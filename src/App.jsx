import React, { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Award, BriefcaseBusiness,
  Check, CheckCircle2, ChevronDown, CircleHelp, Copy, ExternalLink, Eye, FileBadge,
  Github, Globe, GraduationCap, LayoutGrid, Link2, LogOut, Menu, Plus, Search,
  Settings2, ShieldCheck, Sparkles, Trash2, Trophy, UserRound, X, Pencil, Zap,
} from 'lucide-react';
import { supabase } from './lib/supabase';

const demoProfile = {
  display_name: 'Aarav Mehta',
  bio: 'Computer science student building useful things at the intersection of design and technology. I learn by shipping, then sharing the receipts.',
  skills: ['React', 'Python', 'Figma', 'Product design', 'SQL'],
  slug: 'aarav-mehta-demo',
};
const demoEntries = [
  { id: 'demo-1', title: 'Campus Connect', description: 'A student-led directory that makes it easier to find clubs, events and people on campus. Designed the experience and built the front end with React.', evidence_url: 'https://example.com/evidence/campus-connect', entry_type: 'project', created_at: '2026-09-18T00:00:00Z' },
  { id: 'demo-2', title: 'Build for Tomorrow — finalist', description: 'Worked in a 4-person team to prototype an accessibility-first campus navigation concept during a 36-hour hackathon.', evidence_url: 'https://example.com/evidence/build-for-tomorrow', entry_type: 'hackathon', created_at: '2026-08-27T00:00:00Z' },
  { id: 'demo-3', title: 'Foundations of UX Design', description: 'Completed a structured course covering research, wireframing, prototyping and usability testing.', evidence_url: '', entry_type: 'certificate', created_at: '2026-07-12T00:00:00Z' },
];

const categories = [
  { value: 'project', label: 'Project' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'other', label: 'Other' },
];
const categoryLabel = (value) => categories.find((c) => c.value === value)?.label || 'Project';

function initials(name = 'Student') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || 'S';
}
function safeUrl(value) {
  if (!value) return '';
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch { return ''; }
}
function useAuthSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  return { session, loading };
}

export default function App() {
  const { session, loading } = useAuthSession();
  return <Routes>
    <Route path="/u/:slug" element={<PublicPortfolio />} />
    <Route path="/sample" element={<SamplePortfolio />} />
    <Route path="*" element={<Home session={session} authLoading={loading} />} />
  </Routes>;
}

function Home({ session, authLoading }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [toast, setToast] = useState('');
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  if (authLoading) return <div className="loading-screen"><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><span>Loading your workspace…</span></div>;
  return <>
    {session ? <Dashboard session={session} notify={notify} /> : <Landing openAuth={(mode = 'signup') => { setAuthMode(mode); setAuthOpen(true); }} />}
    {authOpen && <AuthModal mode={authMode} onMode={setAuthMode} onClose={() => setAuthOpen(false)} />}
    {toast && <div className="toast"><CheckCircle2 size={16} />{toast}</div>}
  </>;
}

function Brand({ light = false }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} to="/" aria-label="ProofOfWork home">
    <span className="brand-mark"><Zap size={17} fill="currentColor" strokeWidth={2.4} /></span>
    <span>proof<span className="brand-word-light">of</span>work<span className="brand-period">.</span></span>
  </Link>;
}

