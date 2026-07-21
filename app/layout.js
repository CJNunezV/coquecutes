import React from "react";
import Header from "./Header"; // Importamos el componente cliente de forma segura
import WhatsAppBubble from "./WhatsAppBubble";
import "./globals.css";
 
export const metadata = {
  title: "Coquecutes",
  description: "Tienda online de Coquecutes",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#fafafa",
        color: "#1a1a1a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Renderiza el Header dinámico aquí */}
        <Header />
 
        <main style={{ flex: 1, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", boxSizing: "border-box" }}>
          {children}
        </main>
 
        <footer style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "#888888", backgroundColor: "#ffffff", borderTop: "1px solid #eee" }}>
          © {new Date().getFullYear()} Coquecutes
        </footer>
 
        <WhatsAppBubble />
 
      </body>
    </html>
  );
}