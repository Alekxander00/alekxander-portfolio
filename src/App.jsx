import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // Importar el nuevo componente
import Home from './pages/Home';
import About from './pages/About';
import References from './pages/References';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop /> {/* Agregar aquí */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/references" element={<References />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;