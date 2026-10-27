"use client";
import { addToCart as addCartItem } from "../cart";
import { useState, useEffect, useRef, useContext, createContext } from "react";
import Link from "next/link";
import { singles, extendedPacks, customTypes, customExamples, decks, proxyTypes, proxyInfo } from "../../data/proxys";
import { extendedSingles, extendedEvolutions, EXT_PRICE, EVO_PRICE, SPRITE } from "../../data/extendedArt";

const WA = "51962167068";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const tabs = [
  { id: "sueltas", label: "Cartas sueltas", emoji: "🃏" },
  { id: "extended-art", label: "Extended Art", emoji: "🎨" },
  { id: "personalizados", label: "Personalizados", emoji: "✨" },
  { id: "decks", label: "Decks", emoji: "📚" },
];

const gradBg = (g) => `linear-gradient(145deg, ${g[0]}, ${g[1]})`;

function useCart() {
  const [added, setAdded] = useState(null);
  const add = (item) => {
    addCartItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    setAdded(item.id);
    setTimeout(() => setAdded((a) => (a === item.id ? null : a)), 1400);
  };
  return { added, add };
}

/* ---------- Tipo de proxy (en frío / con crema / al calor) ---------- */
const typeOf = (id) => proxyTypes.find((t) => t.id === id) || proxyTypes[0];
// Devuelve el ítem del carrito: id único por tipo, nombre con el tipo y precio + extra
const withType = (item, typeId, name) => {
  const t = typeOf(typeId);
  return { id: `${item.id}-${t.id}`, name: `${name} · ${t.label}`, price: item.price + (t.extra || 0), image: item.image };
};
// Carta suelta: el precio depende del acabado (singlePrice)
const singleItem = (s, typeId) => {
  const t = typeOf(typeId);
  return { id: `${s.id}-${t.id}`, name: `Proxy ${s.name} (${s.set}) · ${t.label}`, price: t.singlePrice, image: s.image };
};
/* ---------- Contexto de la página: acabado por defecto + modal informativo ---------- */
const Ui = createContext({ defaultType: "frio", openInfo: () => {}, openQuick: () => {} });

function TypePicker({ value, onChange, showInfo = true, priceKey }) {
  const ui = useContext(Ui);
  const t = typeOf(value);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div className="px-types" role="radiogroup" aria-label="Tipo de proxy" style={{ marginBottom: "6px" }}>
        {proxyTypes.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={value === x.id} className={`px-type ${value === x.id ? "is-active" : ""}`} onClick={() => onChange(x.id)}>
            {x.label}{priceKey ? ` · S/${x[priceKey]}` : x.extra > 0 ? ` +S/${x.extra}` : ""}
          </button>
        ))}
      </div>
      {showInfo && (
        <button type="button" className="px-info" onClick={() => ui.openInfo(value, onChange)}>
          <span className="px-info-play">▶</span> Ver cómo queda «{t.label}»
        </button>
      )}
    </div>
  );
}

/* ---------- Video: archivo (.mp4/.webm) o YouTube / Vimeo ---------- */
function VideoBox({ type }) {
  const url = type.video || "";
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  const frame = { position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "16px", overflow: "hidden", background: "#0f0a2a" };
  if (yt) return <div style={frame}><iframe src={`https://www.youtube.com/embed/${yt[1]}?rel=0`} title={`Video ${type.label}`} allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div>;
  if (vimeo) return <div style={frame}><iframe src={`https://player.vimeo.com/video/${vimeo[1]}`} title={`Video ${type.label}`} allow="fullscreen; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div>;
  if (url) return <div style={frame}><video src={url} poster={type.poster || undefined} controls playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }} /></div>;
  return (
    <div style={{ ...frame, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "#e9d5ff", textAlign: "center", background: type.poster ? `url(${type.poster}) center/cover` : "linear-gradient(135deg,#1e1b4b,#4c1d95)" }}>
      <span style={{ fontSize: "44px" }}>{type.emoji || "🎬"}</span>
      <strong style={{ fontSize: "16px" }}>Video próximamente</strong>
      <span style={{ fontSize: "13px", opacity: 0.8, maxWidth: "280px" }}>Estamos grabando cómo queda el acabado «{type.label}».</span>
    </div>
  );
}

/* ---------- Modal base (Esc, clic afuera, bloquea el scroll) ---------- */
function Modal({ onClose, children, wide }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="px-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="px-modal" role="dialog" aria-modal="true" style={{ maxWidth: wide ? "980px" : "640px" }}>
        <button className="px-close" onClick={onClose} aria-label="Cerrar">✕</button>
        {children}
      </div>
    </div>
  );
}

