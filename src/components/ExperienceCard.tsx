import { motion } from 'motion/react';
import { Briefcase, Award, Code, GraduationCap, Github } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceCardProps {
  key?: string | number;
  experience: Experience;
  index: number;
}

export default function ExperienceCard({ experience, index }: ExperienceCardProps) {
  // Determine relevant icon for company or role
  const getExperienceIcon = () => {
    switch (experience.type) {
      case 'Full-time':
        return <Briefcase className="w-5 h-5 text-white" />;
      case 'Freelance':
        return <Award className="w-5 h-5 text-white" />;
      case 'Training':
        return <GraduationCap className="w-5 h-5 text-white" />;
      case 'Voluntary':
        return <Github className="w-5 h-5 text-white" />;
      case 'Self-Learning':
        return <Code className="w-5 h-5 text-white" />;
      default:
        return <Briefcase className="w-5 h-5 text-white" />;
    }
  };

  // Extract initials for placeholder avatar
  const getInitials = () => {
    return experience.company
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
  };

  // Horizontal animation variations based on index placement (even represents left-entrance, odd is right-entrance)
  const isEven = index % 2 === 0;
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: isEven ? -60 : 60 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      
      {/* 1. Connecting Line Spot Indicator (Floating Center Bubble on Large Screens) */}
      <div className="absolute left-4 md:left-1/2 top-4 md:top-1/2 -translate-x-[9px] md:-translate-x-1/2 md:-translate-y-1/2 w-[20px] h-[20px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-slate-50 dark:border-slate-950 shadow-md z-10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>

      {/* 2. Experience Card Container */}
      <motion.div
        id={`experience-card-${experience.id}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`w-[calc(100%-2.5rem)] md:w-[44%] ml-10 md:ml-0 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 relative`}
      >
        {/* Type Badge */}
        <div className="absolute top-4 right-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 dark:bg-blue-500/20">
          {experience.type}
        </div>

        {/* Card Header Content */}
        <div className="flex items-center gap-4 mb-4 mt-1">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-md">
            {getExperienceIcon()}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-sans leading-tight">
              {experience.role}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-semibold text-blue-500 dark:text-purple-400">
                {experience.company}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                {experience.period}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {experience.description}
        </p>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/45">
          {experience.skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/40"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 3. Empty spacer block on opposite side of timeline */}
      <div className="hidden md:block w-[44%]" />
    </div>
  );
}
