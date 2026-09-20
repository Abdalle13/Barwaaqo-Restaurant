import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  staff?: any | null; // Pass null for create, staff object for edit
}

export default function StaffModal({ isOpen, onClose, onSave, staff }: StaffModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [roleName, setRoleName] = useState('DELIVERY');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEdit = !!staff;

  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setName(staff.name || '');
        setEmail(staff.email || '');
        setPhone(staff.phone || '');
        setRoleName(staff.role?.name || 'DELIVERY');
        setPassword(''); // Don't show existing password
      } else {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setRoleName('DELIVERY');
      }
      setShowPassword(false);
    }
  }, [isOpen, staff]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const data: any = { name, email, phone, roleName };
    if (password) data.password = password; // Only send password if it's entered (for update)

    await onSave(data);
    setIsSaving(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        width: '100%', maxWidth: '500px',
        padding: '32px',
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '24px', right: '24px',
            background: 'rgba(255, 255, 255, 0.05)', border: 'none',
            color: 'var(--text-secondary)', padding: '8px',
            borderRadius: '50%', cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Staff Member' : 'Add New Staff'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-primary)', fontSize: '14px'
              }}
              placeholder="E.g., Ahmed Ali"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-primary)', fontSize: '14px'
              }}
              placeholder="delivery@gmail.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
            <input
              required
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-primary)', fontSize: '14px'
              }}
              placeholder="+252 61 0000000"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Password {isEdit && '(Leave blank to keep unchanged)'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                required={!isEdit}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px 40px 12px 16px', borderRadius: '12px',
                  border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-primary)', fontSize: '14px'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>Role</label>
            <select
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-primary)', fontSize: '14px'
              }}
            >
              <option value="DELIVERY">Delivery Personnel</option>
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                backgroundColor: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                backgroundColor: 'var(--accent)', border: 'none',
                color: 'var(--bg-deep)', fontWeight: '700',
                opacity: isSaving ? 0.7 : 1
              }}
            >
              {isSaving ? 'Saving...' : 'Save Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
