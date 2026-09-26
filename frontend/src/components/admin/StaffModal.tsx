import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Bike, Shield, Phone, AlertCircle } from 'lucide-react';

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
  const [status, setStatus] = useState('active');
  const [vehicleType, setVehicleType] = useState('Motorbike');
  const [plateNumber, setPlateNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
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
        setStatus(staff.status || 'active');
        setVehicleType(staff.vehicleType || 'Motorbike');
        setPlateNumber(staff.plateNumber || '');
        setEmergencyContactName(staff.emergencyContactName || '');
        setEmergencyContactPhone(staff.emergencyContactPhone || '');
        setPassword(''); // Don't show existing password
      } else {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setRoleName('DELIVERY');
        setStatus('active');
        setVehicleType('Motorbike');
        setPlateNumber('');
        setEmergencyContactName('');
        setEmergencyContactPhone('');
      }
      setShowPassword(false);
    }
  }, [isOpen, staff]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const data: any = {
      name,
      email,
      phone,
      roleName,
      status,
      vehicleType: roleName === 'DELIVERY' ? vehicleType : 'None',
      plateNumber: roleName === 'DELIVERY' ? plateNumber : '',
      emergencyContactName,
      emergencyContactPhone,
    };
    if (password) data.password = password; // Only send password if it's entered (for update)

    await onSave(data);
    setIsSaving(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        width: '100%', maxWidth: '540px',
        padding: 'clamp(20px, 4vw, 32px)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border)',
        position: 'relative',
        maxHeight: '92vh',
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

        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Staff Member' : 'Add New Staff'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Full Name *</label>
            <input
              required
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '12px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-primary)', fontSize: '14px'
              }}
              placeholder="E.g., Ahmed Ali"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Email Address *</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '12px',
                  border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-primary)', fontSize: '14px'
                }}
                placeholder="delivery@gmail.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Phone Number *</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '12px',
                  border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-primary)', fontSize: '14px'
                }}
                placeholder="+252 61 0000000"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Password {isEdit && '(Leave blank to keep current)'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                required={!isEdit}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '11px 40px 11px 14px', borderRadius: '12px',
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>System Role *</label>
              <select
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '12px',
                  border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-primary)', fontSize: '14px'
                }}
              >
                <option value="DELIVERY">Delivery Personnel</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Account Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '12px',
                  border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-primary)', fontSize: '14px'
                }}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked / Suspended</option>
              </select>
            </div>
          </div>

          {/* Delivery Specific Fields */}
          {roleName === 'DELIVERY' && (
            <div style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(212, 165, 116, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--accent)' }}>
                <Bike size={16} />
                <span>Delivery Vehicle Information</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '10px',
                      border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                      color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  >
                    <option value="Motorbike">Motorbike (Mooto)</option>
                    <option value="Bajaj">Bajaj / Rickshaw</option>
                    <option value="Car">Car / Vehicle</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="None">None (Foot/Runner)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>Plate / Tag Number (Optional)</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={e => setPlateNumber(e.target.value)}
                    placeholder="e.g. MOG-4492"
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '10px',
                      border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)',
                      color: 'var(--text-primary)', fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              <AlertCircle size={15} />
              <span>Emergency Contact / Qofka Degdegga (Optional)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>Contact Name</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={e => setEmergencyContactName(e.target.value)}
                  placeholder="e.g. Maryan Ali"
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '10px',
                    border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={e => setEmergencyContactPhone(e.target.value)}
                  placeholder="e.g. +252 61 0000000"
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '10px',
                    border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)', fontSize: '13px'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                backgroundColor: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer'
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
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(212, 165, 116, 0.3)'
              }}
            >
              {isSaving ? 'Saving...' : isEdit ? 'Update Staff' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