/* ---------- Modal: de qué trata cada acabado + video ---------- */
function TypeModal({ typeId, onClose, onChoose }) {
  const [cur, setCur] = useState(typeId);
  const t = typeOf(cur);
  const rows = [["¿De qué trata?", t.desc], ["Así queda el acabado final", t.finish], ["Ideal para", t.bestFor]].filter(([, v]) => v);
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "26px 26px 24px" }}>
        <div className="px-types" style={{ marginBottom: "16px" }}>
          {proxyTypes.map((x) => (
            <button key={x.id} className={`px-type ${cur === x.id ? "is-active" : ""}`} onClick={() => setCur(x.id)}>{x.emoji} {x.label}</button>
          ))}
        </div>
        <VideoBox key={cur} type={t} />
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", margin: "18px 0 6px" }}>{t.emoji} Proxy {t.label}</h3>
        {rows.length === 0 && <p style={{ color: "#6b7280", margin: "0 0 14px" }}>Pronto agregaremos aquí la descripción de este acabado. Si tienes dudas, escríbenos y te mostramos fotos y videos por WhatsApp.</p>}
        {rows.map(([k, v]) => (
          <div key={k} style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7c3aed", letterSpacing: ".5px", textTransform: "uppercase" }}>{k}</div>
            <div style={{ color: "#374151", lineHeight: 1.6 }}>{v}</div>
          </div>
        ))}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
          <button className="px-btn px-btn-lg" style={{ flex: 1, minWidth: "200px" }} onClick={() => { onChoose(cur); onClose(); }}>
            Elegir «{t.label}»{t.extra > 0 ? ` (+S/${t.extra})` : ""}
          </button>
          <a className="px-ghost" href={waLink(`Hola Coquecutes, tengo una duda sobre el proxy ${t.label}`)} target="_blank" rel="noopener noreferrer">💬 Preguntar</a>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Guía de acabados (arriba de la página) ---------- */