function Landing({ openAuth }) {
  return <div className="landing">
    <header className="site-nav wrap">
      <Brand />
      <nav className="nav-links"><a href="#how-it-works">How it works</a><a href="#sample">Explore a sample</a></nav>
      <div className="nav-actions"><button className="btn btn-text" onClick={() => openAuth('signin')}>Log in</button><button className="btn btn-dark btn-small" onClick={() => openAuth('signup')}>Build your portfolio <ArrowUpRight size={15} /></button></div>
    </header>
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR WORK, WITH RECEIPTS</div>
          <h1>Don't just say<br />you can. <span>Show it.</span></h1>
          <p className="hero-subtitle">A portfolio for the work behind your potential. Projects, certificates, and hackathons — connected to the evidence.</p>
          <div className="hero-ctas"><button className="btn btn-dark btn-large" onClick={() => openAuth('signup')}>Create your portfolio <ArrowRight size={17} /></button><Link className="btn btn-outline btn-large" to="/sample">View sample <ArrowUpRight size={16} /></Link></div>
          <div className="hero-note"><div className="avatar-stack"><span>A</span><span>M</span><span>J</span></div><span>Made for students who build things.</span></div>
        </div>
        <div className="hero-preview" aria-label="Sample portfolio preview">
          <div className="preview-topline"><span className="window-dots"><i /><i /><i /></span><span className="mono small-muted">PORTFOLIO / 001</span><span className="sample-stamp">SAMPLE</span></div>
          <div className="preview-profile">
            <div className="avatar avatar-large">AM</div>
            <div className="preview-identity"><h2>Aarav Mehta</h2><p>CS student · Product-minded builder</p><div className="preview-skills"><span>React</span><span>Python</span><span>Figma</span></div></div>
          </div>
          <div className="preview-divider"><span>SELECTED WORK</span><span>03 ENTRIES</span></div>
          {demoEntries.map((entry, index) => <div className="preview-entry" key={entry.id}>
            <div className={`preview-entry-icon color-${index}`}><EntryIcon type={entry.entry_type} size={19} /></div>
            <div className="preview-entry-text"><strong>{entry.title}</strong><span>{categoryLabel(entry.entry_type)}</span></div>
            <EvidenceBadge hasEvidence={!!entry.evidence_url} compact />
            <ArrowUpRight className="preview-arrow" size={16} />
          </div>)}
          <div className="preview-foot"><span><span className="green-dot" /> LINKS, NOT CLAIMS</span><Link to="/sample">View full sample <ArrowRight size={13} /></Link></div>
        </div>
        <span className="hero-deco deco-one">✳</span><span className="hero-deco deco-two">✳</span>
      </section>
      <section className="trust-strip"><div className="wrap trust-inner"><span>BUILT FOR YOUR NEXT OPPORTUNITY</span><div><span><GraduationCap size={16} /> Internships</span><span><Trophy size={16} /> Hackathons</span><span><FileBadge size={16} /> Scholarships</span><span><BriefcaseBusiness size={16} /> First roles</span></div></div></section>
      <section className="how-section wrap" id="how-it-works">
        <div className="section-heading"><div className="eyebrow">THE IDEA IS SIMPLE</div><h2>Make your work<br />easy to <span>believe in.</span></h2><p>Less self-promotion. More substance. Give people a clear path from your claims to the work behind them.</p></div>
        <div className="feature-grid"><Feature number="01" icon={<Link2 size={20} />} title="Bring the receipts" text="Attach a repo, certificate, demo, case study or event page to each entry. Or keep it self-reported." /><Feature number="02" icon={<LayoutGrid size={20} />} title="One home for your work" text="Projects, hackathons, certificates and achievements, presented in one tidy portfolio." /><Feature number="03" icon={<Globe size={20} />} title="Share a clean profile" text="Publish a read-only page with a unique link. People can browse your work without needing an account." /></div>
      </section>
      <section className="sample-section" id="sample"><div className="wrap sample-inner"><div><div className="eyebrow">A LITTLE INSPIRATION</div><h2>Good work speaks.<br /><span>Evidence helps.</span></h2><p>Explore a fictional student portfolio to see how entries, skills and evidence links come together.</p><Link className="btn btn-dark btn-large" to="/sample">Explore the sample portfolio <ArrowRight size={16} /></Link></div><div className="sample-stats"><div><strong>01</strong><span>Profile</span></div><div><strong>03</strong><span>Sample entries</span></div><div><strong>05</strong><span>Skills</span></div><small>All example content is fictional and illustrative.</small></div></div></section>
    </main>
    <footer className="site-footer wrap"><Brand /><span>Build it. Link it. Own it.</span><span>© 2026 ProofOfWork</span></footer>
  </div>;
}

function Feature({ number, icon, title, text }) {
  return <article className="feature-card"><div className="feature-meta"><span>{number}</span><span className="feature-icon">{icon}</span></div><h3>{title}</h3><p>{text}</p></article>;
}

function EntryIcon({ type, size = 18 }) {
  if (type === 'certificate') return <Award size={size} />;
  if (type === 'hackathon') return <Trophy size={size} />;
  if (type === 'achievement') return <Sparkles size={size} />;
  return <BriefcaseBusiness size={size} />;
}

function EvidenceBadge({ hasEvidence, compact = false }) {
  return <span className={`evidence-badge ${hasEvidence ? 'evidence-linked' : 'self-reported'} ${compact ? 'badge-compact' : ''}`}>
    {hasEvidence ? <><Link2 size={12} /> Evidence-linked</> : <><UserRound size={12} /> Self-reported</>}
  </span>;
}

