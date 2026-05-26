import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment configuration
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON body parser
app.use(express.json());

// Initialize Supabase client if credentials are provided in process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: any = null;

const isValidSupabaseUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

if (supabaseUrl && supabaseAnonKey && isValidSupabaseUrl(supabaseUrl)) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[Supabase] Client initialized successfully.');
  } catch (err) {
    console.error('[Supabase] Critical error initializing client:', err);
  }
} else {
  console.warn('[Supabase] Credentials missing or invalid URL configured. Server will run in simulated fallback modes.');
}

// ========================================================
// MEMORY/FALLBACK DATA STORAGE
// ========================================================

let serverContacts = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Collaboration Opportunity",
    message: "Hi Syed! I loved your portfolio. Would you be open to working with us on a freelance basis?",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    name: "Zainab Ali",
    email: "zainab@example.com",
    subject: "Agency Inquiry",
    message: "Aasalam-o-Alaikum, is Haxudio available to build a web platform this month? Let me know your rates.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let serverProjects = [
  {
    id: 1,
    title: 'ChatPDF - AI Document Assistant',
    description: 'An interactive AI-powered application that allows users to upload PDF documents and extract summaries, ask contextual questions, or search terms using natural language processing.',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'OpenAI', 'Pinecone'],
    githubUrl: '',
    liveUrl: 'https://www.chatpdf.com/',
    category: 'Deep Learning',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600',
    showGithub: false,
  },
  {
    id: 2,
    title: 'Supabase Open Database Console',
    description: 'A highly scalable database management console featuring real-time data listener grids, robust row-level security visualizers, and instant SQL query auto-complete.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Go'],
    githubUrl: '',
    liveUrl: 'https://supabase.com/',
    category: 'Backend',
    gradient: 'from-cyan-500 via-teal-500 to-teal-600',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    showGithub: false,
  },
  {
    id: 3,
    title: 'v0 Generative UI Sandbox',
    description: 'A state-of-the-art developer platform that leverages generative AI models to convert natural language prompts into clean, interactive, and production-ready React component code.',
    techStack: ['Next.js', 'React', 'Generative AI', 'Vercel', 'Tailwind CSS'],
    githubUrl: '',
    liveUrl: 'https://v0.dev/',
    category: 'Frontend',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    showGithub: false,
  },
  {
    id: 4,
    title: 'Kapa.ai - SDK & API Copilot',
    description: 'An intelligent developer assistant that ingests developer documentation, GitHub repositories, and API endpoints to answer intricate integration questions with contextual code templates.',
    techStack: ['React', 'TypeScript', 'LangChain', 'OpenAI SDK', 'Python'],
    githubUrl: '',
    liveUrl: 'https://www.kapa.ai/',
    category: 'Full Stack',
    gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    showGithub: false,
  },
];

let serverExperiences = [
  {
    id: 1,
    role: 'CTO & Co-Founder',
    company: 'Haxudio Digital Solutions',
    type: 'Full-time',
    period: 'Jan 2023 – Present',
    description: 'Leading the technical vision and architecture of a service-based digital agency. Managing a team of developers, overseeing project delivery, and driving innovation in web and mobile solutions for clients globally.',
    skills: ['Next.js', 'Node.js', 'Team Leadership', 'System Architecture', 'Client Relations'],
  },
  {
    id: 2,
    role: 'Freelance Full-Stack Developer',
    company: 'Self-Employed',
    type: 'Freelance',
    period: 'Jun 2022 – Dec 2022',
    description: 'Delivered 10+ custom web applications for international clients on platforms like Fiverr and Upwork. Specialized in MERN stack development, REST API design, and responsive UI implementation.',
    skills: ['React', 'Express.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
  },
  {
    id: 3,
    role: 'Web Development Student',
    company: 'Saylani Mass IT Training (SMIT)',
    type: 'Training',
    period: 'Jan 2022 – Jun 2022',
    description: 'Completed an intensive full-stack web development bootcamp covering JavaScript, React, Node.js, and databases. Built multiple real-world projects under professional mentorship.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
  },
  {
    id: 4,
    role: 'Open Source Contributor',
    company: 'GitHub Community',
    type: 'Voluntary',
    period: 'Mar 2023 – Present',
    description: 'Actively contribute to open-source projects on GitHub, including bug fixes, feature additions, and documentation improvements across MERN stack repositories.',
    skills: ['Git', 'GitHub', 'Code Review', 'TypeScript'],
  },
];

let serverSocials = {
  github: 'https://github.com/syedalibg',
  linkedin: 'https://linkedin.com/in/syedalibg',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
};

// ========================================================
// CORE API PORTFOLIO ENDPOINTS
// ========================================================

// Helper to check write access
const ensureConnected = (req: any, res: any, next: any) => {
  if (!supabaseClient) {
    return res.status(403).json({
      success: false,
      error: 'Disconnected Mode! Database is offline or not configured. Modifications are locked.'
    });
  }
  next();
};

// 1. PROJECTS API
app.get('/api/projects', async (req, res) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('projects').select('*').order('id', { ascending: true });
      if (!error && data) {
        // Map Supabase column snake_case format to camelCase schema
        const mapped = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          techStack: Array.isArray(p.tech_stack) ? p.tech_stack : (typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : p.tech_stack || []),
          githubUrl: p.github_url || '',
          liveUrl: p.live_url || '',
          category: p.category || 'Full Stack',
          gradient: p.gradient || 'from-indigo-600 via-indigo-700 to-violet-800',
          imageUrl: p.image_url || '',
          showGithub: p.show_github === true
        }));
        return res.json(mapped);
      } else if (error) {
        console.error('[Supabase Error] Select projects failed:', error.message);
        return res.json([]);
      }
    } catch (err) {
      console.warn('[Supabase] Failed to fetch projects, returning empty list:', err);
      return res.json([]);
    }
  } else {
    // ONLY return mock fallback data when disconnected (no environment variables at all)
    return res.json(serverProjects);
  }
});

