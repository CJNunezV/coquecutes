export const metadata = {
  title: "Coquecutes | Protectores Premium",
  description: "Tienda online de Coquecutes.",
};
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function RootLayout({ children }) {
  const [totalItems, setTotalItems] = useState(0);

  const updateItemsCount = () => {
    const savedCart = localStorage.getItem("coquecutes_cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const count = cart.reduce((acc, item) => acc + item.quantity, 0);
      setTotalItems(count);
    } else {
      setTotalItems(0);
    }
  };

  useEffect(() => {
    updateItemsCount();
    window.addEventListener("cartUpdate", updateItemsCount);
    return () => window.removeEventListener("cartUpdate", updateItemsCount);
  }, []);

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
        
        <header style={{
          padding: "20px 24px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}>
          <Link href="/" style={{ fontSize: "22px", fontWeight: "bold", color: "#1a1a1a", textDecoration: "none" }}>
            Coquecutes
          </Link>
          
          <Link href="/checkout" style={{
            backgroundColor: totalItems > 0 ? "#7c3aed" : "#a78bfa",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.1)",
            pointerEvents: totalItems > 0 ? "auto" : "none",
            transition: "background 0.2s"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span>Ir a pagar {totalItems > 0 && `(${totalItems})`}</span>
          </Link>
        </header>

        <main style={{ flex: 1, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", boxSizing: "border-box" }}>
          {children}
        </main>

        <footer style={{ padding: "24px", textAlign: "center", fontSize: "14px", color: "#888888", backgroundColor: "#ffffff", borderTop: "1px solid #eee" }}>
          © {new Date().getFullYear()} Coquecutes
        </footer>

      </body>
    </html>
  );
}