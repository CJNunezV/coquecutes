"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { subastaConfig, facebook, albumes, calendario, calendarioMeses, tiposSubasta, reglas, sorteo } from "../../data/subastas";

const WA = "51962376893";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES_FULL = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const gradBg = (g) => `linear-gradient(145deg, ${g[0]}, ${g[1]})`;
const fbUrl = (a) => albumes[a?.numero] || facebook.pagina || `https://www.facebook.com/search/top?q=${encodeURIComponent(facebook.nombre)}`;
const horaLabel = () => {
  const [h, m] = subastaConfig.horaCierre.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

/* ---------- Calendario calculado (hora de Perú, UTC-5) ---------- */
function buildAuctions() {
  if (calendarioMeses && calendarioMeses.length) {
    const [hh, mm] = subastaConfig.horaCierre.split(":").map(Number);
    const out = [];
    calendarioMeses.forEach(({ year, month, eventos }) => {
      eventos.filter((e) => e.t === "subasta").forEach((e) => {
        const t = new Date(Date.UTC(year, month - 1, e.d));
        out.push({
          numero: e.n,
          tipo: e.tipo && tiposSubasta[e.tipo] ? e.tipo : "subasta",
          dia: t.getUTCDay(),
          dm: `${e.d}/${String(month).padStart(2, "0")}`,
          fecha: `${e.d} ${MESES[month - 1]}`,
          cierre: Date.UTC(year, month - 1, e.d, hh + 5, mm),
        });
      });
    });
    return out.sort((a, b) => a.cierre - b.cierre);
  }
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
      dm: `${t.getUTCDate()}/${String(t.getUTCMonth() + 1).padStart(2, "0")}`,
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

function Countdown({ ms }) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const p = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {[["d", "días"], ["h", "horas"], ["m", "min"], ["s", "seg"]].map(([k, l]) => (
        <div key={k} style={{ minWidth: "64px", textAlign: "center", padding: "10px 6px", borderRadius: "14px", background: "rgba(255,255,255,0.14)", color: "#fff" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{String(p[k]).padStart(2, "0")}</div>
          <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px", textTransform: "uppercase", letterSpacing: ".5px" }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Calendario del mes (como el flyer) ---------- */
const EV = {
  subasta: { bg: "#f6c453", fg: "#6a3059", ring: "#6a3059" },
  envio: { bg: "#e53935", fg: "#fff", ring: "#6a3059" },
  entrega: { bg: "#22c55e", fg: "#06240f", ring: "#6a3059" },
  sorteo: { bg: "#fde3ec", fg: "#e0698f", ring: "#e0698f" },
};
const TruckIcon = () => (
  <svg width="62%" height="62%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5h10v9H3zM13 8h4l3 3v3h-7zM6.5 15.5a1.8 1.8 0 1 0 .01 0zm10 0a1.8 1.8 0 1 0 .01 0z" /><circle cx="6.5" cy="16" r="1.9" /><circle cx="16.5" cy="16" r="1.9" /></svg>
);
function MonthGrid({ year, month, eventos, todayKey }) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7; // semana empieza en lunes
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const byDay = {};
  eventos.forEach((e) => { byDay[e.d] = e; });
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return (
    <div className="sb-cal">
      <div className="sb-cal-title">{MESES_FULL[month - 1]} {year}</div>
      <div className="sb-cal-grid">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((n) => <div key={n} className="sb-cal-h">{n}</div>)}
        {cells.map((d, i) => {
          const e = d && byDay[d];
          const st = e && EV[e.t];
          const isToday = d && todayKey === `${year}-${month}-${d}`;
          return (
            <div key={i} className={`sb-cal-c ${d ? "" : "is-empty"} ${isToday ? "is-today" : ""}`}>
              {d && <span className="sb-cal-d">{d}</span>}
              {e && (
                <span className="sb-cal-dot" style={{ background: st.bg, color: st.fg, borderColor: st.ring }} title={e.t}>
                  {e.t === "subasta" ? `S${e.n}` : e.t === "entrega" ? "E" : e.t === "envio" ? <TruckIcon /> : "♥"}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="sb-cal-legend">
        <span><i style={{ background: EV.subasta.bg }} />Subasta Coquecutes</span>
        <span><i style={{ background: EV.envio.bg }} />Envío por Shalom/Olva</span>
        <span><i style={{ background: EV.entrega.bg }} />Entrega FM/Arenales</span>
        <span><i style={{ background: EV.sorteo.bg, borderColor: EV.sorteo.ring }} />Gran sorteo mensual</span>
      </div>
    </div>
  );
}

const FbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.5-3.2h-3.2V8.7c0-.9.4-1.7 1.8-1.7h1.5V4.2S15.5 4 14.3 4c-2.6 0-4.3 1.6-4.3 4.4v2.4H7.2V14H10v8h3.5z" /></svg>
);

export default function SubastasPage() {
  const now = useNow();
  const auctions = useMemo(buildAuctions, []);
  const idx = now == null ? -1 : auctions.findIndex((a) => a.cierre > now);
  const upcoming = idx >= 0 ? auctions.slice(idx, idx + 3) : [];
  const current = upcoming[0];
  const todayKey = now == null ? "" : (() => { const p = new Date(now - 5 * 3600000); return `${p.getUTCFullYear()}-${p.getUTCMonth() + 1}-${p.getUTCDate()}`; })();

  const whenLabel = (a) => {
    const t = new Date(a.cierre - 5 * 3600000);
    const td = new Date(now - 5 * 3600000);
    const same = t.getUTCDate() === td.getUTCDate() && t.getUTCMonth() === td.getUTCMonth();
    return same ? "Hoy" : `${DIAS[a.dia]} ${a.dm}`;
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .sb-hero { border-radius:28px; padding:34px 36px; color:#fff; background:linear-gradient(135deg,#704066 0%,#96507c 55%,#a62d5c 100%); position:relative; overflow:hidden; display:flex; gap:28px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
        .sb-hero::after { content:""; position:absolute; right:-80px; top:-80px; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle,rgba(236,72,153,.45),transparent 70%); pointer-events:none; }
        .sb-live { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:999px; background:rgba(255,255,255,.14); font-size:13px; font-weight:700; }
        .sb-dot { width:9px; height:9px; border-radius:50%; background:#f58bab; box-shadow:0 0 0 0 rgba(244,114,182,.7); animation:sbPulse 1.6s infinite; }
        @keyframes sbPulse { 70% { box-shadow:0 0 0 10px rgba(244,114,182,0);} 100% { box-shadow:0 0 0 0 rgba(244,114,182,0);} }
        .sb-fb { display:inline-flex; align-items:center; gap:10px; padding:14px 24px; border-radius:16px; background:#1877f2; color:#fff; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 10px 24px rgba(24,119,242,.4); transition:transform .2s, background .2s; }
        .sb-fb:hover { transform:translateY(-2px); background:#0f63d0; }
        .sb-cta { display:inline-block; padding:13px 22px; border-radius:16px; background:linear-gradient(135deg,#f59ab6,#e66791); color:#fff; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 10px 24px rgba(236,72,153,.35); transition:transform .2s; }
        .sb-cta:hover { transform:translateY(-2px); }
        .sb-h2 { font-size:24px; font-weight:800; color:#5f2d52; margin:44px 0 6px; }
        .sb-sub { color:#6b7280; margin:0 0 20px; font-size:15px; }
        .sb-week { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .sb-day { border-radius:22px; padding:20px; background:#fff; border:2px solid #ffebf2; text-decoration:none; display:block; transition:transform .25s, box-shadow .25s, border-color .25s; }
        .sb-day:hover { transform:translateY(-4px); box-shadow:0 14px 28px rgba(224,105,143,.14); border-color:#f394b4; }
        .sb-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:999px; font-size:13px; font-weight:800; color:#fff; }
        .sb-cal { background:#fff; border:2px solid #ffebf2; border-radius:22px; padding:18px; margin-bottom:22px; box-shadow:0 8px 22px rgba(224,105,143,.08); }
        .sb-cal-title { font-size:22px; font-weight:900; color:#e0698f; margin:0 0 12px; letter-spacing:.3px; text-transform:uppercase; }
        .sb-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); border-top:1px solid #f1dfe7; border-left:1px solid #f1dfe7; }
        .sb-cal-h { background:#fbe3ee; color:#7a3d68; font-size:12px; font-weight:800; letter-spacing:1px; text-align:center; padding:8px 2px; border-right:1px solid #f1dfe7; border-bottom:1px solid #f1dfe7; }
        .sb-cal-c { position:relative; min-height:84px; border-right:1px solid #f1dfe7; border-bottom:1px solid #f1dfe7; display:flex; align-items:center; justify-content:center; padding:18px 2px 4px; }
        .sb-cal-c.is-empty { background:#fff8fb; }
        .sb-cal-c.is-today { background:#fff3f7; box-shadow:inset 0 0 0 2px #e0698f; }
        .sb-cal-d { position:absolute; top:5px; left:7px; font-size:12px; font-weight:800; color:#7a3d68; }
        .sb-cal-dot { width:54px; height:54px; border-radius:50%; border:2.5px solid; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:15px; }
        .sb-cal-legend { display:flex; flex-wrap:wrap; gap:8px 22px; margin-top:14px; font-size:13px; font-weight:700; color:#7a3d68; }
        .sb-cal-legend span { display:inline-flex; align-items:center; gap:8px; }
        .sb-cal-legend i { width:16px; height:16px; border-radius:50%; border:2px solid #6a3059; display:inline-block; }
        @media (max-width:640px) { .sb-cal { padding:12px; } .sb-cal-c { min-height:56px; padding-top:16px; } .sb-cal-dot { width:34px; height:34px; font-size:10.5px; border-width:2px; } .sb-cal-d { font-size:10px; left:4px; top:3px; } .sb-cal-h { font-size:10px; letter-spacing:0; } }
        .sb-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .sb-step { background:#fff; border-radius:20px; padding:20px; border:1px solid #f1f1f4; }
        .sb-num { width:36px; height:36px; border-radius:12px; background:#fff3f7; color:#e0698f; font-weight:800; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
        @media (max-width:860px) { .sb-week { grid-template-columns:1fr; } .sb-steps { grid-template-columns:1fr 1fr; } .sb-hero { padding:26px 22px; } }
        @media (max-width:520px) { .sb-steps { grid-template-columns:1fr; } }
      ` }} />

      {/* ---------- Subasta actual ---------- */}
      <section id="actual" className="sb-hero">
        <div style={{ position: "relative", zIndex: 1, maxWidth: "540px" }}>
          {current ? (
            <>
              <span className="sb-live"><span className="sb-dot" /> Subasta #{current.numero} · {tiposSubasta[current.tipo].label} {tiposSubasta[current.tipo].emoji}</span>
              <h1 style={{ fontSize: "clamp(30px,5vw,44px)", lineHeight: 1.1, fontWeight: 800, margin: "16px 0 10px" }}>
                Subastas en vivo en <span style={{ color: "#f9b4c6" }}>Facebook</span>
              </h1>
              <p style={{ margin: "0 0 20px", opacity: 0.9, lineHeight: 1.6 }}>
                Cierra {whenLabel(current).toLowerCase()} a las {horaLabel()} (hora Perú). Entra al álbum, elige tu lote y puja en los comentarios desde S/{subastaConfig.pujaInicial}. Únete a la comunidad de {subastaConfig.seguidores} seguidores.
              </p>
              <a className="sb-fb" href={fbUrl(current)} target="_blank" rel="noopener noreferrer"><FbIcon /> Ir a la subasta #{current.numero}</a>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "34px", margin: "0 0 16px" }}>Subastas Coquecutes</h1>
              <a className="sb-fb" href={fbUrl()} target="_blank" rel="noopener noreferrer"><FbIcon /> Ver en Facebook</a>
            </>
          )}
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          {current && now != null && (
            <>
              <div style={{ fontSize: "13px", fontWeight: 700, opacity: 0.85, marginBottom: "10px", textTransform: "uppercase", letterSpacing: ".6px" }}>Cierra en</div>
              <Countdown ms={current.cierre - now} />
            </>
          )}
        </div>
      </section>

      {/* ---------- Calendario ---------- */}
      <section id="calendario">
        <h2 className="sb-h2">Próximas subastas</h2>
        <p className="sb-sub">Este es el cronograma del mes: las subastas cierran a las {horaLabel()} (hora Perú). Toca una subasta de abajo para ir al álbum.</p>
        {calendarioMeses && calendarioMeses.map((m) => <MonthGrid key={`${m.year}-${m.month}`} {...m} todayKey={todayKey} />)}
        <div className="sb-week">
          {upcoming.map((a, i) => {
            const t = tiposSubasta[a.tipo];
            return (
              <a key={a.numero} className="sb-day" href={fbUrl(a)} target="_blank" rel="noopener noreferrer">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span className="sb-chip" style={{ background: gradBg(t.grad) }}>{t.emoji} {t.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#e0698f" }}>#{a.numero}</span>
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#5f2d52" }}>{whenLabel(a)}</div>
                <div style={{ fontSize: "14px", color: "#6b7280", margin: "2px 0 10px" }}>Cierre {horaLabel()}</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: i === 0 ? "#cc5580" : "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px" }}>
                  {i === 0 ? "● Abierta ahora" : "Próxima"}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ---------- Reglas ---------- */}
      <section id="reglas">
        <h2 className="sb-h2">Reglas de la subasta</h2>
        <p className="sb-sub">Así funcionan todas nuestras subastas en Facebook.</p>
        <div className="sb-steps">
          {reglas.map((r) => (
            <div key={r.n} className="sb-step">
              <div className="sb-num">{r.n}</div>
              <strong style={{ color: "#5f2d52" }}>{r.titulo}</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.55 }}>{r.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Sorteo ---------- */}
      <section id="sorteo" style={{ margin: "28px 0 0", padding: "22px 26px", borderRadius: "22px", background: "linear-gradient(135deg,#fdf2f8,#fff3f7)", border: "1px solid #fbcfe8", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "40px" }}>🎟️</span>
          <div>
            <strong style={{ fontSize: "18px", color: "#5f2d52" }}>Cada subasta ganada = 1 ticket para el sorteo del mes</strong>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>{sorteo} Mira los premios y a los ganadores anteriores.</p>
          </div>
        </div>
        <Link className="sb-cta" href="/sorteo">Ver el sorteo</Link>
      </section>

      {/* ---------- Vende en subasta ---------- */}
      <section style={{ margin: "28px 0 10px", padding: "26px", borderRadius: "22px", background: "#fff3f7", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <strong style={{ fontSize: "18px", color: "#5f2d52" }}>¿Quieres subastar tus cartas, figuras o proxys?</strong>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>Escríbenos y los ponemos en la próxima subasta.</p>
        </div>
        <a className="sb-cta" href={waLink("Hola Coquecutes, quiero poner mis productos en una subasta")} target="_blank" rel="noopener noreferrer">Quiero subastar</a>
      </section>
    </div>
  );
}
