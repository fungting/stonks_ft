import click
import historical_data.earnings as hist_earnings
import historical_data.economic_indicators as hist_economics
import historical_data.sentiment_indicators as hist_sentiments
import historical_data.treasury_rates as hist_rates
import historical_data.yfinance_stock_price as hist_stock_prices
import daily_data.earnings as daily_earnings
import daily_data.sentiment as daily_sentiments
import daily_data.treasury_rates as daily_rates
import daily_data.stock_price as daily_stock_prices
from psql_config.config import config

@click.group()
def cli():
    pass

#All time data
@click.command(name='hist_earnings')
def get_all_earnings():
    hist_earnings.finnhub_to_mongo.main()
    hist_earnings.finnhub_mongo_to_psql.main()

@click.command(name='hist_economics')
def get_all_economics():
    hist_economics.economic_indicator_scraping.main()
    hist_economics.econ_mongo_to_psql.main()

@click.command(name='hist_sentiments')
def get_all_sentiments():
    hist_sentiments.sentiment_indicator_scraping.main()
    hist_sentiments.sentiment_mongo_to_psql.main()   

@click.command(name='hist_rates')
def get_all_rates():
    hist_rates.treasury_rates_scraping.main()
    hist_rates.rates_mongo_to_psql.main()   

@click.command(name='hist_stock_prices')
def get_one_year_stock_price():
    hist_stock_prices.yfinance_to_mongo.main()
    hist_stock_prices.mongo_to_postgres.main()
    hist_stock_prices.psql_connect.main(config)

#Daily data
@click.command(name='daily_earnings')
def get_today_earnings():
    daily_earnings.daily_finnhub_to_mongo.main()
    daily_earnings.finnhub_mongo_to_psql.main()

@click.command(name='weekly_sentiments')
def get_today_sentiments():
    daily_sentiments.weekly_sentiment_to_mongo.main()
    daily_sentiments.sentiment_mongo_to_psql.main()

@click.command(name='daily_rates')
def get_today_rates():
    daily_rates.daily_rates_to_mongo.main()
    daily_rates.rates_mongo_to_psql.main()

@click.command(name='daily_stock_prices')
def get_today_stock_prices():
    daily_stock_prices.fmp_to_mongo.main()
    daily_stock_prices.fmp_to_postgres.main()
    daily_stock_prices.insert_stock_prices.main(config, 'postgresql-data')
    daily_stock_prices.calculate_rs.main(config, 'postgresql-data')
    daily_stock_prices.insert_stock_prices.main(config, 'postgresql-web')
    daily_stock_prices.calculate_rs.main(config, 'postgresql-web')

cli.add_command(get_all_earnings)
cli.add_command(get_all_economics)
cli.add_command(get_all_sentiments)
cli.add_command(get_all_rates)
cli.add_command(get_one_year_stock_price)
cli.add_command(get_today_earnings)
cli.add_command(get_today_rates)
cli.add_command(get_today_sentiments)
cli.add_command(get_today_stock_prices)

if __name__ == '__main__':
    cli()