# Tienda de dispositivos

Páginas
- index.html es la tienda que ven tus clientes y se parece a la página principal de 1hora
- admin.html es tu panel para cambiar todo sin tocar código

Sin configurar nada la tienda ya funciona en modo ejemplo con los productos de 1HORA y los 58 de tu página venta en la sección Otros. Para guardar tus cambios necesitas Firebase y es gratis.

## Estructura de carpetas

```
TIENDA_DE_DISPOSITIVOS/
├── index.html
├── admin.html
├── firestore.rules
├── README.md
├── css/
│   ├── tienda.css
│   └── admin.css
└── js/
    ├── firebase-config.js
    ├── datos.js
    ├── tienda.js
    └── admin.js
```

## Pasos para conectar Firebase

1. Entra a console.firebase.google.com y crea un proyecto nuevo.
2. En Authentication pulsa Comenzar y activa Correo y contraseña. Luego en Usuarios agrega tu correo con una contraseña.
3. En Firestore Database crea la base de datos en modo producción.
4. En Firestore abre la pestaña Reglas y pega el contenido de firestore.rules cambiando TU_CORREO@gmail.com por el correo del paso 2. Pulsa Publicar.
5. En Configuración del proyecto y Tus apps agrega una app web y copia el objeto firebaseConfig dentro de js/firebase-config.js.
6. Sube todo a GitHub y activa GitHub Pages en Settings y Pages con la rama main.
7. En Firebase entra a Authentication, Configuración y Dominios autorizados y agrega tu dirección de GitHub Pages sin https. Por ejemplo billybc.github.io.
8. Abre tu-sitio/admin.html, entra con tu correo y pulsa Cargar tienda de ejemplo.

## Qué puedes cambiar desde el panel

- Productos. Nombre, descripción, precio, oferta, foto, sección 1HORA u Otros, disponible, visible y destacado
- Portada. Los banners grandes que pasan solos, el banner de promoción y el aviso negro de arriba
- Categorías. Nombre, imagen y orden de las categorías que salen con imágenes
- Ajustes. Nombre, logo, WhatsApp, moneda, descuento por cantidad, textos de Por qué elegirnos, nota de entrega, contacto y redes

## Enlaces de los botones

En los botones de los banners puedes poner #productos para ir al catálogo, #1hora para ver solo 1HORA, #otros para ver solo Otros o un enlace completo que empiece con https.
