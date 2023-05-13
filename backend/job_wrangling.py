import requests
from bs4 import BeautifulSoup
from parsing import parse_resume

API_BASE_URL = "https://www.bcjobs.ca/api/v1.1/public/jobs"
BASE_URL = "https://bcjobs.ca"


def get_job_description(job_posting_url: str):
    response = requests.get(job_posting_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        desc_div = soup.find("div", {"class": "rf_job__description u_p-base"})

        if desc_div:
            return desc_div.text.strip().lower().replace('\n', '')

    return None


def get_job_postings(title: str, page: int):
    url = f'{API_BASE_URL}?q={title}&page={page}'
    response = requests.get(url)

    if response.status_code == 200:
        raw_postings = response.json()['data']
        postings = []

        for posting in raw_postings:
            job_id = posting['id']
            url = f'{BASE_URL}{posting["url"]}'
            description = get_job_description(url)
            job_title = posting['title']
            company_name = posting['employer']['name']
            publish_date = posting['publishDate']
            job_locations = posting['locations']
            parsed_locations = []

            for location in job_locations:
                parsed_locations.append({
                    "name": location['name'],
                    "description": location['description'],
                })

            postings.append({
                "job_id": job_id,
                "url": url,
                "job_title": job_title,
                "description": description,
                "company_name": company_name,
                "publish_date": publish_date,
                "locations": parsed_locations
            })

        return postings

    return []


def get_recommendations(titles, skills):
    total_categories = len(skills)
    postings = []

    for job_title in titles:
        postings += get_job_postings(job_title,1)
        postings += get_job_postings(job_title, 2)

    recommendations = []    
    seen = set()

    for posting in postings:

        for skill in skills:
            if skill in posting['description']:
                if posting['job_id'] not in seen:
                    recommendations.append(posting)
                    seen.add(posting['job_id'])
                    break

    return recommendations
