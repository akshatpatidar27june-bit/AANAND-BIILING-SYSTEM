"use client";

import { useMemo, useState } from "react";
import { calculateTotals, deductInventory, initialIngredients, menuItems, type Bill, type CartItem, type Ingredient, type PaymentMethod } from "../../lib/billing";

const categories = ["All", "Starters", "Main Course", "Chinese", "Beverages", "Desserts"];
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function POSPage() {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("Cash");
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [bills, setBills] = useState<Bill[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [notice, setNotice] = useState("");
  const [nextBill, setNextBill] = useState(1001);

  const filtered = category === "All" ? menuItems : menuItems.filter((item) => item.category === category);
  const totals = useMemo(() => calculateTotals(cart, discount), [cart, discount]);

  function addItem(id: string) {
    const item = menuItems.find((entry) => entry.id === id);
    if (!item) return;
    setCart((current) => {
      const found = current.find((entry) => entry.id === id);
      if (found) return current.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + 1 } : entry);
      return [...current, { ...item, quantity: 1 }];
    });
  }

  function changeQuantity(id: string, delta: number) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0));
  }

  function completeBill() {
    if (!cart.length) return;
    const billNumber = nextBill;
    const bill: Bill = {
      id: crypto.randomUUID(), billNumber, createdAt: new Date().toISOString(), cashier: "Demo Cashier", outlet: "Main Outlet",
      items: cart.map(({ id, name, quantity, price }) => ({ menuItemId: id, name, quantity, price })), ...totals, paymentMethod: payment,
    };
    setBills((current) => [bill, ...current]);
    setIngredients((current) => deductInventory(current, cart));
    setNextBill((current) => current + 1);
    setNotice(`Bill #${billNumber} completed successfully.`);
    setCart([]); setDiscount(0);
  }

  function printBill(bill: Bill | null = null) {
    if (!bill) {
      if (!cart.length) return;
      const preview: Bill = { id: "preview", billNumber: nextBill, createdAt: new Date().toISOString(), cashier: "Demo Cashier", outlet: "Main Outlet", items: cart.map(({ id, name, quantity, price }) => ({ menuItemId: id, name, quantity, price })), ...totals, paymentMethod: payment };
      openPrint(preview);
      return;
    }
    openPrint(bill);
  }

  function openPrint(bill: Bill) {
    const win = window.open("", "_blank", "width=420,height=700");
    if (!win) return;
    const rows = bill.items.map((item) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${money(item.price * item.quantity)}</td></tr>`).join("");
    win.document.write(`<html><head><title>Bill #${bill.billNumber}</title><style>@page{size:80mm auto;margin:3mm}body{width:72mm;font-family:Arial,sans-serif;font-size:12px;margin:auto}.center{text-align:center}.line{border-top:1px dashed #222;margin:8px 0}table{width:100%;border-collapse:collapse}td{padding:3px 0}td:nth-child(2),td:nth-child(3){text-align:right}.total{font-size:16px;font-weight:700}</style></head><body><div class="center"><h2 style="margin:4px 0">AANAND FAMILY RESTRO</h2><div>Mandsaur, Madhya Pradesh</div><div>Main Outlet</div></div><div class="line"></div><div>Bill No: #${bill.billNumber}</div><div>Date: ${new Date(bill.createdAt).toLocaleString("en-IN")}</div><div>Cashier: ${bill.cashier}</div><div class="line"></div><table>${rows}</table><div class="line"></div><div>Subtotal: ${money(bill.subtotal)}</div><div>Discount: ${money(bill.discount)}</div><div>Tax: ${money(bill.tax)}</div><div class="total">TOTAL: ${money(bill.total)}</div><div>Payment: ${bill.paymentMethod}</div><div class="line"></div><div class="center">Thank you! Visit again.</div><script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
  }

  return <main className="pos-shell">
    <header className="topbar"><div><div className="brand">AANAND FAMILY RESTRO</div><div className="subbrand">Mandsaur • Main Outlet</div></div><div className="top-actions"><span className="cashier">Demo Cashier</span><button onClick={() => setShowHistory(!showHistory)} className="secondary">{showHistory ? "Back to POS" : "Bill History"}</button></div></header>
    {notice && <div className="notice">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {showHistory ? <section className="history"><div className="section-title"><div><h1>Bill History</h1><p>Completed restaurant bills</p></div></div>{bills.length === 0 ? <div className="empty">No completed bills yet.</div> : <div className="history-list">{bills.map((bill) => <article className="history-card" key={bill.id}><div><strong>#{bill.billNumber}</strong><span>{new Date(bill.createdAt).toLocaleString("en-IN")}</span></div><div><span>{bill.paymentMethod}</span><strong>{money(bill.total)}</strong><button onClick={() => printBill(bill)}>Print</button></div></article>)}</div>}</section> : <section className="workspace">
      <div className="menu-panel"><div className="section-title"><div><h1>Menu</h1><p>Select items to add to the bill</p></div><span className="item-count">{filtered.length} items</span></div><div className="categories">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? "active" : ""}>{item}</button>)}</div><div className="menu-grid">{filtered.map((item) => <button className="menu-card" key={item.id} onClick={() => addItem(item.id)}><span className="food-icon">🍽️</span><span className="food-name">{item.name}</span><span className="food-category">{item.category}</span><strong>{money(item.price)}</strong></button>)}</div></div>
      <aside className="bill-panel"><div className="bill-heading"><div><h2>Current Bill</h2><span>Bill #{nextBill}</span></div>{cart.length > 0 && <button className="clear" onClick={() => {setCart([]);setDiscount(0)}}>Clear</button>}</div><div className="cart">{cart.length === 0 ? <div className="cart-empty"><span>🧾</span><strong>No items added</strong><small>Select food from the menu</small></div> : cart.map((item) => <div className="cart-row" key={item.id}><div className="cart-info"><strong>{item.name}</strong><span>{money(item.price)} each</span></div><div className="qty"><button onClick={() => changeQuantity(item.id, -1)}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}>+</button></div><strong className="row-total">{money(item.price * item.quantity)}</strong></div>)}</div><div className="bill-bottom"><label>Discount <input type="number" min="0" value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value) || 0)} placeholder="₹ 0" /></label><div className="payment-label">Payment Method</div><div className="payments">{(["Cash", "UPI", "Card"] as PaymentMethod[]).map((method) => <button key={method} onClick={() => setPayment(method)} className={payment === method ? "selected" : ""}>{method}</button>)}</div><div className="totals"><div><span>Subtotal</span><b>{money(totals.subtotal)}</b></div><div><span>Discount</span><b>− {money(totals.discount)}</b></div><div><span>GST (5%)</span><b>{money(totals.tax)}</b></div><div className="grand"><span>Total</span><b>{money(totals.total)}</b></div></div><div className="bill-actions"><button className="print" disabled={!cart.length} onClick={() => printBill()}>🖨 Print Bill</button><button className="complete" disabled={!cart.length} onClick={completeBill}>Complete Bill →</button></div></div></aside>
    </section>}
    <footer>Billing prototype • Print bills manually • Inventory deducts on completed bills</footer>
  </main>;
}
