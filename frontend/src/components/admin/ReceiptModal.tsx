'use client';

import React from 'react';
import { Order } from '@/types';
import { Printer, X, CheckCircle2, Phone, MapPin, Calendar, CreditCard, Utensils } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  restaurantSettings?: {
    restaurantName?: string;
    contactPhone?: string;
    address?: string;
    currencySymbol?: string;
  };
}

export default function ReceiptModal({
  isOpen,
  onClose,
  order,
  restaurantSettings,
}: ReceiptModalProps) {
  if (!isOpen || !order) return null;

  const restaurantName = restaurantSettings?.restaurantName || 'Barwaaqo Restaurant';
  const restaurantPhone = restaurantSettings?.contactPhone || '+252 61 0000000';
  const restaurantAddress = restaurantSettings?.address || 'KM4 Maka Al-Mukarama Road, Mogadishu';
  const currencySymbol = restaurantSettings?.currencySymbol || '$';

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString();

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'evc_plus':
        return 'EVC Plus (Hormuud)';
      case 'edahab':
        return 'eDahab (Dahabshiil)';
      case 'pay_on_delivery':
        return 'Pay on Delivery (Mobile Money)';
      case 'cash_on_delivery':
        return 'Pay on Delivery';
      default:
        return method.toUpperCase();
    }
  };

  return (
    <div
      onClick={onClose}
      className="receipt-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="receipt-modal-card"
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '94vh',
          backgroundColor: '#ffffff',
          color: '#111827',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          fontFamily: "'Courier New', Courier, monospace, sans-serif",
        }}
      >
        {/* Modal Header Toolbar (Hidden when printing) */}
        <div
          className="no-print"
          style={{
            padding: '12px 18px',
            backgroundColor: '#1f2937',
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="#d4a574" />
            <span style={{ fontWeight: '700', fontSize: '14px' }}>Thermal Receipt / Slip</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                backgroundColor: '#d4a574',
                color: '#111827',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div
          id="printable-receipt"
          className="printable-receipt-content"
          style={{
            padding: '24px 20px',
            overflowY: 'auto',
            fontSize: '13px',
            lineHeight: 1.45,
            color: '#000000',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
              {restaurantName.toUpperCase()}
            </h2>
            <p style={{ margin: '2px 0', fontSize: '12px' }}>{restaurantAddress}</p>
            <p style={{ margin: '2px 0', fontSize: '12px' }}>Tel: {restaurantPhone}</p>
            <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }} />
            <p style={{ fontSize: '13px', fontWeight: '800', margin: '4px 0' }}>
              {order.orderType === 'DINE_IN'
                ? '★ DINE-IN SERVICE ★'
                : order.orderType === 'TAKEAWAY'
                ? '★ TAKEAWAY / COUNTER PICKUP ★'
                : '★ DELIVERY ORDER ★'}
            </p>
          </div>

          {/* Order Meta Info */}
          <div style={{ fontSize: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span>Order No:</span>
              <strong style={{ fontSize: '14px' }}>{order.orderId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span>Date:</span>
              <span>{formattedDate}</span>
            </div>
            {order.orderType === 'DINE_IN' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', fontWeight: '700' }}>
                <span>Table:</span>
                <span>
                  {typeof order.table === 'object' && order.table?.tableNumber
                    ? `Table ${order.table.tableNumber} (${order.table.location || 'Dine-In'})`
                    : order.shippingAddress || 'Counter'}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span>Customer:</span>
              <span>{typeof order.user === 'object' && order.user?.name ? order.user.name : 'Walk-in Guest'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span>Phone:</span>
              <span>{order.paymentPhone || 'N/A'}</span>
            </div>
            {order.orderType === 'DELIVERY' && (
              <div style={{ margin: '4px 0', paddingTop: '4px', borderTop: '1px dotted #ccc' }}>
                <span>Address: </span>
                <strong>
                  {order.district ? `Degmada ${order.district}` : ''}
                  {order.landmark ? ` (${order.landmark})` : ''} - {order.shippingAddress}
                </strong>
              </div>
            )}
          </div>

          <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', margin: '8px 0' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>
                <th style={{ padding: '4px 0', width: '28px' }}>Qty</th>
                <th style={{ padding: '4px 6px' }}>Item</th>
                <th style={{ padding: '4px 0', textAlign: 'right' }}>Amt</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ verticalAlign: 'top' }}>
                  <td style={{ padding: '5px 0', fontWeight: '700' }}>{item.quantity}x</td>
                  <td style={{ padding: '5px 6px' }}>{item.name || (item.food as any)?.name || 'Dish'}</td>
                  <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: '600' }}>
                    {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

          {/* Pricing Totals */}
          <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>{currencySymbol}{order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee:</span>
                <span>{currencySymbol}{order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax (5%):</span>
              <span>{currencySymbol}{order.serviceTax?.toFixed(2) || '0.00'}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '6px',
                marginTop: '4px',
                borderTop: '1px solid #000',
                fontSize: '15px',
                fontWeight: '900',
              }}
            >
              <span>TOTAL:</span>
              <span>{currencySymbol}{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }} />

          {/* Payment & Mobile Money Verification */}
          <div style={{ fontSize: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span>Payment:</span>
              <strong>{getPaymentMethodLabel(order.paymentMethod)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span>Payment Status:</span>
              <strong style={{ textTransform: 'uppercase' }}>
                {order.paymentStatus === 'Paid' ? 'PAID [VERIFIED]' : 'PENDING'}
              </strong>
            </div>
            {order.transactionId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                <span>Mobile Ref / TRX:</span>
                <strong style={{ fontFamily: 'monospace' }}>{order.transactionId}</strong>
              </div>
            )}
            {order.notes && (
              <div style={{ marginTop: '6px', fontSize: '11px', fontStyle: 'italic', backgroundColor: '#f3f4f6', padding: '6px', borderRadius: '4px' }}>
                <strong>Note:</strong> {order.notes}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px' }}>
            <p style={{ margin: '3px 0', fontWeight: '800' }}>MAHADSANID! / THANK YOU!</p>
            <p style={{ margin: '2px 0', color: '#4b5563' }}>Fadlan dib noogu soo laabo mar kale</p>
            <p style={{ margin: '6px 0 0 0', fontSize: '10px', color: '#9ca3af' }}>Powered by Barwaaqo Restaurant System</p>
          </div>
        </div>

        {/* Action Button Footer (Hidden when printing) */}
        <div
          className="no-print"
          style={{
            padding: '14px 18px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '10px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 16px',
              backgroundColor: '#111827',
              color: '#ffffff',
              borderRadius: '9px',
              fontWeight: '700',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Printer size={16} /> Print Receipt (80mm)
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '11px 16px',
              backgroundColor: '#ffffff',
              color: '#374151',
              borderRadius: '9px',
              fontWeight: '600',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Dedicated Print Media Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-modal-backdrop,
          .receipt-modal-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            padding: 4mm !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
