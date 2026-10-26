"use client";
import { useState, useEffect, useMemo } from "react";
import { subastaConfig, calendario, tiposSubasta, lotes, resultados } from "../../data/subastas";

const WA = "51962167068";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const money = (n) => `S/${Number(n).toFixed(Number.isInteger(n) ? 0 : 2)}`;
const gradBg = (g) => `linear-gradient(145deg, ${g[0]}, ${g[1]})`;

/* ---------- Calendario calculado (hora de Perú, UTC-5) ---------- */
function buildAuctions() {
  const [y, m, d] = subastaConfig.referencia.fecha.split("-").map(Number);
  const [hh, mm] = subastaConfig.horaCierre.split(":").map(Number);
  const base = Date.UTC(y, m - 1, d);
  const list = [];
  for (let off = -42; off <= 70; off++) {
    const t = new Date(base + off * 86400000);
    const slot = calendario.find((c) => c.dia === t.getUTCDay());
    if (!slot) continue;
    list.push({
      off,
      tipo: slot.tipo,
      dia: t.getUTCDay(),
      fecha: `${t.getUTCDate()} ${MESES[t.getUTCMonth()]}`,
      cierre: Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), hh + 5, mm),
    });
  }
  const refIdx = list.findIndex((a) => a.off === 0);
  return list.map((a, i) => ({ ...a, numero: subastaConfig.referencia.numero + (i - refIdx) }));
}

