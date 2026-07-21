"use client";
import { useEffect, useRef, useState } from "react";

// Envuelve cualquier sección: cuando entra en el viewport al hacer scroll,
// le agrega la clase "is-visible" para que las animaciones de globals.css
// (fade + slide up, y el stagger de .reveal-item) se disparen.
export default function Reveal({ children, as = "div", className = "", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const Tag = as;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
