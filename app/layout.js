import React from "react";
import TrustBar from "./TrustBar";
import Header from "./Header"; // Importamos el componente cliente de forma segura
import WhatsAppBubble from "./WhatsAppBubble";
import CartDrawer from "./CartDrawer";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const display = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display", display: "swap" });
const body = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-body", display: "swap" });
 
export const metadata = {
  title: "Coquecutes",
  description: "Tienda online de Coquecutes",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body style={{
        margin: 0,
        fontFamily: "var(--font-body), system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        background: "#fff8fb",
        color: "#3d2434",
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
 
        <footer style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "#f7c9d9", background: "linear-gradient(90deg,#6a3059,#7a3d68)", borderTop: "3px solid #f0d070" }}>
          © {new Date().getFullYear()} Coquecutes
          <div style={{ marginTop: 8 }}><a href="/vender" style={{ color: "#f0d070", fontWeight: 700, textDecoration: "none" }}>Vender tus productos</a></div>
        </footer>
 
        <CartDrawer />
        <WhatsAppBubble />
 
      </body>
    </html>
  );
}