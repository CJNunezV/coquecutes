export default function ProductsPage() {
  // Simulación de los productos basados en tus increíbles diseños impresos en 3D
  const products = [
    {
      id: 1,
      name: "Case Premium - Edición Pokébola Clásica",
      price: "PEN 49.90",
      tag: "Popular",
      bgGradient: "linear-gradient(135deg, #fee2e2 0%, #fff1f2 100%)" // Fondo sutil rojizo/rosa
    },
    {
      id: 2,
      name: "Case Premium - Edición Especial 30 Aniversario Oro",
      price: "PEN 59.90",
      tag: "Nuevo",
      bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)" // Fondo sutil dorado/amarillo
    },
    {
      id: 3,
      name: "Case Premium - Edición Team Rocket / Premier Ball",
      price: "PEN 39.90",
      tag: "Exclusivo",
      bgGradient: "linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%)" // Fondo sutil morado
    }
  ];

  return (
    <div style={{ width: "100%", padding: "20px 0" }}>
      
      {/* Sección Hero / Presentación Corta */}
      <div style={{
        textAlign: "center",
        marginBottom: "60px",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #f5f3ff 0%, #fafafa 100%)", // Gradiente morado pastel super suave hacia el fondo de la página
        borderRadius: "32px",
        boxShadow: "0 4px 20px rgba(124, 58, 237, 0.03)"
      }}>
        <h1 style={{
          fontSize: "42px",
          fontWeight: "800",
          letterSpacing: "-1px",
          color: "#1e1b4b",
          margin: "0 0 16px 0",
          lineHeight: "1.2"
        }}>
          Nuestros productos
        </h1>
        <p style={{
          fontSize: "16px",
          color: "#6b7280",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.6"
        }}>
          Elige el protector perfecto para tus cartas más valiosas. El pago se realiza vía 
          <strong style={{ color: "#7c3aed" }}> Yape, Plin o Transferencia </strong> y luego subes tu comprobante. ¡Envíos a todo el Perú!
        </p>
      </div>

      {/* Grid de Productos Rediseñado */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "32px",
        padding: "0 10px"
      }}>
        {products.map((product) => (
          <div key={product.id} style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f3f4f6",
            transition: "transform 0.2s, boxShadow 0.2s",
            display: "flex",
            flexDirection: "column"
          }}>
            
            {/* Contenedor de la Foto con Gradiente Personalizado */}
            <div style={{
              background: product.bgGradient,
              height: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderBottom: "1px solid #f1f5f9"
            }}>
              {/* Etiqueta flotante del producto */}
              <span style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                backgroundColor: "#ffffff",
                color: "#1e1b4b",
                padding: "6px 14px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "700",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>
                {product.tag}
              </span>
              
              {/* Texto temporal hasta que pongas la etiqueta <img /> real */}
              <span style={{ color: "#a78bfa", fontSize: "14px", fontWeight: "600", letterSpacing: "0.5px" }}>
                [ Foto del producto ]
              </span>
            </div>

            {/* Información del Producto */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 12px 0",
                lineHeight: "1.4",
                minHeight: "50px" // Para que los textos largos no desalinien las tarjetas
              }}>
                {product.name}
              </h3>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "auto",
                paddingTop: "16px",
                borderTop: "1px solid #f3f4f6"
              }}>
                <span style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#7c3aed" // Morado característico de tu web
                }}>
                  {product.price}
                </span>

                {/* Botón de acción directa */}
                <button style={{
                  backgroundColor: "#f5f3ff",
                  color: "#7c3aed",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}>
                  Agregar
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}