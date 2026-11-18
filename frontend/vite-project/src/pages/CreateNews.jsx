import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import UserContext from '../context/userContext';

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
      <div style={{ background: 'var(--bg-secondary)', borderBottom: 'var(--border-thin)', padding: '8px 16px', display: 'flex', gap: '16px' }}>
        <button type="button" onMouseDown={(e) => execCmd('bold', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '900', color: 'var(--text-primary)', padding: 0, fontSize: '14px' }}>B</button>
        <button type="button" onMouseDown={(e) => execCmd('italic', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontStyle: 'italic', fontFamily: 'serif', fontSize: '16px', color: 'var(--text-primary)', padding: 0 }}>I</button>
        <button type="button" onMouseDown={(e) => execCmd('underline', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-primary)', padding: 0, fontSize: '14px' }}>U</button>
        <button type="button" onMouseDown={insertLink} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: '700', padding: 0, fontSize: '13px', textDecoration: 'underline' }}>Link</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        style={{ padding: '16px', minHeight: '150px', outline: 'none', color: 'var(--text-primary)', fontSize: '15px', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}
      />
    </div>
  );
};

const CreateNews = ({ onBack, onCreate }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // NEW: Upload Loading State
  
  const [form, setForm] = useState({
    title: '',
    author: user?.name || '',
    category: 'Technology',
    customCategory: '',
    image: '',
  });

  const [blocks, setBlocks] = useState([
    { type: 'paragraph', value: '' } 
  ]);

  const categories = ["Technology", "Business", "Science", "Sports", "Environment", "Politics", "Entertainment", "Health", "Other"];

  const addBlock = (type) => setBlocks([...blocks, { type, value: '' }]);
  const updateBlock = (index, newValue) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].value = newValue;
    setBlocks(updatedBlocks);
  };
  const removeBlock = (index) => setBlocks(blocks.filter((_, i) => i !== index));

  // NEW: Dedicated function to handle Cloudinary uploads
  const uploadFileToCloud = async (file, callback) => {
    if (file.size > 50 * 1024 * 1024) {
      alert("File exceeds the 50MB limit.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData);
      callback(res.data.url); // Returns the clean Cloudinary URL
    } catch (err) {
      console.error(err);
      alert("Failed to upload file to server.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (status = 'published') => {
    setLoading(true);
    
    const finalCategory = form.category === 'Other' && form.customCategory.trim() !== '' 
      ? form.customCategory 
      : form.category;

    const payload = {
      ...form,
      category: finalCategory,
      userId: user._id,
      status: status,
      isDraft: status === 'draft',
      contentBlocks: blocks.map(b => ({ blockType: b.type, value: b.value })),
      description: blocks.find(b => b.type === 'paragraph')?.value || ''
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('${import.meta.env.VITE_API_URL}/news', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onCreate(response.data);
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Failed to save article.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { background: 'var(--bg-primary)', border: 'var(--border-thick)', borderRadius: '4px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'var(--font-sans)' },
    title: { fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '0 0 24px 0', color: 'var(--text-primary)' },
    input: { width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', outline: 'none', fontFamily: 'var(--font-sans)' },
    label: { display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
    blockContainer: { background: 'var(--bg-secondary)', border: 'var(--border-thin)', borderRadius: '4px', padding: '16px', marginBottom: '16px', position: 'relative' },
    blockHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' },
    blockInput: { width: '100%', padding: '12px', background: 'var(--bg-primary)', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)' },
    controlBtn: { padding: '8px 16px', background: 'var(--bg-primary)', border: 'var(--border-thin)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase' },
    draftBtn: { padding: '12px 24px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: 'var(--border-thin)', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' },
    submitBtn: { padding: '12px 24px', background: 'var(--text-primary)', border: 'none', borderRadius: '4px', color: 'var(--bg-primary)', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={styles.container}>
        <h2 style={styles.title}>Create Editorial Article</h2>
        
        {isUploading && (
          <div style={{ background: '#3b82f6', color: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
            Uploading media file... Please wait.
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('published'); }}>
          <label style={styles.label}>News Title *</label>
          <input required style={styles.input} placeholder="Headline" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={styles.label}>Author *</label>
              <input required style={styles.input} value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
            </div>
            <div>
              <label style={styles.label}>Category</label>
              <select style={styles.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {form.category === 'Other' && (
            <div>
              <label style={styles.label}>Custom Category Name *</label>
              <input required style={styles.input} placeholder="e.g., Automotive, Fashion, Real Estate" value={form.customCategory} onChange={e => setForm({...form, customCategory: e.target.value})} />
            </div>
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
          <input style={styles.input} placeholder="Or paste image URL here" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />

          <hr style={{ border: 'none', borderTop: 'var(--border-thin)', margin: '30px 0' }}/>
          <label style={styles.label}>Article Content Blocks</label>

          {blocks.map((block, index) => (
            <div key={index} style={styles.blockContainer}>
              <div style={styles.blockHeader}>
                <span>{block.type}</span>
                {blocks.length > 1 && (
                  <button type="button" onClick={() => removeBlock(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '700' }}>✕ Remove</button>
                )}
              </div>

              {block.type === 'paragraph' && (
                <RichTextEditor value={block.value} onChange={val => updateBlock(index, val)} />
              )}
              
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
                    style={styles.blockInput} 
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
                    style={styles.blockInput} 
                    placeholder="Or paste YouTube Link here" 
                    value={block.value} 
                    onChange={e => updateBlock(index, e.target.value)} 
                  />
                </div>
              )}

              {block.type === 'link' && (
                <input required style={styles.blockInput} placeholder="Paste External Link URL" value={block.value} onChange={e => updateBlock(index, e.target.value)} />
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', padding: '16px', background: 'var(--bg-secondary)', border: 'var(--border-thin)', borderRadius: '4px', justifyContent: 'center', marginTop: '20px' }}>
            <button type="button" style={styles.controlBtn} onClick={() => addBlock('paragraph')}>+ Paragraph</button>
            <button type="button" style={styles.controlBtn} onClick={() => addBlock('image')}>+ Image</button>
            <button type="button" style={styles.controlBtn} onClick={() => addBlock('video')}>+ Video</button>
            <button type="button" style={styles.controlBtn} onClick={() => addBlock('link')}>+ Link</button>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button type="button" onClick={onBack} style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text-primary)', border: 'var(--border-thin)', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase' }}>Cancel</button>
            <button type="button" onClick={() => handleSubmit('draft')} style={styles.draftBtn} disabled={loading || isUploading}>
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading || isUploading}>
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;