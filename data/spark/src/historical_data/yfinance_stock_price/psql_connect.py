import psycopg2

def execute_cursor(conn):
    # create a cursor
    cur = conn.cursor()

	# execute a statement
    cur.execute("""INSERT INTO stock_prices (stock_id,date_id,price,created_at) 
                (select s.id as stock_id, dd.id as date_id, ssp.price, ssp.created_at 
                from staging_stock_prices ssp 
                join stocks s on s.ticker = ssp.ticker
                join dim_dates dd on dd."year" = ssp."year" and dd."month" = ssp."month" and dd."day" = ssp."day")
                on conflict(stock_id, date_id) 
	 			DO UPDATE set price = EXCLUDED.price, updated_at = NOW();""")
       
    conn.commit()
	# close the communication with the PostgreSQL
    cur.close()

    print('Inserted into stock_prices')

def close_connection(conn):
    if conn is not None:
        conn.close()
        print('Database connection closed.')

def main(config):
    # read connection parameters
    params = config()

    # connect to the PostgreSQL server
    conn = psycopg2.connect(**params)

    execute_cursor(conn)
    close_connection(conn)
    exit()
    

if __name__ == '__main__':
    import os
    import sys
    os.chdir("/opt/bitnami/spark/src/")
    sys.path.append('psql_config/')
    from config import config

    main(config)