function AuthModal({ mode, onMode, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const isSignup = mode === 'signup';
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { display_name: name.trim() || email.split('@')[0] } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) setNotice('Check your inbox for the confirmation link, then log in.');
        else onClose();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (e) { setError(e.message || 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  };
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="icon-btn modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <Brand /><div className="auth-icon"><Zap size={20} fill="currentColor" /></div>
      <h2 id="auth-title">{isSignup ? 'Start with what you’ve built.' : 'Welcome back.'}</h2>
      <p>{isSignup ? 'Make your work easy to find and easier to understand.' : 'Your portfolio is waiting.'}</p>
      <form onSubmit={submit} className="auth-form">
        {isSignup && <label>Your name<input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Mehta" maxLength={90} required /></label>}
        <label>Email address<input autoFocus={!isSignup} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" required /></label>
        <label>Password<input type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required /></label>
        {error && <div className="form-error">{error}</div>}{notice && <div className="form-notice">{notice}</div>}
        <button className="btn btn-dark btn-large btn-full" disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'} <ArrowRight size={16} /></button>
      </form>
      <div className="auth-switch">{isSignup ? 'Already have an account?' : 'New to ProofOfWork?'} <button onClick={() => { onMode(isSignup ? 'signin' : 'signup'); setError(''); setNotice(''); }}>{isSignup ? 'Log in' : 'Create an account'}</button></div>
      <div className="auth-fineprint"><ShieldCheck size={13} /> Private by default. You choose when to publish.</div>
    </section>
  </div>;
}

function useWorkspace(session) {
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = async () => {
    if (!session?.user?.id) return;
    setLoading(true); setError('');
    const [profileResult, entriesResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
      supabase.from('portfolio_entries').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
    ]);
    if (profileResult.error) setError(profileResult.error.message);
    else if (!profileResult.data) setError('No profile was found. Run db/schema.sql in your Supabase SQL Editor, then sign out and sign back in.');
    else setProfile(profileResult.data);
    if (entriesResult.error) setError((current) => current || entriesResult.error.message);
    else setEntries(entriesResult.data || []);
    setLoading(false);
  };
  useEffect(() => { reload(); /* reload is intentionally driven by user id */ }, [session?.user?.id]);
  return { profile, setProfile, entries, setEntries, loading, error, reload };
}

function Dashboard({ session, notify }) {
  const navigate = useNavigate();
  const { profile, setProfile, entries, setEntries, loading, error, reload } = useWorkspace(session);
  const [section, setSection] = useState('overview');
  const [entryModal, setEntryModal] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileNav, setMobileNav] = useState(false);
  const [busyPublish, setBusyPublish] = useState(false);

  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const searchMatch = `${entry.title} ${entry.description} ${categoryLabel(entry.entry_type)}`.toLowerCase().includes(query.toLowerCase());
    const typeMatch = filter === 'all' || (filter === 'evidence' ? !!entry.evidence_url : entry.entry_type === filter);
    return searchMatch && typeMatch;
  }), [entries, query, filter]);

  const shareUrl = profile ? `${window.location.origin}/u/${profile.slug}` : '';
  const evidenceCount = entries.filter((e) => !!e.evidence_url).length;
  const publish = async () => {
    if (!profile) return;
    setBusyPublish(true);
    const next = !profile.is_public;
    const { data, error: updateError } = await supabase.from('profiles').update({ is_public: next }).eq('id', session.user.id).select().single();
    if (updateError) notify(`Couldn't update visibility: ${updateError.message}`);
    else { setProfile(data); notify(next ? 'Your portfolio is now public.' : 'Your portfolio is now private.'); }
    setBusyPublish(false);
  };
  const signOut = async () => { await supabase.auth.signOut(); navigate('/'); };
  const saveEntry = async (entryData, entryId) => {
    if (entryId) {
      const { error: updateError } = await supabase.from('portfolio_entries').update(entryData).eq('id', entryId).eq('user_id', session.user.id);
      if (updateError) throw updateError;
      notify('Entry updated.');
    } else {
      const { error: insertError } = await supabase.from('portfolio_entries').insert({ ...entryData, user_id: session.user.id });
      if (insertError) throw insertError;
      notify('Entry added to your portfolio.');
    }
    setEntryModal(null); await reload();
  };
  const deleteEntry = async (entry) => {
    if (!window.confirm(`Delete “${entry.title}”? This can't be undone.`)) return;
    const { error: deleteError } = await supabase.from('portfolio_entries').delete().eq('id', entry.id).eq('user_id', session.user.id);
    if (deleteError) notify(`Couldn't delete entry: ${deleteError.message}`);
    else { setEntries((items) => items.filter((item) => item.id !== entry.id)); notify('Entry deleted.'); }
  };
  const saveProfile = async (values) => {
    const { data, error: updateError } = await supabase.from('profiles').update(values).eq('id', session.user.id).select().single();
    if (updateError) throw updateError;
    setProfile(data); setProfileModal(false); notify('Profile details saved.');
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); notify('Portfolio link copied.'); }
    catch { window.prompt('Copy your portfolio link:', shareUrl); }
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand-row"><Brand /><button className="icon-btn mobile-close" onClick={() => setMobileNav(false)}><X size={18} /></button></div>
      <div className="sidebar-workspace"><span className="workspace-label">WORKSPACE</span><button className="workspace-select"><span className="workspace-avatar">{initials(profile?.display_name || session.user.email)}</span><span><strong>My portfolio</strong><small>Personal space</small></span><ChevronDown size={14} /></button></div>
      <nav className="side-nav"><span className="side-label">BUILD</span>
        <button className={section === 'overview' ? 'active' : ''} onClick={() => { setSection('overview'); setMobileNav(false); }}><LayoutGrid size={17} />Overview</button>
        <button className={section === 'entries' ? 'active' : ''} onClick={() => { setSection('entries'); setMobileNav(false); }}><BriefcaseBusiness size={17} />Portfolio entries <span className="nav-count">{entries.length}</span></button>
        <button className={section === 'profile' ? 'active' : ''} onClick={() => { setSection('profile'); setMobileNav(false); }}><UserRound size={17} />Profile & skills</button>
        <span className="side-label side-label-lower">SHARE</span>
        <button className={section === 'share' ? 'active' : ''} onClick={() => { setSection('share'); setMobileNav(false); }}><Globe size={17} />Public portfolio {profile?.is_public && <span className="nav-live-dot" />}</button>
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-help"><div className="help-icon"><CircleHelp size={16} /></div><div><strong>Show the work</strong><p>Links add context, not verification.</p></div></div><button className="sidebar-user" onClick={signOut}><span className="user-avatar">{initials(profile?.display_name || session.user.email)}</span><span className="sidebar-user-name"><strong>{profile?.display_name || 'Your account'}</strong><small>{session.user.email}</small></span><LogOut size={15} /></button></div>
    </aside>
    {mobileNav && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="dashboard-main">
      <header className="dashboard-topbar"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={19} /></button><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{section === 'overview' ? 'Overview' : section === 'entries' ? 'Portfolio entries' : section === 'profile' ? 'Profile & skills' : 'Public portfolio'}</strong></div><div className="topbar-right"><span className={`status-pill ${profile?.is_public ? 'status-public' : ''}`}><span />{profile?.is_public ? 'Published' : 'Private draft'}</span><button className="btn btn-dark btn-small" onClick={() => setEntryModal({ entry: null })}><Plus size={15} /> Add entry</button></div></header>
      <div className="dashboard-content">
        {loading && <div className="inline-loading"><span className="spinner" />Loading your portfolio…</div>}
        {error && <div className="error-banner"><CircleHelp size={17} /><div><strong>Workspace setup needs attention</strong><p>{error}</p><button className="text-link" onClick={reload}>Try again</button></div></div>}
        {!loading && profile && <>
          {section === 'overview' && <>
            <div className="page-intro"><div><div className="eyebrow">YOUR WORKSPACE <span className="live-slash">/</span> OVERVIEW</div><h1>Good work deserves <span>proof.</span></h1><p>A little progress, made visible. Keep your work organised and your story up to date.</p></div><button className="btn btn-outline" onClick={() => setProfileModal(true)}><Pencil size={15} /> Edit profile</button></div>
            <section className="welcome-card"><div className="welcome-left"><div className="avatar avatar-xl">{initials(profile.display_name)}</div><div><div className="welcome-meta"><span className="mini-tag">YOUR PORTFOLIO</span>{profile.is_public && <span className="public-mini"><span /> LIVE</span>}</div><h2>{profile.display_name}</h2><p>{profile.bio || 'Add a short bio to introduce yourself and the work you want to be known for.'}</p><div className="skill-chips">{(profile.skills || []).slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}{(!profile.skills || profile.skills.length === 0) && <button className="chip-empty" onClick={() => setSection('profile')}>+ Add your skills</button>}</div></div></div><div className="welcome-action"><span className="mono small-muted">PUBLIC LINK</span>{profile.is_public ? <><strong className="url-short">/u/{profile.slug}</strong><button className="btn btn-light" onClick={copyLink}><Copy size={14} /> Copy link</button></> : <><strong className="url-short muted-url">Not published yet</strong><button className="btn btn-lime" onClick={publish} disabled={busyPublish}><Globe size={14} /> {busyPublish ? 'Publishing…' : 'Publish portfolio'}</button></>}</div></section>
            <div className="metrics-grid"><Metric label="Portfolio entries" value={entries.length.toString().padStart(2, '0')} hint="Your work, in one place" icon={<BriefcaseBusiness size={17} />} /><Metric label="Evidence-linked" value={evidenceCount.toString().padStart(2, '0')} hint={entries.length ? `${Math.round((evidenceCount / entries.length) * 100)}% of entries have a link` : 'Links are optional'} icon={<Link2 size={17} />} /><Metric label="Skills listed" value={(profile.skills || []).length.toString().padStart(2, '0')} hint="What you bring to the table" icon={<Zap size={17} />} /><Metric label="Visibility" value={profile.is_public ? 'Live' : 'Private'} hint={profile.is_public ? 'Anyone with the link can view' : 'Only you can see your profile'} icon={<Eye size={17} />} special={profile.is_public} /></div>
            <section className="entries-section"><div className="section-toolbar"><div><div className="section-title-line"><h2>Portfolio entries</h2><span className="count-badge">{entries.length}</span></div><p>Small proof points add up to a bigger picture.</p></div><button className="btn btn-outline btn-small" onClick={() => setSection('entries')}>View all <ArrowRight size={14} /></button></div>
              {entries.length ? <div className="entries-list">{entries.slice(0, 3).map((entry) => <EntryRow key={entry.id} entry={entry} onEdit={() => setEntryModal({ entry })} onDelete={() => deleteEntry(entry)} />)}</div> : <EmptyEntries onAdd={() => setEntryModal({ entry: null })} />}
            </section>
            <div className="bottom-guidance"><span className="guidance-icon"><ShieldCheck size={17} /></span><div><strong>Evidence-linked doesn't mean verified.</strong><p>Links help people explore your work. ProofOfWork does not authenticate or endorse the content of an entry.</p></div><button className="text-link" onClick={() => setSection('share')}>Sharing settings <ArrowRight size={14} /></button></div>
          </>}
          {section === 'entries' && <>
            <div className="page-intro"><div><div className="eyebrow">YOUR WORKSPACE <span className="live-slash">/</span> PORTFOLIO</div><h1>Everything you've <span>worked on.</span></h1><p>Add the work, describe your role, and link evidence where you have it.</p></div><button className="btn btn-dark" onClick={() => setEntryModal({ entry: null })}><Plus size={16} /> New entry</button></div>
            <div className="entry-controls"><label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your entries…" /></label><label className="filter-select"><Settings2 size={15} /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All entries</option><option value="evidence">Evidence-linked</option>{categories.map((c) => <option value={c.value} key={c.value}>{c.label}</option>)}</select><ChevronDown size={14} /></label></div>
            {filteredEntries.length ? <div className="entries-list entries-list-large">{filteredEntries.map((entry) => <EntryRow key={entry.id} entry={entry} onEdit={() => setEntryModal({ entry })} onDelete={() => deleteEntry(entry)} />)}</div> : <EmptyEntries onAdd={() => setEntryModal({ entry: null })} isFiltered={!!query || filter !== 'all'} />}
          </>}
          {section === 'profile' && <>
            <div className="page-intro"><div><div className="eyebrow">YOUR WORKSPACE <span className="live-slash">/</span> PROFILE</div><h1>Your story, <span>your words.</span></h1><p>Give people a little context about the person behind the projects.</p></div><button className="btn btn-dark" onClick={() => setProfileModal(true)}><Pencil size={15} /> Edit profile</button></div>
            <section className="profile-settings-card"><div className="profile-settings-head"><div className="avatar avatar-xl">{initials(profile.display_name)}</div><div><span className="mini-tag">PROFILE PREVIEW</span><h2>{profile.display_name}</h2><p>{profile.bio || 'Your bio will appear here.'}</p></div></div><div className="settings-divider" /><div className="settings-field-label">SKILLS & TOOLS</div><div className="skill-chips skill-chips-large">{(profile.skills || []).map((skill) => <span key={skill}>{skill}</span>)}{(!profile.skills || profile.skills.length === 0) && <span className="soft-label">No skills added yet</span>}</div><button className="btn btn-outline" onClick={() => setProfileModal(true)}><Pencil size={14} /> Edit name, bio & skills</button></section>
            <div className="info-panel"><ShieldCheck size={18} /><div><strong>Keep it yours</strong><p>Your profile stays private until you publish it. You can unpublish it at any time.</p></div></div>
          </>}
          {section === 'share' && <>
            <div className="page-intro"><div><div className="eyebrow">YOUR WORKSPACE <span className="live-slash">/</span> SHARE</div><h1>Your work, <span>out in the world.</span></h1><p>Publish your portfolio as a read-only page. You control when it is available.</p></div></div>
            <section className="publish-card"><div className="publish-card-visual"><div className="publish-orbit orbit-one"/><div className="publish-orbit orbit-two"/><div className="publish-visual-mark"><Globe size={30} /></div><span className="publish-visual-label">{profile.is_public ? 'PUBLIC PROFILE' : 'PRIVATE DRAFT'}</span></div><div className="publish-copy"><span className={`status-pill ${profile.is_public ? 'status-public' : ''}`}><span />{profile.is_public ? 'Published' : 'Not published'}</span><h2>{profile.is_public ? 'Your portfolio is live.' : 'Ready to share your work?'}</h2><p>{profile.is_public ? 'Anyone with your unique link can view your profile and entries. They cannot edit them.' : 'Publish when the basics are ready. Your public page is read-only and only includes entries you choose to share while your profile is public.'}</p><div className="public-url-box"><span className="mono">{shareUrl}</span><button className="icon-btn" title="Copy public URL" onClick={copyLink} disabled={!profile.is_public}><Copy size={16} /></button></div><div className="publish-actions"><button className={`btn ${profile.is_public ? 'btn-outline' : 'btn-lime'}`} onClick={publish} disabled={busyPublish}>{profile.is_public ? <><Eye size={15} /> Unpublish portfolio</> : <><Globe size={15} /> {busyPublish ? 'Publishing…' : 'Publish portfolio'}</>}</button>{profile.is_public && <a className="btn btn-dark" href={shareUrl} target="_blank" rel="noreferrer">View public page <ArrowUpRight size={15} /></a>}</div><div className="small-privacy-note"><ShieldCheck size={14} /> No verification claims. Evidence links are provided by the portfolio owner.</div></div></section>
            <div className="share-faq"><h3>What happens when I publish?</h3><div><Check size={16} /><span>Your name, bio, skills and portfolio entries become viewable by anyone with the link.</span></div><div><Check size={16} /><span>Your visitors get a read-only page. Your account and edit controls remain private.</span></div><div><Check size={16} /><span>Unpublish at any time to remove public access through ProofOfWork.</span></div></div>
          </>}
        </>}
      </div>
      <footer className="dashboard-footer"><span>© 2026 ProofOfWork</span><span>Built on work, not words. <span className="footer-star">✳</span></span><button onClick={() => window.open('https://supabase.com/dashboard/project/bctporhapokwtixstqwc', '_blank', 'noopener,noreferrer')}>Backend status <ExternalLink size={12} /></button></footer>
    </main>
    {entryModal && <EntryModal entry={entryModal.entry} onClose={() => setEntryModal(null)} onSave={saveEntry} />}
    {profileModal && profile && <ProfileModal profile={profile} onClose={() => setProfileModal(false)} onSave={saveProfile} />}
  </div>;
}