app.post('/api/projects', ensureConnected, async (req, res) => {
  const p = req.body;
  
  try {
    const newProj = {
      title: p.title || 'New Project',
      description: p.description || '',
      tech_stack: Array.isArray(p.techStack) ? p.techStack : [],
      github_url: p.githubUrl || '',
      live_url: p.liveUrl || '',
      category: p.category || 'Full Stack',
      gradient: p.gradient || 'from-indigo-600 via-purple-600 to-pink-500',
      image_url: p.imageUrl || '',
      show_github: p.showGithub === true
    };

    const { data, error } = await supabaseClient.from('projects').insert([newProj]).select();

    if (error) {
      return res.status(500).json({ error: `Supabase Error: ${error.message}` });
    }

    const savedProj = (data && data.length > 0) ? data[0] : newProj;
    return res.json({ success: true, project: savedProj });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Database write error' });
  }
});

app.put('/api/projects/:id', ensureConnected, async (req, res) => {
  const paramId = req.params.id;
  const id = isNaN(Number(paramId)) ? paramId : Number(paramId);
  const p = req.body;

  // Track / update locally in memory as fallback sync
  const localIndex = serverProjects.findIndex(proj => proj.id === id);
  if (localIndex !== -1) {
    serverProjects[localIndex] = {
      ...serverProjects[localIndex],
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      category: p.category,
      gradient: p.gradient,
      imageUrl: p.imageUrl,
      showGithub: p.showGithub === true
    };
  }

  try {
    const { data, error } = await supabaseClient.from('projects').update({
      title: p.title,
      description: p.description,
      tech_stack: p.techStack,
      github_url: p.githubUrl,
      live_url: p.liveUrl,
      category: p.category,
      gradient: p.gradient,
      image_url: p.imageUrl,
      show_github: p.showGithub === true
    }).eq('id', id).select();

    if (error) {
      return res.status(500).json({ error: `Supabase Error: ${error.message}` });
    }

    const rlsBlocked = !data || data.length === 0;
    if (rlsBlocked) {
      console.warn(`[Supabase RLS Warning] Project update for ID ${id} affected 0 rows. It might be blocked by Row Level Security updates.`);
    }

    return res.json({ success: true, rlsBlocked });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Update database error' });
  }
});

app.delete('/api/projects/:id', ensureConnected, async (req, res) => {
  const paramId = req.params.id;
  const id = isNaN(Number(paramId)) ? paramId : Number(paramId);

  // Sync locally in memory as fallback
  serverProjects = serverProjects.filter(p => p.id !== id);

  try {
    const { data, error } = await supabaseClient.from('projects').delete().eq('id', id).select();
    if (error) {
      return res.status(500).json({ error: `Supabase Error: ${error.message}` });
    }

    const rlsBlocked = !data || data.length === 0;
    if (rlsBlocked) {
      console.warn(`[Supabase RLS Warning] Project delete for ID ${id} affected 0 rows. It might be blocked by Row Level Security deletions.`);
    }

    return res.json({ success: true, rlsBlocked });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Deletion error' });
  }
});

