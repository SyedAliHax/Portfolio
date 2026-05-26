import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderGit2, FolderOpen, Grid, Sparkles, Loader } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { projectsData } from '../data';
import { Project } from '../types';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [projectsList, setProjectsList] = useState<Project[]>(projectsData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        }
      })
      .catch(err => {
        console.warn('Could not fetch projects from server API, using local fallback:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute all unique categories to render filters dynamically
  const categories = useMemo(() => {
    return ['All', 'Full Stack', 'Frontend', 'Backend', 'Deep Learning', 'Mobile'];
  }, []);

  // Filter projects by current active choice
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projectsList;
    return projectsList.filter((proj) => proj.category === activeCategory);
  }, [activeCategory, projectsList]);

  return (
    <div id="projects-page-root" className="min-h-screen pt-24 pb-16 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] relative overflow-hidden">
      
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-[20%] left-[5%] w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[30%] right-[5%] w-[350px] h-[350px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Headings Row */}
        <div className="flex flex-col gap-2 mb-12 text-left">
          <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
            Showcase Collection
          </span>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-indigo-500" />
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-sans">
              My Recent Works
            </h1>
          </div>
          <p className="max-w-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-2">
            A carefully curated collection of nine projects that showcase my software engineering skills, architectural passion, and deep learning implementations.
          </p>
        </div>

        {/* Dynamic Navigation Tabs / Categories Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 font-mono ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-indigo-500/10 scale-102'
                  : 'bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/60 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 9 columns grid (1 col mobile, 2 col tablet, 3 col desktop) as specified */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                key={project.id}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Feedback empty state if filtering matches nothing */}
        {filteredProjects.length === 0 && (
          <div className="p-16 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center">
            <FolderGit2 className="w-12 h-12 text-slate-400 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">
              No Projects Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
              Currently compiling works inside the {activeCategory} category.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
