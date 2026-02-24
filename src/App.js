import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { SignUp } from './pages/SignUp'
import { LogIn } from './pages/LogIn'
import { StartUp } from './pages/StartPage'
import { MajorPage } from './pages/MajorPage'
import { NavBar } from './components/Navbar'
import { Protected } from './components/Protected'
import ForwardSearchPage from './components/ForwardSearchPage'
import PastSearchesPage from './pages/PastSearchesPage'

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ 
        paddingTop: "80px", // Space for the fixed navbar
        width: "100%"
      }}>
        <Routes>
          <Route path="/" element={<StartUp/>}/>
          <Route path="/login" element={<LogIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/home" element={<Protected><Home/></Protected>}/>
          <Route path="/majors/:id" element={<Protected><MajorPage/></Protected>}/>
          <Route path="/search" element={<Protected><ForwardSearchPage/></Protected>}/>
          <Route path="/past-searches" element={<Protected><PastSearchesPage/></Protected>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;