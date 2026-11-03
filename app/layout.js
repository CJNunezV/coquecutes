import React from "react";
import TrustBar from "./TrustBar";
import Header from "./Header"; // Importamos el componente cliente de forma segura
import WhatsAppBubble from "./WhatsAppBubble";
import CartDrawer from "./CartDrawer";
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
        background: "#fff8fb",
        color: "#2a1224",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        
        <TrustBar />

        {/* Renderiza el Header dinámico aquí */}
        <Header />
 
        <main style={{ flex: 1, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "32px 16px", boxSizing: "border-box" }}>
          {children}
        </main>
 
        <footer style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "#f7c9d9", background: "linear-gradient(90deg,#3b1030,#52173f)", borderTop: "3px solid #f0d070" }}>
          © {new Date().getFullYear()} Coquecutes
        </footer>
 
        <CartDrawer />
        <WhatsAppBubble />
 
      </body>
    </html>
  );
}