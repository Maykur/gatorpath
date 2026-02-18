import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { SignUp } from './pages/SignUp'
import { LogIn } from './pages/LogIn'
import { StartUp } from './pages/StartPage'
import { MajorPage } from './pages/MajorPage'
import { NavBar } from './components/Navbar'
import { Protected } from './components/Protected'

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<StartUp/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/home" element={<Protected><Home/></Protected>}/>
        <Route path="/major/:id" element={<Protected><MajorPage/></Protected>}/>
      </Routes>
    </Router>
  )
}

export default App;