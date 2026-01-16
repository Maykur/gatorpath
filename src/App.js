import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { Page1 } from './pages/Page1'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App;