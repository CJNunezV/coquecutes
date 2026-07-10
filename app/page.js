import Link from "next/link";

// ... dentro del map de tus productos en app/page.js:

{products.map((product) => (
  <Link 
    href={`/producto/${product.slug}`} 
    key={product.id} 
    passHref
    style={{ 
      textDecoration: "none", 
      color: "inherit",
      display: "block", // Crucial para que herede el ancho de la tarjeta correctamente
    }}
  >
    <div style={{
      ...cardStyle,
      display: "flex",
      flexDirection: "column",
      height: "100%", // Garantiza que toda la tarjeta use el espacio asignado
      cursor: "pointer"
    }}>
      
      {/* Contenedor de la Imagen */}
      <div style={{ 
        background: product.bgGradient || "#f3e8ff", 
        height: "280px", 
        display: "flex", 
        alignItems: "center", 
        position: "relative", 
        justifyContent: "center",
        borderRadius: "24px 24px 0 0",
        overflow: "hidden"
      }}>
        <span style={tagStyle}>{product.tag}</span>
        <span style={{ color: "#a78bfa", fontSize: "14px", fontWeight: "600" }}>
          [ Foto del producto ]
        </span>
      </div>
      
      {/* Bloque de Información: Título, Precio y Botón */}
      <div style={{ 
        padding: "20px", 
        display: "flex", 
        flexDirection: "column", 
        flexGrow: 1,
        background: "#ffffff"
      }}>
        
        {/* Título Principal */}
        <h3 style={{ 
          fontSize: "16px", 
          fontWeight: "750", 
          color: "#1f2937", 
          margin: "0 0 12px 0", 
          minHeight: "44px",
          lineHeight: "1.4"
        }}>
          {product.name}
        </h3>
        
        {/* Barra inferior con Precio y Acción */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          marginTop: "auto", 
          paddingTop: "12px", 
          borderTop: "1px solid #f3f4f6" 
        }}>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "#7c3aed" }}>
            PEN {product.price.toFixed(2)}
          </span>
          
          {/* Indicador de Acción */}
          <span style={{ 
            backgroundColor: "#f5f3ff", 
            color: "#7c3aed", 
            padding: "8px 16px", 
            borderRadius: "12px", 
            fontWeight: "700", 
            fontSize: "13px" 
          }}>
            Ver detalles
          </span>
        </div>

      </div>
    </div>
  </Link>
))}