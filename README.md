## 🐊 GatorPath
 
> **Personalized career guidance for University of Florida students.**
 
GatorPath bridges the gap between academic choices and real-world careers. Students enter their major, minor, certificates, and coursework, and GatorPath returns career recommendations backed by live job listings, salary data, and learning pathways.
 
Built by practically_employed() as a senior capstone project at the University of Florida.
 
---

## Features
 
- **ML-Powered Career Recommendations** — A custom ML service utilizing TF-IDF + K-Nearest Neighbors model trained on 900+ O\*NET occupations ranks careers by semantic similarity to student's academic profile.
- **Real Job Listings** — Live job data pulled from the Adzuna API, filterable by seniority level and location.
- **Salary Insights** — Aggregated salary ranges displayed per career role.
- **Learning Pathways** — Suggested resources, platforms, certifications, and YouTube searches tailored to recommended careers.
- **CISE Major Explorer** — Browse UF CISE department majors and their core coursework, required foundations, and elective areas.
- **Search History** — Star and save searches to revisit past results.
- **Personalized Dashboard** — Three-column view summarizing career matches, resources, and different major's coursework at a glance.

## Tech Stack

**Frontend:** React, React Router, React Select, Context API  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**ML Service:** Python, Flask, scikit-learn (TF-IDF + KNN), pandas  
**External APIs:** Adzuna Jobs API, O\*NET Career Data  
**Auth:** JWT-based session authentication  
 
---
## Installation Instructions

**Clone the repository using git clone**:

```
git clone https://github.com/Maykur/gatorpath
```
**Run application using command**:

```
npm run serverStart
```
This command will install all needed dependences, start each part of the application, and open it in a new browser window. 

**Note: GatorPath will not work locally without an authorized MongoDB account**

---
 
## Team members and responsibilites of practically_employed():
 
**Sophia Cardona Nader**: Frontend UI design and implementation  

**Julian Garcia**: Backend development and project setup

**Veronika Matos**: Web scraper and parsing, Adzuna API integration, keyword search refinement

**Ashton Penalacia**: Search flow functionality and Keyword reccomendation system

**Haylee Zuba**: Flask microservice and machine learning
 
---
