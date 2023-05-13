from pyresparser import ResumeParser
import spacy

with open("job_titles.txt", "r") as file:
    JOB_TITLES = [job.lower().strip() for job in file.read().splitlines()]


nlp = spacy.load("en_core_web_sm")

def get_job_titles(experience):
    job_titles = []

    for part in experience:
        for job_title in JOB_TITLES:
            if part == job_title or job_title in part:
                job_titles.append(job_title)
    
    return list(job_titles)

def parse_resume(path):
    data = ResumeParser(path).get_extracted_data()

    locations = []

    experience = [part.lower().strip() for part in data['experience']]
    experience_doc = nlp(" ".join([part.lower() for part in experience]))

    
    for ent in experience_doc.ents:
        if ent.label_ == 'GPE':
            locations.append(ent.text)



    return {
        'skills': list(set([skill.strip().lower() for skill in data['skills']])),
        "job_titles": list(set([title for title in get_job_titles(experience) if 'remote' not in title])),
        "locations": set(locations)
    }
