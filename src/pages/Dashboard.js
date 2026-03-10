import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

function Dashboard() {
    const [searchData, setSearchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Get token and active search from location state - if coming from a search submission
                const token = localStorage.getItem('token');
                const activeSearch = location.state?.activeSearch;

                // Check if there is an endpoint for the active search - if not, default to latest search endpoint
                const endpoint = activeSearch?._id
                ? `http://localhost:5000/dashboard/search/${activeSearch._id}`
                : 'http://localhost:5000/dashboard/latest';

                // Await response from backend based on endpoint
                const response = await fetch(endpoint, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // If 404 returned, means no searches found for user - navigate to search page to submit a search
                if (response.status === 404) {
                    navigate('/search');
                    return;
                }

                // If response not ok and not 404, throw error
                if (!response.ok) {
                    throw new Error(`Error fetching dashboard data: ${response.statusText}`);
                }

                // If response ok, set search data to response data
                const data = await response.json();
                setSearchData(data.search);
            }
            // If error occurs, log it and set error message to display to user
            catch (err) {
                console.error(err);
                setError("Failed to load dashboard.");
            }
            // Finally, set loading to false to stop showing loading message
            finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, 
    [location.state, navigate]);

    // Render loading message
    if (loading) {
        return <div>Loading dashboard, please wait...</div>
    }

    // Render error message if error occurs
    if (error) {
        return <div>{error}</div>
    }

    // Render message if no search data found - should not happen due to 404 handling, but added as fallback
    if (!searchData) {
        return <div>No dashboard data found.</div>
    }

    // Set career and Salary results - temp since pre Adzuna integration
    const careerResults = searchData.careerResults || [];
    const salaryResults = searchData.salaryResults || [];

    return (
        <div style={{padding: '2rem'}}>
            <h1>Dashboard</h1>

            <section style={{marginBottom: '2rem'}}>
                <h2>Search Summary</h2>
                <p><strong>Search Name:</strong> {searchData.searchName || 'Untitled Search'}</p>
                <p><strong>Major:</strong> {searchData.academic?.majorLabel || searchData.academic?.majorId || 'N/A'}</p>
                <p><strong>Minor:</strong> {searchData.academic?.minor || 'N/A'}</p>
                <p><strong>Certificate:</strong> {searchData.academic?.certificate || 'N/A'}</p>
                <p><strong>Expected Graduation:</strong> {searchData.additional?.expectedGraduationDate || 'N/A'}</p>
                <p><strong>Course Preference:</strong> {searchData.additional?.coursePreference || 'N/A'}</p>
            </section>

            <section style={{marginBottom: '2rem'}}>
                <h2>Career Recommendations</h2>
                {careerResults.length > 0 ? (
                    careerResults.map((item, index) => (
                        <div key={index} style={{marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem'}}>
                        <h3>{item.title || 'Untitled Role'}</h3>
                        <p>{item.company || 'No company listed'}</p>
                        </div>
                    ))) : (
                    <p>Career data will appear here once available.</p>
                )}
            </section>

            <section style={{marginBottom: '2rem'}}>
                <h2>Salary Insights</h2>
                {salaryResults.length > 0 ? (
                    salaryResults.map((item, index) => (
                        <div key={index} style={{marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem'}}>
                        <p>{item.label}</p>
                        </div>
                    ))) : (
                    <p>Salary recommendations will appear here once available.</p>
                )}
            </section>
        </div>
    );
}

export default Dashboard;
