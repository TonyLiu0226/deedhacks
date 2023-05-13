import { useState, useEffect } from 'react'
import './App.css';
import { Button } from "@mui/material";
import { Checkbox } from "@mui/material";
import { FormGroup, FormControl, FormControlLabel } from "@mui/material"
import JobCard from '../components/JobCard'
import LoadingSpinner from '../components/LoadingSpinner';

function App() {
  const [pdf, setPdf] = useState(null);
  const [filename, setFilename] = useState("");
  const [titles, setTitles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [checkedTitles, setCheckedTitles] = useState([]); 
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [jobRecs, setJobRecs] = useState([]);
  const [parsingResume, setParsingResume] = useState(false);
  const [parsedResume, setParsedResume] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const getJobRecs = async () => {
    const body = {
      titles: checkedTitles,
      skills: checkedSkills,
    };

    const response = await fetch('http://localhost:8000/job-recs', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const recs = await response.json();
      setJobRecs(recs);
    }
    
  }

  //function to handle pdf change when uploading new files in the input
  const upload = (e) => {
    setPdf(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  //function to actually upload the pdf file
  const handlePdfUpload = async () => {
    if (pdf) {
      //check size
      const formData = new FormData();
      formData.append('file', pdf);
      try {
        const response = await fetch('http://localhost:8000/parse-resume', {
          method: 'POST',
          body: formData,
        })
        
        setParsingResume(true);
        const data = await response.json();
        setParsingResume(false);

       if (response.ok) {
          setTitles(data["job_titles"]);
          setSkills(data['skills']);
          setParsedResume(true);
        }
       
      
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      console.log("no pdf selected");
    }
  };

  
  const handleTitleCheckBoxChange = (event) => {
    const title = event.target.value;
    const checked = event.target.checked;
    setCheckedTitles((checkedTitles) => {
      if (checked) {
        if (checkedTitles.length < 2) return [...checkedTitles, title];
        return checkedTitles
      } else {
        return checkedTitles.filter((t) => t !== title);
      }
    });
  };

  const handleSkillCheckBoxChange = (event) => {
    const skill = event.target.value;
    const checked = event.target.checked;
    setCheckedSkills((checkedSkills) => {
      if (checked) {
        return [...checkedSkills, skill];

      } else {
        return checkedSkills.filter((t) => t !== skill);
      }
    });
  }


  return (
    <>
      <h1>JobGPT</h1>
      <div className="card">
        <form>
          <Button className="upload" variant="contained" component="label" color="success">Upload PDF
            <input type="file" id="pdf-file" accept=".pdf" multiple={false} onChange={upload} hidden/>
          </Button>
          <h3>Currently selected pdf: {filename}</h3>
          <button type="button" className="uploadButton" onClick={handlePdfUpload}>Generate jobs</button>
        </form>
        {parsingResume ? <LoadingSpinner /> :  <FormControl component="fieldset">
          <FormGroup className="selection">
            <div className="left">
              <h2>PLEASE SELECT WHICH JOB TITLES YOU WANT TO SEARCH FOR</h2>
            {titles.map((title, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox checked={checkedTitles.includes(title)} onChange={handleTitleCheckBoxChange} value={title}/>}
                label={title}
              />
            ))}
            </div>
            <div className="right">
              <h2>PLEASE SELECT YOUR BEST SKILLS</h2>
             {skills.map((skill, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox checked={checkedSkills.includes(skill)} onChange={handleSkillCheckBoxChange} value={skill}/>}
                label={skill}
              />
            ))}
            </div>
          </FormGroup>
          <button type="button" className="uploadButton" onClick={getJobRecs}>Generate job recommendations</button>
        </FormControl>}  
      </div>
            
      <h2>My Job Recommendations</h2>
      {loadingRecommendations ? <LoadingSpinner /> : jobRecs.map((jobRec, i) => {
   
          return <JobCard key={i} url={jobRec.url} job_title={jobRec.job_title} description={jobRec.description} locations={jobRec.locations.map(location => location.name)} company_name={jobRec.company_name} publish_date={jobRec.publish_date}/>;        
      })}

      {/* <JobCard url="http://localhost:3000" job_title="yo" description="I cannot code pls help" locations={['Vancouver, BC']} company_name="eMonster" publish_date="date"/> */}
    </>
  );
}

export default App
