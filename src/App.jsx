import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './sections/Home';
import About from './sections/About';
import CategoryView from './sections/CategoryView';
import { NavigationProvider } from './contexts/NavigationContext';
import { MenuProvider } from './contexts/MenuContext';
import Menu from './components/ui/Menu';
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
              <Route path="/category/:categoryName" element={<CategoryView />} />
            </Routes>
            <Menu />
          </div>
        </MenuProvider>
      </NavigationProvider>
    </Router>
  );
}

export default App;