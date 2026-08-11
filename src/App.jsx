import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import OwnersPage from './pages/Owners/OwnersPage.jsx'
import CategoriesPage from './pages/Categories/CategoriesPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/records" replace />} />
        <Route path="/records" element={<Home />} />
        <Route path="/owners" element={<OwnersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
