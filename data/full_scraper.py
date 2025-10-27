import requests
from bs4 import BeautifulSoup
import csv
import time
from urllib.parse import urljoin
import re
import os

BASE_URL = "https://www.vvz.ethz.ch/Vorlesungsverzeichnis/"
SEARCH_BASE = BASE_URL + "sucheLehrangebot.view"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/128.0.6613.120 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "de,en-US;q=0.9,en;q=0.8",
    "Referer": "https://www.vvz.ethz.ch/Vorlesungsverzeichnis/sucheLehrangebot.view?lang=de",
    "Connection": "keep-alive",
}
SEMESTER = "2025W"  # Herbstsemester 2025


# ---------- Basic HTML helper ----------
def get_soup(url):
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")


# ---------- Discover all departments ----------
def get_all_departments():
    url = f"{SEARCH_BASE}?lang=de"
    soup = get_soup(url)
    options = soup.select("select[name='deptId'] option[value]")
    departments = []
    for opt in options:
        dept_id = opt.get("value")
        name = opt.get_text(strip=True)
        if dept_id and dept_id.isdigit():
            departments.append((dept_id, name))
    print(f"Found {len(departments)} departments.")
    return departments


# ---------- Course list scraping ----------
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
        detail_url = (
            urljoin(BASE_URL, title_link["href"])
            if title_link and title_link.has_attr("href")
            else None
        )

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


def scrape_all_courses_for_department(dept_id, dept_name):
    start_url = (
        f"{SEARCH_BASE}?lang=de&search=on&semkez={SEMESTER}"
        f"&deptId={dept_id}&_strukturAus=on"
    )

    all_courses = []
    prof_links = set()
    url = start_url
    page = 1

    while url:
        print(f"📄 [{dept_name}] Page {page}")
        soup = get_soup(url)
        courses, links = parse_courses_and_prof_links(soup)
        all_courses.extend(courses)
        prof_links |= links
        next_page = find_next_page(soup)
        if next_page and next_page != url:
            url = next_page
            page += 1
            time.sleep(0.1)
        else:
            break

    print(f"Summary for {dept_name}: {len(all_courses)} courses found, {len(prof_links)} professors found.")
    print(f"✅ {dept_name}: {len(all_courses)} courses, {len(prof_links)} professors")
    return all_courses, prof_links


# ---------- Professor scraping ----------
def parse_professor_page(url):
    soup = get_soup(url)
    data = {"url": url}

    # The detailed fields to extract
    fields = ["Name", "Lehrgebiet", "Departement", "E-Mail", "Telefon", "Adresse", "Beziehung"]

    # Find all rows in the main table
    for row in soup.select("table tr"):
        cols = row.find_all("td")
        if len(cols) == 2:
            label = cols[0].get_text(strip=True).rstrip(":")
            value = cols[1].get_text(" ", strip=True)
            if label in fields:
                data[label] = value

    # Ensure all fields exist in data, even if empty
    for field in fields:
        if field not in data:
            data[field] = ""

    # Normalize multiple spaces in Name field
    if 'Name' in data:
        data['Name'] = re.sub(r'\s+', ' ', data['Name']).strip()

    return data


# ---------- CSV helpers ----------
def write_csv(rows, filename):
    if not rows:
        print(f"⚠️ No data to write for {filename}")
        return
    # Preserve field order with 'number' and 'title' first if present
    all_keys = {k for row in rows for k in row.keys()}
    if 'number' in all_keys and 'title' in all_keys:
        fieldnames = ['number', 'title'] + sorted(k for k in all_keys if k not in ['number', 'title'])
    elif 'Name' in all_keys and 'Departement' in all_keys:
        fieldnames = ['Name', 'Departement'] + sorted(k for k in all_keys if k not in ['Name', 'Departement'])
    elif 'Name' in all_keys:
        fieldnames = ['Name'] + sorted(k for k in all_keys if k != 'Name')
    else:
        fieldnames = sorted(all_keys)
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    print(f"📝 Writing {len(rows)} rows to {filename}...")
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    print(f"💾 Saved {len(rows)} rows → {filename}")


# ---------- Main ----------
if __name__ == "__main__":
    departments = get_all_departments()

    for dept_id, dept_name in departments:
        safe_name = re.sub(r"[^a-zA-Z0-9]+", "_", dept_name)
        print(f"\n=== Scraping department: {dept_name} (id={dept_id}) ===")

        try:
            courses, prof_links = scrape_all_courses_for_department(dept_id, dept_name)

            # --- scrape professors for this department ---
            profs = []
            for link in prof_links:
                try:
                    prof = parse_professor_page(link)
                    prof["department_source"] = dept_name
                    profs.append(prof)
                    time.sleep(0.1)
                except Exception as e:
                    print(f"⚠️ Error scraping prof {link}: {e}")

            # --- save per department ---
            write_csv(courses, f"data/courses/vvz_courses_{safe_name}_{SEMESTER}.csv")
            write_csv(profs, f"data/professors/vvz_professors_{safe_name}_{SEMESTER}.csv")

        except Exception as e:
            print(f"⚠️ Error scraping {dept_name}: {e}")

    print("\n🎉 Done scraping all departments.")