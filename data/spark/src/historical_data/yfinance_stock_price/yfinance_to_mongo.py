import yfinance as yf
import numpy as np
import pandas as pd
from pymongo import MongoClient
from datetime import datetime, timedelta
import time
import math
import os
import json

def main():

    client = MongoClient('mongodb',27017)

    db = client.stonks

    end = datetime.now()
    start_day = end - timedelta(1)

    print("start date:", start, "end date:", end)

    #change directory path
    os.chdir("/opt/bitnami/spark/src/historical_data/yfinance_stock_price/")

    #tickers config
    tickers = pd.read_excel("./new_data.xlsx", sheet_name="stocks")
    ticker_list = list(tickers['ticker'])

    is_market_open = yf.download("SPY", start=start_day, end=end, group_by='ticker', auto_adjust=True)

    if is_market_open.empty:
        print("market is closed")
        pass

    else:
        # stock_data = []
        stocks_not_working = []

        splits = np.array_split(ticker_list, 5)

        start_time = time.perf_counter()

        for split in splits:

            print(split[0], "to", split[-1])

            ticker_string = ' '.join(split)

            print("downloading stocks...")
            data = yf.download(ticker_string, start=start_day, end=end, group_by='ticker', auto_adjust=True)

            print("inserting into mongodb...")
            for ticker in split:
                if (len(split) > 1):
                    df = data[ticker]
                else:
                    df = data
                df = df.dropna()
                if(df.shape[0] == 0):
                    stocks_not_working.append(ticker)
                else:
                    df.insert(0, 'Ticker', ticker)
                    df.reset_index(level=0, inplace=True)
                    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
                    result = df.to_json(orient="records")
                    obj = json.loads(result)
                    db.stockPrices.insert_many(obj)

            print(f"time elapsed: {time.perf_counter() - start_time}")

        end_time = time.perf_counter()

        print(f'total time used: {(end_time - start_time) // 60} minutes, {(end_time - start_time) % 60} seconds')

if __name__ == '__main__':
    main()
