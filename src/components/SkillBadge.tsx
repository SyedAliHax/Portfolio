import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface SkillBadgeProps {
  key?: string | number;
  name: string;
  iconName?: string;
  level?: number; // 1 to 100 for progress display
  initials?: string;
  colorClass?: string;
}

export default function SkillBadge({
  name,
  iconName,
  level,
  initials,
  colorClass = 'from-blue-500 to-indigo-500',
}: SkillBadgeProps) {
  // Resolve Lucide icons dynamically from lucide-react safely
  const getIcon = () => {
    const iconKey = iconName || '';
    const LucideIcon = (Icons as any)[iconKey] || Icons.Code;
    
    return (
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorClass} text-white flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <LucideIcon className="w-5 h-5 stroke-[2.25]" />
      </div>
    );
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-2 cursor-default group"
    >
      <div className="flex items-center gap-3">
        <div className="group-hover:scale-110 transition-transform duration-300">
          {getIcon()}
        </div>
        <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base">
          {name}
        </span>
      </div>

      {level !== undefined && (
        <div className="w-full mt-1.5">
          <div className="flex justify-between text-[10px] font-mono mb-1 text-slate-400 dark:text-slate-500">
            <span>Proficiency</span>
            <span>{level}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
