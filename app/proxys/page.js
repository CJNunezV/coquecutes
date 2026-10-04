"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { singles, extendedPacks, customTypes, decks } from "../../data/proxys";

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

/* ---------- Cartas sueltas ---------- */
function Singles({ cart }) {
  const [q, setQ] = useState("");
  const list = singles.filter((s) => (s.name + s.set).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div>
      <div className="px-search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca por carta o set…" aria-label="Buscar cartas" />
      </div>
      <div className="px-grid-cards">
        {list.map((s) => (
          <div key={s.id} className="px-lift">
            <MiniCard grad={s.grad} image={s.image} title={s.name} sub={s.set} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 2px 8px" }}>
              <strong style={{ color: "#7c3aed", fontSize: "17px" }}>S/{s.price.toFixed(2)}</strong>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>por unidad</span>
            </div>
            <button className={`px-btn ${cart.added === s.id ? "is-added" : ""}`} onClick={() => cart.add({ ...s, name: `Proxy ${s.name} (${s.set})` })}>
              {cart.added === s.id ? "¡Añadido!" : "Añadir"}
            </button>
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>
          No encontramos esa carta. <a href={waLink(`Hola Coquecutes, ¿pueden hacer el proxy de: ${q}?`)} target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed", fontWeight: 700 }}>Pídela por WhatsApp</a>
        </p>
      )}
    </div>
  );
}

/* ---------- Extended Art: hoja de binder 3x3 ---------- */
function Extended({ cart }) {
  const [sel, setSel] = useState(0);
  const pack = extendedPacks[sel];
  return (
    <div className="px-ext">
      <div className="px-binder">
        <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px", color: "#c4b5fd", marginBottom: "12px", textAlign: "center" }}>HOJA DE BINDER 3×3</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
          {pack.cards.map((c, i) => (
            <MiniCard key={pack.id + i} grad={[pack.grad[0], pack.grad[1]]} title={c} style={{ animation: `pxPop .5s ${i * 0.05}s both` }} />
          ))}
          {/* 9º bolsillo */}
          <div style={{ aspectRatio: "63 / 88", borderRadius: "10px", border: "2px dashed rgba(255,255,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#e9d5ff", fontSize: "11px", fontWeight: 700, padding: "6px" }}>
            Bolsillo libre
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 6px" }}>Elige tu pack</h3>
        <p style={{ color: "#6b7280", margin: "0 0 18px", lineHeight: 1.6 }}>Cada pack trae <strong>8 cartas Extended Art</strong> listas para llenar una hoja de binder 3×3.</p>
        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          {extendedPacks.map((p, i) => (
            <button key={p.id} onClick={() => setSel(i)} className={`px-pack ${sel === i ? "is-active" : ""}`}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: gradBg(p.grad), flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: "left", fontWeight: 700 }}>{p.name.replace("Pack Extended Art · ", "")}</span>
              <span style={{ color: "#7c3aed", fontWeight: 800 }}>S/{p.price}</span>
            </button>
          ))}
        </div>
        <button className={`px-btn px-btn-lg ${cart.added === pack.id ? "is-added" : ""}`} onClick={() => cart.add(pack)}>
          {cart.added === pack.id ? "¡Añadido!" : `Añadir pack · S/${pack.price}.00`}
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
          <div style={{ color: "#7c3aed", fontWeight: 800, fontSize: "22px", marginBottom: "12px" }}>S/{d.price.toFixed(2)}</div>
          <button className={`px-btn ${cart.added === d.id ? "is-added" : ""}`} onClick={() => cart.add({ ...d, name: `Deck proxy ${d.name}` })}>
            {cart.added === d.id ? "¡Añadido!" : "Añadir deck"}
          </button>
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
  const cart = useCart();

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

      {tab === "sueltas" && <Singles cart={cart} />}
      {tab === "extended-art" && <Extended cart={cart} />}
      {tab === "personalizados" && <Custom />}
      {tab === "decks" && <Decks cart={cart} />}
    </div>
  );
}