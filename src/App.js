// References: https://www.w3schools.com/react/react_usecontext.asp

import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { SignUp } from './pages/SignUp'
import { LogIn } from './pages/LogIn'
import { StartUp } from './pages/StartPage'
import { MajorPage } from './pages/MajorPage'
import { NavBar } from './components/Navbar'
import { Protected } from './components/Protected'
import Dashboard from './pages/Dashboard'
import ForwardSearchPage from './components/ForwardSearchPage'
import PastSearchesPage from './pages/PastSearchesPage'
import { JobResults } from "./pages/JobResults";
import {createContext, useState } from 'react'
import { ThemeProvider } from "./context/ThemeContext";

export const Tab = createContext();
function App() {
  const [activeTab, setActiveTab] = useState(-1);
  return (
    <ThemeProvider>
      <Router>
        <Tab value={{activeTab, setActiveTab}}>
          <NavBar />
          <div style={{ minHeight: "100vh", backgroundColor: "#FAF3EA" }}>
            <Routes>
              <Route path="/" element={<StartUp/>}/>
              <Route path="/login" element={<LogIn/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/majors/:id" element={<Protected><MajorPage/></Protected>}/>
              <Route path="/search" element={<Protected><ForwardSearchPage/></Protected>}/>
              <Route path="/past-searches" element={<Protected><PastSearchesPage/></Protected>}/>
              <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
              <Route path="/jobResults" element={<Protected><JobResults/></Protected>}/>
            </Routes>
          </div>
        </Tab>
      </Router>
    </ThemeProvider>
  )
}

export default App;