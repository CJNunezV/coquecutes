"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "../data/products";

const floating = [
  { src: "/team-rocket-png.png", w: 210, top: "2%", left: "8%", rot: -8, delay: "0s" },
  { src: "/ultra-ball-png.png", w: 190, top: "0%", left: "56%", rot: 7, delay: "0.8s" },
  { src: "/premier-ball-png.png", w: 180, top: "46%", left: "0%", rot: 5, delay: "1.4s" },
  { src: "/pokebola-png.png", w: 200, top: "50%", left: "40%", rot: -6, delay: "0.4s" },
  { src: "/dispensador-png.png", w: 150, top: "38%", left: "76%", rot: 9, delay: "1.1s" },
];

const badges = ["Hecho en Perú", "Envíos a todo el país", "Pago con Yape / Plin"];

export default function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim().toLowerCase();
    if (!term) return;
    const match = products.find((p) => p.name.toLowerCase().includes(term));
    if (match) router.push(`/producto/${match.slug}`);
    else document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="buscar"
      className="zh-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "32px",
        border: "1px solid #ede9fe",
        marginBottom: "48px",
        background:
          "radial-gradient(900px 400px at 85% 20%, rgba(236,72,153,0.18), transparent 60%), radial-gradient(800px 500px at 10% 90%, rgba(124,58,237,0.20), transparent 60%), linear-gradient(135deg, #1e1b4b 0%, #2e1065 55%, #4c1d95 100%)",
      }}
    >
      <style>{`
        .zh-grid { display:grid; grid-template-columns: 1.05fr 1fr; gap:24px; align-items:center; padding:56px 48px; }
        .zh-float { position:absolute; filter: drop-shadow(0 18px 24px rgba(0,0,0,0.35)); animation: zhFloat 6s ease-in-out infinite; }
        @keyframes zhFloat { 0%,100% { transform: translateY(0) rotate(var(--r)); } 50% { transform: translateY(-14px) rotate(var(--r)); } }
        .zh-badge { display:inline-flex; align-items:center; gap:8px; color:#e9d5ff; font-size:13px; font-weight:600; }
        .zh-badge::before { content:"✓"; display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; background:#ec4899; color:#fff; font-size:12px; }
        .zh-cta { display:inline-block; background:linear-gradient(90deg,#ec4899,#7c3aed); color:#fff; padding:16px 36px; border-radius:16px; font-weight:800; font-size:16px; text-decoration:none; box-shadow:0 10px 28px rgba(236,72,153,0.4); transition:transform .2s, box-shadow .2s; }
        .zh-cta:hover { transform: translateY(-2px); box-shadow:0 14px 34px rgba(236,72,153,0.5); }
        .zh-search { display:flex; align-items:center; background:#fff; border-radius:14px; padding:6px 6px 6px 16px; max-width:460px; box-shadow:0 8px 24px rgba(0,0,0,0.25); }
        .zh-search input { flex:1; border:none; outline:none; font-size:15px; padding:10px 8px; background:transparent; color:#1f2937; min-width:0; }
        .zh-search button { border:none; background:#7c3aed; color:#fff; width:42px; height:42px; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .zh-visual { position:relative; height:420px; }
        @media (max-width: 860px) {
          .zh-grid { grid-template-columns:1fr; padding:36px 22px; }
          .zh-visual { height:340px; }
          .zh-float { width:44% !important; }
        }
        @media (prefers-reduced-motion: reduce) { .zh-float { animation:none; } }
      `}</style>

      <div className="zh-grid">
        <div>
          <span className="hero-badge" style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "#f5d0fe", fontSize: "13px", fontWeight: 700, padding: "6px 14px", borderRadius: "20px", marginBottom: "18px", border: "1px solid rgba(255,255,255,0.2)" }}>
            Coquecutes · Impresión 3D hecha en Perú
          </span>
          <h1 className="hero-title" style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 900, color: "#ffffff", margin: "0 0 16px 0", lineHeight: 1.1 }}>
            Tu mejor colección de <span style={{ background: "linear-gradient(90deg,#f9a8d4,#c4b5fd)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>cases para toploaders</span>
          </h1>
          <p className="hero-desc" style={{ fontSize: "17px", color: "#e9d5ff", margin: "0 0 22px 0", lineHeight: 1.6, maxWidth: "480px" }}>
            Cada case de Coquecutes se diseña e imprime a medida para proteger y lucir tus cartas más valiosas.
          </p>
          <div className="hero-desc" style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", marginBottom: "26px" }}>
            {badges.map((b) => (<span key={b} className="zh-badge">{b}</span>))}
          </div>
          <div className="hero-cta" style={{ marginBottom: "22px" }}>
            <a href="#catalogo" className="zh-cta">Ver catálogo</a>
          </div>
          <form className="zh-search hero-cta" onSubmit={onSearch}>
            <input id="hero-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca tu case: Ultra Ball, Team Rocket…" aria-label="Buscar productos" />
            <button type="submit" aria-label="Buscar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
          </form>
        </div>

        <div className="zh-visual" aria-hidden="true">
          {floating.map((f) => (
            <img key={f.src} src={f.src} alt="" className="zh-float" style={{ width: f.w, top: f.top, left: f.left, "--r": `${f.rot}deg`, animationDelay: f.delay }} />
          ))}
        </div>
      </div>
    </section>
  );
}
