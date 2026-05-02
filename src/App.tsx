import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Breeds from './pages/Breeds';
import Calculator from './pages/Calculator';
import Herd from './pages/Herd';
import Farrowings from './pages/Farrowings';
import Vaccinations from './pages/Vaccinations';
import Diseases from './pages/Diseases';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="herd" element={<Herd />} />
          <Route path="breeds" element={<Breeds />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="farrowings" element={<Farrowings />} />
          <Route path="vaccinations" element={<Vaccinations />} />
          <Route path="diseases" element={<Diseases />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