// 2. EXPERIENCES API
app.get('/api/experiences', async (req, res) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('experiences').select('*').order('id', { ascending: true });
      if (!error && data) {
        const mapped = data.map((exp: any) => ({
          id: exp.id,
          role: exp.role,
          company: exp.company,
          type: exp.type || 'Full-time',
          period: exp.period || '',
          description: exp.description || '',
          skills: Array.isArray(exp.skills) ? exp.skills : (typeof exp.skills === 'string' ? JSON.parse(exp.skills) : exp.skills || [])
        }));
        return res.json(mapped);
      } else if (error) {
        console.error('[Supabase Error] Select experiences failed:', error.message);
        return res.json([]);
      }
    } catch (err) {
      console.warn('[Supabase] Failed to fetch experience list:', err);
      return res.json([]);
    }
  } else {
    // Return mock offline experiences only when disconnected
    return res.json(serverExperiences);
  }
});

app.post('/api/experiences', ensureConnected, async (req, res) => {
  const exp = req.body;

  try {
    const newExp = {
      role: exp.role || 'Software Engineer',
      company: exp.company || 'New Company',
      type: exp.type || 'Full-time',
      period: exp.period || '2026',
      description: exp.description || '',
      skills: Array.isArray(exp.skills) ? exp.skills : []
    };

    const { data, error } = await supabaseClient.from('experiences').insert([newExp]).select();

    if (error) {
      return res.status(500).json({ error: `Supabase Error: ${error.message}` });
    }

    const savedExp = (data && data.length > 0) ? data[0] : newExp;
    return res.json({ success: true, experience: savedExp });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Database write error' });
  }
});

app.put('/api/experiences/:id', ensureConnected, async (req, res) => {
  const paramId = req.params.id;
  const id = isNaN(Number(paramId)) ? paramId : Number(paramId);
  const exp = req.body;

  // Track / update locally in memory as fallback sync
  const localIndex = serverExperiences.findIndex(item => item.id === id);
  if (localIndex !== -1) {
    serverExperiences[localIndex] = {
      ...serverExperiences[localIndex],
      role: exp.role,
      company: exp.company,
      type: exp.type || 'Full-time',
      period: exp.period,
      description: exp.description,
      skills: exp.skills || []
    };
  }

  try {
    const { data, error } = await supabaseClient.from('experiences').update({
      role: exp.role,
      company: exp.company,
      type: exp.type,
      period: exp.period,
      description: exp.description,
      skills: exp.skills
    }).eq('id', id).select();

    if (error) {
      return res.status(500).json({ error: `Supabase Error: ${error.message}` });
    }

    const rlsBlocked = !data || data.length === 0;
    if (rlsBlocked) {
      console.warn(`[Supabase RLS Warning] Experience update for ID ${id} affected 0 rows. It might be blocked by Row Level Security updates.`);
    }

    return res.json({ success: true, rlsBlocked });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Database error' });
  }
});

app.delete('/api/experiences/:id', ensureConnected, async (req, res) => {
  const paramId = req.params.id;
  const id = isNaN(Number(paramId)) ? paramId : Number(paramId);

  // Sync locally in memory as fallback
  serverExperiences = serverExperiences.filter(item => item.id !== id);

  try {
    const { data, error } = await supabaseClient.from('experiences').delete().eq('id', id).select();
    if (error) {
      return res.status(500).json({ error: `Supabase Error: ${error.message}` });
    }

    const rlsBlocked = !data || data.length === 0;
    if (rlsBlocked) {
      console.warn(`[Supabase RLS Warning] Experience delete for ID ${id} affected 0 rows. It might be blocked by Row Level Security deletions.`);
    }

    return res.json({ success: true, rlsBlocked });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Timeline delete error' });
  }
});

