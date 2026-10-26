"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { sorteo, premios, tickets, ganadores } from "../../data/sorteo";

const WA = "51962167068";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const gradBg = (g) => `linear-gradient(145deg, ${g[0]}, ${g[1]})`;

function useCountdown(target) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    if (!target) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target || now == null) return null;
  const s = Math.max(0, Math.floor((new Date(target).getTime() - now) / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, done: s === 0 };
}

function Winners() {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  const step = (dir) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector(".sr-win");
    const w = card ? card.getBoundingClientRect().width + 16 : 300;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => step(1), 3800);
    return () => clearInterval(id);
  }, [paused]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector(".sr-win");
    const w = card ? card.getBoundingClientRect().width + 16 : 300;
    setActive(Math.min(ganadores.length - 1, Math.round(el.scrollLeft / w)));
  };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} style={{ position: "relative" }}>
      <button className="sr-arrow sr-prev" onClick={() => step(-1)} aria-label="Anterior">‹</button>
      <button className="sr-arrow sr-next" onClick={() => step(1)} aria-label="Siguiente">›</button>
      <div className="sr-track" ref={ref} onScroll={onScroll}>
        {ganadores.map((g, i) => (
          <figure key={i} className="sr-win">
            <img src={g.img} alt={g.nombre ? `${g.nombre} ganó ${g.premio}` : "Ganador del sorteo Coquecutes"} loading="lazy" />
            {(g.nombre || g.premio) && (
              <figcaption>
                {g.nombre && <strong>{g.nombre}</strong>}
                {g.premio && <span>{g.premio}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "14px" }}>
        {ganadores.map((_, i) => (
          <span key={i} style={{ width: active === i ? "24px" : "8px", height: "8px", borderRadius: "99px", background: active === i ? "#ec4899" : "#e9d5ff", transition: "all .3s" }} />
        ))}
      </div>
    </div>
  );
}

export default function SorteoPage() {
  const cd = useCountdown(sorteo.fechaSorteo);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .sr-hero { border-radius:28px; padding:34px 36px; background:linear-gradient(135deg,#fdf2f8 0%,#fce7f3 45%,#ede9fe 100%); border:1px solid #fbcfe8; display:grid; grid-template-columns:1.1fr .9fr; gap:28px; align-items:center; }
        .sr-badge { display:inline-block; padding:6px 14px; border-radius:999px; background:#fff; color:#be185d; font-weight:800; font-size:13px; border:1.5px solid #f9a8d4; }
        .sr-btn { display:inline-block; padding:13px 22px; border-radius:16px; background:linear-gradient(135deg,#ec4899,#8b5cf6); color:#fff; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 10px 24px rgba(236,72,153,.35); transition:transform .2s; }
        .sr-btn:hover { transform:translateY(-2px); }
        .sr-h2 { font-size:24px; font-weight:800; color:#1e1b4b; margin:46px 0 6px; }
        .sr-sub { color:#6b7280; margin:0 0 20px; font-size:15px; }
        .sr-prizes { display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:16px; }
        .sr-prize { border-radius:24px; padding:24px; color:#fff; position:relative; overflow:hidden; min-height:200px; display:flex; flex-direction:column; justify-content:flex-end; transition:transform .3s; }
        .sr-prize:hover { transform:translateY(-6px) rotate(-.4deg); }
        .sr-prize .big { position:absolute; right:14px; top:6px; font-size:84px; opacity:.9; filter:drop-shadow(0 8px 14px rgba(0,0,0,.25)); }
        .sr-pill { align-self:flex-start; padding:4px 12px; border-radius:99px; background:rgba(255,255,255,.22); font-size:12px; font-weight:800; letter-spacing:.5px; text-transform:uppercase; margin-bottom:8px; }
        .sr-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .sr-step { background:#fff; border-radius:22px; padding:22px; border:1px solid #f1f1f4; }
        .sr-track { display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none; padding:4px 2px 8px; }
        .sr-track::-webkit-scrollbar { display:none; }
        .sr-win { margin:0; flex:0 0 calc((100% - 32px) / 3); scroll-snap-align:start; border-radius:22px; overflow:hidden; background:#fff; border:1px solid #f1f1f4; box-shadow:0 10px 24px rgba(17,12,46,.06); position:relative; }
        .sr-win img { width:100%; aspect-ratio:3/4; object-fit:cover; display:block; }
        .sr-win figcaption { position:absolute; left:0; right:0; bottom:0; padding:30px 16px 14px; color:#fff; background:linear-gradient(transparent,rgba(30,10,60,.78)); display:flex; flex-direction:column; }
        .sr-arrow { position:absolute; top:42%; z-index:2; width:44px; height:44px; border-radius:50%; border:none; background:#fff; color:#7c3aed; font-size:26px; line-height:1; cursor:pointer; box-shadow:0 8px 18px rgba(17,12,46,.18); transition:background .2s,color .2s,transform .2s; }
        .sr-arrow:hover { background:#7c3aed; color:#fff; transform:scale(1.1); }
        .sr-prev { left:-14px; } .sr-next { right:-14px; }
        @media (max-width:860px) { .sr-hero { grid-template-columns:1fr; padding:24px 20px; } .sr-prizes, .sr-steps { grid-template-columns:1fr; } .sr-win { flex-basis:calc((100% - 16px) / 2); } }
        @media (max-width:520px) { .sr-win { flex-basis:82%; } .sr-prev { left:2px; } .sr-next { right:2px; } }
      ` }} />

      {/* ---------- Hero ---------- */}
      <section className="sr-hero">
        <div>
          <span className="sr-badge">¡En Coquecutes ganas más! · {sorteo.mes}</span>
          <h1 style={{ fontSize: "clamp(34px,5.5vw,52px)", lineHeight: 1.05, fontWeight: 800, margin: "16px 0 12px", color: "#1e1b4b" }}>
            Sorteo <span style={{ color: "#ec4899" }}>del mes</span>
          </h1>
          <p style={{ margin: "0 0 8px", color: "#4b5563", lineHeight: 1.6, fontSize: "16px" }}>
            Cada subasta que ganas es un ticket para el sorteo mensual. Mientras más ganas, más oportunidades tienes.
          </p>
          {sorteo.transmision && <p style={{ margin: "0 0 18px", color: "#7c3aed", fontWeight: 700, fontSize: "14px" }}>📺 {sorteo.transmision}</p>}
          {cd && !cd.done && (
            <div style={{ display: "flex", gap: "8px", margin: "0 0 20px" }}>
              {[["d", "días"], ["h", "horas"], ["m", "min"], ["s", "seg"]].map(([k, l]) => (
                <div key={k} style={{ minWidth: "58px", textAlign: "center", padding: "8px 4px", borderRadius: "14px", background: "#fff", border: "1px solid #fbcfe8" }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#be185d", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{String(cd[k]).padStart(2, "0")}</div>
                  <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", marginTop: "3px" }}>{l}</div>
                </div>
              ))}
            </div>
          )}
          {!sorteo.fechaSorteo && <p style={{ margin: "0 0 18px", color: "#be185d", fontWeight: 800 }}>🗓️ Sorteo a fin de mes</p>}
          <Link href="/subastas" className="sr-btn">Quiero mis tickets · Ver subastas</Link>
        </div>
        <img src={sorteo.flyer} alt={`Sorteo del mes ${sorteo.mes}`} style={{ width: "100%", borderRadius: "22px", boxShadow: "0 18px 40px rgba(190,24,93,.18)", display: "block" }} />
      </section>

      {/* ---------- Premios ---------- */}
      <section id="premios">
        <h2 className="sr-h2">Premios de {sorteo.mes}</h2>
        <p className="sr-sub">Tres ganadores. Cada ticket es una oportunidad más de ganar.</p>
        <div className="sr-prizes">
          {premios.map((p) => (
            <div key={p.puesto} className="sr-prize" style={{ background: gradBg(p.grad) }}>
              <span className="big">{p.emoji}</span>
              <span className="sr-pill">{p.puesto === 1 ? "Gran premio" : `Premio ${p.puesto}`}</span>
              <strong style={{ fontSize: p.puesto === 1 ? "30px" : "24px", lineHeight: 1.1 }}>{p.titulo}</strong>
              <span style={{ fontSize: "14px", opacity: 0.92, marginTop: "4px", lineHeight: 1.45 }}>{p.detalle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Cómo ganar tickets ---------- */}
      <section id="tickets">
        <h2 className="sr-h2">¿Cómo ganar tickets?</h2>
        <p className="sr-sub">Participar es automático: ganas subastas, sumas tickets.</p>
        <div className="sr-steps">
          {tickets.map((t) => (
            <div key={t.titulo} className="sr-step">
              <div style={{ fontSize: "34px", marginBottom: "8px" }}>{t.emoji}</div>
              <strong style={{ color: "#1e1b4b", fontSize: "17px" }}>{t.titulo}</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.55 }}>{t.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Ganadores ---------- */}
      {ganadores.length > 0 && (
        <section id="ganadores">
          <h2 className="sr-h2">Ganadores de sorteos anteriores 🏆</h2>
          <p className="sr-sub">Clientes reales que ya se llevaron su premio. El próximo puedes ser tú.</p>
          <Winners />
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section style={{ margin: "46px 0 10px", padding: "28px", borderRadius: "24px", background: "linear-gradient(135deg,#2e1065,#7e22ce)", color: "#fff", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <strong style={{ fontSize: "20px" }}>¿Dudas sobre el sorteo o tus tickets?</strong>
          <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: "14px" }}>Escríbenos y te decimos cuántos tickets llevas.</p>
        </div>
        <a className="sr-btn" href={waLink("Hola Coquecutes, quiero saber cuántos tickets tengo para el sorteo del mes")} target="_blank" rel="noopener noreferrer">Consultar mis tickets</a>
      </section>
    </div>
  );
}
