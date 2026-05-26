import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  LogOut,
  Mail,
  FolderGit2,
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Database,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Share2
} from 'lucide-react';
import { Project, Experience } from '../types';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'contacts' | 'projects' | 'experiences' | 'socials'>('contacts');

  // Backend state
  const [contacts, setContacts] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [socials, setSocials] = useState<any>({
    github: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  });
  const [savingSocials, setSavingSocials] = useState<boolean>(false);
  
  // Loading & feedback states
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);

  // Modal / Form state for Projects
  const [isProjectFormOpen, setIsProjectFormOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    techStack: [],
    githubUrl: '',
    liveUrl: '',
    category: 'Full Stack',
    gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
    imageUrl: '',
    showGithub: false
  });
  const [newSkillTag, setNewSkillTag] = useState<string>('');

  // Modal / Form state for Experiences
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState<boolean>(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({
    role: '',
    company: '',
    type: 'Full-time',
    period: '',
    description: '',
    skills: []
  });
  const [newExpSkill, setNewExpSkill] = useState<string>('');

  // Check login state on mount
  useEffect(() => {
    const token = sessionStorage.getItem('hax_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    
    // Check health endpoint for real connection state
    try {
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setSupabaseConnected(!!healthData.supabaseConnected);
      }
    } catch (e) {
      console.warn('Could not reach health check status', e);
    }

    // Fetch Contacts
    try {
      const contactsRes = await fetch('/api/admin/contacts');
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Error fetching admin contacts:', err);
    }

    // Fetch Projects
    try {
      const projectsRes = await fetch('/api/projects');
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }

    // Fetch Experiences
    try {
      const expRes = await fetch('/api/experiences');
      if (expRes.ok) {
        const data = await expRes.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error('Error fetching experiences:', err);
    }

    // Fetch Socials
    try {
      const socialsRes = await fetch('/api/socials');
      if (socialsRes.ok) {
        const data = await socialsRes.json();
        setSocials(data);
      }
    } catch (err) {
      console.error('Error fetching socials:', err);
    }

    setLoading(false);
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocials(true);
    try {
      const res = await fetch('/api/socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socials)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.rlsBlocked) {
          showToast('error', 'Warning: Saved locally, but Supabase Row Level Security (RLS) blocked writing settings to database.');
        } else {
          showToast('success', 'Social media connections updated successfully!');
        }
        fetchAllData();
      } else {
        showToast('error', 'Failed to update social links.');
      }
    } catch (err) {
      console.error('Error saving socials:', err);
      showToast('error', 'Transmission error updating social accounts.');
    } finally {
      setSavingSocials(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        sessionStorage.setItem('hax_admin_token', resData.token);
        setIsAuthenticated(true);
        fetchAllData();
        showToast('success', 'Aasalam-o-Alaikum Syed Ali! Admin Session Verified Successfully.');
      } else {
        setLoginError(resData.error || 'Authenication failed!');
      }
    } catch (err) {
      setLoginError('Server authentication module offline.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hax_admin_token');
    setIsAuthenticated(false);
    setPassword('');
    showToast('success', 'Logged out safely.');
  };

  // ----------------------------------------------------
  // CONTACT METHODS
  // ----------------------------------------------------
  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts(prev => prev.filter(c => c.id !== id));
        showToast('success', 'User message deleted successfully from feed.');
      } else {
        showToast('error', 'Could not delete entry.');
      }
    } catch (err) {
      showToast('error', 'Network failure.');
    }
  };

  // ----------------------------------------------------
  // PROJECT CRUD METHODS
  // ----------------------------------------------------
  const handleOpenProjectCreate = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      githubUrl: '',
      liveUrl: '',
      category: 'Full Stack',
      gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
      showGithub: false
    });
    setIsProjectFormOpen(true);
  };

  const handleOpenProjectEdit = (p: Project) => {
    setEditingProject(p);
    setProjectForm({ ...p });
    setIsProjectFormOpen(true);
  };

  const handleAddTechTag = () => {
    if (!newSkillTag.trim()) return;
    const currentTags = projectForm.techStack || [];
    if (!currentTags.includes(newSkillTag.trim())) {
      setProjectForm(prev => ({
        ...prev,
        techStack: [...currentTags, newSkillTag.trim()]
      }));
    }
    setNewSkillTag('');
  };

  const handleRemoveTechTag = (tag: string) => {
    setProjectForm(prev => ({
      ...prev,
      techStack: (prev.techStack || []).filter(t => t !== tag)
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      showToast('error', 'Title and description are required fields.');
      return;
    }

    try {
      const isEdit = !!editingProject;
      const url = isEdit ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.rlsBlocked) {
          showToast('error', 'Warning: Saved locally, but Supabase Row Level Security (RLS) blocked writing to database.');
        } else {
          showToast('success', isEdit ? 'Project updated successfully!' : 'New Project created successfully!');
        }
        setIsProjectFormOpen(false);
        fetchAllData();
      } else {
        showToast('error', 'Error while saving portfolio asset.');
      }
    } catch (err) {
      showToast('error', 'Database write error.');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Delete this project forever from collection?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const result = await res.json();
        if (result.rlsBlocked) {
          showToast('error', 'Warning: Removed locally, but Supabase Row Level Security (RLS) blocked deleting from database.');
        } else {
          showToast('success', 'Project removed from indices.');
        }
        fetchAllData();
      } else {
        showToast('error', 'Removal failure');
      }
    } catch (err) {
      showToast('error', 'Failure connected through channels.');
    }
  };

  // ----------------------------------------------------
  // EXPERIENCE CRUD METHODS
  // ----------------------------------------------------
  const handleOpenExpCreate = () => {
    setEditingExperience(null);
    setExperienceForm({
      role: '',
      company: '',
      type: 'Full-time',
      period: 'Jan 2026 – Present',
      description: '',
      skills: ['React', 'Node.js']
    });
    setIsExperienceFormOpen(true);
  };

  const handleOpenExpEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setExperienceForm({ ...exp });
    setIsExperienceFormOpen(true);
  };

  const handleAddExpSkill = () => {
    if (!newExpSkill.trim()) return;
    const current = experienceForm.skills || [];
    if (!current.includes(newExpSkill.trim())) {
      setExperienceForm(prev => ({
        ...prev,
        skills: [...current, newExpSkill.trim()]
      }));
    }
    setNewExpSkill('');
  };

  const handleRemoveExpSkill = (skill: string) => {
    setExperienceForm(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill)
    }));
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceForm.role || !experienceForm.company || !experienceForm.period) {
      showToast('error', 'Role, Company and Career Period are required.');
      return;
    }

    try {
      const isEdit = !!editingExperience;
      const url = isEdit ? `/api/experiences/${editingExperience.id}` : '/api/experiences';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceForm)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.rlsBlocked) {
          showToast('error', 'Warning: Saved locally on server, but Supabase Row Level Security (RLS) policies blocked database update.');
        } else {
          showToast('success', isEdit ? 'Experience revised beautifully!' : 'New timeline record registered!');
        }
        setIsExperienceFormOpen(false);
        fetchAllData();
      } else {
         showToast('error', 'Saving to timeline archive failed.');
      }
    } catch (err) {
      showToast('error', 'Server offline.');
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!window.confirm('Remove this career history node?')) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const result = await res.json();
        if (result.rlsBlocked) {
          showToast('error', 'Warning: Removed locally, but Supabase Row Level Security (RLS) blocked deleting from database.');
        } else {
          showToast('success', 'Chronicle deleted.');
        }
        fetchAllData();
      } else {
        showToast('error', 'Failure in removal request.');
      }
    } catch (err) {
      showToast('error', 'Database sync failed.');
    }
  };

  // ----------------------------------------------------
  // RENDER SPLITS
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div id="admin-login-shield" className="min-h-screen pt-36 pb-20 bg-[#0b0f19] flex items-center justify-center px-4">
        <div className="absolute top-[10%] left-[20%] w-[250px] h-[250px] bg-[#6366F1]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-[#a855f7]/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative"
        >
          {/* Circular Header Icon */}
          <div className="w-16 h-16 bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto -mt-16 sm:-mt-18 shadow-xl shadow-indigo-500/20 border border-indigo-400/20 mb-8">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">Syed Ali Hax Portal</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">SECURED DATABASE ADMINISTRATION</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 font-mono mb-2">
                Administration Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4.5 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#6366F1] font-sans transition-colors placeholder:text-slate-600 font-mono tracking-widest"
                  required
                />
              </div>
              {loginError && (
                <div className="mt-3 text-rose-500 text-xs font-semibold font-mono flex items-center gap-1.5 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loginError}
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold tracking-wide hover:opacity-95 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Verify credentials
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors">
              &larr; Back to Public Portfolio Homepage
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-root" className="min-h-screen pt-24 pb-16 bg-[#0b0f19] text-[#F1F5F9] relative overflow-hidden">
      
      {/* Toast Notification popup block */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`fixed top-20 right-4 sm:right-8 z-55 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-mono font-bold leading-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold font-mono text-[9px] uppercase tracking-widest animate-pulse flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-400"></span> Live Session
              </span>
              <span className="text-xs font-mono">
                SUPABASE SYNC STATUS:{' '}
                {supabaseConnected ? (
                  <span className="text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/25">CONNECTED ✔</span>
                ) : (
                  <span className="text-rose-400 font-bold px-1.5 py-0.5 bg-rose-500/10 rounded border border-rose-500/25">DISCONNECTED ❌</span>
                )}
              </span>
            </div>
            <h1 className="text-3xl font-black mt-2 tracking-tight">Syed Ali's Admin Platform</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Control live projects, inspect client inquiries, and manage timeline milestones</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-colors border border-white/5 shrink-0 flex items-center justify-center cursor-pointer"
              title="Refresh database collections data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4.5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/15 cursor-pointer flex items-center gap-2 tracking-wide uppercase font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {!supabaseConnected && (
          <div className="mb-8 p-4.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm">
              <strong className="block font-bold">DATABASE DISCONNECTED (Read-Only Mode)</strong>
              <p className="mt-1 text-rose-400/95 font-mono leading-relaxed">
                Supabase database keys generate nahi mili. Is wajah se portfolio static list (Simulation) load kar rha h jise ap change ya delete nahi kar sakte. Agar apko real backend data manipulate karna h, to build settings me ja kar correct variables dalen aur restart Karen.
              </p>
            </div>
          </div>
        )}

        {/* Categories Tab Navigation */}
        <div className="flex border-b border-white/5 mb-8 overflow-x-auto pb-[1px] gap-2">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-5 py-4 border-b-2 text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'contacts'
                ? 'border-indigo-500 text-white bg-white/5 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/2'
            }`}
          >
            <Mail className="w-4 h-4" />
            INQUIRIES FLOOD ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-4 border-b-2 text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'projects'
                ? 'border-indigo-500 text-white bg-white/5 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/2'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            PROJECT WORKS ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-5 py-4 border-b-2 text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'experiences'
                ? 'border-indigo-500 text-white bg-white/5 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/2'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            CAREER STEPS ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('socials')}
            className={`px-5 py-4 border-b-2 text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'socials'
                ? 'border-indigo-500 text-white bg-white/5 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/2'
            }`}
          >
            <Share2 className="w-4 h-4" />
            SOCIAL NETWORKS
          </button>
        </div>

        {/* Loader backdrop screen */}
        {loading && projects.length === 0 && contacts.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
            <span className="text-sm font-mono text-slate-400">Loading catalog logs...</span>
          </div>
        )}

        {/* ========================================================
            TAB 1: CONTACT MESSAGES
           ======================================================== */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Supabase Inbox Feedback Forms</h2>
              <span className="text-xs font-mono text-slate-400">Total {contacts.length} notifications</span>
            </div>

            {contacts.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-white/10 rounded-3xl bg-slate-900/30">
                <Mail className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                <h3 className="font-bold text-white text-lg">Your Inbox is Dry</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">No user submissions registered on the contacts endpoint yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map((c) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={c.id || Math.random()}
                    className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all shadow-lg group relative"
                  >
                    <div>
                      {/* Top Action Panel & sender details */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-extrabold text-[#F1F5F9] leading-tight text-base">{c.name}</h4>
                          <a href={`mailto:${c.email}`} className="text-xs text-indigo-400 hover:underline font-mono block mt-1">{c.email}</a>
                        </div>
                        <button
                          onClick={supabaseConnected ? () => handleDeleteContact(c.id) : () => showToast('error', 'Disconnected Mode! Message deletion locked.')}
                          className={`p-2 border rounded-lg transition-all ${
                            supabaseConnected 
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 opacity-80 group-hover:opacity-100 cursor-pointer' 
                              : 'bg-slate-800/20 text-slate-500 border-slate-800 opacity-45 cursor-not-allowed'
                          }`}
                          title={supabaseConnected ? "Delete message from timeline" : "Delete action disabled"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subject */}
                      <div className="mb-3">
                        <span className="text-[9px] uppercase font-mono tracking-widest font-black text-slate-500">SUBJECT</span>
                        <p className="text-xs font-bold text-[#E2E8F0]">{c.subject}</p>
                      </div>

                      {/* Message Content */}
                      <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 mt-2">
                        <span className="text-[8px] uppercase font-mono tracking-widest font-black text-slate-500 block mb-1">MESSAGE BODY</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium whitespace-pre-wrap">{c.message}</p>
                      </div>
                    </div>

                    {/* Date Tag */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>MESSAGE ID: #{c.id || 'N/A'}</span>
                      <span>{c.created_at ? new Date(c.created_at).toLocaleString() : 'Just Now'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: PROJECTS MANAGER
           ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Showcased Grid Projects</h2>
                <p className="text-xs text-slate-400 font-mono">Changes reflect directly in /projects collection grid</p>
              </div>
              <button
                onClick={supabaseConnected ? handleOpenProjectCreate : () => showToast('error', 'Disconnected Mode! Project creation is locked.')}
                className={`px-5 py-3 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  supabaseConnected
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
                    : 'bg-indigo-650/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                ADD NEW PROJECT
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-20 text-center border border-dashed border-white/10 rounded-3xl bg-slate-900/30">
                <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="font-bold text-white text-lg">No Projects Present</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Add a project to initialize the database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 bg-slate-900/30 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all shadow-lg"
                  >
                    <div>
                      {/* Top banner visual placeholder */}
                      <div className="h-28 w-full rounded-xl overflow-hidden relative bg-slate-950 border border-white/5 mb-4 mb-2 flex items-center justify-center">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-r ${p.gradient || 'from-indigo-900 to-indigo-950'} opacity-30`} />
                        )}
                        <span className="absolute px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full text-[9px] text-slate-300 border border-white/10 uppercase tracking-wider font-mono font-bold top-3 right-3 select-none">
                          {p.category}
                        </span>
                        <div className="absolute font-mono font-bold text-[10px] text-slate-400 bottom-2 left-3">ID: {p.id}</div>
                      </div>

                      <h3 className="font-black text-lg text-white mb-1.5">{p.title}</h3>
                      <p className="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">{p.description}</p>

                      {/* Tech Stack pills row */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.techStack.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-slate-300 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links review summary */}
                      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/40 rounded-xl text-xs font-mono text-slate-400 border border-white/5 mb-4">
                        <div className="truncate">
                          <span className="text-[8px] text-slate-600 block leading-none mb-1">LIVE DEMO URL</span>
                          <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline hover:text-indigo-300 leading-none flex items-center gap-1">
                            {p.liveUrl ? 'Visit Website' : 'Not set'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="truncate">
                          <span className="text-[8px] text-slate-600 block leading-none mb-1">GITHUB REPO</span>
                          <span className="leading-none flex items-center gap-1">
                            {p.showGithub ? (p.githubUrl ? 'Source ON' : 'Show GitHub ON (empty url)') : 'Source OFF (Disabled)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-auto">
                      <button
                        onClick={supabaseConnected ? () => handleOpenProjectEdit(p) : () => showToast('error', 'Disconnected Mode! Project settings locked.')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                          supabaseConnected
                            ? 'bg-white/5 hover:bg-white/10 text-white border-white/5'
                            : 'bg-white/2 text-slate-500 border-white/2 opacity-35 cursor-not-allowed'
                        }`}
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit settings
                      </button>
                      <button
                        onClick={supabaseConnected ? () => handleDeleteProject(p.id) : () => showToast('error', 'Disconnected Mode! Project deletion locked.')}
                        className={`py-2.5 px-3 rounded-xl transition-all border flex items-center justify-center ${
                          supabaseConnected
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/15 cursor-pointer'
                            : 'bg-slate-800/10 text-slate-500 border-slate-800 opacity-35 cursor-not-allowed'
                        }`}
                        title={supabaseConnected ? "Delete project" : "Deletion locked"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: TIMELINE / EXPERIENCE MANAGER
           ======================================================== */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Timeline Milestone Chroniclers</h2>
                <p className="text-xs text-slate-400 font-mono">Adds cards straight inside professional career flow page</p>
              </div>
              <button
                onClick={supabaseConnected ? handleOpenExpCreate : () => showToast('error', 'Disconnected Mode! Experience creation is locked.')}
                className={`px-5 py-3 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  supabaseConnected
                    ? 'bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-violet-600/10'
                    : 'bg-violet-650/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                ADD NEW WORK HISTORY
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="p-20 text-center border border-dashed border-white/10 rounded-3xl bg-slate-900/30">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="font-bold text-white text-lg">No Career Steps Present</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Register work chronicles inside catalog indexes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 bg-slate-900/35 border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-800 transition-all"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold font-mono">
                          ID: {exp.id}
                        </span>
                        <span className="px-2.5 py-1 bg-white/5 text-slate-300 border border-white/5 rounded-lg text-[10px] font-bold font-mono">
                          {exp.type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-white">{exp.role}</h4>
                        <p className="text-xs text-indigo-400 font-semibold font-mono mt-0.5">{exp.company}</p>
                      </div>

                      <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">{exp.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] text-slate-400 font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      <button
                        onClick={supabaseConnected ? () => handleOpenExpEdit(exp) : () => showToast('error', 'Disconnected Mode! Career settings locked.')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                          supabaseConnected
                            ? 'bg-white/5 hover:bg-white/10 text-white border-white/5'
                            : 'bg-white/2 text-slate-500 border-white/2 opacity-35 cursor-not-allowed'
                        }`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit node
                      </button>
                      <button
                        onClick={supabaseConnected ? () => handleDeleteExperience(exp.id) : () => showToast('error', 'Disconnected Mode! Milestone deletion locked.')}
                        className={`p-2.5 rounded-xl transition-all border flex items-center justify-center ${
                          supabaseConnected
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/15 cursor-pointer'
                            : 'bg-slate-800/10 text-slate-500 border-slate-800 opacity-35 cursor-not-allowed'
                        }`}
                        title={supabaseConnected ? "Delete Milestone Chronicle" : "Deletion locked"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* ========================================================
            TAB 4: SOCIAL CONNECTIONS SETTINGS PANEL
           ======================================================== */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-405" />
                Manage Social Profile Connections
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Customize global portfolio social buttons across Navbar, Footer, and Contact sections instantly.
              </p>
            </div>

            <form onSubmit={handleSocialSubmit} className="p-6 sm:p-8 bg-slate-900/35 border border-white/5 rounded-3xl space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none select-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* LinkedIn */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="soc-linkedin" className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    LinkedIn Profile URL
                  </label>
                  <input
                    id="soc-linkedin"
                    type="url"
                    value={socials.linkedin || ''}
                    placeholder="https://linkedin.com/in/username"
                    onChange={(e) => setSocials((prev: any) => ({ ...prev, linkedin: e.target.value }))}
                    className="px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 duration-200"
                  />
                </div>

                {/* GitHub */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="soc-github" className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                    <Github className="w-4 h-4 text-white" />
                    GitHub Account URL
                  </label>
                  <input
                    id="soc-github"
                    type="url"
                    value={socials.github || ''}
                    placeholder="https://github.com/username"
                    onChange={(e) => setSocials((prev: any) => ({ ...prev, github: e.target.value }))}
                    className="px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 duration-200"
                  />
                </div>

                {/* Facebook */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="soc-facebook" className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    Facebook Page URL
                  </label>
                  <input
                    id="soc-facebook"
                    type="url"
                    value={socials.facebook || ''}
                    placeholder="https://facebook.com/username"
                    onChange={(e) => setSocials((prev: any) => ({ ...prev, facebook: e.target.value }))}
                    className="px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 duration-200"
                  />
                </div>

                {/* Instagram */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="soc-instagram" className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-rose-400" />
                    Instagram Account URL
                  </label>
                  <input
                    id="soc-instagram"
                    type="url"
                    value={socials.instagram || ''}
                    placeholder="https://instagram.com/username"
                    onChange={(e) => setSocials((prev: any) => ({ ...prev, instagram: e.target.value }))}
                    className="px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 duration-200"
                  />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4 relative z-10">
                <span className="text-[10px] font-mono text-slate-500 leading-snug max-w-md">
                  {!supabaseConnected ? (
                    <span className="text-rose-400 font-bold uppercase">Disconnected Simulator Mode. Saved locally on active Node server instance.</span>
                  ) : (
                    <span className="text-indigo-400 font-semibold uppercase font-sans">Settings write dynamically to active Supabase settings table.</span>
                  )}
                </span>
                <button
                  type="submit"
                  disabled={savingSocials}
                  className="px-5 py-3 hover:opacity-95 text-white bg-indigo-650 hover:bg-indigo-700 rounded-xl text-xs font-bold tracking-wide shadow-md font-mono flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase text-nowrap shrink-0 transition-all border border-indigo-500/40"
                >
                  {savingSocials ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save Connections
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ========================================================
          PROJECT FORM OVERLAY MODAL DOCKED
         ======================================================== */}
      <AnimatePresence>
        {isProjectFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProjectFormOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl z-10"
            >
              <button
                onClick={() => setIsProjectFormOpen(false)}
                className="absolute top-5 right-5 p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <Database className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {editingProject ? 'Modify Schooled Project Settings' : 'Create New Collection Project'}
                </h3>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Supabase DB Console"
                      value={projectForm.title || ''}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Category</label>
                    <select
                      value={projectForm.category || 'Full Stack'}
                      onChange={(e: any) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="Full Stack">Full Stack</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Deep Learning">Deep Learning</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Description (One detailed human paragraphs)</label>
                  <textarea
                    placeholder="Describe your design and performance integrations in full scope..."
                    rows={3}
                    value={projectForm.description || ''}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Live Demo Web Address</label>
                    <input
                      type="url"
                      placeholder="https://client-project.com"
                      value={projectForm.liveUrl || ''}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Thumbnail Picture (Image URL)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={projectForm.imageUrl || ''}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-sans text-xs"
                    />
                  </div>
                </div>

                {/* GitHub configuration rows requested */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-white block">Interactive Code Access</span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Toggle this setting to activate GitHub Source Code links on hover cards.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjectForm(prev => ({ ...prev, showGithub: !prev.showGithub }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        projectForm.showGithub ? 'bg-indigo-600' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          projectForm.showGithub ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {projectForm.showGithub && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-[10px] font-bold font-mono uppercase text-[#94A3B8] mb-1">GitHub Original Code Repository Address</label>
                      <input
                        type="url"
                        placeholder="https://github.com/syedalibg/repository-name"
                        value={projectForm.githubUrl || ''}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Tech Stack builder */}
                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Project Tech Stack</label>
                  <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 border border-slate-850 rounded-xl mb-2">
                    {(projectForm.techStack || []).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-indigo-300 font-mono flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTechTag(tag)} className="hover:text-red-400 cursor-pointer text-slate-500 font-extrabold text-[10px]">&times;</button>
                      </span>
                    ))}
                    {(projectForm.techStack || []).length === 0 && (
                      <span className="text-xs text-slate-600 font-mono italic">No technologies listed...</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. PyTorch"
                      value={newSkillTag}
                      onChange={(e) => setNewSkillTag(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTechTag(); } }}
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddTechTag}
                      className="px-4.5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 rounded-xl transition-all cursor-pointer font-bold font-mono"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60 font-mono">
                  <button
                    type="button"
                    onClick={() => setIsProjectFormOpen(false)}
                    className="px-5 py-3 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Project Grid State
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          EXPERIENCE FORM OVERLAY MODAL DOCKED
         ======================================================== */}
      <AnimatePresence>
        {isExperienceFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExperienceFormOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl z-10"
            >
              <button
                onClick={() => setIsExperienceFormOpen(false)}
                className="absolute top-5 right-5 p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {editingExperience ? 'Modify Timeline Experience Item' : 'New Career Timeline Marker'}
                </h3>
              </div>

              <form onSubmit={handleSaveExperience} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Role / Position</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Frontend Developer"
                      value={experienceForm.role || ''}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Company / Firm</label>
                    <input
                      type="text"
                      placeholder="e.g. Haxudio Agency"
                      value={experienceForm.company || ''}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Period</label>
                    <input
                      type="text"
                      placeholder="e.g. Jan 2024 – Nov 2025"
                      value={experienceForm.period || ''}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Engagement Type</label>
                    <select
                      value={experienceForm.type || 'Full-time'}
                      onChange={(e: any) => setExperienceForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Contract">Contract</option>
                      <option value="Training">Training</option>
                      <option value="Voluntary">Voluntary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Role Description & Achievements Summary</label>
                  <textarea
                    placeholder="Built responsive frontends keeping clean structures..."
                    rows={4}
                    value={experienceForm.description || ''}
                    onChange={(e) => setExperienceForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                    required
                  />
                </div>

                {/* Skills/Tools list */}
                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase text-slate-400 mb-1.5">Accomplished Skills</label>
                  <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 border border-slate-850 rounded-xl mb-2">
                    {(experienceForm.skills || []).map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-purple-300 font-mono flex items-center gap-1">
                        {s}
                        <button type="button" onClick={() => handleRemoveExpSkill(s)} className="hover:text-red-400 cursor-pointer text-slate-500 font-extrabold text-[10px]">&times;</button>
                      </span>
                    ))}
                    {(experienceForm.skills || []).length === 0 && (
                      <span className="text-xs text-slate-600 font-mono italic">No skill tags listed yet...</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Next.js, Teamwork"
                      value={newExpSkill}
                      onChange={(e) => setNewExpSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddExpSkill(); } }}
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddExpSkill}
                      className="px-4.5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 rounded-xl transition-all cursor-pointer font-bold font-mono"
                    >
                      Add Skill Tag
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60 font-mono">
                  <button
                    type="button"
                    onClick={() => setIsExperienceFormOpen(false)}
                    className="px-5 py-3 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-705 text-white shadow-md shadow-violet-600/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Timeline Anchor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
