'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Mail,
  MailOpen,
  Trash2,
  AlertCircle,
  Calendar,
  User,
  Phone,
  Reply
} from 'lucide-react';

interface MessageData {
  _id: string;
  name: string;
  emailOrPhone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Detect if contact is phone or email and return appropriate reply link
const getReplyLink = (contact: string, customerName: string, subject: string) => {
  const trimmed = contact.trim();
  // Check if it looks like an email
  if (trimmed.includes('@')) {
    const mailSubject = encodeURIComponent(`Re: ${subject}`);
    return { href: `mailto:${trimmed}?subject=${mailSubject}`, label: 'Reply via Email', isWhatsApp: false };
  }
  // Treat as phone number - clean it and open WhatsApp
  const phone = trimmed.replace(/[^0-9+]/g, '');
  const greeting = encodeURIComponent(`Hello ${customerName}, thank you for reaching out regarding "${subject}". `);
  return { href: `https://wa.me/${phone}?text=${greeting}`, label: 'Reply on WhatsApp', isWhatsApp: true };
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/messages');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    try {
      const res = await api.put(`/messages/${id}/read`, { isRead: !currentStatus });
      if (res.data.success) {
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, isRead: !currentStatus } : msg
        ));
      }
    } catch (err: any) {
      console.error('Error toggling read status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) return;
    
    setActionLoadingId(id);
    try {
      const res = await api.delete(`/messages/${id}`);
      if (res.data.success) {
        setMessages(messages.filter(msg => msg._id !== id));
      }
    } catch (err: any) {
      console.error('Error deleting message:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      msg.emailOrPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (statusFilter === 'unread') return !msg.isRead && matchesSearch;
    if (statusFilter === 'read') return msg.isRead && matchesSearch;
    return matchesSearch;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={28} color="var(--accent)" />
            Customer Messages
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            View and manage inquiries from the Contact Us page.
          </p>
        </div>
        
        <button
          onClick={fetchMessages}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="e.g. customer name or subject"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {/* Message List */}
      {isLoading && messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="spin" style={{ margin: '0 auto', marginBottom: '16px', color: 'var(--accent)' }} />
          <p>Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>No Messages Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters or search query.' : 'You have no customer messages yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredMessages.map((msg) => (
            <div 
              key={msg._id} 
              style={{ 
                backgroundColor: 'var(--bg-surface)', 
                borderRadius: '12px', 
                border: `1px solid ${msg.isRead ? 'var(--border)' : 'var(--accent)'}`,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {!msg.isRead && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
              )}
              
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: msg.isRead ? '600' : '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {msg.subject}
                  </h3>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      {msg.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} />
                      {msg.emailOrPhone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleToggleRead(msg._id, msg.isRead)}
                    disabled={actionLoadingId === msg._id}
                    title={msg.isRead ? "Mark as Unread" : "Mark as Read"}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: msg.isRead ? 'var(--text-secondary)' : 'var(--success)',
                      cursor: actionLoadingId === msg._id ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {msg.isRead ? <Mail size={18} /> : <MailOpen size={18} />}
                  </button>

                  {/* Smart Reply Button */}
                  {(() => {
                    const reply = getReplyLink(msg.emailOrPhone, msg.name, msg.subject);
                    return (
                      <a
                        href={reply.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={reply.label}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: reply.isWhatsApp ? 'rgba(37, 211, 102, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          border: `1px solid ${reply.isWhatsApp ? 'rgba(37, 211, 102, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                          borderRadius: '8px',
                          color: reply.isWhatsApp ? '#25d366' : '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Reply size={15} />
                        {reply.label}
                      </a>
                    );
                  })()}

                  <button
                    onClick={() => handleDelete(msg._id)}
                    disabled={actionLoadingId === msg._id}
                    title="Delete Message"
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--danger)',
                      cursor: actionLoadingId === msg._id ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-deep)' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
