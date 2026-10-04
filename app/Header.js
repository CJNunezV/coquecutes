"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const WA = "51962167068";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const menus = [
  {
    label: "Pokemon",
    items: [
      { label: "Cases", href: "/#catalogo", emoji: "📦" },
      { label: "Cartas sueltas", href: "/#cartas-sueltas", emoji: "🃏" },
      { label: "Productos sellados", href: "/#sellados", emoji: "🎁" },
    ],
  },
  {
    label: "Proxys",
    items: [
      { label: "Cartas sueltas", href: "/#proxys-sueltas", emoji: "🃏" },
      { label: "Extended Art", href: "/#proxys-extended-art", emoji: "🎨" },
      { label: "Personalizados", href: "/#proxys-personalizados", emoji: "✨" },
      { label: "Decks", href: "/#proxys-decks", emoji: "📚" },
    ],
  },
];

export default function Header() {
  const [totalItems, setTotalItems] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const updateItemsCount = () => {
    try {
      const savedCart = localStorage.getItem("coquecutes_cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        setTotalItems(cart.reduce((acc, item) => acc + item.quantity, 0));
      } else {
        setTotalItems(0);
      }
    } catch {
      setTotalItems(0);
    }
  };

  useEffect(() => {
    updateItemsCount();
    window.addEventListener("cartUpdate", updateItemsCount);
    return () => window.removeEventListener("cartUpdate", updateItemsCount);
  }, []);

  // La lupa lleva al buscador del hero (o al catálogo si estás en otra página)
  const goSearch = () => {
    const input = document.getElementById("hero-search");
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => input.focus(), 400);
    } else {
      window.location.href = "/#buscar";
    }
  };

  return (
    <>
      <style>{`
        .hd-link { color:#1f2937; text-decoration:none; font-weight:600; font-size:15px; padding:8px 4px; position:relative; transition:color .2s; white-space:nowrap; }
        .hd-link:hover { color:#7c3aed; }
        .hd-link::after { content:""; position:absolute; left:4px; right:4px; bottom:2px; height:2px; background:#7c3aed; transform:scaleX(0); transition:transform .25s; border-radius:2px; }
        .hd-link:hover::after { transform:scaleX(1); }
        .hd-trigger { background:none; border:none; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:5px; }
        .hd-menu { position:absolute; top:100%; left:-12px; min-width:230px; padding:10px; margin-top:6px; background:#fff; border:1px solid #ede9fe; border-radius:16px; box-shadow:0 18px 40px rgba(76,29,149,0.18); opacity:0; visibility:hidden; transform:translateY(-6px); transition:opacity .2s, transform .2s, visibility .2s; z-index:200; }
        .hd-menu::before { content:""; position:absolute; top:-12px; left:0; right:0; height:12px; }
        .hd-menu.is-open { opacity:1; visibility:visible; transform:translateY(0); }
        .hd-menu-item { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; color:#1f2937; text-decoration:none; font-weight:600; font-size:15px; transition:background .15s, color .15s; }
        .hd-menu-item:hover { background:#f5f3ff; color:#7c3aed; }
        .hd-menu-emoji { width:34px; height:34px; display:flex; align-items:center; justify-content:center; background:#f5f3ff; border-radius:10px; font-size:18px; }
        .hd-icon { background:none; border:none; cursor:pointer; color:#1f2937; padding:8px; display:flex; border-radius:50%; transition:background .2s,color .2s; }
        .hd-icon:hover { background:#f5f3ff; color:#7c3aed; }
        .hd-sell { color:#7c3aed; text-decoration:none; font-weight:700; font-size:14px; padding:9px 16px; border:1.5px solid #7c3aed; border-radius:999px; white-space:nowrap; transition:all .2s; }
        .hd-sell:hover { background:#7c3aed; color:#fff; }
        @media (max-width: 900px) { .hd-hide-md { display:none !important; } }
        @media (max-width: 600px) { .hd-hide-sm { display:none !important; } .hd-logo { height:52px !important; } .hd-cart-text { display:none; } }
      `}</style>
      <header
        style={{
          padding: "10px 24px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          gap: "28px",
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img className="hd-logo" src="/logo.png" alt="Coquecutes" style={{ height: "64px", width: "auto", display: "block" }} />
        </Link>

        {/* Izquierda: categorías */}
        <nav style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          {menus.map((m) => (
            <div
              key={m.label}
              ref={openMenu === m.label ? menuRef : null}
              style={{ position: "relative" }}
              onMouseEnter={() => setOpenMenu(m.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                type="button"
                className="hd-link hd-trigger"
                onClick={() => setOpenMenu((o) => (o === m.label ? null : m.label))}
                aria-haspopup="true"
                aria-expanded={openMenu === m.label}
              >
                {m.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform .25s", transform: openMenu === m.label ? "rotate(180deg)" : "none" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`hd-menu ${openMenu === m.label ? "is-open" : ""}`}>
                {m.items.map((it) => (
                  <Link key={it.label} href={it.href} className="hd-menu-item" onClick={() => setOpenMenu(null)}>
                    <span className="hd-menu-emoji">{it.emoji}</span>
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Derecha */}
        <a className="hd-link hd-hide-md" href={waLink("Hola Coquecutes, quiero hacer una consulta")} target="_blank" rel="noopener noreferrer">
          Contáctanos
        </a>
        <a className="hd-sell hd-hide-md" href={waLink("Hola Coquecutes, quiero vender mis productos con ustedes")} target="_blank" rel="noopener noreferrer">
          Vender tus Productos
        </a>

        <button className="hd-icon" onClick={goSearch} aria-label="Buscar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <Link
          href="/checkout"
          aria-label="Ir a pagar"
          style={{
            backgroundColor: totalItems > 0 ? "#7c3aed" : "#a78bfa",
            color: "#ffffff",
            padding: "10px 16px",
            borderRadius: "20px",
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            pointerEvents: totalItems > 0 ? "auto" : "none",
            transition: "background .2s",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <span className="hd-cart-text">Ir a pagar {totalItems > 0 && `(${totalItems})`}</span>
        </Link>
      </header>
    </>
  );
}