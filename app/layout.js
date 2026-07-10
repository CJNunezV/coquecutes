export const metadata = {
  title: "Coquecutes | Protectores Premium",
  description: "Tienda online de Coquecutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#fafafa", // Fondo claro y limpio original
        color: "#1a1a1a",      // Texto principal oscuro para buena legibilidad
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Barra de navegación Coquecutes */}
        <header style={{
          padding: "20px 24px",
          borderBottom: "1px solid #eee", // Borde sutil original
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff", // Fondo blanco limpio
          position: "sticky",
          top: 0,
          zIndex: 50
        }}>
          {/* Nombre de la marca alineado a tu estilo */}
          <a href="/" style={{ 
            fontSize: "22px", 
            fontWeight: "bold", 
            color: "#1a1a1a",
            textDecoration: "none"
          }}>
            Coquecutes
          </a>
          
          {/* Botón Ir a pagar adaptado a la estética cute/minimalista */}
          <a href="/checkout" style={{
            backgroundColor: "#7c3aed", // Un morado estético que va con la onda de las tarjetas
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "20px", // Bordes más redondeados y amigables
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(124, 58, 237, 0.1)"
          }}>
            Ir a pagar
          </a>
        </header>

        {/* Contenedor principal */}
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

        {/* Footer adaptado */}
        <footer style={{
          padding: "24px",
          textAlign: "center",
          fontSize: "14px",
          color: "#888888",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #eee"
        }}>
          © {new Date().getFullYear()} Coquecutes
        </footer>

      </body>
    </html>
  );
}