function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function parts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function Countdown({ ms, light }) {
  const p = parts(ms);
  const cells = [["d", "días"], ["h", "horas"], ["m", "min"], ["s", "seg"]];
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {cells.map(([k, l]) => (
        <div key={k} style={{ minWidth: "64px", textAlign: "center", padding: "10px 6px", borderRadius: "14px", background: light ? "rgba(255,255,255,0.14)" : "#f5f3ff", color: light ? "#fff" : "#4c1d95" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{String(p[k]).padStart(2, "0")}</div>
          <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px", textTransform: "uppercase", letterSpacing: ".5px" }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function LotCard({ lot, auction, closed }) {
  const t = tiposSubasta[auction.tipo];
  const inc = subastaConfig.incremento;
  const base = lot.ofertaActual ?? lot.precioBase;
  const next = lot.ofertaActual != null ? lot.ofertaActual + inc : lot.precioBase;
  const msg = `Hola Coquecutes, quiero pujar ${money(next)} por «${lot.nombre}» en la Subasta #${auction.numero}`;
  return (
    <article className="sb-lot">
      <div className="sb-lot-img" style={{ background: lot.image ? "#f3f4f6" : gradBg(t.grad) }}>
        {lot.image ? <img src={lot.image} alt={lot.nombre} loading="lazy" /> : <span style={{ fontSize: "64px" }}>{t.emoji}</span>}
        {lot.demo && <span className="sb-demo">Ejemplo</span>}
      </div>
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.3 }}>{lot.nombre}</h3>
        {lot.detalle && <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>{lot.detalle}</p>}
        <div style={{ marginTop: "auto", paddingTop: "6px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".4px" }}>
            {lot.ofertaActual != null ? "Oferta actual" : "Precio base · sin ofertas"}
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#1e1b4b" }}>{money(base)}</div>
        </div>
        {closed ? (
          <div className="sb-btn sb-btn-off">Subasta cerrada</div>
        ) : (
          <a className="sb-btn" href={waLink(msg)} target="_blank" rel="noopener noreferrer">
            Pujar {money(next)} por WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}

export default function SubastasPage() {
  const now = useNow();
  const auctions = useMemo(buildAuctions, []);
  const [sel, setSel] = useState(null);

  const currentIdx = now == null ? -1 : auctions.findIndex((a) => a.cierre > now);
  const upcoming = currentIdx >= 0 ? auctions.slice(currentIdx, currentIdx + 6) : [];
  const current = upcoming[0];
  const shown = upcoming.find((a) => a.numero === sel) || current;
  const week = upcoming.slice(0, 3);
  const shownLots = shown ? lotes.filter((l) => l.subasta === shown.numero) : [];
  const closed = shown && now != null && shown.cierre <= now;
  const hasDemo = lotes.some((l) => l.demo);

  const whenLabel = (a) => {
    const t = new Date(a.cierre - 5 * 3600000);
    const todayLima = new Date(now - 5 * 3600000);
    const same = t.getUTCDate() === todayLima.getUTCDate() && t.getUTCMonth() === todayLima.getUTCMonth();
    return same ? "Hoy" : `${DIAS[a.dia]} ${a.fecha}`;
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .sb-hero { border-radius:28px; padding:34px 36px; color:#fff; background:linear-gradient(135deg,#2e1065 0%,#4c1d95 55%,#7e22ce 100%); position:relative; overflow:hidden; display:flex; gap:28px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
        .sb-hero::after { content:""; position:absolute; right:-80px; top:-80px; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle,rgba(236,72,153,.45),transparent 70%); pointer-events:none; }
        .sb-live { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:999px; background:rgba(255,255,255,.14); font-size:13px; font-weight:700; }
        .sb-dot { width:9px; height:9px; border-radius:50%; background:#f472b6; box-shadow:0 0 0 0 rgba(244,114,182,.7); animation:sbPulse 1.6s infinite; }
        @keyframes sbPulse { 70% { box-shadow:0 0 0 10px rgba(244,114,182,0);} 100% { box-shadow:0 0 0 0 rgba(244,114,182,0);} }
        .sb-cta { display:inline-block; padding:13px 22px; border-radius:16px; background:linear-gradient(135deg,#ec4899,#8b5cf6); color:#fff; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 10px 24px rgba(236,72,153,.35); transition:transform .2s; }
        .sb-cta:hover { transform:translateY(-2px); }
        .sb-h2 { font-size:24px; font-weight:800; color:#1e1b4b; margin:44px 0 6px; }
        .sb-sub { color:#6b7280; margin:0 0 20px; font-size:15px; }
        .sb-week { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .sb-day { border-radius:22px; padding:20px; background:#fff; border:2px solid #ede9fe; cursor:pointer; text-align:left; font-family:inherit; transition:transform .25s, box-shadow .25s, border-color .25s; }
        .sb-day:hover { transform:translateY(-4px); box-shadow:0 14px 28px rgba(124,58,237,.14); }
        .sb-day.is-sel { border-color:#7c3aed; box-shadow:0 14px 30px rgba(124,58,237,.18); }
        .sb-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:999px; font-size:13px; font-weight:800; color:#fff; }
        .sb-lots { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:20px; }
        .sb-lot { background:#fff; border-radius:22px; overflow:hidden; border:1px solid #f1f1f4; display:flex; flex-direction:column; transition:transform .3s, box-shadow .3s; }
        .sb-lot:hover { transform:translateY(-6px); box-shadow:0 18px 34px rgba(17,12,46,.1); }
        .sb-lot-img { position:relative; aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .sb-lot-img img { width:100%; height:100%; object-fit:cover; }
        .sb-demo { position:absolute; top:10px; left:10px; background:rgba(0,0,0,.55); color:#fff; font-size:11px; font-weight:700; padding:3px 10px; border-radius:999px; }
        .sb-btn { display:block; text-align:center; padding:12px; border-radius:14px; background:#7c3aed; color:#fff; font-weight:800; text-decoration:none; font-size:14px; transition:background .2s, transform .2s; margin-top:8px; }
        .sb-btn:hover { background:#6d28d9; transform:translateY(-2px); }
        .sb-btn-off { background:#e5e7eb; color:#6b7280; pointer-events:none; }
        .sb-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .sb-step { background:#fff; border-radius:20px; padding:20px; border:1px solid #f1f1f4; }
        .sb-num { width:36px; height:36px; border-radius:12px; background:#f5f3ff; color:#7c3aed; font-weight:800; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
        .sb-table { width:100%; border-collapse:collapse; background:#fff; border-radius:18px; overflow:hidden; }
        .sb-table th, .sb-table td { padding:12px 16px; text-align:left; font-size:14px; border-bottom:1px solid #f1f1f4; }
        .sb-table th { background:#f5f3ff; color:#4c1d95; font-size:12px; text-transform:uppercase; letter-spacing:.5px; }
        @media (max-width:860px) { .sb-week { grid-template-columns:1fr; } .sb-steps { grid-template-columns:1fr 1fr; } .sb-hero { padding:26px 22px; } }
        @media (max-width:520px) { .sb-steps { grid-template-columns:1fr; } }
      ` }} />

      {/* ---------- Subasta actual ---------- */}
      <section id="actual" className="sb-hero">
        <div style={{ position: "relative", zIndex: 1, maxWidth: "520px" }}>
          {current ? (
            <>
              <span className="sb-live"><span className="sb-dot" /> Subasta #{current.numero} · {tiposSubasta[current.tipo].label} {tiposSubasta[current.tipo].emoji}</span>
              <h1 style={{ fontSize: "clamp(30px,5vw,44px)", lineHeight: 1.1, fontWeight: 800, margin: "16px 0 10px" }}>
                Puja por {current.tipo === "cartas" ? "cartas" : current.tipo === "figuras" ? "figuras" : "proxys"} con <span style={{ color: "#f9a8d4" }}>precios de locura</span>
              </h1>
              <p style={{ margin: "0 0 18px", opacity: 0.88, lineHeight: 1.6 }}>
                Cierra {whenLabel(current).toLowerCase()} a las {subastaConfig.horaCierre} (hora Perú). Tres subastas por semana: lunes, miércoles y viernes.
              </p>
              <a className="sb-cta" href="#lotes">Ver los lotes</a>
            </>
          ) : (
            <h1 style={{ fontSize: "34px", margin: 0 }}>Subastas Coquecutes</h1>
          )}
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          {current && now != null && (
            <>
              <div style={{ fontSize: "13px", fontWeight: 700, opacity: 0.85, marginBottom: "10px", textTransform: "uppercase", letterSpacing: ".6px" }}>Cierra en</div>
              <Countdown ms={current.cierre - now} light />
            </>
          )}
        </div>
      </section>

      {/* ---------- Calendario de la semana ---------- */}
      <section id="calendario">
        <h2 className="sb-h2">Próximas subastas</h2>
        <p className="sb-sub">Elige una para ver sus lotes. Cada día se subasta algo distinto.</p>
        <div className="sb-week">
          {week.map((a, i) => {
            const t = tiposSubasta[a.tipo];
            const active = shown && shown.numero === a.numero;
            return (
              <button key={a.numero} type="button" className={`sb-day ${active ? "is-sel" : ""}`} onClick={() => setSel(a.numero)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span className="sb-chip" style={{ background: gradBg(t.grad) }}>{t.emoji} {t.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#7c3aed" }}>#{a.numero}</span>
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1e1b4b" }}>{whenLabel(a)}</div>
                <div style={{ fontSize: "14px", color: "#6b7280", margin: "2px 0 10px" }}>Cierre {subastaConfig.horaCierre}</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: i === 0 ? "#be185d" : "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px" }}>
                  {i === 0 ? "● Abierta ahora" : "Próxima"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- Lotes ---------- */}
      <section id="lotes">
        {shown && (
          <>
            <h2 className="sb-h2">Lotes de la subasta #{shown.numero} · {tiposSubasta[shown.tipo].label} {tiposSubasta[shown.tipo].emoji}</h2>
            <p className="sb-sub">
              Puja mínima: +{money(subastaConfig.incremento)} sobre la oferta actual. {subastaConfig.extension}
            </p>
            {shownLots.length > 0 ? (
              <div className="sb-lots">
                {shownLots.map((l) => <LotCard key={l.id} lot={l} auction={shown} closed={closed} />)}
              </div>
            ) : (
              <div style={{ padding: "36px 20px", textAlign: "center", background: "#fff", borderRadius: "22px", border: "1px dashed #c4b5fd" }}>
                <div style={{ fontSize: "40px" }}>{tiposSubasta[shown.tipo].emoji}</div>
                <strong style={{ color: "#1e1b4b", fontSize: "18px" }}>Estamos preparando los lotes</strong>
                <p style={{ color: "#6b7280", margin: "6px 0 14px" }}>Los publicamos poco antes de abrir la subasta.</p>
                <a className="sb-cta" href={waLink(`Hola Coquecutes, avísenme cuando publiquen los lotes de la Subasta #${shown.numero}`)} target="_blank" rel="noopener noreferrer">Avísame por WhatsApp</a>
              </div>
            )}
            {hasDemo && <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>* Los lotes marcados como «Ejemplo» son de muestra.</p>}
          </>
        )}
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section id="como-funciona">
        <h2 className="sb-h2">¿Cómo funciona?</h2>
        <div className="sb-steps">
          {[
            ["Elige un lote", "Mira los lotes de la subasta abierta y escoge el que quieres."],
            ["Puja por WhatsApp", "Toca el botón y te abre el chat con tu oferta lista para enviar."],
            ["Gana al cierre", "Gana la oferta más alta cuando termina la cuenta regresiva."],
            ["Paga y recibe", "Pagas con Yape, Plin o Interbank y te lo enviamos a todo el país."],
          ].map(([t, d], i) => (
            <div key={t} className="sb-step">
              <div className="sb-num">{i + 1}</div>
              <strong style={{ color: "#1e1b4b" }}>{t}</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.55 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Resultados ---------- */}
      {resultados.length > 0 && (
        <section id="resultados">
          <h2 className="sb-h2">Resultados anteriores</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="sb-table">
              <thead><tr><th>Subasta</th><th>Tipo</th><th>Lote</th><th>Precio final</th><th>Ganó</th></tr></thead>
              <tbody>
                {resultados.map((r, i) => (
                  <tr key={i}><td>#{r.subasta}</td><td>{tiposSubasta[r.tipo]?.emoji} {tiposSubasta[r.tipo]?.label}</td><td>{r.lote}</td><td><strong>{money(r.precio)}</strong></td><td>{r.ganador}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ---------- Vende en subasta ---------- */}
      <section style={{ margin: "44px 0 10px", padding: "26px", borderRadius: "22px", background: "#f5f3ff", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <strong style={{ fontSize: "18px", color: "#1e1b4b" }}>¿Quieres subastar tus cartas, figuras o proxys?</strong>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>Escríbenos y los ponemos en la próxima subasta.</p>
        </div>
        <a className="sb-cta" href={waLink("Hola Coquecutes, quiero poner mis productos en una subasta")} target="_blank" rel="noopener noreferrer">Quiero subastar</a>
      </section>
    </div>
  );
}
