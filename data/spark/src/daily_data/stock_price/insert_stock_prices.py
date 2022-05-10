import psycopg2
from datetime import datetime, timedelta
import yfinance as yf

#check if market is opened
def check_market_open():
    end = datetime.now()
    start = end - timedelta(1)
    is_market_open = yf.download("SPY", start=start, end=end, group_by='ticker', auto_adjust=True)
    print(is_market_open)

    if is_market_open.empty:
        print("market is closed ytd")
        exit()


def insert_stock_price(conn):
    # create a cursor
    cur = conn.cursor()

	# execute a statement
    cur.execute("""INSERT INTO stock_prices (stock_id,date_id,price,created_at) 
                (select s.id as stock_id, dd.id as date_id, ssp.price, ssp.created_at 
                from staging_stock_prices ssp 
                join stocks s on s.ticker = ssp.ticker
                join dim_dates dd on dd."year" = ssp."year" and dd."month" = ssp."month" and dd."day" = ssp."day" 
                where ssp.created_at in (select created_at from staging_stock_prices order by created_at desc limit 1) 
                and s.industry_id < 198) on conflict(stock_id, date_id) 
	 			DO UPDATE set updated_at = NOW();""")
       
    conn.commit()
	# close the communication with the PostgreSQL
    cur.close()

    print('Inserted into stock_prices')


def close_connection(conn):
    if conn is not None:
        conn.close()
        print('Database connection closed.')

def main(config, section: str):

    check_market_open()

    print("connecting to", section)
    
    # read connection parameters
    params = config(section)

    # connect to the PostgreSQL server
    conn = psycopg2.connect(**params)

    insert_stock_price(conn)

    close_connection(conn)

if __name__ == '__main__':
    import os
    import sys
    os.chdir("/opt/bitnami/spark/src/")
    sys.path.append('psql_config/')
    from config import config

    main(config, 'postgresql-data')
    main(config, 'postgresql-web')
    exit()