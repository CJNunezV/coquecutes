"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { products } from "../../data/products";

const categoryOf = (p) => (p.slug.startsWith("dispensador") ? "Dispensadores" : "Cases");
const categories = ["Todos", "Cases", "Dispensadores"];
const accents = ["#f3e8ff", "#e0e7ff", "#ffe4e6", "#fef3c7", "#dcfce7"];

export default function CatalogoPage() {
  const [category, setCategory] = useState("Todos");
  const [perPage, setPerPage] = useState(12);
  const [cols, setCols] = useState(4);
  const [sort, setSort] = useState("default");
  const [added, setAdded] = useState(null);

  const list = useMemo(() => {
    let l = products.filter((p) => category === "Todos" || categoryOf(p) === category);
    if (sort === "asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "desc") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "name") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l.slice(0, perPage);
  }, [category, sort, perPage]);

  const countOf = (c) => products.filter((p) => c === "Todos" || categoryOf(p) === c).length;

  const addToCart = (product) => {
    try {
      const saved = localStorage.getItem("coquecutes_cart");
      const cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find((i) => i.id === product.id);
      if (existing) existing.quantity += 1;
      else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
      localStorage.setItem("coquecutes_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdate"));
      setAdded(product.id);
      setTimeout(() => setAdded((a) => (a === product.id ? null : a)), 1400);
    } catch {}
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
        {/* Categorías */}
        <aside className="cg-side">
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 12px 0", letterSpacing: ".5px" }}>CATEGORÍAS</h3>
          {categories.map((c) => (
            <button key={c} className={`cg-cat ${category === c ? "is-active" : ""}`} onClick={() => setCategory(c)}>
              {c}
              <span className="cg-count">{countOf(c)}</span>
            </button>
          ))}
        </aside>

        <section>
          {/* Barra superior */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px", marginBottom: "28px" }}>
            <div style={{ fontSize: "18px", color: "#9ca3af" }}>
              <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Inicio</Link>
              <span style={{ margin: "0 10px" }}>/</span>
              <strong style={{ color: "#1e1b4b" }}>Catálogo</strong>
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
                        const side = n === 4 ? 4 : n === 3 ? 3 : 2;
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

          {/* Grilla */}
          <div className="cg-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "32px 28px" }}>
            {list.map((p, idx) => (
              <div key={p.id} className="cg-card">
                <Link href={`/producto/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: accents[idx % accents.length], borderRadius: "16px", aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", overflow: "hidden" }}>
                    <img src={p.thumbnail || (p.images && p.images[0]) || "/placeholder.svg"} alt={p.name} style={{ width: `${p.thumbnailZoom || 85}%`, height: `${p.thumbnailZoom || 85}%`, objectFit: "contain" }} />
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 500, color: "#1f2937", margin: "0 0 10px 0", lineHeight: 1.5, minHeight: "50px" }}>{p.name}</h3>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#7c3aed", fontWeight: 600, fontSize: "16px", marginBottom: "6px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Disponible
                </div>
                <div style={{ color: "#7c3aed", fontWeight: 700, fontSize: "20px", marginBottom: "14px" }}>S/{p.price.toFixed(2)}</div>
                <button className={`cg-add ${added === p.id ? "is-added" : ""}`} onClick={() => addToCart(p)} style={{ marginTop: "auto" }}>
                  {added === p.id ? "¡Añadido!" : "Añadir al carrito"}
                </button>
              </div>
            ))}
          </div>

          {list.length === 0 && <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>No hay productos en esta categoría todavía.</p>}
        </section>
      </div>
    </div>
  );
}