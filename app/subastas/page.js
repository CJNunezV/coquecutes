"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { subastaConfig, facebook, albumes, calendario, tiposSubasta, reglas, sorteo } from "../../data/subastas";

const WA = "51962167068";
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const gradBg = (g) => `linear-gradient(145deg, ${g[0]}, ${g[1]})`;
const fbUrl = (a) => albumes[a?.numero] || facebook.pagina || `https://www.facebook.com/search/top?q=${encodeURIComponent(facebook.nombre)}`;
const horaLabel = () => {
  const [h, m] = subastaConfig.horaCierre.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

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

const FbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.5-3.2h-3.2V8.7c0-.9.4-1.7 1.8-1.7h1.5V4.2S15.5 4 14.3 4c-2.6 0-4.3 1.6-4.3 4.4v2.4H7.2V14H10v8h3.5z" /></svg>
);

export default function SubastasPage() {
  const now = useNow();
  const auctions = useMemo(buildAuctions, []);
  const idx = now == null ? -1 : auctions.findIndex((a) => a.cierre > now);
  const upcoming = idx >= 0 ? auctions.slice(idx, idx + 3) : [];
  const current = upcoming[0];

  const whenLabel = (a) => {
    const t = new Date(a.cierre - 5 * 3600000);
    const td = new Date(now - 5 * 3600000);
    const same = t.getUTCDate() === td.getUTCDate() && t.getUTCMonth() === td.getUTCMonth();
    return same ? "Hoy" : `${DIAS[a.dia]} ${a.dm}`;
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .sb-hero { border-radius:28px; padding:34px 36px; color:#fff; background:linear-gradient(135deg,#2e1065 0%,#4c1d95 55%,#7e22ce 100%); position:relative; overflow:hidden; display:flex; gap:28px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
        .sb-hero::after { content:""; position:absolute; right:-80px; top:-80px; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle,rgba(236,72,153,.45),transparent 70%); pointer-events:none; }
        .sb-live { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:999px; background:rgba(255,255,255,.14); font-size:13px; font-weight:700; }
        .sb-dot { width:9px; height:9px; border-radius:50%; background:#f472b6; box-shadow:0 0 0 0 rgba(244,114,182,.7); animation:sbPulse 1.6s infinite; }
        @keyframes sbPulse { 70% { box-shadow:0 0 0 10px rgba(244,114,182,0);} 100% { box-shadow:0 0 0 0 rgba(244,114,182,0);} }
        .sb-fb { display:inline-flex; align-items:center; gap:10px; padding:14px 24px; border-radius:16px; background:#1877f2; color:#fff; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 10px 24px rgba(24,119,242,.4); transition:transform .2s, background .2s; }
        .sb-fb:hover { transform:translateY(-2px); background:#0f63d0; }
        .sb-cta { display:inline-block; padding:13px 22px; border-radius:16px; background:linear-gradient(135deg,#ec4899,#8b5cf6); color:#fff; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 10px 24px rgba(236,72,153,.35); transition:transform .2s; }
        .sb-cta:hover { transform:translateY(-2px); }
        .sb-h2 { font-size:24px; font-weight:800; color:#1e1b4b; margin:44px 0 6px; }
        .sb-sub { color:#6b7280; margin:0 0 20px; font-size:15px; }
        .sb-week { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .sb-day { border-radius:22px; padding:20px; background:#fff; border:2px solid #ede9fe; text-decoration:none; display:block; transition:transform .25s, box-shadow .25s, border-color .25s; }
        .sb-day:hover { transform:translateY(-4px); box-shadow:0 14px 28px rgba(124,58,237,.14); border-color:#a78bfa; }
        .sb-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:999px; font-size:13px; font-weight:800; color:#fff; }
        .sb-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .sb-step { background:#fff; border-radius:20px; padding:20px; border:1px solid #f1f1f4; }
        .sb-num { width:36px; height:36px; border-radius:12px; background:#f5f3ff; color:#7c3aed; font-weight:800; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
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
                Subastas en vivo en <span style={{ color: "#f9a8d4" }}>Facebook</span>
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
        <p className="sb-sub">Tres por semana: lunes, miércoles y viernes. Cada día se subasta algo distinto.</p>
        <div className="sb-week">
          {upcoming.map((a, i) => {
            const t = tiposSubasta[a.tipo];
            return (
              <a key={a.numero} className="sb-day" href={fbUrl(a)} target="_blank" rel="noopener noreferrer">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span className="sb-chip" style={{ background: gradBg(t.grad) }}>{t.emoji} {t.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#7c3aed" }}>#{a.numero}</span>
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1e1b4b" }}>{whenLabel(a)}</div>
                <div style={{ fontSize: "14px", color: "#6b7280", margin: "2px 0 10px" }}>Cierre {horaLabel()}</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: i === 0 ? "#be185d" : "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px" }}>
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
              <strong style={{ color: "#1e1b4b" }}>{r.titulo}</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.55 }}>{r.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Sorteo ---------- */}
      <section id="sorteo" style={{ margin: "28px 0 0", padding: "22px 26px", borderRadius: "22px", background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", border: "1px solid #fbcfe8", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "40px" }}>🎟️</span>
          <div>
            <strong style={{ fontSize: "18px", color: "#1e1b4b" }}>Cada subasta ganada = 1 ticket para el sorteo del mes</strong>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>{sorteo} Mira los premios y a los ganadores anteriores.</p>
          </div>
        </div>
        <Link className="sb-cta" href="/sorteo">Ver el sorteo</Link>
      </section>

      {/* ---------- Vende en subasta ---------- */}
      <section style={{ margin: "28px 0 10px", padding: "26px", borderRadius: "22px", background: "#f5f3ff", display: "flex", gap: "16px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <strong style={{ fontSize: "18px", color: "#1e1b4b" }}>¿Quieres subastar tus cartas, figuras o proxys?</strong>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>Escríbenos y los ponemos en la próxima subasta.</p>
        </div>
        <a className="sb-cta" href={waLink("Hola Coquecutes, quiero poner mis productos en una subasta")} target="_blank" rel="noopener noreferrer">Quiero subastar</a>
      </section>
    </div>
  );
}
