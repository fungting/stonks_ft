from playwright.sync_api import Playwright, sync_playwright
from pymongo import MongoClient
import time
from datetime import datetime

def run(playwright: Playwright, indicator_list, url_list, data_list):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    for indicator, link in zip(indicator_list, url_list):

        page.goto(f"https://ycharts.com/indicators/{link}_treasury_rate")

        print(f"directing to https://ycharts.com/indicators/{link}_treasury_rate...")
        
    # time.sleep(1)
        
        data = {}

        tables = page.query_selector_all('.col-md-8 .panel-data .panel-content .row .col-6 .table tbody tr')

        for table in tables:
            if table.query_selector('.text-right'):
                data = {}

                date_str = table.query_selector('td').inner_text()
                stat = table.query_selector('.text-right').inner_text()

                if stat:
                    data["name"] = indicator
                    data["rate"] = float(stat.partition("%")[0])
                    data["date"] = datetime.strptime(date_str, "%B %d, %Y")
                    print(data)
                    data_list.append(data)
                    break

    # ---------------------
    context.close()
    browser.close()

def main():

    print("start scraping daily treasury rates")

    start = time.perf_counter()

    client = MongoClient('mongodb',27017)

    db = client.stonks

    db.treasuryRatesToday.drop()

    data_list = []

    indicator_list = ["1 Month", "3 Month", "6 Month", "1 Year", "2 Year", "3 Year", "5 Year", "7 Year", "10 Year", "20 Year", "30 Year"]

    url_list = ["1_month", "3_month", "6_month", "1_year", "2_year", "3_year", "5_year", "7_year", "10_year", "20_year", "30_year"]

    with sync_playwright() as playwright:
        run(playwright, indicator_list, url_list, data_list)

        db.treasuryRatesToday.insert_many(data_list)

        print(f"inserted {len(data_list)} data into mongodb")

    time_used = time.perf_counter() - start

    print(f"total time used = {time_used // 60} minutes, {time_used % 60} seconds")

if __name__ == '__main__':
    main()

