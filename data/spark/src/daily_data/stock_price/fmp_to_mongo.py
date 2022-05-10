import yfinance as yf
from urllib.request import urlopen
import certifi
import json
import csv
import pandas as pd
from datetime import datetime, timedelta
from pymongo import MongoClient
import os
import time

def main():

    client = MongoClient('mongodb',27017)

    db = client.stonks

    end = datetime.now()
    start = end - timedelta(1)
    is_market_open = yf.download("SPY", start=start, end=end, group_by='ticker', auto_adjust=True)
    print(is_market_open)

    if is_market_open.empty:
        print("market is closed ytd")
        exit()

    start_time = time.perf_counter()

    def get_jsonparsed_data(url):
        response = urlopen(url, cafile=certifi.where())
        data = response.read().decode("utf-8")
        return json.loads(data)

    url = ("https://financialmodelingprep.com/api/v3/stock/list?apikey=3a001506d7161a8269397deeb7217f51")

    #change directory path
    os.chdir("/opt/bitnami/spark/src/daily_data/stock_price/")

    tickers = pd.read_excel("./new_data.xlsx", sheet_name="stocks")
    ticker_list = list(tickers['ticker'])
    stocklist = get_jsonparsed_data(url)

    results = []

    for stock in stocklist:
        if (stock['symbol'] in ticker_list):
            obj = {}
            obj["ticker"] = stock['symbol']
            obj["price"] = stock['price']
            obj["date"] = start
            results.append(obj)

    db.stockPricesToday.drop()

    db.stockPricesToday.insert_many(results)

    end_time = time.perf_counter()

    print(f'finished inserting into mongodb, total time used: {(end_time - start_time)} seconds')

    exit()

if __name__ == '__main__':
    main()
