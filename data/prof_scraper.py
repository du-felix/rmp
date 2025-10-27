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

HEADERS = {"User-Agent": "rmp-professor-scraper/2.0 (+your-email@example.com)"}


def get_soup(url):
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")


# --- course pages (same as before) ---
def parse_courses_and_prof_links(soup):
    courses = []
    prof_links = set()

    for row in soup.select("table tr"):
        cols = row.find_all("td")
        if len(cols) < 5:
            continue

        number = cols[0].get_text(strip=True)
        title_link = cols[1].find("a")
        title = title_link.get_text(strip=True) if title_link else cols[1].get_text(strip=True)
        detail_url = urljoin(BASE_URL, title_link["href"]) if title_link and title_link.has_attr("href") else None

        dozierende = []
        for a in cols[-1].find_all("a", href=True):
            name = a.get_text(strip=True)
            prof_url = urljoin(BASE_URL, a["href"])
            dozierende.append(name)
            prof_links.add(prof_url)

        courses.append({
            "number": number,
            "title": title,
            "detail_url": detail_url,
            "dozierende": ", ".join(dozierende)
        })

    return courses, prof_links


def find_next_page(soup):
    link = soup.find("a", string=lambda s: s and "Nächste" in s)
    if link and link.get("href"):
        return urljoin(BASE_URL, link["href"])
    img = soup.find("img", alt=lambda s: s and "Nächste" in s)
    if img and img.parent.name == "a" and img.parent.get("href"):
        return urljoin(BASE_URL, img.parent["href"])
    return None


def scrape_all_courses(start_url, delay=1.0):
    all_courses, all_prof_links = [], set()
    current_url, page = start_url, 1

    while current_url:
        print(f"📄 Scraping course list page {page}: {current_url}")
        soup = get_soup(current_url)
        courses, prof_links = parse_courses_and_prof_links(soup)
        all_courses.extend(courses)
        all_prof_links |= prof_links

        next_page = find_next_page(soup)
        if next_page and next_page != current_url:
            current_url = next_page
            page += 1
            time.sleep(delay)
        else:
            break

    print(f"✅ Found {len(all_courses)} courses and {len(all_prof_links)} unique professor links")
    return all_courses, sorted(all_prof_links)


# --- professor pages ---
def parse_professor_page(url):
    soup = get_soup(url)

    data = {"url": url}

    # table with labels in first td and values in second
    for row in soup.select("table tr"):
        cols = row.find_all("td")
        if len(cols) != 2:
            continue
        label = cols[0].get_text(strip=True).rstrip(":")
        value = cols[1].get_text(" ", strip=True)
        data[label] = value

    # normalize expected keys
    data["Name"] = data.get("Name", "")
    data["Departement"] = data.get("Departement", "")
    data["E-Mail"] = data.get("E-Mail", "")
    data["Telefon"] = data.get("Telefon", "")
    data["Adresse"] = data.get("Adresse", "")
    data["Beziehung"] = data.get("Beziehung", "")

    return data


def scrape_all_professors(prof_links, delay=0.1):
    profs = []
    for i, link in enumerate(prof_links, 1):
        try:
            print(f"👨‍🏫 [{i}/{len(prof_links)}] {link}")
            prof = parse_professor_page(link)
            profs.append(prof)
            time.sleep(delay)
        except Exception as e:
            print(f"⚠️ Error {link}: {e}")
    return profs

def save_csv(rows, filename, fields):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    print(f"✅ Saved {len(rows)} rows to {filename}")


if __name__ == "__main__":
    print("Scraping all Computer Science (D-INFK) professors and details...\n")
    courses, prof_links = scrape_all_courses(START_URL)
    save_csv(courses, "vvz_infk_courses_2025W.csv", ["number", "title", "detail_url", "dozierende"])

    profs = scrape_all_professors(prof_links)
    save_csv(
        profs,
        "vvz_infk_professors_2025W.csv",
        ["Name", "Departement", "E-Mail", "Telefon", "Adresse", "Beziehung", "url"],
    )

    print("\n🎉 Done.")