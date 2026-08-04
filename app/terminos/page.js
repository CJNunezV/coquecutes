import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones — Coquecutes",
};

const sectionStyle = { marginBottom: "28px" };
const h2Style = { fontSize: "18px", fontWeight: "800", color: "#1e1b4b", margin: "0 0 10px 0" };
const pStyle = { fontSize: "14px", color: "#4b5563", lineHeight: "1.7", margin: "0 0 8px 0" };
const liStyle = { fontSize: "14px", color: "#4b5563", lineHeight: "1.7", marginBottom: "6px" };

export default function TerminosPage() {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <Link
        href="/checkout"
        style={{ fontSize: "13px", color: "#7c3aed", fontWeight: "700", textDecoration: "none" }}
      >
        ← Volver al checkout
      </Link>

      <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1e1b4b", margin: "16px 0 8px 0" }}>
        Términos y Condiciones
      </h1>
      <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 32px 0" }}>
        Última actualización: agosto 2026
      </p>

      <section style={sectionStyle}>
        <h2 style={h2Style}>1. Sobre nuestros productos</h2>
        <p style={pStyle}>
          Los cases de Coquecutes son productos impresos en 3D. Cada
          unidad puede presentar pequeñas variaciones naturales del proceso de
          impresión (líneas de capa, leves diferencias de tono) que no se
          consideran defectos y forman parte del acabado del producto.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>2. Precios y pagos</h2>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={liStyle}>Los precios están expresados en soles (S/) e incluyen los impuestos de ley.</li>
          <li style={liStyle}>
            El pago se realiza por adelantado vía Yape, Plin o transferencia
            bancaria, y se confirma subiendo la captura del comprobante en el
            checkout.
          </li>
          <li style={liStyle}>
            Tu pedido queda en estado <strong>"Pendiente"</strong> hasta que
            verifiquemos manualmente el pago. Te contactaremos por WhatsApp
            para confirmar.
          </li>
          <li style={liStyle}>
            Si el comprobante no corresponde al monto del pedido o no puede
            verificarse, nos pondremos en contacto contigo antes de procesar
            el envío.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>3. Entrega</h2>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={liStyle}>
            <strong>Recojo en tienda (FullMarket / Arenales):</strong> el
            pedido queda disponible en la tienda que indiques al confirmar tu
            compra.
          </li>
          <li style={liStyle}>
            <strong>Envío por agencia (Shalom/Olva):</strong> el pedido se
            despacha a la agencia que elijas fuera de Lima; los costos y
            tiempos de envío dependen de la agencia y no son responsabilidad
            de Coquecutes.
          </li>
          <li style={liStyle}>
            <strong>Envío con motorizado:</strong> el punto de entrega se
            coordina directamente por WhatsApp una vez confirmado el pago.
          </li>
          <li style={liStyle}>
            Los tiempos de entrega son estimados y pueden variar según la
            demanda de producción.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>4. Cambios y devoluciones</h2>
        <p style={pStyle}>
          Al ser productos hechos bajo pedido, no se aceptan cambios ni
          devoluciones por gustos personales una vez iniciada la producción.
          Si tu producto llega con un defecto real de fabricación o dañado
          por el transporte, escríbenos por WhatsApp dentro de las 48 horas
          posteriores a la entrega, adjuntando fotos, para evaluar la
          reposición.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>5. Datos personales</h2>
        <p style={pStyle}>
          Los datos que nos compartes (nombre, WhatsApp, DNI cuando aplica, y
          comprobante de pago) se usan únicamente para procesar tu pedido y
          coordinar la entrega. No compartimos tu información con terceros
          fuera de lo necesario para el envío (por ejemplo, la agencia de
          transporte).
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>6. Contacto</h2>
        <p style={pStyle}>
          Ante cualquier duda sobre tu pedido, estos términos, o el estado de
          tu compra, puedes escribirnos directamente por el botón de
          WhatsApp del sitio.
        </p>
      </section>

      <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "32px" }}>
        Al confirmar tu pedido, declaras haber leído y aceptado estos
        Términos y Condiciones.
      </p>
    </div>
  );
}