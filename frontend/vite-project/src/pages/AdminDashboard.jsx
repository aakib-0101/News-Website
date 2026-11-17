import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import CreateNews from "./CreateNews";
import NewsDetails from "./NewsDetails";
import UserContext from "../context/UserContext";

const defaultCategories = [
  "Technology", "Business", "Science", "Sports", "Environment", "Politics", "Entertainment", "Health", "Other"
];

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const execCmd = (cmd, e) => {
    e.preventDefault();
    document.execCommand(cmd, false, null);
    handleInput();
  };

  const insertLink = (e) => {
    e.preventDefault();
    const url = prompt("Enter the link URL (e.g., https://example.com):");
    if (url) {
      document.execCommand('createLink', false, url);
      handleInput();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    tempDiv.querySelectorAll('*').forEach(el => {
      el.style.backgroundColor = '';
      el.style.color = '';
      el.removeAttribute('bgcolor');
      el.removeAttribute('color');
    });
    document.execCommand('insertHTML', false, tempDiv.innerHTML || text);
    handleInput();
  };

  return (
    <div style={{ background: 'var(--bg-primary)', border: 'var(--border-thin)', borderRadius: '4px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: 'var(--border-thin)', padding: '8px 12px', display: 'flex', gap: '16px' }}>
        <button type="button" onMouseDown={(e) => execCmd('bold', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '900', color: 'var(--text-primary)', padding: 0 }}>B</button>
        <button type="button" onMouseDown={(e) => execCmd('italic', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontStyle: 'italic', fontFamily: 'serif', fontSize: '15px', color: 'var(--text-primary)', padding: 0 }}>I</button>
        <button type="button" onMouseDown={(e) => execCmd('underline', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-primary)', padding: 0 }}>U</button>
        <button type="button" onMouseDown={insertLink} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: '700', padding: 0, textDecoration: 'underline' }}>Link</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        style={{ padding: '12px', minHeight: '100px', outline: 'none', color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}
      />
    </div>
  );
};

const styles = {
  app: { minHeight: "100vh", background: "var(--bg-secondary)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", transition: "background-color 0.3s, color 0.3s" },
  sidebar: { width: "235px", position: "fixed", top: 0, bottom: 0, left: 0, background: "var(--bg-primary)", borderRight: "var(--border-thin)", padding: "27px 18px", display: "flex", flexDirection: "column", boxSizing: "border-box", zIndex: 2 },
  logo: { fontSize: "21px", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px", marginBottom: "45px", fontFamily: "var(--font-serif)", letterSpacing: "-0.5px" },
  logoIcon: { background: "var(--text-primary)", color: "var(--bg-primary)", width: "36px", height: "36px", borderRadius: "4px", display: "grid", placeItems: "center", fontFamily: "var(--font-sans)" },
  logoIconSuper: { background: "#e11d48", color: "#fff", width: "36px", height: "36px", borderRadius: "4px", display: "grid", placeItems: "center", fontFamily: "var(--font-sans)" },
  navLabel: { fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "var(--text-muted)", paddingLeft: "10px", marginBottom: "12px", textTransform: "uppercase" },
  nav: { padding: "13px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "7px", cursor: "pointer", transition: "background-color 0.2s, color 0.2s" },
  navActive: { background: "var(--bg-tertiary)", color: "var(--text-primary)", borderLeft: "3px solid var(--text-primary)" },
  navActiveSuper: { background: "rgba(225, 29, 72, 0.1)", color: "#e11d48", borderLeft: "3px solid #e11d48" },
  profile: { marginTop: "auto", borderTop: "var(--border-thin)", paddingTop: "20px", display: "flex", alignItems: "center", gap: "11px", fontSize: "12px" },
  main: { marginLeft: "235px", padding: "35px", minWidth: 0, boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", marginBottom: "28px", flexWrap: "wrap" },
  eyebrow: { color: "var(--text-muted)", fontSize: "12px", margin: "0 0 9px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" },
  heading: { fontSize: "29px", letterSpacing: "-0.8px", margin: "0 0 8px", fontFamily: "var(--font-serif)" },
  subtitle: { fontSize: "14px", color: "var(--text-secondary)", margin: 0 },
  primary: { background: "var(--text-primary)", color: "var(--bg-primary)", border: "none", borderRadius: "4px", padding: "12px 17px", fontSize: "12px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" },
  primarySuper: { background: "#e11d48", color: "#fff", border: "none", borderRadius: "4px", padding: "12px 17px", fontSize: "12px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "17px", marginBottom: "30px" },
  stat: { background: "var(--bg-primary)", border: "var(--border-thin)", borderRadius: "4px", padding: "20px" },
  statIcon: { width: "38px", height: "38px", borderRadius: "4px", display: "grid", placeItems: "center", fontSize: "18px", marginBottom: "17px" },
  statLabel: { fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 8px", fontWeight: "600" },
  statNumber: { fontSize: "28px", fontWeight: 800, margin: "0 0 7px", color: "var(--text-primary)" },
  section: { background: "var(--bg-primary)", border: "var(--border-thin)", borderRadius: "4px", padding: "23px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", flexWrap: "wrap", marginBottom: "23px" },
  sectionTitle: { fontSize: "17px", margin: "0 0 7px", fontFamily: "var(--font-serif)", fontWeight: "700" },
  search: { width: "235px", maxWidth: "100%", boxSizing: "border-box", border: "var(--border-thin)", background: "var(--bg-secondary)", color: "var(--text-primary)", borderRadius: "4px", padding: "11px 13px", fontSize: "12px", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(245px, 1fr))", gap: "20px" },
  card: { border: "var(--border-thin)", borderRadius: "4px", overflow: "hidden", background: "var(--bg-primary)", minWidth: 0, display: "flex", flexDirection: "column" },
  image: { width: "100%", height: "165px", objectFit: "cover", display: "block", background: "var(--bg-tertiary)", borderBottom: "var(--border-thin)" },
  cardBody: { padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 },
  category: { display: "inline-block", color: "var(--text-primary)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "11px" },
  cardTitle: { fontSize: "16px", fontFamily: "var(--font-serif)", lineHeight: 1.3, margin: "0 0 9px", overflowWrap: "anywhere" },
  description: { fontSize: "12px", lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 16px", overflowWrap: "anywhere", flexGrow: 1 },
  meta: { fontSize: "11px", color: "var(--text-muted)", paddingBottom: "14px", borderBottom: "var(--border-thin)", display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", fontWeight: "600" },
  actions: { display: "flex", gap: "9px", marginTop: "14px" },
  edit: { flex: 1, background: "var(--bg-secondary)", color: "var(--text-primary)", border: "var(--border-thin)", borderRadius: "4px", padding: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase" },
  delete: { flex: 1, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "4px", padding: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.6)", display: "grid", placeItems: "center", padding: "18px", zIndex: 100, overflowY: "auto" },
  modal: { width: "100%", maxWidth: "540px", boxSizing: "border-box", background: "var(--bg-primary)", border: "var(--border-thick)", borderRadius: "4px", padding: "32px", boxShadow: "0 20px 70px rgba(0,0,0,0.3)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  label: { display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" },
  field: { display: "block", width: "100%", boxSizing: "border-box", padding: "12px", marginTop: "8px", background: "var(--bg-secondary)", border: "var(--border-thin)", color: "var(--text-primary)", borderRadius: "4px", fontSize: "13px", outline: "none", fontFamily: "var(--font-sans)" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px" },
};

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [news, setNews] = useState([]);
  const [usersList, setUsersList] = useState([]); 
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [page, setPage] = useState("dashboard"); 
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({
    title: "", author: "", category: "Technology", customCategory: "", image: "", isDraft: false,
  });

  const [blocks, setBlocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/news?userId=${user._id}&isSuperAdmin=${user.isSuperAdmin || false}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data?.news ?? response.data;
        setNews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching news:", error.response?.data || error.message);
      }
    };
    if (user && user._id && page === "dashboard") fetchNews();
  }, [user, page]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("${import.meta.env.VITE_API_URL}/user", { headers: { Authorization: `Bearer ${token}` } });
        setUsersList(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    if (user?.isSuperAdmin) fetchUsers();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  const dynamicCategories = ["All", "Drafts", ...new Set([...defaultCategories, ...news.map(item => item.category).filter(Boolean)])];

  const filteredNews = news.filter((item) => {
    const matchesSearch = [item.title, item.description, item.author, item.category].join(" ").toLowerCase().includes(search.toLowerCase());
    
    let matchesCategory = true;
    if (categoryFilter === "Drafts") {
      matchesCategory = item.isDraft === true;
    } else if (categoryFilter !== "All") {
      matchesCategory = item.category === categoryFilter && !item.isDraft;
    } else {
      matchesCategory = !item.isDraft; 
    }
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const openCreate = () => setPage("create");

  const openUpdate = (item) => {
    setEditingId(item._id ?? item.id);
    const isStandard = defaultCategories.includes(item.category);
    
    setForm({
      title: item.title || "",
      author: item.author || "",
      category: isStandard ? item.category : "Other",
      customCategory: isStandard ? "" : item.category,
      image: item.image || "",
      isDraft: item.isDraft || false,
    });
    
    setBlocks(
      item.contentBlocks && item.contentBlocks.length > 0
        ? item.contentBlocks.map(b => ({ type: b.blockType, value: b.value }))
        : [{ type: 'paragraph', value: item.description || '' }]
    );
    setShowModal(true);
  };

  const addBlock = (type) => setBlocks([...blocks, { type, value: '' }]);
  const updateBlock = (index, newValue) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].value = newValue;
    setBlocks(updatedBlocks);
  };
  const removeBlock = (index) => setBlocks(blocks.filter((_, i) => i !== index));

  const uploadFileToCloud = async (file, callback) => {
    if (file.size > 50 * 1024 * 1024) {
      alert("File exceeds the 50MB limit.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("${import.meta.env.VITE_API_URL}/upload", formData);
      callback(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e, forceStatus = null) => {
    e.preventDefault();
    if (editingId === null) return;
    
    const finalCategory = form.category === 'Other' && form.customCategory?.trim() !== '' 
      ? form.customCategory 
      : form.category;

    const newIsDraft = forceStatus !== null ? forceStatus : form.isDraft;

    const payload = {
      ...form,
      category: finalCategory,
      isDraft: newIsDraft,
      status: newIsDraft ? 'draft' : 'published',
      contentBlocks: blocks.map(b => ({ blockType: b.type, value: b.value })),
      description: blocks.find(b => b.type === 'paragraph')?.value || '' 
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/news/update?id=${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setNews((current) => current.map((item) => String(item._id ?? item.id) === String(editingId) ? { ...item, ...payload } : item));
      setShowModal(false);
      setEditingId(null);
      setBlocks([]);
    } catch (error) {
      alert("Failed to update news. Please check the backend route.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/news/delete?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNews((current) => current.filter((item) => String(item._id ?? item.id) !== String(id)));
      if (currentNews.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (error) {
      alert("Failed to delete news.");
    }
  };

  const changeUserRole = async (targetUserId, updates) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/user/update?id=${targetUserId}`, updates, { headers: { Authorization: `Bearer ${token}` } });
      setUsersList((current) => current.map((u) => u._id === targetUserId ? { ...u, ...updates } : u));
    } catch (error) {
      alert("Failed to update user role.");
    }
  };

 const recentCount = news.filter((item) => {
    const timestamp = item.createdAt || item.date; 
    if (!timestamp) return false; 
    const parsedDate = new Date(timestamp);
    return (!Number.isNaN(parsedDate.getTime()) && Date.now() - parsedDate.getTime() <= 7 * 24 * 60 * 60 * 1000 && parsedDate.getTime() <= Date.now() + 86400000);
  }).length;

  const activeNavStyle = user?.isSuperAdmin ? styles.navActiveSuper : styles.navActive;
  const primaryButtonStyle = user?.isSuperAdmin ? styles.primarySuper : styles.primary;
  const logoIconStyle = user?.isSuperAdmin ? styles.logoIconSuper : styles.logoIcon;

  return (
    <div style={styles.app}>
      <style>{`
        * { box-sizing: border-box; }
        button { transition: opacity .15s ease, transform .15s ease; }
        button:hover { opacity: .86; }
        input:focus, textarea:focus, select:focus { border-color: var(--text-primary) !important; outline: none; }
        @media (max-width: 760px) {
          .news-sidebar { position: static !important; width: 100% !important; height: auto !important; padding: 16px !important; border-right: none !important; border-bottom: var(--border-thin) !important; }
          .news-sidebar .sidebar-profile { display: none !important; }
          .news-sidebar .nav-items { display: flex; gap: 8px; flex-wrap: wrap; }
          .news-sidebar .sidebar-heading { display: none; }
          .news-main { margin-left: 0 !important; padding: 20px 14px !important; }
          .news-page-heading { font-size: 24px !important; }
          .news-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important; }
        }
      `}</style>

      <aside className="news-sidebar" style={styles.sidebar}>
        <div style={styles.logo}><span style={logoIconStyle}>N</span>NewsDesk</div>
        <p className="sidebar-heading" style={styles.navLabel}>{user?.isSuperAdmin ? "GLOBAL WORKSPACE" : "PERSONAL WORKSPACE"}</p>
        <div className="nav-items">
          <div onClick={() => setPage("dashboard")} style={{ ...styles.nav, ...(page === "dashboard" ? activeNavStyle : {}) }}>
            {user?.isSuperAdmin ? "🌎 Global Dashboard" : "▦ My Dashboard"}
          </div>
          {user?.isSuperAdmin && (
            <div onClick={() => setPage("users")} style={{ ...styles.nav, ...(page === "users" ? activeNavStyle : {}) }}>
              👥 Manage Users
            </div>
          )}
        </div>
        <div className="sidebar-profile" style={styles.profile}>
          <div style={{ ...logoIconStyle, borderRadius: "50%", background: user?.isSuperAdmin ? "rgba(225, 29, 72, 0.1)" : "var(--bg-tertiary)", color: user?.isSuperAdmin ? "#e11d48" : "var(--text-primary)" }}>
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>{user?.name || "Admin"}</strong>
            <p style={{ color: user?.isSuperAdmin ? "#e11d48" : "var(--text-secondary)", margin: "5px 0 0", fontWeight: user?.isSuperAdmin ? "bold" : "normal" }}>
              {user?.isSuperAdmin ? "Super Admin" : "News Editor"}
            </p>
          </div>
        </div>
      </aside>
      
      <main className="news-main" style={styles.main}>
        {page === "users" ? (
          <>
            <header style={styles.header}>
              <div>
                <p style={styles.eyebrow}>Workspace / Manage Users</p>
                <h1 className="news-page-heading" style={styles.heading}>System Access Management</h1>
                <p style={styles.subtitle}>Promote or demote users across your application.</p>
              </div>
            </header>
            <section style={styles.section}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "var(--border-thick)", color: "var(--text-muted)", fontSize: "11px", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: "12px 10px" }}>Name</th>
                      <th style={{ padding: "12px 10px" }}>Email</th>
                      <th style={{ padding: "12px 10px" }}>Current Role</th>
                      <th style={{ padding: "12px 10px" }}>Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u._id} style={{ borderBottom: "var(--border-thin)", fontSize: "13px" }}>
                        <td style={{ padding: "15px 10px", fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                        <td style={{ padding: "15px 10px", color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td style={{ padding: "15px 10px" }}>
                          <span style={{ background: u.isSuperAdmin ? "rgba(225, 29, 72, 0.1)" : u.isAdmin ? "var(--bg-secondary)" : "var(--bg-tertiary)", color: u.isSuperAdmin ? "#e11d48" : u.isAdmin ? "var(--text-primary)" : "var(--text-secondary)", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, border: "var(--border-thin)" }}>
                            {u.isSuperAdmin ? "Super Admin" : u.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td style={{ padding: "15px 10px", display: "flex", gap: "8px" }}>
                          {!u.isSuperAdmin && (<button onClick={() => changeUserRole(u._id, { isSuperAdmin: true, isAdmin: true })} style={{...styles.edit, background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', borderColor: 'rgba(225, 29, 72, 0.3)'}}>Make Super Admin</button>)}
                          {!u.isAdmin && !u.isSuperAdmin && (<button onClick={() => changeUserRole(u._id, { isAdmin: true })} style={styles.edit}>Make Admin</button>)}
                          {(u.isAdmin || u.isSuperAdmin) && (<button onClick={() => changeUserRole(u._id, { isAdmin: false, isSuperAdmin: false })} style={styles.delete}>Demote</button>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : page === "create" ? (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <CreateNews onBack={() => setPage("dashboard")} onCreate={(newItem) => { const createdItem = newItem?.news ?? newItem; setNews((current) => [createdItem, ...current]); setPage("dashboard"); }} />
          </div>
        ) : page === "details" ? (
          <NewsDetails news={selectedNews} onBack={() => setPage("dashboard")} />
        ) : (
          <>
            <header style={styles.header}>
              <div>
                <p style={styles.eyebrow}>Workspace / Dashboard</p>
                <h1 className="news-page-heading" style={styles.heading}>{user?.isSuperAdmin ? "Global News Overview" : "My News Articles"}</h1>
                <p style={styles.subtitle}>{user?.isSuperAdmin ? "Monitor and manage all content across the platform." : "Create and manage your specific news articles."}</p>
              </div>
              <button style={primaryButtonStyle} onClick={openCreate}>+ Create News</button>
            </header>
            
            <section style={styles.stats}>
              {[
                { label: user?.isSuperAdmin ? "Total Platform Articles" : "Your Articles", value: news.length, symbol: "▤", bg: "var(--bg-tertiary)", color: "var(--text-primary)" },
                { label: "Categories Used", value: new Set(news.map((item) => item.category)).size, symbol: "◈", bg: "var(--bg-tertiary)", color: "var(--text-primary)" },
                { label: "Recent Uploads (7d)", value: recentCount, symbol: "◷", bg: "var(--bg-tertiary)", color: "var(--text-primary)" },
              ].map((stat) => (
                <div key={stat.label} style={styles.stat}>
                  <div style={{ ...styles.statIcon, background: stat.bg, color: stat.color, border: 'var(--border-thin)' }}>{stat.symbol}</div>
                  <p style={styles.statLabel}>{stat.label}</p>
                  <h2 style={styles.statNumber}>{stat.value}</h2>
                </div>
              ))}
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>News Directory</h2>
                </div>
                <input style={styles.search} placeholder="⌕  Search news..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
                {dynamicCategories.map((category) => (
                  <button key={category} onClick={() => setCategoryFilter(category)} style={{ padding: "8px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, cursor: "pointer", border: "var(--border-thin)", background: categoryFilter === category ? (user?.isSuperAdmin ? "#e11d48" : "var(--text-primary)") : "var(--bg-secondary)", color: categoryFilter === category ? "var(--bg-primary)" : "var(--text-secondary)", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {category === "Drafts" ? "📝 Drafts" : category}
                  </button>
                ))}
              </div>

              {filteredNews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 15px" }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)' }}>No news articles found</h3>
                  <button style={{ ...primaryButtonStyle, marginTop: "15px" }} onClick={openCreate}>+ Create News</button>
                </div>
              ) : (
                <>
                  <div className="news-grid" style={styles.grid}>
                    {currentNews.map((item) => {
                      const creator = usersList.find(u => u._id === item.userId);
                      const creatorName = creator ? creator.name : "Unknown Admin";

                      return (
                        <article key={item._id || item.id} style={styles.card}>
                          <img src={item.image || "https://placehold.co/800x450/ececf5/5d56e9?text=News"} alt={item.title} style={styles.image} />
                          <div style={styles.cardBody}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '11px'}}>
                              <span style={styles.category}>{item.category}</span>
                              {item.isDraft && <span style={{ fontSize: '10px', background: 'rgba(234, 179, 8, 0.2)', color: '#ca8a04', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>DRAFT</span>}
                            </div>
                            <h3 style={styles.cardTitle}>{item.title}</h3>
                            <p style={styles.description}>{item.description?.length > 80 ? item.description.slice(0, 80) + "..." : item.description}</p>
                            {user?.isSuperAdmin && (
                              <div style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", padding: "6px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", marginBottom: "12px", display: "inline-block", border: "var(--border-thin)" }}>👤 Uploaded by: {creatorName}</div>
                            )}
                            <div style={styles.meta}><span>By {item.author}</span></div>
                            <div style={styles.actions}>
                              <button style={styles.edit} onClick={() => openUpdate(item)}>✎ Edit</button>
                              <button style={styles.delete} onClick={() => handleDelete(item._id ?? item.id)}>× Delete</button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '8px 16px', borderRadius: '4px', fontWeight: 700, fontSize: '12px', background: 'transparent', border: 'var(--border-thin)', color: 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                      <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600 }}>Page {currentPage} of {totalPages}</span>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '8px 16px', borderRadius: '4px', fontWeight: 700, fontSize: '12px', background: 'transparent', border: 'var(--border-thin)', color: 'var(--text-primary)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>

      {showModal && (
        <div style={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <form style={styles.modal} onSubmit={(e) => handleSubmit(e)}>
            <div style={styles.modalHeader}>
              <div><h2 style={{ margin: "0 0 7px", fontSize: "24px", fontFamily: "var(--font-serif)" }}>Update Article</h2></div>
              <button type="button" onClick={() => setShowModal(false)} style={{ border: 0, background: "transparent", fontSize: "25px", cursor: "pointer", color: 'var(--text-primary)' }}>×</button>
            </div>
            
            {isUploading && (
              <div style={{ background: '#3b82f6', color: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                Uploading media file... Please wait.
              </div>
            )}
            
            <label style={styles.label}>News Title <input required style={styles.field} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <div style={{ display: 'flex', gap: '15px' }}>
               <label style={{...styles.label, flex: 1}}>Author <input required style={styles.field} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label>
               <label style={{...styles.label, flex: 1}}>Category <select style={styles.field} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}> {defaultCategories.map((c) => <option key={c} value={c}>{c}</option>)} </select></label>
            </div>

            {form.category === 'Other' && (
              <label style={styles.label}>Custom Category <input required style={styles.field} placeholder="e.g., Automotive, Space" value={form.customCategory} onChange={(e) => setForm({ ...form, customCategory: e.target.value })} /></label>
            )}

            <label style={styles.label}>Cover Image (Upload from Device or Paste URL)</label>
            <div style={{ marginBottom: '12px' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) uploadFileToCloud(file, (url) => setForm({...form, image: url}));
                }} 
                style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}
              />
            </div>
            {form.image && (
              <div style={{ marginBottom: '16px' }}>
                <img src={form.image} alt="Cover Preview" style={{ width: '150px', height: '90px', objectFit: 'cover', borderRadius: '4px', border: 'var(--border-thin)' }} />
              </div>
            )}
            <input style={styles.field} placeholder="Or paste image URL here" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            
            <hr style={{ margin: '24px 0', border: 'none', borderTop: 'var(--border-thin)' }} />
            <label style={styles.label}>Article Content Blocks</label>
            
            <div style={{ maxHeight: '35vh', overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {blocks.map((block, index) => (
                <div key={index} style={{ background: 'var(--bg-secondary)', border: 'var(--border-thin)', borderRadius: '4px', padding: '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    <span>{block.type}</span>
                    {blocks.length > 1 && (<button type="button" onClick={() => removeBlock(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '700' }}>✕ Remove</button>)}
                  </div>
                  
                  {block.type === 'paragraph' && (<RichTextEditor value={block.value} onChange={val => updateBlock(index, val)} />)}
                  
                  {block.type === 'image' && (
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Upload Image from Mac:</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) uploadFileToCloud(file, (url) => updateBlock(index, url));
                        }} 
                        style={{ fontSize: '12px', marginBottom: '8px', display: 'block', color: 'var(--text-primary)' }}
                      />
                      {block.value && (
                        <div style={{ marginBottom: '8px' }}>
                          <img src={block.value} alt="Preview" style={{ maxWidth: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                        </div>
                      )}
                      <input 
                        style={styles.field} 
                        placeholder="Or paste Image URL here" 
                        value={block.value} 
                        onChange={e => updateBlock(index, e.target.value)} 
                      />
                    </div>
                  )}

                  {block.type === 'video' && (
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Upload Video from Mac (Max 50MB):</label>
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) uploadFileToCloud(file, (url) => updateBlock(index, url));
                        }} 
                        style={{ fontSize: '12px', marginBottom: '8px', display: 'block', color: 'var(--text-primary)' }}
                      />
                      {block.value && block.value.includes('cloudinary') && (
                        <div style={{ marginBottom: '8px' }}>
                          <video src={block.value} controls style={{ maxWidth: '100%', height: '140px', borderRadius: '4px', background: '#000' }} />
                        </div>
                      )}
                      <input 
                        style={styles.field} 
                        placeholder="Or paste YouTube Link here" 
                        value={block.value} 
                        onChange={e => updateBlock(index, e.target.value)} 
                      />
                    </div>
                  )}

                  {block.type === 'link' && (<input required style={styles.field} placeholder="Paste External Link URL" value={block.value} onChange={e => updateBlock(index, e.target.value)} />)}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', background: 'var(--bg-secondary)', border: 'var(--border-thin)', padding: '12px', borderRadius: '4px' }}>
              <button type="button" onClick={() => addBlock('paragraph')} style={{ padding: '8px 12px', background: 'var(--bg-primary)', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>+ Paragraph</button>
              <button type="button" onClick={() => addBlock('image')} style={{ padding: '8px 12px', background: 'var(--bg-primary)', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>+ Image</button>
              <button type="button" onClick={() => addBlock('video')} style={{ padding: '8px 12px', background: 'var(--bg-primary)', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>+ Video</button>
              <button type="button" onClick={() => addBlock('link')} style={{ padding: '8px 12px', background: 'var(--bg-primary)', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>+ Link</button>
            </div>
            
            <div style={styles.modalActions}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: "12px 24px", borderRadius: "4px", background: "transparent", color: "var(--text-primary)", cursor: "pointer", border: "var(--border-thin)", fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Cancel</button>
              
              <button type="button" onClick={(e) => handleSubmit(e, true)} style={{ padding: "12px 24px", borderRadius: "4px", background: "var(--bg-secondary)", color: "var(--text-primary)", border: "var(--border-thin)", cursor: "pointer", fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }} disabled={isUploading}>Save as Draft</button>
              <button type="button" onClick={(e) => handleSubmit(e, false)} style={primaryButtonStyle} disabled={isUploading}>Publish Now</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}