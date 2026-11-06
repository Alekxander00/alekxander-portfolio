import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './sections/Home';
import About from './sections/About';
import { NavigationProvider } from './contexts/NavigationContext';
import { MenuProvider } from './contexts/MenuContext';
import './index.css';

function App() {
  return (
    <Router>
      <NavigationProvider>
        <MenuProvider>
          <div className="bg-black min-h-screen text-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/category/:categoryName" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </MenuProvider>
      </NavigationProvider>
    </Router>
  );
}

export default App;