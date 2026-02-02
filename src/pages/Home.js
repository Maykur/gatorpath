import { Link } from "react-router-dom"
import SearchPage from "../components/SearchPage"

// Search bar test page
export function Home(){
  return (
    <>
        <h1>Home Page</h1>
        <SearchPage/>
        <Link to="/">Go Back to Login</Link>
    </>
  );
}