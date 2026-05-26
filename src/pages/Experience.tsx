import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar } from 'lucide-react';
import { experienceData } from '../data';
import ExperienceCard from '../components/ExperienceCard';
import { Experience as ExpType } from '../types';

export default function Experience() {
  const [experiences, setExperiences] = useState<ExpType[]>(experienceData);

  useEffect(() => {
    fetch('/api/experiences')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setExperiences(data);
        }
      })
      .catch(err => {
        console.warn('Could not fetch experiences from server API, using local fallback:', err);
      });
  }, []);

  return (
    <div id="experience-page" className="min-h-screen pt-24 pb-16 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] relative overflow-hidden">
      
      {/* Dynamic Background Blur Accents */}
      <div className="absolute top-[30%] right-[5%] w-[350px] h-[350px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[8%] w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Headings Unit */}
        <div className="flex flex-col gap-2 mb-20 text-left">
          <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
            Professional Timeline
          </span>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-500" />
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-sans">
              Career Experience
            </h1>
          </div>
          <p className="max-w-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-2">
            A linear progression of my professional journey in technology. Includes my roles leading digital agency engineering teams, delivering robust solutions, and managing client integrations globally.
          </p>
        </div>

        {/* Timeline Matrix Structure */}
        <div className="relative w-full max-w-5xl mx-auto mt-12 pb-12">
          
          {/* Central Connecting Timeline Line (Drawn in blue-to-purple linear gradient) */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 -translate-x-[1px] w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-60 dark:opacity-40" />

          {/* Core Mapping of Experience Cards */}
          <div className="flex flex-col w-full relative">
            {experiences.map((exp, idx) => (
              <ExperienceCard key={exp.id} experience={exp} index={idx} />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
