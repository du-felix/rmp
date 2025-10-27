import requests
from bs4 import BeautifulSoup
import csv
import time
from urllib.parse import urljoin

BASE_URL = "https://www.vvz.ethz.ch/Vorlesungsverzeichnis/"
START_URL = (
    "https://www.vvz.ethz.ch/Vorlesungsverzeichnis/"
    "sucheLehrangebot.view?lang=de&search=on&semkez=2025W&deptId=5&_strukturAus=on"
)

HEADERS = {
    "User-Agent": "rmp-course-scraper/1.0 (+your-email@example.com)"
}

def get_soup(url):
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")

def parse_courses(soup):
    courses = []
    for row in soup.select("table tr"):
        cols = row.find_all("td")
        if len(cols) < 5:
            continue

        number = cols[0].get_text(strip=True)

        # title is inside an <a> in the second <td>
        title_link = cols[1].find("a")
        title = title_link.get_text(strip=True) if title_link else cols[1].get_text(strip=True)
        detail_url = urljoin(BASE_URL, title_link["href"]) if title_link and title_link.has_attr("href") else None

        dozierende = cols[-1].get_text(" ", strip=True)

        if number and title:
            courses.append({
                "number": number,
                "title": title,
                "detail_url": detail_url,
                "dozierende": dozierende
            })
    return courses

def find_next_page(soup):
    """Detect next page link — handles <img alt='Nächste Seite'>."""
    link = soup.find("a", string=lambda s: s and "Nächste" in s)
    if link and link.get("href"):
        return urljoin(BASE_URL, link["href"])

    img = soup.find("img", alt=lambda s: s and "Nächste" in s)
    if img and img.parent.name == "a" and img.parent.get("href"):
        return urljoin(BASE_URL, img.parent["href"])

    return None

def scrape_department(start_url, delay=1.0):
    all_courses = []
    current_url = start_url
    page = 1

    while current_url:
        print(f"Scraping page {page}: {current_url}")
        soup = get_soup(current_url)
        courses = parse_courses(soup)
        print(f"  Found {len(courses)} courses")
        all_courses.extend(courses)

        next_page = find_next_page(soup)
        if next_page and next_page != current_url:
            current_url = next_page
            page += 1
            time.sleep(delay)
        else:
            print("No more pages found.")
            break

    return all_courses

def save_csv(courses, filename="vvz_infk_2025W.csv"):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["number", "title", "detail_url", "dozierende"])
        writer.writeheader()
        writer.writerows(courses)
    print(f"✅ Saved {len(courses)} courses to {filename}")

if __name__ == "__main__":
    print("Scraping all Computer Science (D-INFK) courses for 2025W...")
    data = scrape_department(START_URL)
    save_csv(data)
    print("Done.")
    