function Metric({ label, value, hint, icon, special }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className={`metric-value ${special ? 'metric-live' : ''}`}>{value}</div><p>{hint}</p></div>;
}

function EntryRow({ entry, onEdit, onDelete, publicView = false }) {
  const hasEvidence = !!safeUrl(entry.evidence_url);
  const dateLabel = entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
  return <article className="entry-row"><div className={`entry-type-icon type-${entry.entry_type || 'project'}`}><EntryIcon type={entry.entry_type} size={19} /></div><div className="entry-row-main"><div className="entry-row-heading"><h3>{entry.title}</h3><span className="entry-date">{dateLabel}</span></div><p>{entry.description || 'No description added.'}</p><div className="entry-row-meta"><span className="entry-category">{categoryLabel(entry.entry_type)}</span><EvidenceBadge hasEvidence={hasEvidence} /></div></div><div className="entry-row-actions">{hasEvidence && <a className="entry-link" href={safeUrl(entry.evidence_url)} target="_blank" rel="noreferrer" aria-label="Open evidence link" title="Open evidence"><ExternalLink size={16} /></a>}{!publicView && <><button className="icon-btn" title="Edit entry" onClick={onEdit}><Pencil size={15} /></button><button className="icon-btn danger-icon" title="Delete entry" onClick={onDelete}><Trash2 size={15} /></button></>}{publicView && hasEvidence && <a className="public-view-link" href={safeUrl(entry.evidence_url)} target="_blank" rel="noreferrer">View evidence <ArrowUpRight size={14} /></a>}</div></article>;
}

