import { Link } from "react-router-dom"
import SearchPage from "../components/SearchPage"
import Navbar from "../components/Navbar"

// Search bar test page
export function Home(){
  return (
    <>
        <h1>Home Page</h1>
        <Link to="/search">
          <button>
            Go to Search for Career Paths
          </button>
        </Link>

        <hr />

        <h2>Major Lookup (Temp)</h2>
        <SearchPage/>
    </>
  );
}