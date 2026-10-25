"use client";
import { addToCart as addCartItem } from "../cart";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { products } from "../../data/products";
import { singleCards, sealedProducts } from "../../data/pokemon";
import { cartas } from "../../data/cartas";

const accents = ["#f3e8ff", "#e0e7ff", "#ffe4e6", "#fef3c7", "#dcfce7"];

// Unifica todo en una sola lista con "kind"
const allItems = [
  ...products.map((p) => ({
    kind: p.slug.startsWith("dispensador") ? "dispensador" : "case",
    id: p.id, name: p.name, price: p.price, slug: p.slug,
    image: p.thumbnail || (p.images && p.images[0]) || "/placeholder.svg", zoom: p.thumbnailZoom || 85,
  })),
  ...singleCards.map((c) => ({ kind: "carta", ...c })),
  ...cartas.map((c) => ({ kind: "carta", ...c })),
  ...sealedProducts.map((s) => ({ kind: "sellado", ...s })),
];

const categories = [
  { id: "todos", label: "Todos" },
  { id: "case", label: "Cases" },
  { id: "dispensador", label: "Dispensadores" },
  { id: "carta", label: "Cartas sueltas" },
  { id: "sellado", label: "Productos sellados" },
];
// Enlaces del menú (#cases, #cartas-sueltas, #sellados)
const hashMap = { cases: "case", dispensadores: "dispensador", "cartas-sueltas": "carta", sellados: "sellado" };
const hashOf = (id) => Object.keys(hashMap).find((k) => hashMap[k] === id);

