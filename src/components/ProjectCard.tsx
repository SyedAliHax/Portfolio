import { motion } from 'motion/react';
import { Github, ExternalLink, Database, Monitor, Server, Brain, Smartphone } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  key?: string | number;
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Determine relevant icon based on category type
  const getCategoryIcon = () => {
    switch (project.category) {
      case 'Full Stack':
        return <Database className="w-10 h-10 text-white" />;
      case 'Frontend':
        return <Monitor className="w-10 h-10 text-white" />;
      case 'Backend':
        return <Server className="w-10 h-10 text-white" />;
      case 'Deep Learning':
        return <Brain className="w-10 h-10 text-white" />;
      case 'Mobile':
        return <Smartphone className="w-10 h-10 text-white" />;
      default:
        return <Monitor className="w-10 h-10 text-white" />;
    }
  };

  // Determine label colors for dynamic categories
  const getCategoryBadgeClass = () => {
    switch (project.category) {
      case 'Full Stack':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Frontend':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Backend':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Deep Learning':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'Mobile':
        return 'bg-pink-500/10 text-pink-500 border border-pink-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  return (
    <motion.div
      id={`project-card-${project.id}`}
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Dynamic Gradient Border Outer Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none -m-[1px]" />

      {/* TOP: Custom Gradient Container & Image */}
      <div className="h-48 relative overflow-hidden bg-slate-950 flex items-center justify-center transition-all duration-300 border-b border-slate-200 dark:border-slate-800">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient}`} />
        )}
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        {/* Animated Icon Glow */}
        <div className="absolute p-4 rounded-full bg-black/40 backdrop-blur-xs group-hover:scale-110 transition-transform duration-500 shadow-inner pointer-events-none">
          {getCategoryIcon()}
        </div>
      </div>

      {/* BODY: Info, Stack, and Badges */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full uppercase font-semibold ${getCategoryBadgeClass()}`}>
            {project.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-sans group-hover:text-blue-500 dark:group-hover:text-purple-400 transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed flex-grow line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* FOOTER: Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
          {(project.showGithub !== false && project.githubUrl) ? (
            <>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 transition-colors cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
                Code
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </motion.a>
            </>
          ) : (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:opacity-95 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
