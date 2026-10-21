"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCart, setQuantity, removeItem, cartCount, cartTotal, money } from "./cart";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [justAdded, setJustAdded] = useState(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    const refresh = () => setCart(getCart());
    const onAdded = (e) => {
      setCart(getCart());
      setJustAdded(e.detail?.name || null);
      setOpen(true);
    };
    const onOpen = () => {
      setCart(getCart());
      setJustAdded(null);
      setOpen(true);
    };
    refresh();
    window.addEventListener("cartUpdate", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("cartAdded", onAdded);
    window.addEventListener("cartOpen", onOpen);
    return () => {
      window.removeEventListener("cartUpdate", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("cartAdded", onAdded);
      window.removeEventListener("cartOpen", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => closeBtn.current && closeBtn.current.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const count = cartCount(cart);
  const total = cartTotal(cart);

  return (
    <>
      <style>{`
        .cd-back{position:fixed;inset:0;background:rgba(30,27,75,.45);backdrop-filter:blur(2px);z-index:2000;opacity:0;pointer-events:none;transition:opacity .25s}
        .cd-back.on{opacity:1;pointer-events:auto}
        .cd-panel{position:fixed;top:0;right:0;height:100%;width:min(420px,100%);background:#fff;z-index:2001;display:flex;flex-direction:column;transform:translateX(105%);transition:transform .3s cubic-bezier(.16,1,.3,1);box-shadow:-20px 0 50px rgba(76,29,149,.18)}
        .cd-panel.on{transform:none}
        .cd-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #f3f4f6}
        .cd-thumb{width:68px;height:68px;border-radius:12px;background:#f5f3ff;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:26px}
        .cd-thumb img{width:100%;height:100%;object-fit:cover}
        .cd-q{display:inline-flex;align-items:center;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}
        .cd-q button{width:34px;height:34px;border:none;background:#fff;font-size:17px;font-weight:700;color:#4c1d95;cursor:pointer}
        .cd-q button:hover{background:#f5f3ff}
        .cd-q span{min-width:28px;text-align:center;font-weight:700;font-size:14px}
        .cd-btn{display:block;width:100%;text-align:center;border:none;border-radius:14px;padding:15px;font-weight:800;font-size:15px;text-decoration:none;cursor:pointer;font-family:inherit}
        .cd-btn.main{background:#7c3aed;color:#fff;box-shadow:0 6px 16px rgba(124,58,237,.3)}
        .cd-btn.main:hover{background:#6d28d9}
        .cd-btn.ghost{background:#fff;color:#6d28d9;border:1.5px solid #ddd6fe;margin-top:10px}
      `}</style>
      <div className={`cd-back ${open ? "on" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`cd-panel ${open ? "on" : ""}`} role="dialog" aria-modal="true" aria-label="Tu carrito" aria-hidden={!open}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "#1e1b4b" }}>Tu carrito {count > 0 && <span style={{ color: "#7c3aed" }}>({count})</span>}</h2>
          <button ref={closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar carrito" style={{ border: "none", background: "#f5f3ff", width: 38, height: 38, borderRadius: "50%", cursor: "pointer", fontSize: 18, color: "#4c1d95" }}>✕</button>
        </div>

        {justAdded && cart.length > 0 && (
          <div style={{ margin: "14px 20px 0", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 600 }}>
            ✓ Añadido: {justAdded}
          </div>
        )}

        {cart.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32, gap: 8 }}>
            <div style={{ fontSize: 46 }}>🛒</div>
            <p style={{ margin: 0, fontWeight: 800, color: "#1e1b4b", fontSize: 18 }}>Tu carrito está vacío</p>
            <p style={{ margin: "0 0 14px", color: "#6b7280", fontSize: 14 }}>Mira nuestros cases, cartas y proxys.</p>
            <Link href="/catalogo" onClick={() => setOpen(false)} className="cd-btn main" style={{ width: "auto", padding: "13px 26px" }}>Ver catálogo</Link>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
              {cart.map((it) => (
                <div className="cd-item" key={it.id}>
                  <div className="cd-thumb">{it.image ? <img src={it.image} alt="" /> : "🃏"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1f2937", lineHeight: 1.3 }}>{it.name}</p>
                    <p style={{ margin: "3px 0 8px", color: "#6b7280", fontSize: 13 }}>{money(it.price)} c/u</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div className="cd-q">
                        <button onClick={() => setQuantity(it.id, it.quantity - 1)} aria-label={`Quitar una unidad de ${it.name}`}>−</button>
                        <span>{it.quantity}</span>
                        <button onClick={() => setQuantity(it.id, it.quantity + 1)} aria-label={`Añadir una unidad de ${it.name}`}>+</button>
                      </div>
                      <strong style={{ color: "#7c3aed", fontSize: 15 }}>{money(it.price * it.quantity)}</strong>
                    </div>
                  </div>
                  <button onClick={() => removeItem(it.id)} aria-label={`Quitar ${it.name} del carrito`} title="Quitar" style={{ alignSelf: "flex-start", border: "none", background: "none", color: "#9ca3af", cursor: "pointer", fontSize: 16, padding: 4 }}>🗑</button>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 20px 20px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: "#4b5563" }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#7c3aed" }}>{money(total)}</span>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>El lugar de entrega lo eliges en el siguiente paso.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="cd-btn main">Finalizar compra →</Link>
              <button className="cd-btn ghost" onClick={() => setOpen(false)}>Seguir comprando</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
