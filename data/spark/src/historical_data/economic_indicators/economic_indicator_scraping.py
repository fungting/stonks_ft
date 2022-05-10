from playwright.sync_api import Playwright, sync_playwright
from pymongo import MongoClient
import time
from datetime import datetime
import csv
from dotenv import load_dotenv
import os


def run(playwright: Playwright, link: str, indicator: str, country: str):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    # Go to https://ycharts.com/indicators/us_investor_sentiment_bullish
    page.goto(f"https://ycharts.com/indicators/{link}")

    print(f"directing to https://ycharts.com/indicators/{link}...")

    sign_in(page)

    no_of_pages_str = page.query_selector(".panel-pagination-count").inner_text()

    print(no_of_pages_str)

    no_of_pages = int(no_of_pages_str.partition(" of ")[2])

    individual_data_list = []

    for i in range(no_of_pages):
        
        time.sleep(1.5)
        
        tables = page.query_selector_all('yc-historical-data-table .table tbody tr')

        for table in tables:
            data = {}

            date_str = table.query_selector('td').inner_text()
            stat = table.query_selector('.text-right').inner_text()

            data["indicator"] = indicator
            data["country"] = country
            data["date"] = datetime.strptime(date_str, "%B %d, %Y")

            if "%" in stat:
                data["stat"] = float(stat.partition("%")[0])
            elif "M" in stat:
                data["stat"] = float(stat.partition("M")[0])
            elif "B" in stat:
                data["stat"] = float(stat.partition("B")[0]) * 1000
            elif "T" in stat:
                data["stat"] = float(stat.partition("T")[0]) * 1000 * 1000

            individual_data_list.append(data)

        if i < no_of_pages - 1:
            page.locator("yc-historical-data-table >> text=Next").click()

    # ---------------------
    context.close()
    browser.close()

    check_duplicates_and_insert(data_list, individual_data_list)


def sign_in(page):
    load_dotenv()

    YCHART_ACCOUNT = os.getenv('YCHART_ACCOUNT')
    YCHART_PASSWORD = os.getenv('YCHART_PASSWORD')

    page.locator("text=Sign In").first.click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").click()

    page.locator("[placeholder=\"name\\@company\\.com\"]").fill(YCHART_ACCOUNT)

    page.locator("[placeholder=\"Password\"]").click()

    page.locator("[placeholder=\"Password\"]").fill(YCHART_PASSWORD)

    page.locator("button:has-text(\"Sign In\")").click()

    print("Signed in, start scraping data...")

    time.sleep(3)

def check_duplicates_and_insert(data_list: list, individual_data_list: list):
    print(f"{len(individual_data_list)} data scraped, checking duplicates")
    duplicates = len(individual_data_list) - len(set([item["date"] for item in individual_data_list]))
    if duplicates:
        print(f"!!! There are {duplicates} duplicate data !!!")
    else:
        data_list += individual_data_list


def main():
    client = MongoClient('mongodb',27017)

    db = client.stonks

    db.economicData.drop()

    data_list = []

    country_list = ["US", "China", "Japan", "Germany", "UK"]

    indicator_list = ["Inflation Rate (%)", "Unemployment Rate (%)", "Population (Million)", "GDP (Billion USD)"]

    inflation_url_list = ["us_inflation_rate", "china_inflation_rate", "japan_inflation_rate", "germany_inflation_rate", "uk_inflation_rate"]

    unemployment_url_list = ["us_unemployment_rate", "china_urban_survey_unemployment_rate", "japan_unemployment_rate", "germany_unemployment_rate", "uk_unemployment_rate"]

    population_url_list = ["us_total_population", "china_population", "japan_population", "germany_population", "united_kingdom_population"]

    gdp_url_list = ["us_real_gdp", "china_gdp_currencys", "japan_real_gdp_saar_chn_2012_currencys", "germany_gdp_currencys", "uk_gdp_sa_currencys"]

    url_list = [inflation_url_list, unemployment_url_list, population_url_list, gdp_url_list]

    with sync_playwright() as playwright:
        i = 1
        for indicator, url in zip(indicator_list, url_list):
            for country, link in zip(country_list, url):
                run(playwright, link, indicator, country)
                print(f"{i} of 20 completed")
                i += 1
        
        print("data_list length:", len(data_list))
        
        db.economicData.insert_many(data_list)

    print(f"total time used = {time.perf_counter() // 60} minutes, {time.perf_counter() % 60} seconds")
    

if __name__ == '__main__':
    main()