'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Food, CartItem, Table, Order } from '@/types';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Utensils,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import ReceiptModal from '@/components/admin/ReceiptModal';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

interface PosCustomer {
  _id: string;
  name: string;
  phone?: string;
  role?: { name: string };
}

export default function ReceptionistPosPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderType, setOrderType] = useState<'TAKEAWAY' | 'DINE_IN' | 'DELIVERY'>('TAKEAWAY');
  const [selectedTableId, setSelectedTableId] = useState('');
  const [location, setLocation] = useState('Counter / Walk-in');
  const [customers, setCustomers] = useState<PosCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'evc_plus' | 'edahab' | 'pay_on_delivery'>('evc_plus');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Receipt Modal State
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState<{
    restaurantName?: string;
    contactPhone?: string;
    address?: string;
    currencySymbol?: string;
  }>({});

  const { showToast, ToastComponent } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [foodResponse, customerResponse, tableResponse, orderResponse, settingsResponse] =
        await Promise.allSettled([
          api.get('/foods?limit=100&status=Available'),
          api.get('/users'),
          api.get('/tables'),
          api.get('/orders?limit=6'),
          api.get('/settings'),
        ]);

      if (foodResponse.status === 'fulfilled' && foodResponse.value.data.success) {
        setFoods(foodResponse.value.data.data);
      }
      if (customerResponse.status === 'fulfilled' && customerResponse.value.data.success) {
        setCustomers(
          (customerResponse.value.data.data || []).filter(
            (c: PosCustomer) => c.role?.name === 'CUSTOMER'
          )
        );
      }
      if (tableResponse.status === 'fulfilled' && tableResponse.value.data.success) {
        setTables(tableResponse.value.data.data);
      }
      if (orderResponse.status === 'fulfilled' && orderResponse.value.data.success) {
        setRecentOrders(orderResponse.value.data.data || []);
      }
      if (settingsResponse.status === 'fulfilled' && settingsResponse.value.data.success) {
        setRestaurantSettings(settingsResponse.value.data.data || {});
      }
    } catch (error) {
      showToast('Could not load menu items or tables', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = useMemo(() => {
    const names = foods
      .map((food) => (typeof food.category === 'object' && food.category ? food.category.name : ''))
      .filter(Boolean);
    return Array.from(new Set(names));
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const categoryName =
        typeof food.category === 'object' && food.category ? food.category.name : '';
      const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
      const query = search.trim().toLowerCase();
      return matchesCategory && (!query || food.name.toLowerCase().includes(query));
    });
  }, [foods, search, selectedCategory]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'DELIVERY' && cart.length > 0 ? 2 : 0;
  const serviceTax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + serviceTax;

  const addToCart = (food: Food) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.food._id === food._id);
      if (existing) {
        return currentCart.map((item) =>
          item.food._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { food, quantity: 1, price: food.price }];
    });
  };

  const updateQuantity = (foodId: string, change: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.food._id === foodId ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.food._id !== foodId));
  };

  const clearCart = () => {
    setCart([]);
    setNotes('');
  };

  const handleOrderTypeChange = (type: 'TAKEAWAY' | 'DINE_IN' | 'DELIVERY') => {
    setOrderType(type);
    if (type === 'DINE_IN') {
      const firstAvailable = tables.find((t) => t.status === 'Available');
      if (firstAvailable) {
        setSelectedTableId(firstAvailable._id);
        setLocation(`Table ${firstAvailable.tableNumber} (${firstAvailable.location})`);
      } else {
        setLocation('Dine-In Table');
      }
    } else if (type === 'TAKEAWAY') {
      setLocation('Counter Pickup');
      setSelectedTableId('');
    } else {
      setLocation('Delivery Address');
      setSelectedTableId('');
    }
  };

  const handleTableChange = (tableId: string) => {
    setSelectedTableId(tableId);
    const table = tables.find((t) => t._id === tableId);
    if (table) {
      setLocation(`Table ${table.tableNumber} (${table.location})`);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) {
      showToast('Add at least one menu item first', 'error');
      return;
    }

    const resolvedPhone = paymentPhone.trim() || '+252 61 0000000';

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          food: item.food._id,
          name: item.food.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: location.trim() || 'Counter Order',
        paymentPhone: resolvedPhone,
        paymentMethod,
        orderType,
        table: orderType === 'DINE_IN' && selectedTableId ? selectedTableId : undefined,
        paymentStatus,
        ...(selectedCustomerId ? { customerId: selectedCustomerId } : {}),
        notes: notes.trim(),
      };

      const response = await api.post('/orders', orderPayload);

      if (response.data.success) {
        const newOrder = response.data.data;
        showToast(`Order ${newOrder.orderId} created successfully!`, 'success');
        
        // Open receipt modal right away
        setReceiptOrder(newOrder);
        setIsReceiptOpen(true);

        // Reset cart and fields
        setCart([]);
        setPaymentPhone('');
        setSelectedCustomerId('');
        setNotes('');
        if (orderType === 'TAKEAWAY') setLocation('Counter / Walk-in');

        // Refresh recent orders and tables
        loadData();
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Could not create order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Somalia Counter & Dine-in POS
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            Point of Sale
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Quick counter orders, EVC Plus / eDahab verification, and instant thermal receipt printing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (recentOrders.length > 0) {
                setReceiptOrder(recentOrders[0]);
                setIsReceiptOpen(true);
              } else {
                showToast('No recent orders to print', 'info');
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: 'var(--bg-surface)',
              cursor: 'pointer',
            }}
          >
            <Printer size={15} color="var(--accent)" />
            <span>Reprint Last Order</span>
          </button>
          <Link
            href="/receptionist/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            Live Orders <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* POS Layout */}
      <div className="pos-layout">
        {/* Left Side: Available Menu & Search */}
        <section style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search & Category Filter Toolbar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search dish (e.g. Bariis, Baasto, Suqaar, Goat)..."
                className="form-input"
                style={{
                  width: '100%',
                  paddingLeft: '38px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="form-select"
              style={{
                width: '190px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Food Grid */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <Utensils size={17} color="var(--accent)" />
                <h2 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Available Dishes</h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {filteredFoods.length} items
              </span>
            </div>

            <div className="pos-food-grid" style={{ padding: '16px', maxHeight: '560px', overflowY: 'auto' }}>
              {isLoading ? (
                <p style={{ color: 'var(--text-secondary)', padding: '30px', gridColumn: '1 / -1', textAlign: 'center' }}>
                  Loading menu items...
                </p>
              ) : filteredFoods.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '30px', gridColumn: '1 / -1', textAlign: 'center' }}>
                  No available dishes found matching your search.
                </p>
              ) : (
                filteredFoods.map((food) => {
                  const cartItem = cart.find((item) => item.food._id === food._id);
                  return (
                    <button
                      key={food._id}
                      type="button"
                      onClick={() => addToCart(food)}
                      style={{
                        position: 'relative',
                        textAlign: 'left',
                        padding: 0,
                        overflow: 'hidden',
                        borderRadius: '12px',
                        border: cartItem ? '2px solid var(--accent)' : '1px solid var(--border)',
                        backgroundColor: 'var(--bg-deep)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        transition: 'transform 0.15s, border-color 0.15s',
                      }}
                    >
                      <img
                        src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                        alt={food.name}
                        style={{ width: '100%', height: '105px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '10px 11px' }}>
                        <p
                          style={{
                            fontWeight: '700',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            margin: 0,
                          }}
                        >
                          {food.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                          <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '13px' }}>
                            {formatCurrency(food.price)}
                          </span>
                          {food.discount && food.discount > 0 && (
                            <span style={{ fontSize: '10px', color: '#4ADE80', fontWeight: '700' }}>
                              -{food.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                      {cartItem && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--accent)',
                            color: '#000000',
                            fontSize: '12px',
                            fontWeight: '900',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                          }}
                        >
                          {cartItem.quantity}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Counter Sales (Reprint Bar) */}
          {recentOrders.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '14px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Recent Counter Orders
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Click to view / reprint receipt</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {recentOrders.map((ro) => (
                  <button
                    key={ro._id}
                    type="button"
                    onClick={() => {
                      setReceiptOrder(ro);
                      setIsReceiptOpen(true);
                    }}
                    style={{
                      flex: '0 0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-deep)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    <Printer size={13} color="var(--accent)" />
                    <span style={{ fontWeight: '700', color: 'var(--accent)' }}>{ro.orderId}</span>
                    <span>${ro.totalAmount.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Order Cart & Mobile Money Checkout */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Cart Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={17} color="var(--accent)" />
              <h2 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Current Order</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{cart.length} lines</span>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                  }}
                >
                  <RotateCcw size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Cart Items List */}
          <div style={{ padding: '12px 18px', minHeight: '130px', maxHeight: '220px', overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)' }}>
                <ShoppingBag size={28} style={{ opacity: 0.35, margin: '0 auto 8px' }} />
                <p style={{ fontSize: '13px', margin: 0 }}>Click menu dishes to start an order</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.food._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '9px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        margin: 0,
                      }}
                    >
                      {item.food.name}
                    </p>
                    <p style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '700', margin: '2px 0 0' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() => updateQuantity(item.food._id, -1)}
                      style={{
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-deep)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ width: '20px', textAlign: 'center', fontSize: '13px', fontWeight: '700' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() => updateQuantity(item.food._id, 1)}
                      style={{
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-deep)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() => removeFromCart(item.food._id)}
                      style={{
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        border: '1px solid rgba(248,113,113,0.2)',
                        backgroundColor: 'rgba(248,113,113,0.08)',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* POS Order Options & Somali Mobile Money Flow */}
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              {/* Order Type Toggle (Takeaway / Dine-In / Delivery) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {(['TAKEAWAY', 'DINE_IN', 'DELIVERY'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleOrderTypeChange(type)}
                    style={{
                      padding: '7px 4px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: orderType === type ? '1px solid var(--accent)' : '1px solid var(--border)',
                      backgroundColor: orderType === type ? 'rgba(212, 165, 116, 0.15)' : 'var(--bg-deep)',
                      color: orderType === type ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {type === 'TAKEAWAY' ? 'Takeaway' : type === 'DINE_IN' ? 'Dine-In' : 'Delivery'}
                  </button>
                ))}
              </div>

              {/* Table Selector (If Dine-In) */}
              {orderType === 'DINE_IN' && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    SELECT DINING TABLE
                  </label>
                  <select
                    value={selectedTableId}
                    onChange={(e) => handleTableChange(e.target.value)}
                    className="form-select"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border)',
                      borderRadius: '9px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="">— Select Table —</option>
                    {tables.map((t) => (
                      <option key={t._id} value={t._id}>
                        Table {t.tableNumber} - {t.location} ({t.capacity} seats) [{t.status}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Location / Note */}
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Table # or Pickup details"
                className="form-input"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: '9px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />

              {/* Customer Selector (Optional) */}
              <select
                value={selectedCustomerId}
                onChange={(event) => {
                  const customerId = event.target.value;
                  setSelectedCustomerId(customerId);
                  const customer = customers.find((item) => item._id === customerId);
                  if (customer?.phone) setPaymentPhone(customer.phone);
                }}
                className="form-select"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: '9px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              >
                <option value="">Walk-in Customer (Guest)</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>

              {/* Somali Mobile Payment Method Selector */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  MOBILE MONEY PAYMENT (SOMALIA)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'evc_plus', label: 'EVC Plus', sub: 'Hormuud' },
                    { id: 'edahab', label: 'eDahab', sub: 'Dahabshiil' },
                    { id: 'pay_on_delivery', label: 'On Delivery', sub: 'Later' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: paymentMethod === m.id ? '1px solid #4ADE80' : '1px solid var(--border)',
                        backgroundColor: paymentMethod === m.id ? 'rgba(74, 222, 128, 0.1)' : 'var(--bg-deep)',
                        color: paymentMethod === m.id ? '#4ADE80' : 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: '800' }}>{m.label}</div>
                      <div style={{ fontSize: '10px', opacity: 0.7 }}>{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Phone */}
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>CUSTOMER PHONE</label>
                <input
                  value={paymentPhone}
                  onChange={(event) => setPaymentPhone(event.target.value)}
                  placeholder="061XXXXXXX"
                  className="form-input"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-deep)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Payment Status Toggle (Paid immediately vs Pending) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Payment Received?</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid')}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800',
                      border: 'none',
                      backgroundColor: paymentStatus === 'Paid' ? '#4ADE80' : 'transparent',
                      color: paymentStatus === 'Paid' ? '#000000' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    PAID
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Pending')}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800',
                      border: 'none',
                      backgroundColor: paymentStatus === 'Pending' ? '#FBBF24' : 'transparent',
                      color: paymentStatus === 'Pending' ? '#000000' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    PENDING
                  </button>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Kitchen note (e.g. well-done, no spicy)..."
                rows={1}
                className="form-input"
                style={{
                  resize: 'vertical',
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                }}
              />
            </div>

            {/* Calculations Breakdown */}
            <div
              style={{
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border)',
                display: 'grid',
                gap: '6px',
                fontSize: '12.5px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Service tax (5%)</span>
                <span>{formatCurrency(serviceTax)}</span>
              </div>
              {orderType === 'DELIVERY' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '6px',
                  marginTop: '2px',
                  borderTop: '1px solid var(--border)',
                  fontWeight: '800',
                  fontSize: '16px',
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit & Create Order Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              style={{
                width: '100%',
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '12px 14px',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: cart.length > 0 ? 'var(--accent)' : 'var(--bg-elevated)',
                color: cart.length > 0 ? '#000000' : 'var(--text-muted)',
                fontWeight: '800',
                fontSize: '14px',
                cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
                boxShadow: cart.length > 0 ? '0 4px 16px rgba(212, 165, 116, 0.35)' : 'none',
              }}
            >
              <Check size={17} /> {isSubmitting ? 'Creating Order...' : 'Complete & Print Receipt'}
            </button>
          </div>
        </form>
      </div>

      {/* Printable Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={receiptOrder}
        restaurantSettings={restaurantSettings}
      />

      <style>{`
        .pos-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
          gap: 20px;
          align-items: start;
        }
        .pos-food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        @media (max-width: 960px) {
          .pos-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 520px) {
          .pos-food-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
      {ToastComponent}
    </div>
  );
}