const conditionColors = { "Near Mint": ["#dcfce7", "#15803d"], "Lightly Played": ["#fef9c3", "#a16207"], "Moderately Played": ["#ffedd5", "#c2410c"], "Heavily Played": ["#fee2e2", "#b91c1c"] };

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "13px", padding: "5px 0", borderBottom: "1px dashed #ede9fe" }}>
      <span style={{ color: "#9ca3af", fontWeight: 600 }}>{label}</span>
      <span style={{ color: "#1f2937", fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

const isPhoto = (src) => typeof src === "string" && src.startsWith("/Cases/");

export default function CatalogoPage() {
  const [category, setCategory] = useState("todos");
  const [perPage, setPerPage] = useState(12);
  const [cols, setCols] = useState(4);
  const [sort, setSort] = useState("default");
  const [added, setAdded] = useState(null);
  const [f, setF] = useState({ q: "", lang: "", fin: "", type: "", exp: "", stage: "", ill: "" });
  const [showF, setShowF] = useState(false);
  const [qty, setQty] = useState({});
  const setFilter = (k, v) => { setF((o) => ({ ...o, [k]: o[k] === v && k !== "q" ? "" : v })); setLimit(0); };
  const [limit, setLimit] = useState(0);
  const activeF = Object.values(f).filter(Boolean).length;
  const clearF = () => { setF({ q: "", lang: "", fin: "", type: "", exp: "", stage: "", ill: "" }); setLimit(0); };

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      if (hashMap[h]) setCategory(hashMap[h]);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const pick = (id) => {
    setCategory(id); setLimit(0);
    const h = hashOf(id);
    history.replaceState(null, "", h ? `#${h}` : window.location.pathname);
  };

  const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cardBase = useMemo(() => allItems.filter((p) => p.kind === "carta"), []);
  const matchCard = (c, skip) => {
    if (skip !== "lang" && f.lang && c.language !== f.lang) return false;
    if (skip !== "fin" && f.fin && c.finish !== f.fin) return false;
    if (skip !== "type" && f.type && c.type !== f.type) return false;
    if (skip !== "exp" && f.exp && c.expansion !== f.exp) return false;
    if (skip !== "stage" && f.stage && c.stage !== f.stage) return false;
    if (skip !== "ill" && f.ill && c.illustrator !== f.ill) return false;
    if (f.q) {
      const hay = norm([c.name, c.expansion, c.expansionEn, c.setCode, c.number, c.illustrator, c.type].join(" "));
      if (!f.q.split(/\s+/).every((w) => hay.includes(norm(w)))) return false;
    }
    return true;
  };
  // opciones con contador (según los otros filtros activos)
  const opts = (key, field) => {
    const m = new Map();
    cardBase.filter((c) => matchCard(c, key)).forEach((c) => { if (c[field]) m.set(c[field], (m.get(c[field]) || 0) + (c.stock || 1)); });
    return [...m.entries()];
  };
  const optFinish = ["Normal", "Reverse Holo", "Holo"].map((v) => [v, opts("fin", "finish").find(([k]) => k === v)?.[1] || 0]);
  const optLang = ["Inglés", "Español"].map((v) => [v, opts("lang", "language").find(([k]) => k === v)?.[1] || 0]);
  const optType = ["Planta", "Psíquico", "Siniestro"].map((v) => [v, opts("type", "type").find(([k]) => k === v)?.[1] || 0]);
  const optExp = opts("exp", "expansion").sort((a, b) => a[0].localeCompare(b[0]));
  const optStage = ["Básico", "Fase 1", "Fase 2"].map((v) => [v, opts("stage", "stage").find(([k]) => k === v)?.[1] || 0]).filter(([, n]) => n);
  const optIll = opts("ill", "illustrator").sort((a, b) => a[0].localeCompare(b[0]));

  const filtered = useMemo(() => {
    let l = allItems.filter((p) => category === "todos" || p.kind === category);
    if (category === "carta") l = l.filter((c) => matchCard(c, null));
    if (sort === "asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "desc") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "name") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "num") l = [...l].sort((a, b) => (a.setCode || "").localeCompare(b.setCode || "") || String(a.number).localeCompare(String(b.number)));
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, f]);
  const shown = limit || perPage;
  const list = filtered.slice(0, shown);

  const countOf = (c) => allItems.filter((p) => c === "todos" || p.kind === c).length;

  const addToCart = (item) => {
    const n = item.kind === "carta" && item.stock ? Math.min(qty[item.id] || 1, item.stock) : 1;
    const label = item.setCode ? `${item.name} · ${item.setCode} ${item.number}${item.finish && item.finish !== "Normal" ? " · " + item.finish : ""} · ${item.langCode === "EN" ? "EN" : "ES"}` : item.name;
    addCartItem({ id: item.id, name: label, price: item.price, image: item.image }, n);
    setAdded(item.id);
    setTimeout(() => setAdded((a) => (a === item.id ? null : a)), 1400);
  };

  const Img = ({ item, idx }) => {
    const portrait = item.kind === "carta";
    return (
      <div style={{ position: "relative", background: accents[idx % accents.length], borderRadius: "16px", aspectRatio: (portrait || isPhoto(item.image)) ? "4 / 5" : "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", overflow: "hidden", padding: portrait ? "12px" : 0, boxSizing: "border-box" }}>
        <img src={item.image} alt={item.name} loading="lazy" style={isPhoto(item.image) ? { width: "100%", height: "100%", objectFit: "cover", display: "block", transform: "scale(1.3)", transformOrigin: "50% 58%" } : portrait ? { height: "100%", width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 10px 22px rgba(30,27,75,0.3)" } : { width: `${item.zoom || (item.kind === "sellado" ? 88 : 85)}%`, height: `${item.zoom || (item.kind === "sellado" ? 88 : 85)}%`, objectFit: "contain" }} />
        {item.setCode && (
          <div className="cc-badges">
            <span className="cc-b">{item.langCode === "EN" ? "EN · Inglés" : "ES · Español"}</span>
            {item.finish !== "Normal" && <span className="cc-b fin">{item.finish === "Holo" ? "✨ Holo" : "✨ Reverse"}</span>}
          </div>
        )}
      </div>
    );
  };

  const Chip = ({ k, v, n, label }) => (
    <button className={`cf-chip ${f[k] === v ? "on" : ""} ${n === 0 && f[k] !== v ? "off" : ""}`} onClick={() => setFilter(k, v)}>
      {label || v}<small>{n}</small>
    </button>
  );
  const typeDot = { Planta: "#22c55e", "Psíquico": "#ec4899", Siniestro: "#0f766e" };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .cg-layout { display:grid; grid-template-columns:230px 1fr; gap:36px; align-items:start; }
        .cg-cat { display:flex; align-items:center; justify-content:space-between; width:100%; text-align:left; background:none; border:none; cursor:pointer; padding:12px 4px; font-size:16px; color:#4b5563; font-family:inherit; border-bottom:1px solid #f1f5f9; transition:color .2s, padding-left .2s; }
        .cg-cat:hover { color:#7c3aed; padding-left:10px; }
        .cg-cat.is-active { color:#1e1b4b; font-weight:800; }
        .cg-count { font-size:12px; background:#f5f3ff; color:#7c3aed; border-radius:999px; padding:2px 8px; font-weight:700; }
        .cg-opt { background:none; border:none; cursor:pointer; font-size:15px; color:#9ca3af; font-family:inherit; padding:2px 4px; font-weight:600; }
        .cg-opt.is-active { color:#1e1b4b; font-weight:800; }
        .cg-colbtn { background:none; border:none; cursor:pointer; padding:4px; color:#c4b5fd; display:flex; }
        .cg-colbtn.is-active { color:#1e1b4b; }
        .cg-card { display:flex; flex-direction:column; transition:transform .25s; }
        .cg-card:hover { transform:translateY(-4px); }
        .cg-add { width:100%; border:none; cursor:pointer; background:#7c3aed; color:#fff; font-weight:800; font-size:14px; letter-spacing:.5px; text-transform:uppercase; padding:16px; border-radius:6px; box-shadow:0 3px 0 #5b21b6; font-family:inherit; transition:background .2s, transform .1s; }
        .cg-add:hover { background:#6d28d9; }
        .cg-add:active { transform:translateY(2px); box-shadow:0 1px 0 #5b21b6; }
        .cg-add.is-added { background:#16a34a; box-shadow:0 3px 0 #15803d; }
        @media (max-width: 860px) {
          .cg-layout { grid-template-columns:1fr; gap:18px; }
          .cg-side { display:flex; gap:8px; overflow-x:auto; }
          .cg-side h3 { display:none; }
          .cg-cat { width:auto; white-space:nowrap; border:1px solid #e5e7eb; border-radius:999px; padding:8px 14px; gap:8px; }
          .cg-hide-sm { display:none !important; }
          .cg-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        .cf { background:#faf5ff; border:1px solid #ede9fe; border-radius:16px; padding:16px 18px; margin-bottom:26px; }
        .cf-search { width:100%; box-sizing:border-box; border:2px solid #e5e7eb; border-radius:12px; padding:12px 14px; font-size:16px; font-family:inherit; outline:none; background:#fff; }
        .cf-search:focus { border-color:#7c3aed; }
        .cf-row { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:12px; }
        .cf-lab { font-size:12px; font-weight:800; color:#6b7280; letter-spacing:.6px; text-transform:uppercase; min-width:76px; }
        .cf-chip { border:1.5px solid #ddd6fe; background:#fff; color:#4b5563; border-radius:999px; padding:7px 13px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
        .cf-chip:hover { border-color:#7c3aed; }
        .cf-chip.on { background:#7c3aed; border-color:#7c3aed; color:#fff; }
        .cf-chip.off { opacity:.4; }
        .cf-chip small { font-size:11px; opacity:.75; font-weight:700; }
        .cf-sel { border:1.5px solid #ddd6fe; background:#fff; border-radius:10px; padding:8px 10px; font-size:14px; font-weight:600; font-family:inherit; color:#1f2937; max-width:100%; }
        .cf-toggle { display:none; }
        .cf-body { display:block; }
        .cc-badges { position:absolute; top:8px; left:8px; right:8px; display:flex; justify-content:space-between; gap:4px; pointer-events:none; }
        .cc-b { font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px; background:rgba(255,255,255,.92); color:#1e1b4b; box-shadow:0 1px 4px rgba(0,0,0,.18); }
        .cc-b.fin { background:linear-gradient(120deg,#fde68a,#f9a8d4,#a5b4fc,#99f6e4); }
        .cc-stock { font-size:12px; font-weight:700; color:#15803d; }
        .cc-qty { display:inline-flex; align-items:center; border:1.5px solid #ddd6fe; border-radius:10px; overflow:hidden; }
        .cc-qty button { border:none; background:#f5f3ff; color:#5b21b6; width:34px; height:36px; font-size:18px; font-weight:800; cursor:pointer; font-family:inherit; }
        .cc-qty button:disabled { opacity:.35; cursor:default; }
        .cc-qty span { min-width:30px; text-align:center; font-weight:800; color:#1e1b4b; }
        @media (max-width: 860px) {
          .cf-toggle { display:flex; align-items:center; justify-content:space-between; width:100%; background:none; border:none; font-size:16px; font-weight:800; color:#1e1b4b; font-family:inherit; padding:0; cursor:pointer; }
          .cf-body { display:none; }
          .cf-body.open { display:block; }
          .cf-lab { min-width:100%; }
          .cf-hide-m { display:none; }
        }
      ` }} />

      <div className="cg-layout">
        <aside className="cg-side">
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 12px 0", letterSpacing: ".5px" }}>CATEGORÍAS</h3>
          {categories.map((c) => (
            <button key={c.id} className={`cg-cat ${category === c.id ? "is-active" : ""}`} onClick={() => pick(c.id)}>
              {c.label}
              <span className="cg-count">{countOf(c.id)}</span>
            </button>
          ))}
        </aside>

        <section>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px", marginBottom: "28px" }}>
            <div style={{ fontSize: "18px", color: "#9ca3af" }}>
              <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Inicio</Link>
              <span style={{ margin: "0 10px" }}>/</span>
              <strong style={{ color: "#1e1b4b" }}>{categories.find((c) => c.id === category)?.label === "Todos" ? "Catálogo" : categories.find((c) => c.id === category)?.label}</strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" }}>
              <div className="cg-hide-sm" style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, color: "#1e1b4b" }}>
                Mostrar :
                {[9, 12, 18, 24].map((n, i) => (
                  <span key={n}>
                    {i > 0 && <span style={{ color: "#d1d5db" }}>/</span>}
                    <button className={`cg-opt ${perPage === n ? "is-active" : ""}`} onClick={() => setPerPage(n)}>{n}</button>
                  </span>
                ))}
              </div>

              <div className="cg-hide-sm" style={{ display: "flex", gap: "4px" }}>
                {[2, 3, 4].map((n) => (
                  <button key={n} className={`cg-colbtn ${cols === n ? "is-active" : ""}`} onClick={() => setCols(n)} aria-label={`${n} columnas`}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor">
                      {Array.from({ length: n * n > 9 ? 16 : n * n }).map((_, k) => {
                        const side = n;
                        const size = 22 / side - 2;
                        return <rect key={k} x={2 + (k % side) * (22 / side)} y={2 + Math.floor(k / side) * (22 / side)} width={size} height={size} rx="1" />;
                      })}
                    </svg>
                  </button>
                ))}
              </div>

              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: "none", borderBottom: "2px solid #e5e7eb", background: "transparent", fontSize: "16px", fontWeight: 700, color: "#1e1b4b", padding: "8px 4px", fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
                <option value="default">Orden por defecto</option>
                <option value="asc">Precio: bajo a alto</option>
                <option value="desc">Precio: alto a bajo</option>
                <option value="name">Nombre: A–Z</option>
                {category === "carta" && <option value="num">Expansión y número</option>}
              </select>
            </div>
          </div>

          {category === "carta" && (
            <div className="cf">
              <button className="cf-toggle" onClick={() => setShowF((v) => !v)}>
                <span>🔎 Filtros {activeF > 0 ? `(${activeF})` : ""}</span><span>{showF ? "▲" : "▼"}</span>
              </button>
              <input className="cf-search" style={{ marginTop: "0" }} placeholder="Buscar por nombre, expansión, número o ilustrador…" value={f.q} onChange={(e) => { setF((o) => ({ ...o, q: e.target.value })); setLimit(0); }} />
              <div className={`cf-body ${showF ? "open" : ""}`}>
                <div className="cf-row"><span className="cf-lab">Idioma</span>
                  {optLang.map(([v, n]) => <Chip key={v} k="lang" v={v} n={n} />)}
                </div>
                <div className="cf-row"><span className="cf-lab">Acabado</span>
                  {optFinish.map(([v, n]) => <Chip key={v} k="fin" v={v} n={n} label={v === "Normal" ? "Normal" : v === "Holo" ? "✨ Holo" : "✨ Reverse Holo"} />)}
                </div>
                <div className="cf-row"><span className="cf-lab">Tipo</span>
                  {optType.map(([v, n]) => (
                    <button key={v} className={`cf-chip ${f.type === v ? "on" : ""} ${n === 0 && f.type !== v ? "off" : ""}`} onClick={() => setFilter("type", v)}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: typeDot[v], display: "inline-block" }} />{v}<small>{n}</small>
                    </button>
                  ))}
                </div>
                <div className="cf-row"><span className="cf-lab">Etapa</span>
                  {optStage.map(([v, n]) => <Chip key={v} k="stage" v={v} n={n} />)}
                </div>
                <div className="cf-row">
                  <span className="cf-lab">Expansión</span>
                  <select className="cf-sel" value={f.exp} onChange={(e) => { setF((o) => ({ ...o, exp: e.target.value })); setLimit(0); }}>
                    <option value="">Todas las expansiones</option>
                    {optExp.map(([v, n]) => <option key={v} value={v}>{v} ({n})</option>)}
                  </select>
                  <span className="cf-lab" style={{ minWidth: "auto", marginLeft: "10px" }}>Ilustrador</span>
                  <select className="cf-sel" value={f.ill} onChange={(e) => { setF((o) => ({ ...o, ill: e.target.value })); setLimit(0); }}>
                    <option value="">Todos los ilustradores</option>
                    {optIll.map(([v, n]) => <option key={v} value={v}>{v} ({n})</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: 600 }}>{filtered.length} cartas distintas · {filtered.reduce((a, c) => a + (c.stock || 1), 0)} copias disponibles</span>
                {activeF > 0 && <button className="cf-chip" onClick={clearF}>✕ Limpiar filtros</button>}
              </div>
            </div>
          )}

          <div className="cg-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "32px 28px" }}>
            {list.map((p, idx) => {
              const isCatalogItem = p.kind === "case" || p.kind === "dispensador";
              const Title = (
                <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#1f2937", margin: "0 0 10px 0", lineHeight: 1.4, minHeight: isCatalogItem ? "50px" : "48px" }}>{p.name}</h3>
              );
              return (
                <div key={p.id} className="cg-card">
                  {isCatalogItem ? (
                    <Link href={`/producto/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <Img item={p} idx={idx} />
                      {Title}
                    </Link>
                  ) : (
                    <>
                      <Img item={p} idx={idx} />
                      {Title}
                      <div style={{ marginBottom: "10px" }}>
                        {p.kind === "carta" && p.setCode ? (
                          <>
                            <InfoRow label="Expansión" value={`${p.expansion} · ${p.setCode}`} />
                            <InfoRow label="Número" value={p.number} />
                            <InfoRow label="Idioma" value={p.langCode === "EN" ? "Inglés" : p.langCode === "LA" ? "Español (Latam)" : "Español (España)"} />
                            <InfoRow label="Acabado" value={p.finish} />
                            <InfoRow label="Tipo" value={`${p.type} · ${p.stage}`} />
                            <InfoRow label="Rareza" value={p.rarity} />
                            <InfoRow label="Ilustrador" value={p.illustrator} />
                          </>
                        ) : (
                          <>
                            <InfoRow label="Expansión" value={p.expansion} />
                            <InfoRow label="Idioma" value={p.language} />
                            {p.kind === "carta" && (
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "5px 0", borderBottom: "1px dashed #ede9fe" }}>
                                <span style={{ color: "#9ca3af", fontWeight: 600 }}>Estado</span>
                                <span style={{ background: (conditionColors[p.condition] || ["#f3f4f6", "#374151"])[0], color: (conditionColors[p.condition] || ["#f3f4f6", "#374151"])[1], fontWeight: 700, padding: "2px 10px", borderRadius: "999px" }}>{p.condition}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {isCatalogItem && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#7c3aed", fontWeight: 600, fontSize: "16px", marginBottom: "6px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Disponible
                    </div>
                  )}
                  <div style={{ color: "#7c3aed", fontWeight: 700, fontSize: "20px", marginBottom: "14px", marginTop: isCatalogItem ? 0 : "4px" }}>S/{p.price.toFixed(2)}</div>
                  {p.kind === "carta" && p.stock > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "12px" }}>
                      <span className="cc-stock">{p.stock === 1 ? "1 disponible" : `${p.stock} disponibles`}</span>
                      {p.stock > 1 && (
                        <span className="cc-qty">
                          <button disabled={(qty[p.id] || 1) <= 1} onClick={() => setQty((q) => ({ ...q, [p.id]: Math.max(1, (q[p.id] || 1) - 1) }))} aria-label="Menos">−</button>
                          <span>{qty[p.id] || 1}</span>
                          <button disabled={(qty[p.id] || 1) >= p.stock} onClick={() => setQty((q) => ({ ...q, [p.id]: Math.min(p.stock, (q[p.id] || 1) + 1) }))} aria-label="Más">+</button>
                        </span>
                      )}
                    </div>
                  )}
                  <button className={`cg-add ${added === p.id ? "is-added" : ""}`} onClick={() => addToCart(p)} style={{ marginTop: "auto" }}>
                    {added === p.id ? "¡Añadido!" : "Añadir al carrito"}
                  </button>
                </div>
              );
            })}
          </div>

          {filtered.length > list.length && (
            <div style={{ textAlign: "center", marginTop: "34px" }}>
              <button className="cg-add" style={{ width: "auto", padding: "14px 34px" }} onClick={() => setLimit(shown + (perPage < 18 ? 18 : perPage))}>Ver más ({filtered.length - list.length} restantes)</button>
            </div>
          )}
          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
              <p>{category === "carta" && activeF ? "Ninguna carta coincide con esos filtros." : "No hay productos en esta categoría todavía."}</p>
              {activeF > 0 && <button className="cf-chip" onClick={clearF}>Limpiar filtros</button>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}