import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, User, FolderGit2, CalendarRange, Mail, Github } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: User },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Experience', path: '/experience', icon: CalendarRange },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <nav
        id="main-navbar"
        className="fixed top-0 left-0 w-full z-40 border-b border-slate-200/40 dark:border-slate-800/40 glass transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Mobile burger toggle on LEFT side as requested */}
            <div className="flex md:hidden mr-2">
              <button
                id="mobile-drawer-trigger"
                onClick={handleToggle}
                aria-label="Open navigation menu"
                className="p-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* LEFT / Brand Logo → "Syed Ali Hax" in gradient text */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink
                to="/"
                className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#60A5FA] via-[#8B5CF6] to-[#C084FC] bg-clip-text text-transparent cursor-pointer hover:opacity-95 duration-200 select-none"
              >
                Syed Ali Hax
              </NavLink>
            </div>

            {/* CENTER / Desktop Links Menu */}
            <div className="hidden md:flex items-center justify-center space-x-1 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'text-indigo-600 dark:text-white border-b-2 border-indigo-500 dark:border-[#6366F1] font-bold'
                        : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* RIGHT / Tools & GitHub (Desktop Only GitHub) */}
            <div className="flex items-center gap-3">
              {/* GitHub Button - Desktop view */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/syedalibg"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile Link"
                className="hidden md:inline-flex items-center justify-center p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE DRAWERS & SLIDEOUT OVERWRITES */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Semi-transparent Dark Overriding Backdrop */}
            <motion.div
              id="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black z-45"
            />

            {/* Slide-In Drawer from LEFT side as specified */}
            <motion.div
              id="slide-in-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-950 shadow-2xl z-50 p-6 flex flex-col justify-between border-r border-slate-200 dark:border-slate-900"
            >
              {/* Drawer Top Branding & Close Header */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 gradient-text uppercase tracking-wider font-mono">
                    Navigation
                  </span>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Vertical Navigation Link Stack */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={handleClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-blue-500/10 text-blue-500 dark:text-purple-400 font-bold border-l-4 border-blue-500'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Circular GitHub Button for Mobile & Tablet fixed at BOTTOM-RIGHT of screen */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <motion.a
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          href="https://github.com/syedalibg"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit github profile"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all text-center shrink-0 border border-white/20 cursor-pointer"
        >
          <Github className="w-6 h-6" />
        </motion.a>
      </div>
    </>
  );
}
