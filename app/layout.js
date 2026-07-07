export const metadata = {
  title: "Coquecutes",
  description: "Tienda online de Coquecutes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#fafafa",
          color: "#1a1a1a",
        }}
      >
        <header
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a href="/" style={{ textDecoration: "none", color: "#1a1a1a" }}>
            <strong style={{ fontSize: 22 }}>Coquecutes</strong>
          </a>
          <a href="/checkout" style={{ textDecoration: "none", color: "#7c3aed", fontWeight: 600 }}>
            Ir a pagar
          </a>
        </header>
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          {children}
        </main>
        <footer style={{ padding: "24px", textAlign: "center", color: "#888", fontSize: 14 }}>
          © {new Date().getFullYear()} Coquecutes
        </footer>
      </body>
    </html>
  );
}
