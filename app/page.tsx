'use client';

import { useState } from 'react';

const nav = ['Dashboard','POS Billing','Orders','KOT / Kitchen','Tables','Menu','Inventory','Purchases','Expenses','Customers','Reports','Staff','Settings'];
const stats = [['Today’s Sales','₹48,650','+12.4%'],['Today’s Orders','126','+8.1%'],['Active Tables','18 / 32','6 pending'],['Estimated Profit','₹19,420','39.9% margin']];

export default function Home() {
  const [active,setActive]=useState('Dashboard');
  return <div className="shell">
    <aside className="sidebar"><div className="brand">ANAND FAMILY RESTO<small>Restaurant POS & Management</small></div><div className="nav">{nav.map((n,i)=><button key={n} className={active===n?'active':''} onClick={()=>setActive(n)}>{['⌂','▣','◉','▤','▦','☷','◈','▰','₹','♙','▥','♟','⚙'][i]}&nbsp;&nbsp; {n}</button>)}</div></aside>
    <main className="main"><header className="top"><div><h1>{active}</h1><p>Central control for all Aanand Family Resto outlets</p></div><select className="outlet" defaultValue="all"><option value="all">All Outlets</option><option>ANAND-MDS — Mandsaur</option><option>ANAND-NIM — Neemuch</option><option>ANAND-RATLAM — Ratlam</option></select></header>
      {active==='Dashboard'?<>
      <section className="cards">{stats.map(([a,b,c])=><div className="card" key={a}><div className="label">{a}</div><div className="value">{b}</div><div className="delta">{c}</div></div>)}</section>
      <section className="grid"><div className="panel"><h2>Outlet Sales</h2><div className="bars">{[['Mandsaur','₹22,400','92'],['Neemuch','₹15,850','65'],['Ratlam','₹10,400','43']].map(([a,b,c])=><div className="barrow" key={a}><span>{a}</span><div className="track"><div className="fill" style={{width:c+'%'}}/></div><strong>{b}</strong></div>)}</div></div>
      <div className="panel"><h2>Live Operations</h2><div className="list"><div className="item"><span>Pending KOTs</span><span className="pill">7</span></div><div className="item"><span>Low stock items</span><span className="pill">4</span></div><div className="item"><span>Online orders</span><span className="pill">3</span></div><div className="item"><span>Open tables</span><strong>18</strong></div></div></div></section>
      <section className="grid"><div className="panel"><h2>Top Selling Items</h2><div className="list">{[['Paneer Butter Masala','42 sold','₹7,560'],['Tandoori Roti','118 sold','₹5,900'],['Dal Tadka','36 sold','₹4,680'],['Veg Spring Roll','31 sold','₹3,720']].map(x=><div className="item" key={x[0]}><span>{x[0]} <small style={{color:'#687386'}}>{x[1]}</small></span><strong>{x[2]}</strong></div>)}</div></div><div className="panel"><h2>Quick Actions</h2><div className="quick"><button onClick={()=>setActive('POS Billing')}>New Bill</button><button onClick={()=>setActive('Orders')}>Orders</button><button onClick={()=>setActive('KOT / Kitchen')}>Kitchen</button><button onClick={()=>setActive('Inventory')}>Stock</button></div></div></section>
      </>:<section className="panel"><h2>{active}</h2><p style={{color:'#687386'}}>This module is part of the Aanand Family Resto platform and is ready for the next implementation phase.</p></section>}
    </main></div>;
}
