import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { Page1 } from './pages/Page1'
import { MajorPage } from './pages/MajorPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/major/:id" element={<MajorPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;