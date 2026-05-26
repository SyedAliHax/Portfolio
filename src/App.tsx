import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Scroll to Top helper component on path change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  // Force dark theme unconditionally
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <BrowserRouter>
      {/* Dynamic Scroll Restores */}
      <ScrollToTop />
      
      <div id="app-viewport-wrapper" className="min-h-screen flex flex-col bg-[#0b0f19] text-[#F1F5F9] selection:bg-indigo-500/30 relative overflow-hidden">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#6366F1] rounded-full blur-[120px] opacity-10 dark:opacity-20 pointer-events-none animate-float" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#C084FC] rounded-full blur-[120px] opacity-10 dark:opacity-20 pointer-events-none animate-float-delayed" />
        
        {/* Persistent top fixed navigation menu */}
        <Navbar />

        {/* Core view outlets content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* Fallback boundary redirect */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Corporate branding footer */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}
