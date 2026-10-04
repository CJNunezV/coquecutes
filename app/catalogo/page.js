"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { products } from "../../data/products";
import { singleCards, sealedProducts } from "../../data/pokemon";

const accents = ["#f3e8ff", "#e0e7ff", "#ffe4e6", "#fef3c7", "#dcfce7"];

// Unifica todo en una sola lista con "kind"
const allItems = [
  ...products.map((p) => ({
    kind: p.slug.startsWith("dispensador") ? "dispensador" : "case",
    id: p.id, name: p.name, price: p.price, slug: p.slug,
    image: p.thumbnail || (p.images && p.images[0]) || "/placeholder.svg", zoom: p.thumbnailZoom || 85,
  })),
  ...singleCards.map((c) => ({ kind: "carta", ...c })),
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

export default function CatalogoPage() {
  const [category, setCategory] = useState("todos");
  const [perPage, setPerPage] = useState(12);
  const [cols, setCols] = useState(4);
  const [sort, setSort] = useState("default");
  const [added, setAdded] = useState(null);

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
    setCategory(id);
    const h = hashOf(id);
    history.replaceState(null, "", h ? `#${h}` : window.location.pathname);
  };

  const list = useMemo(() => {
    let l = allItems.filter((p) => category === "todos" || p.kind === category);
    if (sort === "asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "desc") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "name") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l.slice(0, perPage);
  }, [category, sort, perPage]);

  const countOf = (c) => allItems.filter((p) => c === "todos" || p.kind === c).length;

  const addToCart = (item) => {
    try {
      const saved = localStorage.getItem("coquecutes_cart");
      const cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find((i) => i.id === item.id);
      if (existing) existing.quantity += 1;
      else cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
      localStorage.setItem("coquecutes_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdate"));
      setAdded(item.id);
      setTimeout(() => setAdded((a) => (a === item.id ? null : a)), 1400);
    } catch {}
  };

  const Img = ({ item, idx }) => {
    const portrait = item.kind === "carta";
    return (
      <div style={{ background: accents[idx % accents.length], borderRadius: "16px", aspectRatio: portrait ? "4 / 5" : "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", overflow: "hidden", padding: portrait ? "14px" : 0, boxSizing: "border-box" }}>
        <img src={item.image} alt={item.name} style={portrait ? { height: "100%", width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 10px 22px rgba(30,27,75,0.3)" } : { width: `${item.zoom || (item.kind === "sellado" ? 88 : 85)}%`, height: `${item.zoom || (item.kind === "sellado" ? 88 : 85)}%`, objectFit: "contain" }} />
      </div>
    );
  };

  return (
    <div>
      <style>{`
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
      `}</style>

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
              </select>
            </div>
          </div>

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
                        <InfoRow label="Expansión" value={p.expansion} />
                        <InfoRow label="Idioma" value={p.language} />
                        {p.kind === "carta" && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "5px 0", borderBottom: "1px dashed #ede9fe" }}>
                            <span style={{ color: "#9ca3af", fontWeight: 600 }}>Estado</span>
                            <span style={{ background: (conditionColors[p.condition] || ["#f3f4f6", "#374151"])[0], color: (conditionColors[p.condition] || ["#f3f4f6", "#374151"])[1], fontWeight: 700, padding: "2px 10px", borderRadius: "999px" }}>{p.condition}</span>
                          </div>
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
                  <button className={`cg-add ${added === p.id ? "is-added" : ""}`} onClick={() => addToCart(p)} style={{ marginTop: "auto" }}>
                    {added === p.id ? "¡Añadido!" : "Añadir al carrito"}
                  </button>
                </div>
              );
            })}
          </div>

          {list.length === 0 && <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>No hay productos en esta categoría todavía.</p>}
        </section>
      </div>
    </div>
  );
}