// 3. CONTACT FORM RECEIVER (UPGRADED)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedSubject = String(subject).trim();
  const trimmedMessage = String(message).trim();

  const newContact = {
    id: serverContacts.length > 0 ? Math.max(...serverContacts.map(c => c.id)) + 1 : 1,
    name: trimmedName,
    email: trimmedEmail,
    subject: trimmedSubject,
    message: trimmedMessage,
    created_at: new Date().toISOString()
  };

  // Keep locally in memory for visual display
  serverContacts.unshift(newContact);

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('contacts')
        .insert([
          {
            name: trimmedName,
            email: trimmedEmail,
            subject: trimmedSubject,
            message: trimmedMessage,
          },
        ])
        .select();

      if (error) {
        console.error('[Supabase Error] Insertion failed:', error);
      }
      return res.status(200).json({ success: true, data: data || [newContact] });
    } catch (err: any) {
      console.error('[Server Error] Supabase execution error, used local memory:', err);
      return res.status(200).json({ success: true, data: [newContact] });
    }
  } else {
    console.log('[Disconnected Mode] Simulated Message received:', newContact);
    return res.status(200).json({
      success: true,
      simulated: true,
      data: [newContact]
    });
  }
});

// ========================================================
// REVOLUTIONARY ADMIN ENDPOINTS
// ========================================================

// 1. ADMIN LOGIN
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const configuredPassword = process.env.ADMIN_PASSWORD || 'syedalihaxadmin';

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === configuredPassword) {
    return res.json({
      success: true,
      token: `session_hax_token_${Buffer.from(password).toString('base64')}`
    });
  } else {
    return res.status(401).json({ error: 'Ghalat password! Please enter the correct password.' });
  }
});

// 2. GET CONTACT MESSAGES INBOX
app.get('/api/admin/contacts', async (req, res) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('contacts').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('[Supabase] Could not fetch contact database table from Supabase, using in-memory contacts');
    }
  }
  return res.json(serverContacts);
});

// 3. DELETE CONTACT MESSAGE
app.delete('/api/admin/contacts/:id', ensureConnected, async (req, res) => {
  const paramId = req.params.id;
  const id = isNaN(Number(paramId)) ? paramId : Number(paramId);
  serverContacts = serverContacts.filter(c => c.id !== id);

  try {
    const { error } = await supabaseClient.from('contacts').delete().eq('id', id);
    if (error) {
      return res.status(500).json({ error: `Supabase Error: ${error.message}` });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Contact delete error' });
  }
});

// 4. MANAGE SOCIAL LINKS ENDPOINTS (GET and PUT)
app.get('/api/socials', async (req, res) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('settings')
        .select('*')
        .eq('key', 'social_links')
        .single();
      
      if (!error && data && data.value) {
        const merged = { ...serverSocials, ...data.value };
        return res.json(merged);
      }
    } catch (err) {
      console.warn('[Supabase] Could not fetch settings table for social_links. Using in-memory fallback.');
    }
  }
  return res.json(serverSocials);
});

app.put('/api/socials', async (req, res) => {
  const newSocials = req.body;
  if (!newSocials || typeof newSocials !== 'object') {
    return res.status(400).json({ error: 'Body element is invalid. Expected JSON map.' });
  }

  // Update in-memory fallback instantly
  serverSocials = { ...serverSocials, ...newSocials };

  if (supabaseClient) {
    try {
      // Check if key='social_links' row exists in the settings table
      const { data: existing, error: fetchErr } = await supabaseClient
        .from('settings')
        .select('*')
        .eq('key', 'social_links');

      let dbError = null;
      let dataResult = null;

      if (!fetchErr && existing && existing.length > 0) {
        const { data, error } = await supabaseClient
          .from('settings')
          .update({ value: serverSocials })
          .eq('key', 'social_links')
          .select();
        dbError = error;
        dataResult = data;
      } else {
        const { data, error } = await supabaseClient
          .from('settings')
          .insert([{ key: 'social_links', value: serverSocials }])
          .select();
        dbError = error;
        dataResult = data;
      }

      if (dbError) {
        console.warn('[Supabase Error] Socials persist failed:', dbError.message);
        return res.json({ success: true, rlsBlocked: true, error: dbError.message });
      }

      const rlsBlocked = !dataResult || dataResult.length === 0;
      return res.json({ success: true, rlsBlocked });

    } catch (err: any) {
      console.error('[Supabase Error] Socials exception block:', err);
      return res.json({ success: true, rlsBlocked: true, error: err.message });
    }
  }

  return res.json({ success: true, rlsBlocked: false, offlineMode: true });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabaseConnected: !!supabaseClient,
    time: new Date().toISOString()
  });
});

// ========================================================
// VITE MIDDLEWARE AND ASSETS SERVING SETUP
// ========================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Mode: Development] Vite middleware mounted.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Mode: Production] Serving static files from dist/.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express Server] Syed Ali Hax portfolio listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[Server Crash] Initialization failed:', error);
});