function FinishGuide({ value, onPick, mode }) {
  const ui = useContext(Ui);
  return (
    <div className="px-guide">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#7c3aed", letterSpacing: "1px" }}>{mode === "info" ? "ACABADOS DISPONIBLES" : "PASO 1 · ELIGE TU ACABADO"}</div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>{mode === "info" ? "Mira el video de cada tipo para saber cómo queda. El acabado lo eliges al añadir tu carta." : "Mira el video de cada tipo para saber cómo queda. Luego elige tus cartas."}</div>
        </div>
      </div>
      <div className="px-guide-grid">
        {proxyTypes.map((t) => (
          <div key={t.id} className={`px-guide-card ${value === t.id ? "is-active" : ""}`}>
            <button className="px-guide-thumb" onClick={() => ui.openInfo(t.id)} aria-label={`Ver video ${t.label}`} style={{ background: t.poster ? `url(${t.poster}) center/cover` : "linear-gradient(135deg,#1e1b4b,#4c1d95)" }}>
              <span style={{ fontSize: "26px" }}>{t.emoji}</span>
              <span className="px-play">▶</span>
            </button>
            <div style={{ padding: "12px 14px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#1e1b4b", fontSize: "16px" }}>{t.label}</strong>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>{mode === "info" ? `S/${t.singlePrice} c/u` : t.extra > 0 ? `+S/${t.extra}` : "Precio base"}</span>
              </div>
              <div style={{ color: "#6b7280", fontSize: "13px", minHeight: "36px", margin: "4px 0 10px", lineHeight: 1.4 }}>{t.summary || "Toca ▶ para ver cómo queda."}</div>
              {mode === "info" ? (
                <button className="px-pick" onClick={() => ui.openInfo(t.id)}>▶ Ver cómo queda</button>
              ) : (
                <button className={`px-pick ${value === t.id ? "is-active" : ""}`} onClick={() => onPick(t.id)}>{value === t.id ? "✓ Elegido" : "Elegir este"}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Mini carta (63:88) ---------- */
function MiniCard({ grad, title, sub, image, style }) {
  return (
    <div style={{ aspectRatio: "63 / 88", borderRadius: "10px", border: "2.5px solid rgba(255,255,255,0.9)", background: image ? `url("${image}") center/cover` : gradBg(grad), boxShadow: "0 8px 18px rgba(30,27,75,0.25)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "8px", color: "#fff", ...style }}>
      {!image && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.55))" }} />}
      {title && <div style={{ position: "relative", fontWeight: 800, fontSize: "12px", lineHeight: 1.2 }}>{title}</div>}
      {sub && <div style={{ position: "relative", fontSize: "10px", opacity: 0.85 }}>{sub}</div>}
    </div>
  );
}

/* ---------- Vista rápida de una carta (grande, con efecto 3D y todo lo que recibes) ---------- */
function QuickView({ s, cart, startType, onClose }) {
  const ui = useContext(Ui);
  const [tid, setTid] = useState(startType);
  const [tilt, setTilt] = useState({ x: 0, y: 0, on: false });
  const t = typeOf(tid);
  const item = singleItem(s, tid);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 14, y: px * 14, on: true });
  };
  return (
    <Modal onClose={onClose} wide>
      <div className="px-quick">
        <div className="px-quick-img" onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0, on: false })}>
          <div style={{ aspectRatio: "63 / 88", height: "min(68vh, 560px)", maxWidth: "100%", borderRadius: "14px", background: s.image ? `url(${s.image}) center/cover` : gradBg(s.grad), boxShadow: "0 24px 50px rgba(30,27,75,0.4)", border: "3px solid #fff", transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: tilt.on ? "transform .08s" : "transform .4s", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${115 + tilt.y * 6}deg, transparent 35%, rgba(255,255,255,${tilt.on ? 0.28 : 0}) 50%, transparent 65%)`, transition: "opacity .3s", pointerEvents: "none" }} />
          </div>
          <div style={{ marginTop: "10px", fontSize: "12px", color: "#9ca3af" }}>Mueve el mouse sobre la carta ✨</div>
        </div>
        <div style={{ padding: "6px 4px" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#7c3aed", letterSpacing: "1px" }}>{s.set.toUpperCase()}</div>
          <h3 style={{ fontSize: "26px", fontWeight: 900, color: "#1e1b4b", margin: "2px 0 8px", lineHeight: 1.15 }}>{s.name}</h3>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#7c3aed", marginBottom: "14px" }}>S/{item.price.toFixed(2)}</div>

          <div style={{ fontSize: "12px", fontWeight: 800, color: "#1e1b4b", letterSpacing: ".5px", marginBottom: "6px" }}>ACABADO</div>
          <TypePicker value={tid} onChange={setTid} priceKey="singlePrice" />
          {t.summary && <p style={{ margin: "0 0 12px", color: "#4b5563", fontSize: "14px", lineHeight: 1.5 }}>{t.summary}</p>}

          <div className="px-receive">
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#1e1b4b", letterSpacing: ".5px", marginBottom: "6px" }}>LO QUE RECIBES</div>
            <ul>
              <li>1 proxy de «{s.name}»</li>
              <li>Acabado: {t.label}</li>
              {proxyInfo.size && <li>{proxyInfo.size}</li>}
              {proxyInfo.shipping && <li>{proxyInfo.shipping}</li>}
            </ul>
            {proxyInfo.disclaimer && <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px", lineHeight: 1.5 }}>ℹ️ {proxyInfo.disclaimer}</div>}
          </div>

          <button className={`px-btn px-btn-lg ${cart.added === item.id ? "is-added" : ""}`} onClick={() => cart.add(item)} style={{ marginTop: "14px" }}>
            {cart.added === item.id ? "¡Añadido al carrito!" : `Añadir · S/${item.price.toFixed(2)}`}
          </button>
          {cart.added === item.id && (
            <a href="/checkout" className="px-ghost" style={{ display: "block", textAlign: "center", marginTop: "10px" }}>Ir a pagar →</a>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Modal: elegir acabado al añadir una carta suelta ---------- */
function AddModal({ s, cart, onClose }) {
  const ui = useContext(Ui);
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "26px 24px 24px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px", paddingRight: "30px" }}>
          <div style={{ width: "64px", flexShrink: 0 }}><MiniCard grad={s.grad} image={s.image} /></div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7c3aed", letterSpacing: "1px" }}>ELIGE TU ACABADO</div>
            <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#1e1b4b", margin: "2px 0 0", lineHeight: 1.2 }}>{s.name}</h3>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>{s.set}</div>
          </div>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          {proxyTypes.map((t) => {
            const item = singleItem(s, t.id);
            const done = cart.added === item.id;
            return (
              <div key={t.id} className="px-opt">
                <span style={{ fontSize: "26px" }}>{t.emoji}</span>
                <div className="px-opt-info">
                  <div style={{ fontWeight: 800, color: "#1e1b4b", fontSize: "16px", whiteSpace: "nowrap" }}>{t.label}</div>
                  <button type="button" className="px-info" style={{ whiteSpace: "nowrap" }} onClick={() => ui.openInfo(t.id)}><span className="px-info-play">▶</span> Ver cómo queda</button>
                </div>
                <strong className="px-opt-price">S/{t.singlePrice}</strong>
                <button className={`px-btn px-opt-btn ${done ? "is-added" : ""}`} onClick={() => cart.add(item)}>{done ? "✓ Añadido" : "Añadir"}</button>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
          <button className="px-ghost" style={{ flex: 1, cursor: "pointer", fontFamily: "inherit" }} onClick={onClose}>Seguir viendo</button>
          <a href="/checkout" className="px-ghost" style={{ flex: 1, background: "#f5f3ff", color: "#7c3aed", borderColor: "#c4b5fd" }}>Ir a pagar →</a>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Cartas sueltas ---------- */
function Singles({ cart }) {
  const ui = useContext(Ui);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(null);
  const list = singles.filter((s) => (s.name + s.set).toLowerCase().includes(q.trim().toLowerCase()));
  const minPrice = Math.min(...proxyTypes.map((t) => t.singlePrice));
  return (
    <div>
      <div className="px-search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(24); }} placeholder="Busca por carta o set…" aria-label="Buscar cartas" />
      </div>
      <div className="px-grid-cards">
        {list.map((s, idx) => (
          <div key={s.id} className="px-lift">
            <button className="px-cardbtn" onClick={() => ui.openQuick(s, ui.defaultType)} aria-label={`Ver ${s.name} en grande`}>
              <MiniCard grad={s.grad} image={s.image} title={s.name} sub={s.set} />
              {idx < 4 && !q && <span className="px-new">NUEVO</span>}
              <span className="px-zoom">🔍 Ver en grande</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 2px 10px" }}>
              <strong style={{ color: "#7c3aed", fontSize: "17px" }}>Desde S/{minPrice.toFixed(2)}</strong>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>por unidad</span>
            </div>
            <button className="px-btn" onClick={() => setAdding(s)}>Añadir</button>
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>
          No encontramos esa carta. <a href={waLink(`Hola Coquecutes, ¿pueden hacer el proxy de: ${q}?`)} target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed", fontWeight: 700 }}>Pídela por WhatsApp</a>
        </p>
      )}
      {adding && <AddModal s={adding} cart={cart} onClose={() => setAdding(null)} />}
    </div>
  );
}

/* ---------- Extended Art: arte 3x3, 8 cartas (sin la central) ---------- */
const tcgImg = (id) => `https://product-images.tcgplayer.com/fit-in/200x279/${id}.jpg`;
const localCard = (slug) => `/proxys/ExtendedArt/cartas/${slug}.jpg`;
const CenterCard = ({ id, c, hide, slug }) => (
  <div style={{ position: "absolute", left: `${c.left}%`, top: `${c.top}%`, width: `${c.w}%`, height: `${c.h}%`, border: "2.5px dashed rgba(255,255,255,0.95)", borderRadius: "6px", background: "rgba(10,8,30,0.35)", overflow: "hidden", pointerEvents: "none" }}>
    {(id || slug) && !hide && <img key={id || slug} src={id ? tcgImg(id) : localCard(slug)} alt="" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ animation: "pxFade .3s both", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
  </div>
);

const TW = 44, TH = 62;
function Thumb({ p }) {
  const box = { width: TW, height: TH, borderRadius: 8, flexShrink: 0, position: "relative", overflow: "hidden", background: p.t != null ? `url(${SPRITE.src}) -${(p.t % SPRITE.cols) * TW}px -${Math.floor(p.t / SPRITE.cols) * TH}px / ${SPRITE.cols * TW}px auto` : p.image ? `url(${p.image}) center/cover` : gradBg(p.grad) };
  return (
    <span style={box}>
      {p.t != null && <img src={`/proxys/ExtendedArt/final/t/${p.id.slice(3)}.webp`} alt="" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
    </span>
  );
}

function Extended({ cart }) {
  const [mode, setMode] = useState("single");
  const [selId, setSelId] = useState(null);
  const [q, setQ] = useState("");
  const [setF, setSetF] = useState("todos");
  const [limit, setLimit] = useState(24);
  const [bad, setBad] = useState({});
  const ui = useContext(Ui);
  const [own, setOwn] = useState(null);
  const type = own || ui.defaultType;
  const setType = setOwn;
  const singlesAll = [
    ...extendedPacks.map((p) => ({ ...p, set: "Destacados", card: null })),
    ...extendedSingles.map((p) => ({ ...p, price: EXT_PRICE })),
  ];
  const evoAll = extendedEvolutions.map((p) => ({ ...p, price: EVO_PRICE }));
  const all = mode === "single" ? singlesAll : evoAll;
  const sets = Array.from(new Set(all.map((p) => p.set)));
  const ql = q.trim().toLowerCase();
  const list = all.filter((p) => (setF === "todos" || p.set === setF) && (!ql || `${p.name} ${p.set}`.toLowerCase().includes(ql)));
  const pack = all.find((p) => p.id === selId) || list[0] || all[0];
  const evo = mode === "evo";
  const useFinal = pack.t != null && !bad[pack.id];
  const mainImg = useFinal ? `/proxys/ExtendedArt/final/${pack.id.slice(3)}.webp` : pack.image;
  const packItem = { ...withType(pack, type, evo ? `Extended Art ${pack.name} (6 cartas)` : `Extended Art ${pack.name} (8 cartas)`), image: mainImg };
  const switchMode = (m) => { setLimit(24); setMode(m); setSelId(null); setSetF("todos"); setQ(""); };
  return (
    <div className="px-ext">
      <div className="px-binder">
        <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px", color: "#c4b5fd", marginBottom: "12px", textAlign: "center" }}>{evo ? "LÍNEA EVOLUTIVA · 6 CARTAS" : "ARTE 3×3 · 8 CARTAS"}</div>
        {evo && <div style={{ textAlign: "center", marginBottom: "10px" }}><span style={{ display: "inline-block", background: "#1e1b4b", color: "#fff", fontSize: "12px", fontWeight: 800, padding: "7px 12px", borderRadius: "999px", border: "1.5px solid rgba(255,255,255,0.8)" }}>🚫 Cartas centrales no incluidas</span></div>}
        {pack.image ? (
          <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", lineHeight: 0 }}>
            <img key={mainImg} src={mainImg} alt={`Extended Art ${pack.name}`} decoding="async" onError={() => { if (pack.t != null) setBad((b) => ({ ...b, [pack.id]: 1 })); }} style={{ animation: "pxFade .25s both", width: "100%", height: "auto", display: "block" }} />
            {!useFinal && (evo
              ? pack.centers.map((c, i) => <CenterCard key={i} id={pack.cards[i]} c={c} />)
              : <CenterCard id={pack.card} slug={pack.id.slice(3)} c={pack.center || { left: 35.2, top: 34.5, w: 29.8, h: 30.4 }} />)}
            {!evo && <div style={{ position: "absolute", left: "50%", top: `${((pack.center || { top: 34.5 }).top) + ((pack.center || { h: 30.4 }).h) + 1.5}%`, transform: "translateX(-50%)", background: "#1e1b4b", color: "#fff", fontSize: "12px", fontWeight: 800, lineHeight: 1.2, padding: "7px 12px", borderRadius: "999px", whiteSpace: "nowrap", boxShadow: "0 6px 14px rgba(0,0,0,0.35)", border: "1.5px solid rgba(255,255,255,0.8)" }}>🚫 Carta central no incluida</div>}
            {evo && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }} />}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
            {Array.from({ length: 9 }).map((_, i) =>
              i === 4 ? (
                <div key={i} style={{ aspectRatio: "63 / 88", borderRadius: "10px", border: "2px dashed rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#e9d5ff", fontSize: "11px", fontWeight: 700, padding: "6px" }}>No incluida</div>
              ) : (
                <MiniCard key={pack.id + i} grad={pack.grad} style={{ animation: `pxPop .5s ${i * 0.05}s both` }} />
              )
            )}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 6px" }}>Elige tu Extended Art</h3>
        <div style={{ display: "flex", gap: "8px", margin: "0 0 12px" }}>
          <button onClick={() => switchMode("single")} className={`px-pack ${!evo ? "is-active" : ""}`} style={{ justifyContent: "center", fontWeight: 700 }}>1 carta (centro)</button>
          <button onClick={() => switchMode("evo")} className={`px-pack ${evo ? "is-active" : ""}`} style={{ justifyContent: "center", fontWeight: 700 }}>Línea evolutiva</button>
        </div>
        <p style={{ color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
          {evo ? <>Recibes las <strong>6 cartas</strong> de los costados. <strong>Las 3 cartas centrales no están incluidas.</strong></> : <>Recibes las <strong>8 cartas</strong> que rodean al centro del arte. <strong>La carta central no está incluida.</strong></>}
        </p>
        {all.length > 6 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
            <div className="px-search" style={{ margin: 0, flex: "1 1 160px", padding: "0 12px" }}>
              <input placeholder="Buscar carta…" value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: "9px 0", minWidth: 0 }} />
            </div>
            <select value={setF} onChange={(e) => { setSetF(e.target.value); setLimit(24); }} style={{ flex: "1 1 140px", border: "1.5px solid #ede9fe", borderRadius: "14px", padding: "9px 10px", fontFamily: "inherit", fontSize: "14px", background: "#fff" }}>
              <option value="todos">Todas las colecciones</option>
              {sets.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <div style={{ display: "grid", gap: "8px", marginBottom: "20px", maxHeight: "340px", overflowY: "auto", paddingRight: "4px" }}>
          {list.slice(0, limit).map((p) => (
            <button key={p.id} onClick={() => setSelId(p.id)} className={`px-pack ${pack.id === p.id ? "is-active" : ""}`}>
              <Thumb p={p} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: 700 }}>{p.name}<span style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}>{p.set}</span></span>
              <span style={{ color: "#7c3aed", fontWeight: 800 }}>S/{p.price}</span>
            </button>
          ))}
          {list.length > limit && <button className="px-pack" onClick={() => setLimit(limit + 24)} style={{ justifyContent: "center", fontWeight: 700, color: "#7c3aed" }}>Ver más ({list.length - limit})</button>}
          {list.length === 0 && <p style={{ color: "#6b7280", textAlign: "center", margin: "10px 0" }}>No encontramos ese arte. <a href={waLink(`Hola Coquecutes, ¿pueden hacer el Extended Art de: ${q}?`)} target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed", fontWeight: 700 }}>Pídelo por WhatsApp</a></p>}
        </div>
        <div style={{ fontSize: "13px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 8px", letterSpacing: ".5px" }}>TIPO DE PROXY</div>
        <TypePicker value={type} onChange={setType} />
        <button className={`px-btn px-btn-lg ${cart.added === packItem.id ? "is-added" : ""}`} onClick={() => cart.add(packItem)} style={{ marginTop: "14px" }}>
          {cart.added === packItem.id ? "¡Añadido!" : `Añadir · S/${packItem.price.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

/* ---------- Personalizados ---------- */
function Custom() {
  const [type, setType] = useState("graduacion");
  const [desc, setDesc] = useState("");
  const [filter, setFilter] = useState("todos");
  const [zoom, setZoom] = useState(null);
  const label = customTypes.find((t) => t.id === type)?.label;
  const shown = customExamples.filter((e) => filter === "todos" || e.cat === filter);
  const catLabel = (id) => customTypes.find((t) => t.id === id)?.label || "";
  const steps = [
    ["1", "Cuéntanos tu idea", "Elige la ocasión y descríbela. Si quieres tu foto en la carta, la envías por WhatsApp."],
    ["2", "Te cotizamos", "Respondemos por WhatsApp con precio y plazo."],
    ["3", "Imprimimos y enviamos", "Lo recibes en todo el Perú."],
  ];
  const chooseLike = (ex) => {
    setType(ex.cat);
    setDesc((d) => d || `Quiero una carta como el ejemplo "${ex.title}".`);
    setZoom(null);
    const el = document.getElementById("px-custom-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <div>
      <div className="px-custom">
        <div id="px-custom-form">
          <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 16px" }}>¿Para qué ocasión?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "18px" }}>
            {customTypes.map((t, i) => (
              <button key={t.id} onClick={() => setType(t.id)} className={`px-pack ${type === t.id ? "is-active" : ""}`} style={{ flexDirection: "column", padding: "16px 10px", gap: "6px", gridColumn: i === customTypes.length - 1 && customTypes.length % 2 ? "1 / -1" : "auto" }}>
                <span style={{ fontSize: "28px" }}>{t.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: "14px" }}>{t.label}</span>
              </button>
            ))}
          </div>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Cuéntanos: para quién es, personajes favoritos, estilo, cantidad…" style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e5e7eb", borderRadius: "14px", padding: "14px", fontSize: "16px", fontFamily: "inherit", resize: "vertical", outline: "none", marginBottom: "14px" }} />
          <a className="px-btn px-btn-lg" style={{ display: "block", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }} href={waLink(`Hola Coquecutes, quiero una carta personalizada.\nOcasión: ${label}\nIdea: ${desc || "(te la cuento por aquí)"}`)} target="_blank" rel="noopener noreferrer">
            Pedir cotización por WhatsApp
          </a>
        </div>
        <div style={{ display: "grid", gap: "14px", alignContent: "start" }}>
          {steps.map(([n, t, d]) => (
            <div key={n} style={{ display: "flex", gap: "14px", background: "#fff", border: "1px solid #ede9fe", borderRadius: "18px", padding: "18px" }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#7c3aed)", color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
              <div><div style={{ fontWeight: 800, color: "#1e1b4b" }}>{t}</div><div style={{ color: "#6b7280", fontSize: "14px", marginTop: 2 }}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Galería de ejemplos */}
      <div style={{ marginTop: "48px" }}>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 4px" }}>Ejemplos de nuestros trabajos</h3>
        <p style={{ color: "#6b7280", margin: "0 0 16px", fontSize: "14px" }}>Así quedan las cartas personalizadas. Toca una para verla en grande o pedir una igual.</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
          {[{ id: "todos", label: "Todos", emoji: "✨" }, ...customTypes.filter((t) => customExamples.some((e) => e.cat === t.id))].map((t) => (
            <button key={t.id} onClick={() => setFilter(t.id)} className={`px-type ${filter === t.id ? "is-active" : ""}`}>{t.emoji} {t.label}</button>
          ))}
        </div>
        <div className="px-ex-grid">
          {shown.map((ex) => (
            <button key={ex.id} className="px-ex" onClick={() => setZoom(ex)} aria-label={`Ver ejemplo: ${ex.title}`}>
              <img src={ex.image} alt={ex.title} loading="lazy" />
              <span className="px-ex-tag">{catLabel(ex.cat)}</span>
            </button>
          ))}
        </div>
      </div>

      {zoom && (
        <Modal onClose={() => setZoom(null)}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "6px" }}>
            <img src={zoom.image} alt={zoom.title} style={{ maxHeight: "68vh", maxWidth: "100%", borderRadius: "14px", boxShadow: "0 14px 34px rgba(30,27,75,.3)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, color: "#1e1b4b", fontSize: "17px" }}>{zoom.title}</div>
              <div style={{ color: "#7c3aed", fontWeight: 700, fontSize: "13px" }}>{catLabel(zoom.cat)}</div>
            </div>
            <button className="px-btn px-btn-lg" onClick={() => chooseLike(zoom)}>Quiero una igual</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Decks ---------- */
function Decks({ cart }) {
  return (
    <div className="px-grid-decks">
      {decks.map((d) => (
        <div key={d.id} className="px-lift" style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: "22px", padding: "20px", display: "flex", flexDirection: "column" }}>
          {/* mazo apilado */}
          <div style={{ position: "relative", height: "190px", marginBottom: "18px" }}>
            {[2, 1, 0].map((k) => (
              <MiniCard key={k} grad={d.grad} image={d.images ? encodeURI(d.images[k] || d.images[0]) : undefined} title={!d.images && k === 0 ? d.name : undefined} sub={!d.images && k === 0 ? d.style : undefined} style={{ position: "absolute", height: "100%", left: `calc(50% - 68px + ${(k - 1) * 22}px)`, transform: `rotate(${(k - 1) * 7}deg)`, opacity: k === 0 ? 1 : 0.9 }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#1e1b4b" }}>Deck {d.name}</h3>
            <span style={{ fontSize: "12px", background: "#f5f3ff", color: "#7c3aed", fontWeight: 700, padding: "3px 10px", borderRadius: "999px" }}>{d.cards} cartas</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0 4px" }}>{d.style}</div>
          {d.core && <div style={{ color: "#9ca3af", fontSize: "12.5px", margin: "0 0 14px" }}>Incluye: {d.core}</div>}
          {(() => {
            const item = { id: d.id, name: `Deck proxy ${d.name}`, price: d.price, image: d.images ? encodeURI(d.images[0]) : undefined };
            return (
              <div style={{ marginTop: "auto" }}>
                <div style={{ color: "#7c3aed", fontWeight: 800, fontSize: "22px", marginBottom: "10px" }}>S/{item.price.toFixed(2)}</div>
                <button className={`px-btn ${cart.added === item.id ? "is-added" : ""}`} onClick={() => cart.add(item)}>
                  {cart.added === item.id ? "¡Añadido!" : "Añadir deck"}
                </button>
              </div>
            );
          })()}
        </div>
      ))}
      <a href={waLink("Hola Coquecutes, quiero un deck de proxys con mi propia lista")} target="_blank" rel="noopener noreferrer" className="px-lift" style={{ border: "2px dashed #c4b5fd", borderRadius: "22px", padding: "20px", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "8px", color: "#7c3aed", minHeight: "260px" }}>
        <span style={{ fontSize: "36px" }}>📋</span>
        <strong style={{ fontSize: "17px" }}>¿Tienes tu propia lista?</strong>
        <span style={{ fontSize: "14px", color: "#6b7280" }}>Envíanos tu decklist y la cotizamos</span>
      </a>
    </div>
  );
}

export default function ProxysPage() {
  const [tab, setTab] = useState("sueltas");
  const [defaultType, setDefaultType] = useState(proxyTypes[0].id);
  const [info, setInfo] = useState(null);   // { typeId, onChoose }
  const [quick, setQuick] = useState(null); // { s, tid }
  const cart = useCart();
  const ui = {
    defaultType,
    openInfo: (typeId, onChoose) => setInfo({ typeId, onChoose: onChoose || setDefaultType }),
    openQuick: (s, tid) => setQuick({ s, tid }),
  };

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      if (tabs.some((t) => t.id === h)) setTab(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const go = (id) => {
    setTab(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pxPop { from { opacity:0; transform:scale(.85) translateY(10px); } to { opacity:1; transform:none; } }
        .px-tabs { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:32px; }
        .px-tab { display:inline-flex; align-items:center; gap:8px; border:1.5px solid #e5e7eb; background:#fff; color:#4b5563; font-weight:700; font-size:15px; padding:11px 20px; border-radius:999px; cursor:pointer; font-family:inherit; transition:all .2s; }
        .px-tab:hover { border-color:#c4b5fd; color:#7c3aed; }
        .px-tab.is-active { background:linear-gradient(90deg,#ec4899,#7c3aed); border-color:transparent; color:#fff; box-shadow:0 8px 20px rgba(124,58,237,.3); }
        .px-types { display:flex; flex-wrap:wrap; gap:6px; margin:0 0 10px; }
        .px-type { border:1.5px solid #e5e7eb; background:#fff; color:#4b5563; font-size:12px; font-weight:700; padding:6px 10px; border-radius:999px; cursor:pointer; font-family:inherit; transition:all .15s; }
        .px-type:hover { border-color:#c4b5fd; color:#7c3aed; }
        .px-type.is-active { background:#f5f3ff; border-color:#7c3aed; color:#6d28d9; box-shadow:0 0 0 2px rgba(124,58,237,.12); }
        .px-info { background:none; border:none; padding:2px 0; cursor:pointer; color:#7c3aed; font-weight:700; font-size:12px; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
        .px-info:hover { text-decoration:underline; }
        .px-info-play { width:18px; height:18px; border-radius:50%; background:#7c3aed; color:#fff; font-size:8px; display:inline-flex; align-items:center; justify-content:center; padding-left:1px; }
        .px-guide { background:#fff; border:1px solid #ede9fe; border-radius:24px; padding:20px; margin-bottom:30px; box-shadow:0 8px 30px rgba(124,58,237,.06); }
        .px-guide-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:14px; }
        .px-guide-card { border:1.5px solid #ede9fe; border-radius:18px; overflow:hidden; background:#fff; transition:all .2s; }
        .px-guide-card.is-active { border-color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,.14); }
        .px-guide-thumb { position:relative; display:flex; align-items:center; justify-content:center; width:100%; height:110px; border:none; cursor:pointer; color:#fff; font-family:inherit; }
        .px-play { position:absolute; right:10px; bottom:10px; width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,.95); color:#7c3aed; display:flex; align-items:center; justify-content:center; font-size:12px; padding-left:2px; transition:transform .2s; }
        .px-guide-thumb:hover .px-play { transform:scale(1.12); }
        .px-pick { width:100%; border:1.5px solid #7c3aed; background:#fff; color:#7c3aed; font-weight:800; font-size:13px; padding:9px; border-radius:10px; cursor:pointer; font-family:inherit; transition:all .15s; }
        .px-pick:hover { background:#f5f3ff; } .px-pick.is-active { background:#7c3aed; color:#fff; }
        .px-ghost { display:inline-flex; align-items:center; justify-content:center; gap:6px; border:1.5px solid #e5e7eb; color:#4b5563; text-decoration:none; font-weight:700; font-size:14px; padding:14px 18px; border-radius:14px; background:#fff; }
        .px-ghost:hover { border-color:#c4b5fd; color:#7c3aed; }
        .px-cardbtn { position:relative; display:block; width:100%; padding:0; border:none; background:none; cursor:zoom-in; font-family:inherit; text-align:left; }
        .px-new { position:absolute; top:8px; left:8px; background:linear-gradient(90deg,#ec4899,#7c3aed); color:#fff; font-size:10px; font-weight:900; letter-spacing:1px; padding:4px 9px; border-radius:999px; box-shadow:0 4px 10px rgba(0,0,0,.25); }
        .px-zoom { position:absolute; left:50%; bottom:10px; transform:translate(-50%,8px); background:rgba(15,10,42,.85); color:#fff; font-size:12px; font-weight:700; padding:6px 12px; border-radius:999px; opacity:0; transition:all .2s; white-space:nowrap; pointer-events:none; }
        .px-cardbtn:hover .px-zoom, .px-cardbtn:focus-visible .px-zoom { opacity:1; transform:translate(-50%,0); }
        .px-overlay { position:fixed; inset:0; z-index:300; background:rgba(15,10,42,.72); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:20px; animation:pxFade .2s both; }
        .px-modal { position:relative; width:100%; max-height:92vh; overflow:auto; background:#fff; border-radius:26px; box-shadow:0 30px 80px rgba(0,0,0,.45); animation:pxPop .3s both; }
        .px-close { position:absolute; top:12px; right:12px; z-index:2; width:36px; height:36px; border-radius:50%; border:none; background:#f3f4f6; color:#374151; font-size:15px; cursor:pointer; }
        .px-close:hover { background:#e5e7eb; }
        .px-quick { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:30px; padding:30px; }
        .px-quick-img { display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(145deg,#f5f3ff,#fdf2f8); border-radius:20px; padding:20px; }
        .px-receive { background:#faf5ff; border:1px solid #ede9fe; border-radius:14px; padding:12px 14px; }
        .px-receive ul { margin:0; padding-left:18px; color:#374151; font-size:14px; line-height:1.7; }
        .px-opt { display:flex; align-items:center; gap:12px; border:1.5px solid #ede9fe; border-radius:16px; padding:12px 14px; background:#fff; transition:border-color .2s, box-shadow .2s; }
        .px-opt:hover { border-color:#c4b5fd; box-shadow:0 6px 16px rgba(124,58,237,.1); }
        .px-opt .px-opt-btn { width:auto; flex:0 0 auto; min-width:112px; padding:11px 14px; }
        .px-opt-info { flex:1 1 auto; min-width:0; }
        .px-opt-price { flex:0 0 auto; color:#7c3aed; font-size:20px; font-weight:800; white-space:nowrap; }
        @media (max-width:520px) { .px-opt { flex-wrap:wrap; } .px-opt .px-opt-btn { width:100%; flex:1 1 100%; } .px-opt-info { flex:1 1 0; } }
        @keyframes pxFade { from { opacity:0; } to { opacity:1; } }
        @media (max-width:860px) { .px-quick { grid-template-columns:1fr; padding:20px 16px; gap:18px; } .px-quick-img > div:first-child { height:min(52vh,420px) !important; } .px-overlay { padding:10px; align-items:flex-end; } .px-modal { border-radius:22px 22px 0 0; } }
        .px-btn { width:100%; border:none; cursor:pointer; background:#7c3aed; color:#fff; font-weight:800; font-size:13px; letter-spacing:.5px; text-transform:uppercase; padding:13px; border-radius:10px; font-family:inherit; transition:background .2s, transform .1s; }
        .px-btn:hover { background:#6d28d9; } .px-btn:active { transform:scale(.98); }
        .px-btn-lg { padding:17px; font-size:14px; border-radius:14px; background:linear-gradient(90deg,#ec4899,#7c3aed); }
        .px-btn.is-added { background:#16a34a; }
        .px-lift { transition:transform .25s, box-shadow .25s; } .px-lift:hover { transform:translateY(-5px); }
        .px-search { display:flex; align-items:center; gap:10px; background:#fff; border:1.5px solid #ede9fe; border-radius:14px; padding:4px 16px; max-width:440px; margin-bottom:26px; }
        .px-search input { flex:1; border:none; outline:none; font-size:15px; padding:12px 0; font-family:inherit; background:transparent; }
        .px-grid-cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:26px 20px; }
        .px-grid-decks { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:24px; }
        @keyframes pxFade { from { opacity:0 } to { opacity:1 } }
        .px-ext { display:grid; grid-template-columns:minmax(300px,420px) 1fr; gap:48px; align-items:center; }
        .px-binder { background:linear-gradient(145deg,#1e1b4b,#4c1d95); border-radius:28px; padding:22px; box-shadow:0 24px 50px rgba(76,29,149,.35); }
        .px-pack { display:flex; align-items:center; gap:12px; width:100%; background:#fff; border:1.5px solid #e5e7eb; border-radius:14px; padding:12px 14px; cursor:pointer; font-family:inherit; font-size:15px; color:#1f2937; transition:all .2s; }
        .px-pack:hover { border-color:#c4b5fd; }
        .px-pack.is-active { border-color:#7c3aed; background:#f5f3ff; box-shadow:0 0 0 3px rgba(124,58,237,.12); }
        .px-custom { display:grid; grid-template-columns:1fr 1fr; gap:44px; }
        .px-ex-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .px-ex { position:relative; border:none; padding:0; background:#fff; border-radius:14px; overflow:hidden; cursor:pointer; aspect-ratio:63/88; box-shadow:0 8px 20px rgba(76,29,149,.15); transition:transform .2s, box-shadow .2s; }
        .px-ex:hover { transform:translateY(-4px) rotate(-.6deg); box-shadow:0 16px 30px rgba(76,29,149,.28); }
        .px-ex img { width:100%; height:100%; object-fit:cover; display:block; }
        .px-ex-tag { position:absolute; left:8px; bottom:8px; background:rgba(30,27,75,.85); color:#fff; font-size:11px; font-weight:800; padding:4px 10px; border-radius:999px; }
        @media (max-width:860px) { .px-ex-grid { grid-template-columns:repeat(2,1fr); gap:12px; } }
        @media (max-width:860px) { .px-ext, .px-custom { grid-template-columns:1fr; gap:28px; } }
      ` }} />

      <div style={{ fontSize: "16px", color: "#9ca3af", marginBottom: "10px" }}>
        <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Inicio</Link>
        <span style={{ margin: "0 10px" }}>/</span>
        <strong style={{ color: "#1e1b4b" }}>Proxys</strong>
      </div>
      <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#1e1b4b", margin: "0 0 6px" }}>Proxys Coquecutes</h1>
      <p style={{ color: "#6b7280", margin: "0 0 26px", maxWidth: "560px", lineHeight: 1.6 }}>Cartas, packs y mazos impresos con calidad. Elige cómo quieres armar tu colección.</p>

      <div className="px-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`px-tab ${tab === t.id ? "is-active" : ""}`} onClick={() => go(t.id)}>
            <span>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      <Ui.Provider value={ui}>
        {(tab === "sueltas" || tab === "extended-art") && <FinishGuide value={defaultType} onPick={setDefaultType} mode={tab === "sueltas" ? "info" : undefined} />}
        {tab === "sueltas" && <Singles cart={cart} />}
        {tab === "extended-art" && <Extended cart={cart} />}
        {tab === "personalizados" && <Custom />}
        {tab === "decks" && <Decks cart={cart} />}
        {info && <TypeModal typeId={info.typeId} onClose={() => setInfo(null)} onChoose={info.onChoose} />}
        {quick && <QuickView s={quick.s} cart={cart} startType={quick.tid} onClose={() => setQuick(null)} />}
      </Ui.Provider>
    </div>
  );
}