function EmptyEntries({ onAdd, isFiltered = false }) {
  return <div className="empty-state"><div className="empty-illustration"><BriefcaseBusiness size={24} /></div><h3>{isFiltered ? 'No matching entries.' : 'Start with one good thing.'}</h3><p>{isFiltered ? 'Try a different search or filter.' : 'A class project, a hackathon, a certificate — add something you learned by doing.'}</p>{!isFiltered && <button className="btn btn-dark" onClick={onAdd}><Plus size={15} /> Add your first entry</button>}</div>;
}

function EntryModal({ entry, onClose, onSave }) {
  const [title, setTitle] = useState(entry?.title || '');
  const [description, setDescription] = useState(entry?.description || '');
  const [url, setUrl] = useState(entry?.evidence_url || '');
  const [type, setType] = useState(entry?.entry_type || 'project');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (url.trim() && !safeUrl(url.trim())) { setError('Use a complete link starting with https:// or http://.'); return; }
    if (title.trim().length < 2) { setError('Add a title with at least 2 characters.'); return; }
    setBusy(true);
    try { await onSave({ title: title.trim(), description: description.trim(), evidence_url: url.trim() ? safeUrl(url.trim()) : null, entry_type: type }, entry?.id); }
    catch (e) { setError(e.message || 'Could not save this entry.'); }
    finally { setBusy(false); }
  };
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="entry-modal-title"><div className="modal-heading"><div><span className="eyebrow">PORTFOLIO ENTRY</span><h2 id="entry-modal-title">{entry ? 'Edit your entry' : 'Add to your portfolio'}</h2><p>Capture what you did, then link to the work if you can.</p></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
    <form className="edit-form" onSubmit={submit}><label>Title <span className="required-mark">*</span><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Campus event finder" required autoFocus /></label><label>Type<select value={type} onChange={(e) => setType(e.target.value)}>{categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></label><label>Description<textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} placeholder="What did you make, learn, or contribute? Add your role and any outcomes." /><span className="field-hint">{description.length}/2000 characters</span></label><label>Evidence URL <span className="optional-label">OPTIONAL</span><div className="url-input-wrap"><Link2 size={16} /><input value={url} onChange={(e) => setUrl(e.target.value)} maxLength={2048} placeholder="https://github.com/you/project" type="url" /></div><span className="field-hint">A project demo, GitHub repository, certificate, event page or case study.</span></label>
    <div className="evidence-explainer"><span className="evidence-explainer-icon"><ShieldCheck size={17} /></span><div><strong>{url.trim() ? 'Evidence-linked' : 'Self-reported'}</strong><p>{url.trim() ? 'A link is attached. It has not been independently verified.' : 'No supporting link yet. You can add one later.'}</p></div></div>
    {error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-dark" disabled={busy}>{busy ? 'Saving…' : entry ? 'Save changes' : 'Add entry'} <ArrowRight size={15} /></button></div></form>
    </section></div>;
}

