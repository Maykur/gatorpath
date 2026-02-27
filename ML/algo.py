# Get course data - bobo data for now
# Data schema: course = [name, code, description]
courses = [["Intro to Data Science", CAP5771, "Description"], ["Data Analytics", ESI4610, "Description"], ["Intro to Neural Network Verif", CAP4930, "Description"]]
# TODO: get real course info and just use descriptions for this part

# LDA https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.LatentDirichletAllocation.html
from sklearn.decomposition import LatentDirichletAllocation

# Apriori algorithm for association rule mining
# https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/apriori/
from mlxtend.frequent_patterns import apriori

# ML model!!
# https://scikit-learn.org/stable/modules/neighbors.html 
from sklearn.neighbors import NearestNeighbors

# Transforms course data into something the LDA can use
# https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
from sklearn.feature_extraction.text import CountVectorizer

# Meat and potatoes of all ML/DS applications
import pandas as pd

# Vectorize data to be read by LDA
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(courses)

# Fit the model
# LDA finds topics within course descriptions
lda = LatentDirichletAllocation(n_components=5,random_state=0)
LDA_vectors = lda.fit_transform(X)

# Actually use ML to find closely relating courses from LDA
nbrs = NearestNeighbors(n_neighbors=2, algorithm='ball_tree').fit(LDA_vectors)
distances, indices = nbrs.kneighbors(LDA_vectors)


# Use LDA results to identify which courses have certain topics
topic_vector = []
for course in LDA_vectors:
    course_vector = []
    for present_score in course:
        if present_score > 0.15:
            course_vector.append(1)
        else:
            course_vector.append(0)
    topic_vector.append(course_vector)

# Change to a df for apriori
df = pd.DataFrame(topic_vector)

# Run apriori and return itemsets with > 50% support
# Apriori finds courses that have common topics
apriori(df, min_support=0.5, use_colnames = True)