"use client";
import { useState, useEffect, useRef, useContext, createContext } from "react";
import Link from "next/link";
import { singles, extendedPacks, customTypes, decks, proxyTypes, proxyInfo } from "../../data/proxys";

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
    try {
      const saved = localStorage.getItem("coquecutes_cart");
      const cart = saved ? JSON.parse(saved) : [];
      const ex = cart.find((i) => i.id === item.id);
      if (ex) ex.quantity += 1;
      else cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
      localStorage.setItem("coquecutes_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdate"));
      setAdded(item.id);
      setTimeout(() => setAdded((a) => (a === item.id ? null : a)), 1400);
    } catch {}
  };
  return { added, add };
}

/* ---------- Tipo de proxy (en frío / con crema / al calor) ---------- */
const typeOf = (id) => proxyTypes.find((t) => t.id === id) || proxyTypes[0];
// Devuelve el ítem del carrito: id único por tipo, nombre con el tipo y precio + extra
const withType = (item, typeId, name) => {
  const t = typeOf(typeId);
  return { id: `${item.id}-${t.id}`, name: `${name} · ${t.label}`, price: item.price + (t.extra || 0) };
};
/* ---------- Contexto de la página: acabado por defecto + modal informativo ---------- */
const Ui = createContext({ defaultType: "frio", openInfo: () => {}, openQuick: () => {} });