function ProfileModal({ profile, onClose, onSave }) {
  const [name, setName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [skills, setSkills] = useState((profile.skills || []).join(', '));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (name.trim().length < 2) { setError('Please enter a name with at least 2 characters.'); return; }
    const cleanedSkills = [...new Set(skills.split(',').map((item) => item.trim()).filter(Boolean))].slice(0, 30);
    setBusy(true);
    try { await onSave({ display_name: name.trim(), bio: bio.trim(), skills: cleanedSkills }); }
    catch (e) { setError(e.message || 'Could not save profile details.'); }
    finally { setBusy(false); }
  };
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="edit-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title"><div className="modal-heading"><div><span className="eyebrow">YOUR PROFILE</span><h2 id="profile-modal-title">Make it personal.</h2><p>Clear context helps your work speak for itself.</p></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div><form className="edit-form" onSubmit={submit}><label>Display name <span className="required-mark">*</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={90} required autoFocus /></label><label>Short bio<textarea rows={4} maxLength={600} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What are you studying, building, or curious about?" /><span className="field-hint">{bio.length}/600 characters</span></label><label>Skills & tools <span className="optional-label">COMMA SEPARATED</span><input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Python, Figma, SQL" /></label><span className="field-hint">Add up to 30 skills. They appear as simple tags on your public profile.</span>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-dark" disabled={busy}>{busy ? 'Saving…' : 'Save profile'} <Check size={15} /></button></div></form></section></div>;
}

