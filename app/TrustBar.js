import React from "react";

// Franja de confianza que aparece arriba de TODAS las páginas (se monta en layout.js).
// Edita los textos aquí. Mantén 4–5 mensajes cortos.
const items = [
  { icon: "🐣", text: "Compra con confianza en Coquecutes" },
  { icon: "🚚", text: "Envíos a todo el país" },
  { icon: "💗", text: "Pago seguro con Yape / Plin" },
  { icon: "🏆", text: "+90 subastas realizadas con coleccionistas reales" },
  { icon: "🇵🇪", text: "Hecho con cariño en Perú" },
];

function Row({ hidden }) {
  return (
    <div className="tb-row" aria-hidden={hidden ? "true" : undefined}>
      {items.map((it) => (
        <span className="tb-item" key={it.text}>
          <span className="tb-icon">{it.icon}</span>
          {it.text}
        </span>
      ))}
    </div>
  );
}

export default function TrustBar() {
  return (
    <div className="tb-bar" role="region" aria-label="Por qué confiar en Coquecutes">
      <style dangerouslySetInnerHTML={{ __html: `
        .tb-bar { position:relative; z-index:101; overflow:hidden; color:#fff6d6; font-size:13px; font-weight:700; letter-spacing:.2px;
          background:linear-gradient(90deg,#6a3059 0%,#8c4a78 50%,#6a3059 100%); border-bottom:2px solid #f0d070; }
        .tb-track { display:flex; width:max-content; margin:0 auto; }
        .tb-row { display:flex; align-items:center; gap:34px; padding:9px 24px; white-space:nowrap; }
        .tb-row[aria-hidden="true"] { display:none; }
        .tb-item { display:inline-flex; align-items:center; gap:8px; }
        .tb-item + .tb-item::before { content:"✦"; color:#f0d070; margin-right:26px; font-size:11px; }
        .tb-icon { font-size:15px; }
        @media (max-width: 900px) {
          .tb-bar { font-size:12px; }
          .tb-track { animation:tbScroll 32s linear infinite; margin:0; }
          .tb-row[aria-hidden="true"] { display:flex; }
        }
        @keyframes tbScroll { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .tb-track { animation:none !important; } }
      ` }} />
      <div className="tb-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
