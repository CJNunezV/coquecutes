"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { products } from "../data/products";

const WA = "51962167068";

const floating = [
  { src: "/team-rocket-png.png", w: 210, top: "2%", left: "8%", rot: -8, delay: "0s" },
  { src: "/ultra-ball-png.png", w: 190, top: "0%", left: "56%", rot: 7, delay: "0.8s" },
  { src: "/premier-ball-png.png", w: 180, top: "46%", left: "0%", rot: 5, delay: "1.4s" },
  { src: "/pokebola-png.png", w: 200, top: "50%", left: "40%", rot: -6, delay: "0.4s" },
  { src: "/dispensador-png.png", w: 150, top: "38%", left: "76%", rot: 9, delay: "1.1s" },
];

// Tarjetas decorativas para la slide de Proxys (luego se pueden cambiar por fotos reales)
const proxyCards = [
  { top: "8%", left: "10%", rot: -10, grad: "linear-gradient(135deg,#f9a8d4,#a78bfa)", delay: "0s" },
  { top: "4%", left: "50%", rot: 6, grad: "linear-gradient(135deg,#fde68a,#f472b6)", delay: "0.7s" },
  { top: "40%", left: "28%", rot: -3, grad: "linear-gradient(135deg,#93c5fd,#c084fc)", delay: "1.2s" },
  { top: "36%", left: "64%", rot: 11, grad: "linear-gradient(135deg,#86efac,#60a5fa)", delay: "0.4s" },
];

const slides = [
  {
    id: "cases",
    tag: "Coquecutes · Impresión 3D hecha en Perú",
    title: (<>Tu mejor colección de <span className="zh-grad">cases para toploaders</span></>),
    desc: "Cada case de Coquecutes se diseña e imprime a medida para proteger y lucir tus cartas más valiosas.",
    badges: ["Hecho en Perú", "Envíos a todo el país", "Pago con Yape / Plin"],
    cta: { label: "Ver catálogo", href: "/catalogo" },
  },
  {
    id: "proxys",
    tag: "Coquecutes · Proxys",
    title: (<>Proxys de tus cartas favoritas, <span className="zh-grad">listos para jugar</span></>),
    desc: "Completa tu mazo o arma tu colección sin gastar de más. Escríbenos y te cotizamos.",
    badges: ["Impresión de calidad", "Envíos a todo el país", "Pedidos por WhatsApp"],
    cta: {
      label: "Ver proxys",
      href: "/proxys",
    },
  },
];

