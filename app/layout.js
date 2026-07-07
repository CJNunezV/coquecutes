export const metadata = {
  title: "Coquecutes | Protectores TCG Premium",
  description: "Eleva el nivel de tu colección. Marcos y cases encajables premium para tus cartas Pokémon favoritas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#0f0f11", // Fondo oscuro premium mate
        color: "#f4f4f5",      // Texto claro y suave para la vista
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Barra de navegación mejorada */}
        <header style={{
          padding: "20px 24px",
          borderBottom: "1px solid #27272a", // Borde sutil oscuro
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#18181b", // Un tono ligeramente más claro para el header
          position: "sticky",
          top: 0,
          zIndex: 50
        }}>
          <a href="/" style={{ 
            fontSize: "22px", 
            fontWeight: "800", 
            letterSpacing: "-0.5px",
            color: "#fff",
            textDecoration: "none"
          }}>
            Coquecutes<span style={{ color: "#e11d48" }}>.</span>
          </a>
          
          <a href="/checkout" style={{
            backgroundColor: "#e11d48", // Botón rojo vibrante (estilo Pokébola)
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "14px",
            transition: "background 0.2s"
          }}>
            Ir a pagar
          </a>
        </header>

        {/* Contenedor principal para centrar tu catálogo */}
        <main style={{
          flex: 1,
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px",
          boxSizing: "border-box"
        }}>
          {children}
        </main>

        {/* Footer elegante */}
        <footer style={{
          padding: "24px",
          textAlign: "center",
          fontSize: "14px",
          color: "#71717a",
          borderTop: "1px solid #27272a",
          backgroundColor: "#18181b"
        }}>
          © {new Date().getFullYear()} Coquecutes. Diseñado para coleccionistas.
        </footer>

      </body>
    </html>
  );
}