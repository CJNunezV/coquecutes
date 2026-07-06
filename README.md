# Coquecutes — Tienda online

Proyecto base en Next.js para vender productos con pago manual (Yape/Plin/transferencia)
y comprobante por captura de pantalla.

## 1. Editar tus productos

Abre `data/products.js` y reemplaza los productos de ejemplo con los tuyos:
nombre, precio, descripción, tallas y foto.

Para las fotos: crea una carpeta `public/productos/` y coloca ahí tus imágenes
(ej: `public/productos/polera-1.jpg`), luego en `products.js` pon
`image: "/productos/polera-1.jpg"`.

## 2. Editar los datos de pago

Abre `app/checkout/page.js` y busca la sección "Datos para el pago"
(cerca de la línea 60). Cambia el número de Yape/Plin y la cuenta bancaria
por los tuyos reales.

## 3. Probar en tu computadora (opcional)

Necesitas tener Node.js instalado (nodejs.org, versión 18 o superior).

```bash
npm install
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## 4. Subir el proyecto a GitHub

1. Crea una cuenta en https://github.com si no tienes.
2. Crea un repositorio nuevo (ej: "coquecutes").
3. Sube esta carpeta al repositorio (puedes arrastrar los archivos desde
   la web de GitHub, o usar git si sabes).

## 5. Desplegar en Vercel

1. Crea una cuenta en https://vercel.com (puedes entrar con tu cuenta de GitHub).
2. Click en "Add New Project" y selecciona tu repositorio "coquecutes".
3. Vercel detecta automáticamente que es Next.js. Click en "Deploy".
4. En unos minutos tu tienda estará en una URL como `coquecutes.vercel.app`.
   Después puedes conectar tu propio dominio (ej: coquecutes.com) desde
   Project Settings > Domains.

## 6. Activar el almacenamiento de imágenes (Vercel Blob)

Esto es necesario para que las capturas de pago se guarden.

1. En tu proyecto en Vercel, ve a la pestaña "Storage".
2. Click en "Create Database" > selecciona "Blob".
3. Conéctalo a tu proyecto. Vercel agrega automáticamente la variable
   `BLOB_READ_WRITE_TOKEN` — no necesitas hacer nada más.

## 7. Activar las notificaciones por email (opcional pero recomendado)

Para que te llegue un correo cada vez que alguien compra:

1. Crea una cuenta gratis en https://resend.com
2. Genera una API key (Dashboard > API Keys > Create).
3. En Vercel, ve a Project Settings > Environment Variables y agrega:
   - `RESEND_API_KEY` = la key que copiaste de Resend
   - `NOTIFY_EMAIL_TO` = tu correo (donde quieres recibir los pedidos)
   - `NOTIFY_EMAIL_FROM` = un remitente (puedes usar `onboarding@resend.dev`
     mientras no tengas dominio verificado en Resend)
4. Vuelve a desplegar el proyecto (Deployments > tres puntos > Redeploy).

Si no configuras Resend, la tienda sigue funcionando igual: las capturas se
guardan en Vercel Blob, pero no te llegará el aviso por correo (tendrías que
revisar los links manualmente, lo cual no es práctico — por eso se recomienda
configurar el email).

## Importante sobre el flujo de pago manual

Como los pagos se verifican a mano (revisando capturas), recuerda:

- Confirma cada pedido por WhatsApp antes de enviar el producto.
- Guarda un registro de qué capturas ya revisaste, para evitar enviar
  productos sin haber confirmado el pago real en tu cuenta bancaria/Yape.
- Con el tiempo, si crece el volumen de pedidos, considera automatizar
  el pago con una pasarela (Mercado Pago, Culqi, Niubiz) para reducir
  el trabajo manual y el riesgo de comprobantes falsos.
