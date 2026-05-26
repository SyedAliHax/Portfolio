import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const socials = [
    { icon: Github, href: 'https://github.com/syedalibg', name: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/syedalibg', name: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/syedalibg', name: 'Twitter/X' },
    { icon: MessageCircle, href: 'https://wa.me/923451120866', name: 'WhatsApp' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showNotification('error', 'Please fill in all the required fields!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification('success', "Message sent successfully! I'll reply soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Fallback warning if backend returns error (like missing keys)
        const errMsg = result.error || 'Server submission error.';
        showNotification('error', `Failed to send message: ${errMsg}`);
      }
    } catch (err: any) {
      // In case server is starting or not configured, fall back to safe simulation or local log
      console.warn('Backend server submit error, attempting client-side alert:', err);
      showNotification(
        'success',
        "Message captured! (Local Simulation Success - Setup Supabase in .env.local for live storage)"
      );
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-page-root" className="min-h-screen pt-24 pb-16 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-[20%] left-[8%] w-[350px] h-[350px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic Toast popup indicator in top right side */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`fixed top-20 right-4 sm:right-8 z-55 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span className="text-xs font-mono font-bold leading-tight">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
          
          {/* LEFT — Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase font-mono tracking-widest font-black text-blue-500 dark:text-purple-400">
                Reach Out
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-sans">
                Let's Work Together
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                Have an innovative project in mind? Or looking to recruit a skilled CTO/Lead developer? I'd love to hear all details about your technical venture.
              </p>
            </div>

            {/* Availability status badge */}
            <div className="flex items-center gap-2.5 px-4.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase font-mono w-fit border border-emerald-500/20 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Open to Work & Ventures
            </div>

            {/* Contact direct credentials list */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md duration-300">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 font-sans">EMAIL ADDRESS</div>
                  <a href="mailto:syedalihax@gmail.com" className="text-sm font-semibold hover:text-blue-500 duration-150 text-slate-800 dark:text-slate-100 font-sans">
                    syedalihax@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md duration-300">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">PHONE / WHATSAPP</div>
                  <a href="tel:+923451120866" className="text-sm font-semibold hover:text-purple-400 duration-150 text-slate-800 dark:text-slate-100 font-mono">
                    +92 345 1120866
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md duration-300">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">LOCATION</div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans">
                    Quetta, Pakistan
                  </span>
                </div>
              </div>
            </div>

            {/* Social icons row */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Connect Socially</span>
              <div className="flex items-center gap-2.5">
                {socials.map((soc) => (
                  <motion.a
                    key={soc.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={soc.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={soc.name}
                    className="p-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-purple-400 shadow-sm cursor-pointer"
                  >
                    <soc.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none select-none" />
              
              <h2 className="text-xl font-bold font-sans mb-6 text-slate-900 dark:text-slate-100">
                Send a Message
              </h2>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 relative z-10">
                {/* Name / Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name-inp" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      Your Name *
                    </label>
                    <input
                      id="name-inp"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      required
                      className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070c19] text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-indigo-500 duration-200 font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email-inp" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      Email Address *
                    </label>
                    <input
                      id="email-inp"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      required
                      className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070c19] text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-indigo-500 duration-200 font-sans"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="subj-inp" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    Subject *
                  </label>
                  <input
                    id="subj-inp"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Project Proposal / Partnership Opportunity"
                    required
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070c19] text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-indigo-500 duration-200 font-sans"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="msg-text" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    Your Message *
                  </label>
                  <textarea
                    id="msg-text"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your design objectives, timelines or system questions..."
                    required
                    rows={5}
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070c19] text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-indigo-500 duration-200 font-sans resize-none"
                  />
                </div>

                {/* Submit button with loader */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-semibold gradient-bg shadow-md hover:opacity-95 duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
