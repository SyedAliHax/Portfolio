import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ArrowDown, Cpu, Briefcase, Award, Zap, Heart, CheckCircle2 } from 'lucide-react';
import TypewriterText from '../components/TypewriterText';
import SkillBadge from '../components/SkillBadge';
import ProjectCard from '../components/ProjectCard';
import { projectsData } from '../data';

export default function Home() {
  const featuredProjects = projectsData.slice(0, 3);

  const featuredSkills = [
    { name: 'HTML', iconName: 'Html5', level: 95 },
    { name: 'CSS', iconName: 'Css3', level: 90 },
    { name: 'JavaScript', iconName: 'FileJson', level: 95 },
    { name: 'TypeScript', iconName: 'FileCode', level: 90 },
    { name: 'React', iconName: 'Atom', level: 95 },
    { name: 'Next.js', iconName: 'FileCode2', level: 90 },
    { name: 'Node.js', iconName: 'Server', level: 85 },
    { name: 'MongoDB', iconName: 'Database', level: 85 },
    { name: 'Tailwind CSS', iconName: 'Palette', level: 95 },
    { name: 'Git', iconName: 'GitBranch', level: 90 },
    { name: 'React Native', iconName: 'Smartphone', level: 80 },
    { name: 'Deep Learning', iconName: 'Brain', level: 75 },
  ];

  const stats = [
    { id: 1, value: '3+', label: 'Years Experience', icon: Award, color: 'text-blue-500' },
    { id: 2, value: '20+', label: 'Projects Completed', icon: Zap, color: 'text-purple-500' },
    { id: 3, value: '15+', label: 'Technologies', icon: Cpu, color: 'text-emerald-500' },
    { id: 4, value: '100%', label: 'Satisfaction Rate', icon: CheckCircle2, color: 'text-amber-500' },
  ];

  // Global viewport transition variable
  const sectionTransition = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  return (
    <div id="home-page-root" className="relative min-h-screen pt-16 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] overflow-hidden">
      
      {/* BACKGROUND DECORATIVE GRADIENT BLOBS */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] bg-rose-400/5 dark:bg-rose-500/5 rounded-full blur-3xl animate-float-slow pointer-events-none" />

      {/* ========================================================
          SECTION 1: HERO
          ======================================================== */}
      <section
        id="hero-section"
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative py-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl flex flex-col items-center gap-6"
        >
          {/* Tag Header Label */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-indigo-600 dark:text-[#60A5FA] text-xs font-semibold tracking-wider uppercase font-mono shadow-sm">
            <span className="mr-2 h-2.5 w-2.5 rounded-full bg-indigo-500 dark:bg-[#6366F1] animate-pulse"></span>
            Open to New Projects
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-sm md:text-base font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-1 font-mono">Hi, I'm</h2>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans leading-none">
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#8B5CF6] to-[#C084FC] [background-slice:clone] bg-clip-text text-transparent">
                Syed Ali Hax
              </span>
            </h1>
          </div>

          {/* Typewriter text cycler with gradient tags */}
          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-600 dark:text-slate-300 h-10 flex items-center justify-center font-mono select-none">
            <span className="text-indigo-500 dark:text-[#60A5FA] mr-2.5 font-bold">&gt; </span>
            <TypewriterText
              texts={['Deep Learning Engineer', 'MERN Stack Developer', 'Frontend Developer', 'Backend Developer']}
              speed={80}
              deleteSpeed={40}
              pause={2000}
            />
            <span className="ml-1.5 w-2.5 h-6 md:h-8 bg-indigo-500 dark:bg-[#6366F1] animate-pulse shrink-0"></span>
          </div>

          <p className="max-w-xl text-sm sm:text-base text-slate-500 dark:text-[#94A3B8] leading-relaxed text-center px-2">
            Passionate about building scalable web applications and intelligent systems. CTO & Co-Founder at Haxudio Digital Solutions.
          </p>

          {/* CTA Buttons Layout */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-95 shadow-lg shadow-blue-500/20 hover:shadow-indigo-500/30 active:shadow-md rounded-xl cursor-pointer transition-shadow"
              >
                View My Work
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator Icon Banner */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono tracking-widest text-[#475569] dark:text-[#94A3B8] font-semibold uppercase">
            Scroll down
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-slate-400 dark:text-slate-300"
          >
            <ArrowDown className="w-4 h-4 text-blue-500" />
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: ABOUT SUMMARY
          ======================================================== */}
      <section
        id="about-summary-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-200/40 dark:border-slate-800/40 relative"
      >
        <motion.div {...sectionTransition}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bio copy */}
            <div className="lg:col-span-7 flex flex-col gap-6 items-start">
              <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
                A bit about me
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
                Solving problems by writing efficient code
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                I'm a passionate software engineer specializing in full-stack web development and deep learning. I love turning complex problems into simple, beautiful, and highly modular digital solutions. With expertise leading technical development and deployment, my goal is delivering bullet-proof user-first web platforms.
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="mt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-md cursor-pointer"
                >
                  Read Full Story
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Key Stats Matrix Box */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {stats.map((st) => (
                <div
                  key={st.id}
                  className="p-6 bg-slate-100/40 dark:bg-white/5 border border-slate-200/30 dark:border-white/10 rounded-2xl shadow-sm relative group hover:scale-[1.02] hover:shadow-md duration-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#6366F1]/10 dark:bg-[#6366F1]/20 rounded-xl text-indigo-600 dark:text-[#6366F1] group-hover:scale-105 transition-transform">
                      <st.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-mono">v3.1.2</span>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-[#F1F5F9] leading-none mb-1">
                      {st.value}
                    </div>
                    <div className="text-xs font-semibold uppercase text-slate-500 dark:text-[#94A3B8] tracking-widest font-mono">
                      {st.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </section>

      {/* ========================================================
          SECTION 3: SKILLS
          ======================================================== */}
      <section
        id="toolkit-section"
        className="bg-slate-50 dark:bg-slate-950/40 py-24 border-t border-slate-200/40 dark:border-slate-800/40 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div {...sectionTransition} className="flex flex-col items-center text-center gap-4 mb-16">
            <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
              My Toolkit
            </span>
            <div className="flex items-center gap-2 justify-center">
              <Cpu className="w-6 h-6 text-indigo-500" />
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-slate-100">
                Core Technologies
              </h2>
            </div>
            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
              A carefully cultivated list of technologies, frameworks, libraries, and tools I use frequently.
            </p>
          </motion.div>

          {/* Stagger Grid Animations */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {featuredSkills.map((sk) => (
              <SkillBadge
                key={sk.name}
                name={sk.name}
                iconName={sk.iconName}
                level={sk.level}
                colorClass="from-blue-500 to-purple-500"
              />
            ))}
          </motion.div>

        </div>
      </section>

      {/* ========================================================
          SECTION 4: FEATURED PROJECTS
          ======================================================== */}
      <section
        id="featured-projects"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-200/40 dark:border-slate-800/40 relative"
      >
        <motion.div {...sectionTransition} className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
            Selected Works
          </span>
          <div className="flex items-center gap-2 justify-center">
            <Briefcase className="w-6 h-6 text-indigo-500" />
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-slate-100">
              Recent Projects
            </h2>
          </div>
          <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Take a look at a subset of full stack and Deep Learning projects I have engineered recently.
          </p>
        </motion.div>

        {/* 3 columns list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        {/* Dynamic Nav Button */}
        <div className="flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-semibold text-white gradient-bg shadow-md rounded-2xl cursor-pointer"
            >
              View All Projects
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