export default function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  // Cambio automático cada 7s (se detiene al pasar el mouse)
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused]);

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim().toLowerCase();
    if (!term) return;
    const match = products.find((p) => p.name.toLowerCase().includes(term));
    if (match) router.push(`/producto/${match.slug}`);
    else document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) setActive((a) => (dx < 0 ? (a + 1) % slides.length : (a - 1 + slides.length) % slides.length));
    touchX.current = null;
  };

  return (
    <section
      id="buscar"
      className="zh-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
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
        .zh-stage { display:grid; }
        .zh-slide { grid-area:1/1; display:grid; grid-template-columns:1.05fr 1fr; gap:24px; align-items:center; padding:56px 48px 76px; opacity:0; visibility:hidden; transform:translateX(30px); transition:opacity .6s ease, transform .6s ease, visibility .6s; }
        .zh-slide.is-active { opacity:1; visibility:visible; transform:translateX(0); }
        .zh-float { position:absolute; filter: drop-shadow(0 18px 24px rgba(0,0,0,0.35)); animation: zhFloat 6s ease-in-out infinite; }
        .zh-pcard { position:absolute; width:150px; aspect-ratio:63/88; border-radius:12px; border:3px solid rgba(255,255,255,0.85); box-shadow:0 18px 24px rgba(0,0,0,0.35); animation: zhFloat 6s ease-in-out infinite; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:13px; letter-spacing:2px; color:rgba(255,255,255,0.9); }
        @keyframes zhFloat { 0%,100% { transform: translateY(0) rotate(var(--r)); } 50% { transform: translateY(-14px) rotate(var(--r)); } }
        .zh-grad { background:linear-gradient(90deg,#f9a8d4,#c4b5fd); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .zh-badge { display:inline-flex; align-items:center; gap:8px; color:#e9d5ff; font-size:13px; font-weight:600; }
        .zh-badge::before { content:"✓"; display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; background:#ec4899; color:#fff; font-size:12px; }
        .zh-cta { display:inline-block; background:linear-gradient(90deg,#ec4899,#7c3aed); color:#fff; padding:16px 36px; border-radius:16px; font-weight:800; font-size:16px; text-decoration:none; box-shadow:0 10px 28px rgba(236,72,153,0.4); transition:transform .2s, box-shadow .2s; }
        .zh-cta:hover { transform: translateY(-2px); box-shadow:0 14px 34px rgba(236,72,153,0.5); }
        .zh-search { display:flex; align-items:center; background:#fff; border-radius:14px; padding:6px 6px 6px 16px; max-width:460px; box-shadow:0 8px 24px rgba(0,0,0,0.25); }
        .zh-search input { flex:1; border:none; outline:none; font-size:15px; padding:10px 8px; background:transparent; color:#1f2937; min-width:0; }
        .zh-search button { border:none; background:#7c3aed; color:#fff; width:42px; height:42px; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .zh-visual { position:relative; height:420px; }
        .zh-dots { position:absolute; left:0; right:0; bottom:22px; display:flex; justify-content:center; gap:10px; z-index:3; }
        .zh-dot { width:11px; height:11px; border-radius:999px; border:none; padding:0; cursor:pointer; background:rgba(255,255,255,0.4); transition:all .3s; }
        .zh-dot:hover { background:rgba(255,255,255,0.7); }
        .zh-dot.is-active { width:32px; background:#fff; }
        @media (max-width: 860px) {
          .zh-slide { grid-template-columns:1fr; padding:36px 22px 70px; }
          .zh-visual { height:340px; }
          .zh-float { width:44% !important; }
          .zh-pcard { width:100px; }
        }
        @media (prefers-reduced-motion: reduce) { .zh-float, .zh-pcard { animation:none; } .zh-slide { transition:none; } }
      `}</style>

      <div className="zh-stage">
        {slides.map((s, i) => (
          <div key={s.id} className={`zh-slide ${i === active ? "is-active" : ""}`} aria-hidden={i !== active}>
            <div>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "#f5d0fe", fontSize: "13px", fontWeight: 700, padding: "6px 14px", borderRadius: "20px", marginBottom: "18px", border: "1px solid rgba(255,255,255,0.2)" }}>
                {s.tag}
              </span>
              <h1 style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 900, color: "#ffffff", margin: "0 0 16px 0", lineHeight: 1.1 }}>
                {s.title}
              </h1>
              <p style={{ fontSize: "17px", color: "#e9d5ff", margin: "0 0 22px 0", lineHeight: 1.6, maxWidth: "480px" }}>
                {s.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", marginBottom: "26px" }}>
                {s.badges.map((b) => (<span key={b} className="zh-badge">{b}</span>))}
              </div>
              <div style={{ marginBottom: "22px" }}>
                <a href={s.cta.href} className="zh-cta" {...(s.cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {s.cta.label}
                </a>
              </div>
              <form className="zh-search" onSubmit={onSearch}>
                <input id={i === active ? "hero-search" : undefined} tabIndex={i === active ? 0 : -1} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca tu case: Ultra Ball, Team Rocket…" aria-label="Buscar productos" />
                <button type="submit" aria-label="Buscar" tabIndex={i === active ? 0 : -1}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </button>
              </form>
            </div>

            <div className="zh-visual" aria-hidden="true">
              {s.id === "cases"
                ? floating.map((f) => (
                    <img key={f.src} src={f.src} alt="" className="zh-float" style={{ width: f.w, top: f.top, left: f.left, "--r": `${f.rot}deg`, animationDelay: f.delay }} />
                  ))
                : proxyCards.map((c, k) => (
                    <div key={k} className="zh-pcard" style={{ top: c.top, left: c.left, background: c.grad, "--r": `${c.rot}deg`, animationDelay: c.delay }}>
                      PROXY
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>

      <div className="zh-dots" role="tablist" aria-label="Cambiar slide">
        {slides.map((s, i) => (
          <button key={s.id} role="tab" aria-selected={i === active} aria-label={i === 0 ? "Cases" : "Proxys"} className={`zh-dot ${i === active ? "is-active" : ""}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </section>
  );
}