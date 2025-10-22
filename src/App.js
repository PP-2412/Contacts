import React, { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, Users, X, Phone, User, Trash2, ChevronDown } from 'lucide-react';

const INITIAL_CONTACTS = [];

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
];

function ContactCard({ contact, onDelete, index }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(contact.id), 300);
  };

  return (
    <div 
      className={`contact-card ${isDeleting ? 'deleting' : ''}`}
      style={{ '--item-index': index }}
    >
      <div className="contact-avatar">
        {contact.avatar}
      </div>
      <div className="contact-info">
        <h3 className="contact-name">{contact.name}</h3>
        <div className="contact-detail">
          <Phone size={14} />
          <span>{contact.phone}</span>
        </div>
        {contact.email && (
          <div className="contact-detail email">
            <span>✉</span>
            <span>{contact.email}</span>
          </div>
        )}
      </div>
      <button 
        className="delete-btn"
        onClick={handleDelete}
        aria-label="Delete contact"
        title="Delete contact"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Users size={64} />
      </div>
      <h3>No contacts yet</h3>
      <p>Add your first contact to get started</p>
    </div>
  );
}

function SearchBar({ value, onChange, totalCount }) {
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, phone number or e-mail address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search contacts"
        />
        {value && (
          <button 
            className="clear-search"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="contact-count">
        {totalCount} {totalCount === 1 ? 'contact' : 'contacts'}
      </div>
    </div>
  );
}

function AddContactForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+1',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s()-]/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newContact = {
      id: Date.now(),
      name: formData.name.trim(),
      phone: `${formData.countryCode} ${formData.phone.trim()}`,
      email: formData.email.trim(),
      avatar: formData.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };
    
    onAdd(newContact);
    setFormData({ name: '', countryCode: '+1', phone: '', email: '' });
    setErrors({});
  };

  return (
    <div className="add-contact-form">
      <div className="form-header">
        <UserPlus size={24} />
        <h2>Add New Contact</h2>
      </div>

      <div className="form-group">
        <label htmlFor="name">
          <User size={16} />
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          <Phone size={16} />
          Phone Number *
        </label>
        <div className="phone-input-group">
          <div className="country-code-selector">
            <button
              type="button"
              className="country-code-btn"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            >
              {COUNTRY_CODES.find(c => c.code === formData.countryCode)?.flag} {formData.countryCode}
              <ChevronDown size={14} />
            </button>
            {showCountryDropdown && (
              <div className="country-dropdown">
                {COUNTRY_CODES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, countryCode: country.code });
                      setShowCountryDropdown(false);
                    }}
                    className={formData.countryCode === country.code ? 'active' : ''}
                  >
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                    <span className="country-name">{country.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="555-123-4567"
            className={errors.phone ? 'error' : ''}
          />
        </div>
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">
          ✉ Email (optional)
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          Add Contact
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleAddContact = useCallback((newContact) => {
    setContacts(prev => {
      const updated = [...prev, newContact];
      return updated.sort((a, b) => {
        const an = a.name.trim().toLowerCase();
        const bn = b.name.trim().toLowerCase();
        const aIsDigit = /^\d/.test(an);
        const bIsDigit = /^\d/.test(bn);
        
        if (aIsDigit && !bIsDigit) return -1;
        if (!aIsDigit && bIsDigit) return 1;
        return an.localeCompare(bn, undefined, { sensitivity: 'base' });
      });
    });
    setShowAddForm(false);
  }, []);

  const handleDeleteContact = useCallback((id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading contacts...</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Users size={32} />
            <h1>Contact Manager</h1>
          </div>
          <button 
            className="add-contact-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? <X size={20} /> : <UserPlus size={20} />}
            {showAddForm ? 'Close' : 'Add Contact'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {showAddForm ? (
          <div className="form-overlay">
            <AddContactForm 
              onAdd={handleAddContact}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        ) : (
          <>
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              totalCount={filteredContacts.length}
            />

            <div className="contacts-grid">
              {filteredContacts.length === 0 ? (
                searchQuery ? (
                  <div className="empty-state">
                    <Search size={64} />
                    <h3>No results found</h3>
                    <p>Try searching with a different name or number</p>
                  </div>
                ) : (
                  <EmptyState />
                )
              ) : (
                filteredContacts.map((contact, index) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onDelete={handleDeleteContact}
                    index={index}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .app-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
  }

  .app-header {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 20px;
    padding: 24px 32px;
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(10px);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #667eea;
  }

  .logo h1 {
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .add-contact-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .add-contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  .add-contact-btn:active {
    transform: translateY(0);
  }

  .app-main {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 20px;
    padding: 32px;
    min-height: 600px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(10px);
  }

  .search-container {
    margin-bottom: 32px;
  }

  .search-wrapper {
    position: relative;
    margin-bottom: 12px;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 16px 48px;
    font-size: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    background: #f8fafc;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .search-input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  .clear-search {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: #e2e8f0;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #64748b;
  }

  .clear-search:hover {
    background: #cbd5e1;
    transform: translateY(-50%) scale(1.1);
  }

  .contact-count {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  .contact-card {
    background: linear-gradient(135deg, #f8f9ff 0%, #faf5ff 100%);
    border: 2px solid #e9e4ff;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    animation: slideIn 0.4s ease-out backwards;
    animation-delay: calc(var(--item-index) * 0.05s);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .contact-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }

  .contact-card.deleting {
    animation: slideOut 0.3s ease-out forwards;
  }

  @keyframes slideOut {
    to {
      opacity: 0;
      transform: translateX(-100%) scale(0.8);
    }
  }

  .contact-avatar {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .contact-info {
    flex: 1;
    min-width: 0;
  }

  .contact-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
    word-break: break-word;
  }

  .contact-detail {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 4px;
  }

  .contact-detail.email {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .delete-btn {
    background: #fee2e2;
    border: none;
    border-radius: 10px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #dc2626;
    flex-shrink: 0;
  }

  .delete-btn:hover {
    background: #fecaca;
    transform: scale(1.1);
  }

  .delete-btn:active {
    transform: scale(0.95);
  }

  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: #94a3b8;
    text-align: center;
  }

  .empty-icon {
    margin-bottom: 24px;
    opacity: 0.5;
  }

  .empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 8px;
    color: #64748b;
  }

  .empty-state p {
    font-size: 1rem;
  }

  .form-overlay {
    max-width: 600px;
    margin: 0 auto;
  }

  .add-contact-form {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .form-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    color: #667eea;
  }

  .form-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }

  .form-group input {
    width: 100%;
    padding: 14px 16px;
    font-size: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: #f8fafc;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  .form-group input.error {
    border-color: #ef4444;
  }

  .error-message {
    display: block;
    color: #ef4444;
    font-size: 0.8rem;
    margin-top: 6px;
  }

  .phone-input-group {
    display: flex;
    gap: 8px;
  }

  .country-code-selector {
    position: relative;
  }

  .country-code-btn {
    padding: 14px 16px;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .country-code-btn:hover {
    border-color: #667eea;
    background: white;
  }

  .country-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 10;
    min-width: 200px;
    max-height: 300px;
    overflow-y: auto;
  }

  .country-dropdown button {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: background 0.2s ease;
    text-align: left;
    font-size: 0.95rem;
  }

  .country-dropdown button:hover {
    background: #f8fafc;
  }

  .country-dropdown button.active {
    background: #ede9fe;
    color: #667eea;
    font-weight: 600;
  }

  .country-name {
    font-size: 0.85rem;
    color: #94a3b8;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 28px;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    padding: 14px 24px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  .btn-secondary {
    background: #f1f5f9;
    color: #475569;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: white;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .app-container {
      padding: 12px;
    }

    .app-header {
      padding: 20px;
      border-radius: 16px;
    }

    .header-content {
      flex-direction: column;
      text-align: center;
    }

    .logo h1 {
      font-size: 1.5rem;
    }

    .add-contact-btn {
      width: 100%;
      justify-content: center;
    }

    .app-main {
      padding: 20px;
      border-radius: 16px;
    }

    .contacts-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .contact-card {
      padding: 20px;
    }

    .contact-name {
      font-size: 1.1rem;
    }

    .add-contact-form {
      padding: 24px;
    }

    .form-actions {
      flex-direction: column;
    }

    .phone-input-group {
      flex-direction: column;
    }

    .country-code-btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
