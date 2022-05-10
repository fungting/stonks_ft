from playwright.sync_api import Playwright, sync_playwright
from pymongo import MongoClient
import time
from datetime import datetime

def run(playwright: Playwright, sentiment_list, data_list):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Open new page
    page = context.new_page()

    for sentiment in sentiment_list:

        page.goto(f"https://ycharts.com/indicators/us_investor_sentiment_{sentiment}")

        print(f"directing to https://ycharts.com/indicators/us_investor_sentiment_{sentiment}...")
        
        data = {}

        tables = page.query_selector_all('.col-md-8 .panel-data .panel-content .row .col-6 .table tbody tr')

        for table in tables:
            if table.query_selector('.text-right'):
                data = {}

                date_str = table.query_selector('td').inner_text()
                stat = table.query_selector('.text-right').inner_text()

                if stat:
                    data["sentiment"] = sentiment
                    data["stat"] = float(stat.partition("%")[0])
                    data["date"] = datetime.strptime(date_str, "%B %d, %Y")
                    print(data)
                    data_list.append(data)
                    break

    # ---------------------
    context.close()
    browser.close()

def main():
    print("start scraping weekly sentiment")

    start = time.perf_counter()

    client = MongoClient('mongodb',27017)

    db = client.stonks

    db.sentimentToday.drop()

    data_list = []

    sentiment_list = ["bullish", "bearish", "neutral"]

    with sync_playwright() as playwright:
        run(playwright, sentiment_list, data_list)

        db.sentimentToday.insert_many(data_list)

        print(f"inserted {len(data_list)} data into mongodb")

    time_used = time.perf_counter() - start

    print(f"total time used = {time_used // 60} minutes, {time_used % 60} seconds")

    exit()

if __name__ == '__main__':
    main()