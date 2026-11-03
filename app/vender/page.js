"use client";
import Link from "next/link";
import { lotes, valor, pasos, notas } from "../../data/vender";

const WA = "51962376893";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const img = (src) => encodeURI(src);
const money = (n) => `S/${Number(n).toFixed(2)}`;

export default function VenderPage() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .vd-hero { border-radius:28px; padding:34px 36px; color:#fff; background:linear-gradient(135deg,#3b1030 0%,#6f2252 55%,#d2406f 100%); position:relative; overflow:hidden; }
        .vd-hero::after { content:""; position:absolute; right:-70px; top:-70px; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle,rgba(240,208,112,.35),transparent 70%); pointer-events:none; }
        .vd-tag { display:inline-block; background:rgba(255,255,255,.16); border:1px solid rgba(240,208,112,.6); color:#fff6d6; font-size:12px; font-weight:800; letter-spacing:1px; padding:5px 12px; border-radius:999px; }
        .vd-h2 { font-size:24px; font-weight:800; color:#461438; margin:40px 0 6px; }
        .vd-sub { color:#6b7280; margin:0 0 18px; font-size:15px; }
        .vd-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .vd-card { background:#fff; border:2px solid #ffebf2; border-radius:22px; padding:20px; transition:transform .25s, box-shadow .25s, border-color .25s; }
        .vd-card:hover { transform:translateY(-4px); box-shadow:0 14px 28px rgba(209,64,111,.14); border-color:#f394b4; }
        .vd-price { font-size:34px; font-weight:900; color:#d2406f; line-height:1; margin:10px 0 2px; }
        .vd-small { font-size:13px; color:#6b7280; }
        .vd-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .vd-step { background:#fff; border-radius:20px; padding:20px; border:1px solid #fbeef3; }
        .vd-num { width:36px; height:36px; border-radius:12px; background:#fff3f7; color:#d2406f; font-weight:800; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
        .vd-ex { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:16px; }
        .vd-ex img { width:100%; aspect-ratio:63/88; object-fit:cover; border-radius:8px; box-shadow:0 4px 10px rgba(59,16,48,.18); background:#fff3f7; }
        .vd-cta { display:inline-block; padding:14px 26px; border-radius:16px; background:linear-gradient(135deg,#f0789a,#d2406f); color:#fff; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 10px 24px rgba(209,64,111,.35); transition:transform .2s; }
        .vd-cta:hover { transform:translateY(-2px); }
        .vd-note { background:#fff8e1; border:1px solid #f0d070; color:#7a5a00; border-radius:16px; padding:14px 18px; font-size:14px; line-height:1.6; }
        @media (max-width:860px) { .vd-grid { grid-template-columns:1fr; } .vd-steps { grid-template-columns:1fr 1fr; } .vd-hero { padding:26px 22px; } }
        @media (max-width:520px) { .vd-steps { grid-template-columns:1fr; } }
      ` }} />

      <div style={{ fontSize: 16, color: "#9ca3af", marginBottom: 12 }}>
        <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Inicio</Link>
        <span style={{ margin: "0 10px" }}>/</span>
        <strong style={{ color: "#461438" }}>Vender tus productos</strong>
      </div>

      <section className="vd-hero">
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
          <span className="vd-tag">COMPRAMOS TUS CARTAS</span>
          <h1 style={{ fontSize: "clamp(30px,5vw,44px)", lineHeight: 1.1, fontWeight: 800, margin: "16px 0 10px" }}>
            Vende tus cartas a <span style={{ color: "#f0d070" }}>Coquecutes</span>
          </h1>
          <p style={{ margin: "0 0 20px", opacity: 0.92, lineHeight: 1.6 }}>
            Convierte tus cartas en soles de forma rápida y transparente. Mira nuestras tarifas y escríbenos por WhatsApp.
          </p>
          <a className="vd-cta" href={waLink("Hola Coquecutes, quiero vender mis productos con ustedes")} target="_blank" rel="noopener noreferrer">Quiero vender por WhatsApp</a>
        </div>
      </section>

      <h2 className="vd-h2">Pagamos por lote</h2>
      <p className="vd-sub">Precio por cada 100 cartas. ¿Tienes menos? Se paga proporcional.</p>
      <div className="vd-grid">
        {lotes.map((l) => (
          <div key={l.id} className="vd-card">
            <div style={{ fontSize: 30 }}>{l.emoji}</div>
            <strong style={{ color: "#461438", fontSize: 18 }}>{l.label}</strong>
            <div className="vd-small">{l.detalle}</div>
            <div className="vd-price">{money(l.por100)}</div>
            <div className="vd-small">por cada 100 cartas</div>
            <div className="vd-ex">
              {(l.ejemplos || []).map((src) => (
                <img key={src} src={img(src)} alt={`Ejemplo de ${l.label}`} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="vd-h2">Cartas de valor</h2>
      <p className="vd-sub">Te pagamos soles por cada dólar de valor de mercado de la carta.</p>
      <div className="vd-grid">
        {valor.map((v) => (
          <div key={v.id} className="vd-card">
            <div style={{ fontSize: 30 }}>{v.emoji}</div>
            <strong style={{ color: "#461438", fontSize: 18 }}>{v.label}</strong>
            <div className="vd-price">S/{v.min.toFixed(2)} – {v.max.toFixed(2)}</div>
            <div className="vd-small">por cada US$1 de valor de mercado</div>
            <div className="vd-ex">
              {(v.ejemplos || []).map((src) => (
                <img key={src} src={img(src)} alt={`Ejemplo de ${v.label}`} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="vd-h2">Cómo funciona</h2>
      <p className="vd-sub">Vender con nosotros es simple.</p>
      <div className="vd-steps">
        {pasos.map((p) => (
          <div key={p.n} className="vd-step">
            <div className="vd-num">{p.n}</div>
            <strong style={{ color: "#461438" }}>{p.titulo}</strong>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280", lineHeight: 1.55 }}>{p.texto}</p>
          </div>
        ))}
      </div>

      <div className="vd-note" style={{ margin: "28px 0 10px" }}>
        <strong>Ten en cuenta:</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>{notas.map((n) => <li key={n}>{n}</li>)}</ul>
      </div>
    </div>
  );
}
