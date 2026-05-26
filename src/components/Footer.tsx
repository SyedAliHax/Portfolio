import { Link } from 'react-router-dom';
import { ChevronRight, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialIcons = [
    { icon: Github, href: 'https://github.com/syedalibg', name: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/placeholder', name: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/placeholder', name: 'Twitter/X' },
    { icon: MessageCircle, href: 'https://wa.me/placeholder', name: 'WhatsApp' },
  ];

  return (
    <footer
      id="main-footer"
      className="bg-slate-50 dark:bg-[#0a101f] border-t border-slate-200/40 dark:border-white/5 pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Three Column Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          
          {/* Col 1: Corporate Tagline */}
          <div className="flex flex-col gap-4">
            <span className="text-xl font-black bg-gradient-to-r from-[#60A5FA] via-[#8B5CF6] to-[#C084FC] [background-slice:clone] bg-clip-text text-transparent uppercase tracking-tight">
              Syed Ali Hax
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Building digital experiences that matter. Turning complex algorithms into human-centered software.
            </p>
          </div>

          {/* Col 2: Quick Link Chevron Navs */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Social Interactions Icons */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono">
              Keep in Touch
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Feel free to visit my github repositories, check works or reach me out instantly.
            </p>
            <div className="flex items-center gap-3">
              {socialIcons.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={soc.name}
                  className="p-2.5 rounded-full bg-slate-150/60 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-purple-400 transition-all border border-slate-250 dark:border-white/10 hover:scale-105 active:scale-95"
                >
                  <soc.icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Brand Bottom Metadata Bar */}
        <div className="pt-8 border-t border-slate-200/40 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 dark:text-slate-500">
          <div className="flex items-center space-x-4">
            <span>&copy; {currentYear} Syed Ali Hax</span>
            <span className="w-1 h-1 bg-[#475569] rounded-full hidden sm:inline-block"></span>
            <span>Built with <span className="text-rose-500">❤️</span> using React & Tailwind</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-[#60A5FA] transition-colors duration-250">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-[#60A5FA] transition-colors duration-250">X / Twitter</a>
            <a href="https://github.com/syedalibg" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-[#60A5FA] transition-colors duration-250">GitHub</a>
            <div className="ml-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full font-bold border border-green-500/20 text-[10px] uppercase select-none tracking-wider animate-pulse flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
