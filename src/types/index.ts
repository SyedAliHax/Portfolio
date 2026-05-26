import { createClient } from '@supabase/supabase-js';
import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// ── Supabase Init ──────────────────────────────────────────
const supabaseUrl  = process.env.VITE_SUPABASE_URL  || '';
const supabaseKey  = process.env.VITE_SUPABASE_ANON_KEY || '';

let db: ReturnType<typeof createClient> | null = null;
try {
  if (supabaseUrl && supabaseKey) {
    db = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase] Connected ✓');
  } else {
    console.warn('[Supabase] Missing env vars — running in fallback mode');
  }
} catch (e) {
  console.error('[Supabase] Init failed:', e);
}

// ── In-Memory Fallback Data ────────────────────────────────
let memContacts: any[] = [];
let memSocials = {
  github:    'https://github.com/syedalibg',
  linkedin:  'https://linkedin.com/in/syedalibg',
  facebook:  'https://facebook.com',
  instagram: 'https://instagram.com',
};

// ── Middleware: require DB for writes ─────────────────────
const requireDb = (_req: Request, res: Response, next: NextFunction) => {
  if (!db) return res.status(403).json({ error: 'Database offline — writes disabled.' });
  next();
};

// ── HEALTH ────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', supabase: !!db, time: new Date().toISOString() });
});

// ── PROJECTS ──────────────────────────────────────────────
app.get('/api/projects', async (_req, res) => {
  if (!db) return res.json([]);
  const { data, error } = await db.from('projects').select('*').order('id');
  if (error || !data) return res.json([]);
  const mapped = data.map((p: any) => ({
    id: p.id, title: p.title, description: p.description,
    techStack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    githubUrl: p.github_url || '', liveUrl: p.live_url || '',
    category: p.category || 'Full Stack',
    gradient: p.gradient || 'from-indigo-600 via-purple-600 to-pink-500',
    imageUrl: p.image_url || '', showGithub: p.show_github === true,
  }));
  res.json(mapped);
});

app.post('/api/projects', requireDb, async (req, res) => {
  const p = req.body;
  const { data, error } = await db!.from('projects').insert([{
    title: p.title, description: p.description,
    tech_stack: p.techStack || [], github_url: p.githubUrl || '',
    live_url: p.liveUrl || '', category: p.category || 'Full Stack',
    gradient: p.gradient || '', image_url: p.imageUrl || '',
    show_github: p.showGithub === true,
  }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.put('/api/projects/:id', requireDb, async (req, res) => {
  const p = req.body;
  const { data, error } = await db!.from('projects').update({
    title: p.title, description: p.description,
    tech_stack: p.techStack || [], github_url: p.githubUrl || '',
    live_url: p.liveUrl || '', category: p.category,
    gradient: p.gradient, image_url: p.imageUrl,
    show_github: p.showGithub === true,
  }).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.delete('/api/projects/:id', requireDb, async (req, res) => {
  const { error } = await db!.from('projects').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── EXPERIENCES ───────────────────────────────────────────
app.get('/api/experiences', async (_req, res) => {
  if (!db) return res.json([]);
  const { data, error } = await db.from('experiences').select('*').order('id');
  if (error || !data) return res.json([]);
  res.json(data);
});

app.post('/api/experiences', requireDb, async (req, res) => {
  const { data, error } = await db!.from('experiences').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.put('/api/experiences/:id', requireDb, async (req, res) => {
  const { data, error } = await db!.from('experiences').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.delete('/api/experiences/:id', requireDb, async (req, res) => {
  const { error } = await db!.from('experiences').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── CONTACT ───────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'All fields required.' });

  const entry = { name, email, subject, message, created_at: new Date().toISOString() };
  memContacts.unshift({ ...entry, id: Date.now() });

  if (db) {
    const { data, error } = await db.from('contacts').insert([entry]).select();
    if (error) console.error('[Contact Insert]', error.message);
    return res.json({ success: true, data: data || [entry] });
  }
  res.json({ success: true, simulated: true, data: [entry] });
});

// ── ADMIN ─────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const correct = process.env.ADMIN_PASSWORD || 'syedalihaxadmin';
  if (!password) return res.status(400).json({ error: 'Password required.' });
  if (password !== correct) return res.status(401).json({ error: 'Wrong password!' });
  res.json({ success: true, token: `hax_${Buffer.from(password).toString('base64')}` });
});

app.get('/api/admin/contacts', async (_req, res) => {
  if (db) {
    const { data, error } = await db.from('contacts').select('*').order('created_at', { ascending: false });
    if (!error && data) return res.json(data);
  }
  res.json(memContacts);
});

app.delete('/api/admin/contacts/:id', requireDb, async (req, res) => {
  const { error } = await db!.from('contacts').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  memContacts = memContacts.filter(c => String(c.id) !== req.params.id);
  res.json({ success: true });
});

// ── SOCIALS ───────────────────────────────────────────────
app.get('/api/socials', async (_req, res) => {
  if (db) {
    const { data, error } = await db.from('settings').select('*').eq('key', 'social_links').single();
    if (!error && data?.value) return res.json({ ...memSocials, ...data.value });
  }
  res.json(memSocials);
});

app.put('/api/socials', async (req, res) => {
  memSocials = { ...memSocials, ...req.body };
  if (db) {
    const { data: existing } = await db.from('settings').select('id').eq('key', 'social_links');
    if (existing && existing.length > 0) {
      await db.from('settings').update({ value: memSocials }).eq('key', 'social_links');
    } else {
      await db.from('settings').insert([{ key: 'social_links', value: memSocials }]);
    }
  }
  res.json({ success: true });
});

export default app;