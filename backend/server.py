from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from parsing import parse_resume
from job_wrangling import get_recommendations


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_methods=["*"]
)


@app.post("/parse-resume")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail='Only PDF files allowed')

    contents = await file.read()

    with open(file.filename, 'wb') as f:
        f.write(contents)

    resume_data = parse_resume(file.filename)

    return resume_data

@app.post("/job-recs")
async def job_recs(request: Request):

    body = await request.json()
    titles = body['titles'] 
    skills = body['skills']
    
    recommendations = get_recommendations(titles, skills)

    return recommendations