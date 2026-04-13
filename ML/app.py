from flask import Flask, request, jsonify
from flask_cors import CORS
from recommend import get_career_recs

# Enable cors
app = Flask(__name__)
CORS(app)

# Create POST route
@app.route('/recommend', methods=['POST'])
def home():
    # Get user data from express
    user_info = request.get_json()

    # Split up data
    major = user_info.get('major', '')
    minor = user_info.get('minor', [])
    certs = user_info.get('certificates', [])
    courses = user_info.get('courses', [])
    majorDescription = user_info.get('majorDescription', [])
    minorDescription = user_info.get('minorDescription', [])
    certDescription = user_info.get('certDescription', [])

    # Return reccomendation results
    user_recs = get_career_recs(major, minor, certs, courses, majorDescription, minorDescription, certDescription)

    # Send results back as a json file
    return jsonify({"recommendations": user_recs})


if __name__ == '__main__':
    app.run(debug=True, port=5001)