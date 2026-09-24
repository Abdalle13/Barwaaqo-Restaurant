'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Food, CartItem } from '@/types';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Utensils,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

interface PosCustomer {
  _id: string;
  name: string;
  phone?: string;
  role?: { name: string };
}

export default function AdminPosPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('Counter Order');
  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEAWAY' | 'DINE_IN'>('TAKEAWAY');
  const [customers, setCustomers] = useState<PosCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'evc_plus'>('cash_on_delivery');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const [foodResponse, customerResponse] = await Promise.all([
          api.get('/foods?limit=100&status=Available'),
          api.get('/users'),
        ]);
        if (foodResponse.data.success) setFoods(foodResponse.data.data);
        if (customerResponse.data.success) {
          setCustomers((customerResponse.data.data || []).filter((customer: PosCustomer) => customer.role?.name === 'CUSTOMER'));
        }
      } catch (error) {
        showToast('Could not load available menu items', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, [showToast]);

  const categories = useMemo(() => {
    const names = foods
      .map((food) => typeof food.category === 'object' && food.category ? food.category.name : '')
      .filter(Boolean);
    return Array.from(new Set(names));
  }, [foods]);

  const filteredFoods = useMemo(() => foods.filter((food) => {
    const categoryName = typeof food.category === 'object' && food.category ? food.category.name : '';
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
    const query = search.trim().toLowerCase();
    return matchesCategory && (!query || food.name.toLowerCase().includes(query));
  }), [foods, search, selectedCategory]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'DELIVERY' && cart.length > 0 ? 2 : 0;
  const serviceTax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + serviceTax;

  const addToCart = (food: Food) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.food._id === food._id);
      if (existing) {
        return currentCart.map((item) => item.food._id === food._id
          ? { ...item, quantity: item.quantity + 1 }
          : item);
      }
      return [...currentCart, { food, quantity: 1, price: food.price }];
    });
  };

  const updateQuantity = (foodId: string, change: number) => {
    setCart((currentCart) => currentCart
      .map((item) => item.food._id === foodId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  };

  const removeFromCart = (foodId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.food._id !== foodId));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) {
      showToast('Add at least one menu item first', 'error');
      return;
    }
    if (!paymentPhone.trim()) {
      showToast('Enter a customer or payment phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/orders', {
        items: cart.map((item) => ({
          food: item.food._id,
          name: item.food.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: location.trim() || 'Counter Order',
        paymentPhone: paymentPhone.trim(),
        paymentMethod,
        orderType,
        ...(selectedCustomerId ? { customerId: selectedCustomerId } : {}),
        notes: notes.trim(),
      });

      if (response.data.success) {
        showToast(`Order ${response.data.data.orderId} created successfully`, 'success');
        setCart([]);
        setPaymentPhone('');
        setSelectedCustomerId('');
        setNotes('');
        setLocation('Counter Order');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Could not create order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Counter Sales
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '5px' }}>
            Point of Sale
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Create an order for a walk-in guest or restaurant table.
          </p>
        </div>
        <Link href="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textDecoration: 'none', backgroundColor: 'var(--bg-surface)' }}>
          Live Orders <ArrowRight size={15} />
        </Link>
      </div>

      <div className="pos-layout">
        <section style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div style={{ position: 'relative', flex: '1 1 220px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. Bariis or Goat" className="form-input" style={{ width: '100%', paddingLeft: '38px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
            </div>
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="form-select" style={{ width: '190px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px' }}>
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <Utensils size={17} color="var(--accent)" />
                <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Available Menu</h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{filteredFoods.length} items</span>
            </div>
            <div className="pos-food-grid" style={{ padding: '16px' }}>
              {isLoading ? (
                <p style={{ color: 'var(--text-secondary)', padding: '24px', gridColumn: '1 / -1', textAlign: 'center' }}>Loading menu...</p>
              ) : filteredFoods.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '24px', gridColumn: '1 / -1', textAlign: 'center' }}>No available dishes found.</p>
              ) : filteredFoods.map((food) => {
                const cartItem = cart.find((item) => item.food._id === food._id);
                return (
                  <button key={food._id} type="button" onClick={() => addToCart(food)} style={{ position: 'relative', textAlign: 'left', padding: 0, overflow: 'hidden', borderRadius: '11px', border: cartItem ? '1px solid var(--accent)' : '1px solid var(--border)', backgroundColor: 'var(--bg-deep)', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <img src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={food.name} style={{ width: '100%', height: '108px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '10px 11px' }}>
                      <p style={{ fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{food.name}</p>
                      <p style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '13px', marginTop: '3px' }}>{formatCurrency(food.price)}</p>
                    </div>
                    {cartItem && <span style={{ position: 'absolute', top: '8px', right: '8px', width: '23px', height: '23px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--accent)', color: 'var(--bg-deep)', fontSize: '12px', fontWeight: '800' }}>{cartItem.quantity}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '9px' }}>
            <ShoppingBag size={17} color="var(--accent)" />
            <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Current Order</h2>
            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '12px' }}>{cart.length} lines</span>
          </div>

          <div style={{ padding: '14px 18px', minHeight: '150px', maxHeight: '280px', overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 10px', color: 'var(--text-muted)' }}>
                <ShoppingBag size={30} style={{ opacity: 0.35, margin: '0 auto 8px' }} />
                <p style={{ fontSize: '13px' }}>Select dishes to start an order</p>
              </div>
            ) : cart.map((item) => (
              <div key={item.food._id} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.food.name}</p>
                  <p style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>{formatCurrency(item.price * item.quantity)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <button type="button" aria-label={`Decrease ${item.food.name}`} onClick={() => updateQuantity(item.food._id, -1)} style={{ width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)', cursor: 'pointer' }}><Minus size={13} /></button>
                  <span style={{ width: '20px', textAlign: 'center', fontSize: '13px', fontWeight: '700' }}>{item.quantity}</span>
                  <button type="button" aria-label={`Increase ${item.food.name}`} onClick={() => updateQuantity(item.food._id, 1)} style={{ width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-deep)', cursor: 'pointer' }}><Plus size={13} /></button>
                  <button type="button" aria-label={`Remove ${item.food.name}`} onClick={() => removeFromCart(item.food._id)} style={{ width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid rgba(248,113,113,0.2)', backgroundColor: 'rgba(248,113,113,0.08)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <select
                value={selectedCustomerId}
                onChange={(event) => {
                  const customerId = event.target.value;
                  setSelectedCustomerId(customerId);
                  const customer = customers.find((item) => item._id === customerId);
                  if (customer?.phone) setPaymentPhone(customer.phone);
                }}
                className="form-select"
                style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '9px' }}
              >
                <option value="">Walk-in customer (not linked)</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>{customer.name}{customer.phone ? ` - ${customer.phone}` : ''}</option>
                ))}
              </select>
              <select value={orderType} onChange={(event) => setOrderType(event.target.value as 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN')} className="form-select" style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '9px' }}>
                <option value="TAKEAWAY">Takeaway</option>
                <option value="DINE_IN">Dine-in</option>
                <option value="DELIVERY">Delivery</option>
              </select>
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Table 4 or Counter" required className="form-input" style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '9px' }} />
              <input value={paymentPhone} onChange={(event) => setPaymentPhone(event.target.value)} placeholder="e.g. +252 61 555 0190" required className="form-input" style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '9px' }} />
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as 'cash_on_delivery' | 'evc_plus')} className="form-select" style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '9px' }}>
                <option value="cash_on_delivery">Cash</option>
                <option value="evc_plus">EVC Plus</option>
              </select>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Order notes (optional)" rows={2} className="form-input" style={{ resize: 'vertical', backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '9px' }} />
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'grid', gap: '7px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>Service tax</span><span>{formatCurrency(serviceTax)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>Service fee</span><span>{formatCurrency(deliveryFee)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '2px', borderTop: '1px solid var(--border)', fontWeight: '800', fontSize: '16px' }}><span>Total</span><span style={{ color: 'var(--accent)' }}>{formatCurrency(total)}</span></div>
            </div>

            <button type="submit" disabled={isSubmitting || cart.length === 0} style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '11px 14px', border: 'none', borderRadius: '9px', backgroundColor: cart.length > 0 ? 'var(--accent)' : 'var(--bg-muted)', color: cart.length > 0 ? 'var(--bg-deep)' : 'var(--text-muted)', fontWeight: '800', cursor: cart.length > 0 ? 'pointer' : 'not-allowed' }}>
              <Check size={16} /> {isSubmitting ? 'Creating order...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .pos-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(300px, 360px); gap: 20px; align-items: start; }
        .pos-food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
        @media (max-width: 900px) { .pos-layout { grid-template-columns: 1fr; } }
        @media (max-width: 520px) { .pos-food-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      `}</style>
      {ToastComponent}
    </div>
  );
}
