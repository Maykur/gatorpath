# Data schema: job = soc, title, description
# ML model!!
# https://scikit-learn.org/stable/modules/neighbors.html 
from sklearn.neighbors import NearestNeighbors

# Vectorize job name and description
# https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
from sklearn.feature_extraction.text import TfidfVectorizer


# Other imports
import pandas as pd
import json
import os

# Set up and train model
# Load onet data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ONET_PATH = os.path.join(BASE_DIR, "../backend/server/datasets/oneNetData.json")

with open(ONET_PATH) as f:
    onet_data = json.load(f)

# Build corpus of career data
career_titles = [job["title"] for job in onet_data]
career_descriptions = [job.get("description", "") for job in onet_data]

career_corpus = [
    f"{job['title']} {job.get('description', '')}"
    for job in onet_data
]

# Vectorize data to be read by LDA
vectorizer = TfidfVectorizer(stop_words='english')

# TF-IDF works better than LDA
# Fit the data to the vectorizer
X = vectorizer.fit_transform(career_corpus)

# Actually use ML to find closely relating careers from onet
nbrs = NearestNeighbors(n_neighbors=15, metric='cosine')
nbrs.fit(X)


# Pivot from apriori to just using KNN and LDA to produce reccomendations
# Get reccomendations from users input and return them to dashboard
def get_career_recs(major, minor="", certificate="", courses=[]):

    # Ensure courses is formatted right if empty
    if courses is None:
        courses = []

    # Build a query string from args
    query = f"{major} {minor} {certificate} {' '.join(courses)}"
    
    # Transform query into same vector space as careers
    query_vec = vectorizer.transform([query])
    
    # Find nearest career neighbors
    distances, indices = nbrs.kneighbors(query_vec)
    
    # Return top career titles sorted by similarity score
    recommendations = []
    for distance, index in zip(distances[0], indices[0]):
        recommendations.append({
            "title": career_titles[index],
            "soc": onet_data[index]["soc"],
            "description": career_descriptions[index],
            "score": round(1 - float(distance), 3)
        })

    return recommendations