function TypePicker({ value, onChange, showInfo = true }) {
  const ui = useContext(Ui);
  const t = typeOf(value);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div className="px-types" role="radiogroup" aria-label="Tipo de proxy" style={{ marginBottom: "6px" }}>
        {proxyTypes.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={value === x.id} className={`px-type ${value === x.id ? "is-active" : ""}`} onClick={() => onChange(x.id)}>
            {x.label}{x.extra > 0 ? ` +S/${x.extra}` : ""}
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
function FinishGuide({ value, onPick }) {
  const ui = useContext(Ui);
  return (
    <div className="px-guide">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#7c3aed", letterSpacing: "1px" }}>PASO 1 · ELIGE TU ACABADO</div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>Mira el video de cada tipo para saber cómo queda. Luego elige tus cartas.</div>
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
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>{t.extra > 0 ? `+S/${t.extra}` : "Precio base"}</span>
              </div>
              <div style={{ color: "#6b7280", fontSize: "13px", minHeight: "36px", margin: "4px 0 10px", lineHeight: 1.4 }}>{t.summary || "Toca ▶ para ver cómo queda."}</div>
              <button className={`px-pick ${value === t.id ? "is-active" : ""}`} onClick={() => onPick(t.id)}>{value === t.id ? "✓ Elegido" : "Elegir este"}</button>
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
    <div style={{ aspectRatio: "63 / 88", borderRadius: "10px", border: "2.5px solid rgba(255,255,255,0.9)", background: image ? `url(${image}) center/cover` : gradBg(grad), boxShadow: "0 8px 18px rgba(30,27,75,0.25)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "8px", color: "#fff", ...style }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.55))" }} />
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
  const item = withType(s, tid, `Proxy ${s.name} (${s.set})`);
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
          <TypePicker value={tid} onChange={setTid} />
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

/* ---------- Cartas sueltas ---------- */
function Singles({ cart }) {
  const ui = useContext(Ui);
  const [q, setQ] = useState("");
  const [types, setTypes] = useState({});
  const list = singles.filter((s) => (s.name + s.set).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div>
      <div className="px-search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca por carta o set…" aria-label="Buscar cartas" />
      </div>
      <div className="px-grid-cards">
        {list.map((s, idx) => {
          const tid = types[s.id] || ui.defaultType;
          const item = withType(s, tid, `Proxy ${s.name} (${s.set})`);
          return (
            <div key={s.id} className="px-lift">
              <button className="px-cardbtn" onClick={() => ui.openQuick(s, tid)} aria-label={`Ver ${s.name} en grande`}>
                <MiniCard grad={s.grad} image={s.image} title={s.name} sub={s.set} />
                {idx < 4 && !q && <span className="px-new">NUEVO</span>}
                <span className="px-zoom">🔍 Ver en grande</span>
              </button>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 2px 8px" }}>
                <strong style={{ color: "#7c3aed", fontSize: "17px" }}>S/{item.price.toFixed(2)}</strong>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>por unidad</span>
              </div>
              <TypePicker value={tid} onChange={(v) => setTypes((p) => ({ ...p, [s.id]: v }))} />
              <button className={`px-btn ${cart.added === item.id ? "is-added" : ""}`} onClick={() => cart.add(item)}>
                {cart.added === item.id ? "¡Añadido!" : "Añadir"}
              </button>
            </div>
          );
        })}
      </div>
      {list.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>
          No encontramos esa carta. <a href={waLink(`Hola Coquecutes, ¿pueden hacer el proxy de: ${q}?`)} target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed", fontWeight: 700 }}>Pídela por WhatsApp</a>
        </p>
      )}
    </div>
  );
}

/* ---------- Extended Art: arte 3x3, 8 cartas (sin la central) ---------- */
function Extended({ cart }) {
  const [sel, setSel] = useState(0);
  const ui = useContext(Ui);
  const [own, setOwn] = useState(null);
  const type = own || ui.defaultType;
  const setType = setOwn;
  const pack = extendedPacks[sel];
  const packItem = withType(pack, type, `Extended Art ${pack.name} (8 cartas)`);
  return (
    <div className="px-ext">
      <div className="px-binder">
        <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px", color: "#c4b5fd", marginBottom: "12px", textAlign: "center" }}>ARTE 3×3 · 8 CARTAS</div>
        {pack.image ? (
          <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", lineHeight: 0 }}>
            <img src={pack.image} alt={`Extended Art ${pack.name}`} style={{ width: "100%", height: "auto", display: "block" }} />
            {/* marca la carta central (solo referencia) */}
            <div style={{ position: "absolute", left: "35.2%", top: "34.5%", width: "29.8%", height: "30.4%", border: "2.5px dashed rgba(255,255,255,0.95)", borderRadius: "6px", background: "rgba(10,8,30,0.35)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: "50%", top: "66.2%", transform: "translateX(-50%)", background: "#1e1b4b", color: "#fff", fontSize: "12px", fontWeight: 800, lineHeight: 1.2, padding: "7px 12px", borderRadius: "999px", whiteSpace: "nowrap", boxShadow: "0 6px 14px rgba(0,0,0,0.35)", border: "1.5px solid rgba(255,255,255,0.8)" }}>🚫 Carta central no incluida</div>
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
        <p style={{ color: "#6b7280", margin: "0 0 18px", lineHeight: 1.6 }}>Recibes las <strong>8 cartas</strong> que rodean al centro del arte. <strong>La carta central no está incluida.</strong></p>
        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          {extendedPacks.map((p, i) => (
            <button key={p.id} onClick={() => setSel(i)} className={`px-pack ${sel === i ? "is-active" : ""}`}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: p.image ? `url(${p.image}) center/cover` : gradBg(p.grad), flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: 700 }}>{p.name}</span>
              <span style={{ color: "#7c3aed", fontWeight: 800 }}>S/{p.price}</span>
            </button>
          ))}
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
  const [type, setType] = useState("carta");
  const [desc, setDesc] = useState("");
  const label = customTypes.find((t) => t.id === type)?.label;
  const steps = [
    ["1", "Cuéntanos tu idea", "Elige el tipo y descríbela."],
    ["2", "Te cotizamos", "Respondemos por WhatsApp con precio y plazo."],
    ["3", "Imprimimos y enviamos", "Lo recibes en todo el Perú."],
  ];
  return (
    <div className="px-custom">
      <div>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 16px" }}>¿Qué quieres crear?</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "18px" }}>
          {customTypes.map((t) => (
            <button key={t.id} onClick={() => setType(t.id)} className={`px-pack ${type === t.id ? "is-active" : ""}`} style={{ flexDirection: "column", padding: "18px 10px", gap: "6px" }}>
              <span style={{ fontSize: "28px" }}>{t.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: "14px" }}>{t.label}</span>
            </button>
          ))}
        </div>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Describe tu idea: personaje, estilo, cantidad…" style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e5e7eb", borderRadius: "14px", padding: "14px", fontSize: "15px", fontFamily: "inherit", resize: "vertical", outline: "none", marginBottom: "14px" }} />
        <a className="px-btn px-btn-lg" style={{ display: "block", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }} href={waLink(`Hola Coquecutes, quiero un proxy personalizado.\nTipo: ${label}\nIdea: ${desc || "(te la cuento por aquí)"}`)} target="_blank" rel="noopener noreferrer">
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
  );
}

/* ---------- Decks ---------- */
function Decks({ cart }) {
  const ui = useContext(Ui);
  const [types, setTypes] = useState({});
  return (
    <div className="px-grid-decks">
      {decks.map((d) => (
        <div key={d.id} className="px-lift" style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: "22px", padding: "20px" }}>
          {/* mazo apilado */}
          <div style={{ position: "relative", height: "190px", marginBottom: "18px" }}>
            {[2, 1, 0].map((k) => (
              <MiniCard key={k} grad={d.grad} title={k === 0 ? d.name : undefined} sub={k === 0 ? d.style : undefined} style={{ position: "absolute", height: "100%", left: `calc(50% - 68px + ${(k - 1) * 22}px)`, transform: `rotate(${(k - 1) * 7}deg)`, opacity: k === 0 ? 1 : 0.9 }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#1e1b4b" }}>Deck {d.name}</h3>
            <span style={{ fontSize: "12px", background: "#f5f3ff", color: "#7c3aed", fontWeight: 700, padding: "3px 10px", borderRadius: "999px" }}>{d.cards} cartas</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0 14px" }}>{d.style}</div>
          {(() => {
            const tid = types[d.id] || ui.defaultType;
            const item = withType(d, tid, `Deck proxy ${d.name}`);
            return (
              <>
                <div style={{ color: "#7c3aed", fontWeight: 800, fontSize: "22px", marginBottom: "10px" }}>S/{item.price.toFixed(2)}</div>
                <TypePicker value={tid} onChange={(v) => setTypes((p) => ({ ...p, [d.id]: v }))} />
                <button className={`px-btn ${cart.added === item.id ? "is-added" : ""}`} onClick={() => cart.add(item)}>
                  {cart.added === item.id ? "¡Añadido!" : "Añadir deck"}
                </button>
              </>
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
      <style>{`
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
        .px-ext { display:grid; grid-template-columns:minmax(300px,420px) 1fr; gap:48px; align-items:center; }
        .px-binder { background:linear-gradient(145deg,#1e1b4b,#4c1d95); border-radius:28px; padding:22px; box-shadow:0 24px 50px rgba(76,29,149,.35); }
        .px-pack { display:flex; align-items:center; gap:12px; width:100%; background:#fff; border:1.5px solid #e5e7eb; border-radius:14px; padding:12px 14px; cursor:pointer; font-family:inherit; font-size:15px; color:#1f2937; transition:all .2s; }
        .px-pack:hover { border-color:#c4b5fd; }
        .px-pack.is-active { border-color:#7c3aed; background:#f5f3ff; box-shadow:0 0 0 3px rgba(124,58,237,.12); }
        .px-custom { display:grid; grid-template-columns:1fr 1fr; gap:44px; }
        @media (max-width:860px) { .px-ext, .px-custom { grid-template-columns:1fr; gap:28px; } }
      `}</style>

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
        {tab !== "personalizados" && <FinishGuide value={defaultType} onPick={setDefaultType} />}
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