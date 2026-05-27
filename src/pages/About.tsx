import { motion } from 'motion/react';
import { User, Award, Layers, Sparkles } from 'lucide-react';
import ContributionGrid from '../components/ContributionGrid';
import SkillBadge from '../components/SkillBadge';

export default function About() {
  const bioHeadline = "CTO & Co-Founder at Haxudio Digital Solutions";
  const agencySubtitle = "A Service Based Digital Agency";

  const skillCards = [
    { name: 'HTML5', initials: 'HT', colorClass: 'from-orange-500 to-red-500', iconName: 'FileCode' },
    { name: 'CSS3', initials: 'CS', colorClass: 'from-blue-500 to-indigo-500', iconName: 'Paintbrush' },
    { name: 'Tailwind CSS', initials: 'TW', colorClass: 'from-sky-400 to-teal-500', iconName: 'Wind' },
    { name: 'Bootstrap', initials: 'BS', colorClass: 'from-purple-600 to-indigo-600', iconName: 'Grid' },
    { name: 'JavaScript', initials: 'JS', colorClass: 'from-yellow-400 to-amber-500', iconName: 'Braces' },
    { name: 'TypeScript', initials: 'TS', colorClass: 'from-blue-600 to-indigo-600', iconName: 'ShieldCheck' },
    { name: 'React', initials: 'RE', colorClass: 'from-cyan-400 to-blue-500', iconName: 'Atom' },
    { name: 'Next.js', initials: 'NX', colorClass: 'from-slate-800 to-slate-900', iconName: 'Globe' },
    { name: 'React Native', initials: 'RN', colorClass: 'from-indigo-400 to-purple-600', iconName: 'Smartphone' },
    { name: 'Node.js', initials: 'ND', colorClass: 'from-green-500 to-emerald-600', iconName: 'Server' },
    { name: 'Express.js', initials: 'EX', colorClass: 'from-slate-600 to-slate-700', iconName: 'Network' },
    { name: 'MongoDB', initials: 'MG', colorClass: 'from-green-600 to-emerald-700', iconName: 'Database' },
    { name: 'Supabase', initials: 'SB', colorClass: 'from-emerald-400 to-teal-600', iconName: 'Compass' },
    { name: 'Firebase', initials: 'FB', colorClass: 'from-amber-400 to-orange-500', iconName: 'Flame' },
    { name: 'Git', initials: 'GT', colorClass: 'from-orange-600 to-red-600', iconName: 'GitBranch' },
    { name: 'GitHub', initials: 'GH', colorClass: 'from-slate-700 to-slate-900', iconName: 'Github' },
    { name: 'GSAP', initials: 'GS', colorClass: 'from-green-400 to-yellow-500', iconName: 'Sparkles' },
  ];

  const fadeUpTransition = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  return (
    <div id="about-page-root" className="min-h-screen pt-24 pb-16 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================
            SECTION 1: HERO
            ======================================================== */}
        <section id="about-hero" className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-2 mb-12 text-left"
          >
            <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
              Get to know me
            </span>
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-500" />
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-sans">
                About Me
              </h1>
            </div>
            
            {/* Dynamic Badge row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 mt-4 bg-slate-100/60 dark:bg-slate-900/40 p-4 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500 shrink-0 animate-pulse" />
                {bioHeadline}
              </span>
              <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600">|</span>
              <span className="text-xs sm:text-sm font-mono font-medium text-slate-500 dark:text-slate-400">
                {agencySubtitle}
              </span>
            </div>
          </motion.div>

          {/* Bio text columns grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Bio info card */}
            <div className="lg:col-span-7 text-base font-sans leading-relaxed text-slate-600 dark:text-slate-400 flex flex-col gap-5">
              <p>
                I'm <strong>Syed Ali Hax</strong>, a passionate Software Engineer and the CTO & Co-Founder of Haxudio Digital Solutions — a service-based digital agency delivering cutting-edge web and mobile solutions.
              </p>
              <p>
                I'm deeply committed to the craft of coding, constantly pushing boundaries in frontend design, robust backend systems, and advanced deep learning domains. I am a firm believer that great software is built at the perfect intersection of technical excellence, user-empowering microinteractions, and innovative creative thinking.
              </p>
              <p className="border-l-4 border-indigo-500/80 pl-4 py-1 italic bg-indigo-50/20 dark:bg-indigo-950/20 rounded-r-lg font-medium text-slate-700 dark:text-slate-300">
                "Technical architecture lies in details; human experiences reside in interactions."
              </p>
            </div>

            {/* Profile cardboard mock right */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-w-[340px] aspect-square rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-1 shadow-lg shadow-indigo-500/10 relative group"
              >
                {/* Decorative particles */}
                <div className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 shadow-md group-hover:scale-110 duration-300">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>

                <div className="w-full h-full rounded-[22px] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-40 select-none pointer-events-none" />
                  
                  {/* Real Profile Image Avatar */}
                  <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-[#60A5FA] via-[#8B5CF6] to-[#C084FC] p-[2.5px] shadow-lg shadow-indigo-500/30 overflow-hidden shrink-0 select-none pointer-events-none">
                    <img
                      src="/src/assets/images/SyedAli.avif"
                      alt="Syed Ali Image"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <span className="text-lg font-black mt-6 tracking-wide text-slate-800 dark:text-slate-100">
                    Syed Ali Hax
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6366F1] dark:text-[#a5b4fc] mt-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200/40 dark:border-slate-850">
                    Lead Tech Engineer
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: PROFESSIONAL SKILLSET
            ======================================================== */}
        <section id="detailed-skills" className="mb-24 border-t border-slate-250/20 dark:border-slate-800/40 pt-20">
          <motion.div {...fadeUpTransition} className="flex flex-col gap-2 mb-12">
            <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
              Stack Capabilities
            </span>
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-500" />
              <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-slate-100">
                Professional Skillset
              </h2>
            </div>
            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Hover over cards to view responsive structural lifts and accent glowing overlays of tools.
            </p>
          </motion.div>

          {/* Multi-responsive grid (2 mobile, 4 desktop, 6 xl) as specified */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {skillCards.map((sk) => (
              <SkillBadge
                key={sk.name}
                name={sk.name}
                initials={sk.initials}
                colorClass={sk.colorClass}
                iconName={sk.iconName}
              />
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 3: GITHUB CONTRIBUTION GRID
            ======================================================== */}
        <section id="github-contributions" className="border-t border-slate-250/20 dark:border-slate-800/40 pt-20">
          <ContributionGrid />
        </section>

      </div>
    </div>
  );
}
