'use client';

import { useMemo, useState } from 'react';

type MenuItem = { id: number; name: string; category: string; price: number };
type CartItem = MenuItem & { qty: number };

const menu: MenuItem[] = [
  { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 180 },
  { id: 2, name: 'Veg Spring Roll', category: 'Starters', price: 140 },
  { id: 3, name: 'Paneer Butter Masala', category: 'Main Course', price: 220 },
  { id: 4, name: 'Dal Makhani', category: 'Main Course', price: 180 },
  { id: 5, name: 'Butter Naan', category: 'Main Course', price: 40 },
  { id: 6, name: 'Veg Hakka Noodles', category: 'Chinese', price: 160 },
  { id: 7, name: 'Veg Fried Rice', category: 'Chinese', price: 150 },
  { id: 8, name: 'Masala Soda', category: 'Beverages', price: 60 },
  { id: 9, name: 'Cold Coffee', category: 'Beverages', price: 110 },
  { id: 10, name: 'Gulab Jamun', category: 'Desserts', price: 90 },
];

const categories = ['All', 'Starters', 'Main Course', 'Chinese', 'Beverages', 'Desserts'];

export default function Home() {
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5);
  const [payment, setPayment] = useState('Cash');
  const [billNo, setBillNo] = useState(1001);
  const [completed, setCompleted] = useState(false);

  const visibleItems = category === 'All' ? menu : menu.filter((item) => item.category === category);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round((taxable * taxRate) / 100);
  const total = taxable + tax;

  function addItem(item: MenuItem) {
    setCompleted(false);
    setCart((current) => {
      const found = current.find((x) => x.id === item.id);
      return found ? current.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...current, { ...item, qty: 1 }];
    });
  }

  function changeQty(id: number, delta: number) {
    setCart((current) => current.flatMap((item) => item.id === id ? (item.qty + delta > 0 ? [{ ...item, qty: item.qty + delta }] : []) : [item]));
  }

  function completeBill() {
    if (!cart.length) return;
    setCompleted(true);
    setBillNo((n) => n + 1);
  }

  function printBill() {
    if (!cart.length && !completed) return;
    window.print();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">AANAND <span>FAMILY RESTRO</span></div>
          <div className="muted">Mandsaur, Madhya Pradesh</div>
        </div>
        <div className="top-actions">
          <div className="outlet"><span className="status-dot" /> Main Outlet</div>
          <div className="cashier">Cashier: <strong>Demo Cashier</strong></div>
        </div>
      </header>

      <div className="workspace">
        <section className="menu-panel">
          <div className="section-heading">
            <div><h1>New Bill</h1><p>Select items to add to the order</p></div>
            <div className="bill-chip">Bill #{billNo}</div>
          </div>

          <div className="categories">
            {categories.map((item) => <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)}>{item}</button>)}
          </div>

          <div className="menu-grid">
            {visibleItems.map((item) => (
              <button className="menu-card" key={item.id} onClick={() => addItem(item)}>
                <div className="food-placeholder">{item.name.split(' ').slice(0, 2).map((x) => x[0]).join('')}</div>
                <div className="food-info"><strong>{item.name}</strong><span>{item.category}</span></div>
                <b>₹{item.price}</b>
              </button>
            ))}
          </div>
        </section>

        <aside className="bill-panel">
          <div className="bill-head"><div><h2>Current Bill</h2><span>#{billNo} · Main Outlet</span></div><button className="clear" onClick={() => setCart([])}>Clear</button></div>

          <div className="cart-list">
            {cart.length === 0 ? <div className="empty"><div className="empty-icon">＋</div><strong>No items yet</strong><span>Select food items from the menu</span></div> : cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-name"><strong>{item.name}</strong><span>₹{item.price} each</span></div>
                <div className="qty"><button onClick={() => changeQty(item.id, -1)}>−</button><b>{item.qty}</b><button onClick={() => changeQty(item.id, 1)}>+</button></div>
                <strong className="line-total">₹{item.price * item.qty}</strong>
              </div>
            ))}
          </div>

          <div className="bill-summary">
            <div><span>Subtotal</span><b>₹{subtotal}</b></div>
            <div className="input-line"><span>Discount</span><label>₹ <input type="number" min="0" value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))} /></label></div>
            <div className="input-line"><span>GST</span><label><input className="percent" type="number" min="0" value={taxRate} onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))} /> %</label></div>
            <div className="grand"><span>Total</span><b>₹{total}</b></div>
          </div>

          <div className="payment"><span>Payment Method</span><div className="payment-options">{['Cash', 'UPI', 'Card'].map((p) => <button key={p} className={payment === p ? 'pay active' : 'pay'} onClick={() => setPayment(p)}>{p}</button>)}</div></div>

          {completed && <div className="success">✓ Bill completed successfully · {payment}</div>}
          <div className="actions"><button className="complete" onClick={completeBill} disabled={!cart.length}>Complete Bill</button><button className="print" onClick={printBill} disabled={!cart.length && !completed}>Print Bill</button></div>
        </aside>
      </div>

      <div className="inventory-demo"><strong>Inventory automation demo</strong><span>Paneer Butter Masala uses 200g paneer per serving. Completing a bill will later trigger recipe-based stock deduction.</span><span className="coming">Phase 1 demo</span></div>
    </main>
  );
}