function PublicPortfolio() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError('');
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('id, display_name, bio, skills, slug, is_public').eq('slug', slug).eq('is_public', true).maybeSingle();
      if (!active) return;
      if (profileError) { setError(profileError.message); setLoading(false); return; }
      if (!profileData) { setProfile(null); setEntries([]); setLoading(false); return; }
      const { data: entriesData, error: entriesError } = await supabase.from('portfolio_entries').select('id,title,description,evidence_url,entry_type,created_at').eq('user_id', profileData.id).order('created_at', { ascending: false });
      if (!active) return;
      setProfile(profileData); setEntries(entriesData || []); if (entriesError) setError(entriesError.message); setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);
  if (loading) return <PublicLoading />;
  if (error && !profile) return <UnavailablePage title="Portfolio unavailable" text={error} />;
  if (!profile) return <UnavailablePage title="This portfolio isn't public." text="The link may be incorrect, or the owner may have unpublished their profile." />;
  return <PublicPortfolioLayout profile={profile} entries={entries} />;
}

function SamplePortfolio() {
  return <div className="public-page"><PublicTop sample /><main className="public-main"><div className="sample-flag"><span className="sample-flag-dot" /> FICTIONAL SAMPLE PORTFOLIO <span>·</span> FOR DEMONSTRATION ONLY</div><PublicProfileContent profile={demoProfile} entries={demoEntries} sample /></main><PublicFooter /></div>;
}
function PublicPortfolioLayout({ profile, entries }) {
  return <div className="public-page"><PublicTop /><main className="public-main"><PublicProfileContent profile={profile} entries={entries} /></main><PublicFooter /></div>;
}
function PublicTop({ sample = false }) {
  return <header className="public-nav wrap"><Brand /><div className="public-nav-right">{sample && <span className="public-demo-chip"><span /> SAMPLE MODE</span>}<Link className="public-create-link" to="/">Create your own <ArrowUpRight size={15} /></Link></div></header>;
}
function PublicProfileContent({ profile, entries, sample = false }) {
  const evidenceCount = entries.filter((e) => !!safeUrl(e.evidence_url)).length;
  return <>
    <section className="public-hero"><div className="public-profile-avatar">{initials(profile.display_name)}</div><div className="public-eyebrow"><span className="green-dot" /> PORTFOLIO <span className="public-slash">/</span> {profile.slug.toUpperCase()}</div><h1>{profile.display_name}<span className="hero-period">.</span></h1><p className="public-bio">{profile.bio || 'A student collecting projects, skills and experience along the way.'}</p><div className="public-skills">{(profile.skills || []).map((skill) => <span key={skill}>{skill}</span>)}</div><div className="public-meta-row"><span><BriefcaseBusiness size={15} /> {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span><i /><span><Link2 size={15} /> {evidenceCount} evidence-linked</span><i /><span><Globe size={15} /> Read-only portfolio</span></div></section>
    <section className="public-work"><div className="public-work-head"><div><div className="eyebrow">A BODY OF WORK</div><h2>Selected work<span>.</span></h2></div><span className="mono public-entry-total">{String(entries.length).padStart(2, '0')} ENTRIES</span></div>
      {entries.length ? <div className="public-entries">{entries.map((entry, index) => <article className="public-entry-card" key={entry.id}><div className={`public-entry-count count-${index % 3}`}>{String(index + 1).padStart(2, '0')}</div><div className="public-entry-content"><div className="public-entry-kicker"><span>{categoryLabel(entry.entry_type).toUpperCase()}</span><span className="public-entry-divider">/</span><EvidenceBadge hasEvidence={!!safeUrl(entry.evidence_url)} /></div><h3>{entry.title}</h3><p>{entry.description || 'No description supplied.'}</p><div className="public-entry-bottom">{safeUrl(entry.evidence_url) ? <a href={safeUrl(entry.evidence_url)} target="_blank" rel="noreferrer" className="evidence-open">Explore evidence <ArrowUpRight size={15} /></a> : <span className="no-link-note"><UserRound size={13} /> Self-reported entry</span>}<span className="public-entry-date">{entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}</span></div></div><div className={`public-entry-art art-${index % 3}`}><EntryIcon type={entry.entry_type} size={26} /><span>{String(index + 1).padStart(2, '0')}</span></div></article>)}</div> : <div className="empty-state public-empty"><h3>No entries published yet.</h3><p>Check back later for new work.</p></div>}
    </section>
    <section className="public-disclaimer"><ShieldCheck size={16} /><p><strong>A note on evidence.</strong> “Evidence-linked” means an entry includes a supporting URL supplied by the portfolio owner. Links and claims have not been independently verified by ProofOfWork.</p></section>
    <div className="public-bottom-cta"><div><span className="eyebrow">MAKE YOUR WORK VISIBLE</span><h2>Build your own proof of work.</h2></div><Link to="/" className="btn btn-dark">Create a portfolio <ArrowRight size={15} /></Link></div>
  </>;
}
function PublicFooter() { return <footer className="public-footer wrap"><Brand /><span>Built on work, not words. <span className="footer-star">✳</span></span><Link to="/">Create a portfolio <ArrowUpRight size={13} /></Link></footer>; }
function PublicLoading() { return <div className="loading-screen"><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><span>Opening portfolio…</span></div>; }
function UnavailablePage({ title, text }) { return <div className="unavailable-page"><Brand /><div className="unavailable-card"><div className="unavailable-icon"><Eye size={22} /></div><span className="eyebrow">PROOFOFWORK / PUBLIC PROFILE</span><h1>{title}</h1><p>{text}</p><Link to="/" className="btn btn-dark">Back to ProofOfWork <ArrowRight size={15} /></Link></div></div>; }
