// App.js actualizado
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EasterEggProvider } from './components/EasterEggManager';
import EasterEggListeners from './components/EasterEggListeners';
import EasterEggIndicators from './components/EasterEggIndicators';
import EasterEggDisplay from './components/EasterEggDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import References from './pages/References';
import './styles/global.css';

function App() {
  return (
    <Router>
      <EasterEggProvider>
        <EasterEggListeners />
        <ScrollToTop />
        
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/references" element={<References />} />
          </Routes>
        </main>
        
        <Footer />
        <EasterEggIndicators />
        <EasterEggDisplay />
      </EasterEggProvider>
    </Router>
  );
}

export default App;