/* datos.js - ajustes base, datos de ejemplo y funciones comunes */
const H1 = "https://1hora.com/cdn/shop/files/";
const FOTOS = "https://billybc.github.io/venta/fotos-para-vender/";

const AJUSTES_BASE = {
  nombreTienda: "Tienda de Todo",
  logo: "",
  avisoSuperior: "Por el momento solo en El Progreso. Tiempo de entrega de 15 a 20 días.",
  whatsapp: "50200000000",
  moneda: "Q",
  descuentoActivo: true,
  descuentoUnidades: 3,
  descuentoPorcentaje: 10,
  promo: {
    imagen: H1 + "1_86987f4c-c135-406b-aa8c-1f545f965875.jpg?v=1756716174&width=2000",
    titulo: "Sonido puro y ajuste perfecto",
    subtitulo: "Audífonos AUT211 pensados para acompañarte todo el día.",
    boton: "Ver productos 1HORA",
    enlace: "#1hora",
  },
  porQueTitulo: "¿Por qué elegirnos?",
  porQue: [
    { titulo: "Todo en un solo lugar", texto: "Tecnología 1HORA y muchos otros productos para la casa, el carro y el trabajo." },
    { titulo: "Lo conseguimos para ti", texto: "Si no ves lo que buscas pregunta y lo conseguimos." },
    { titulo: "Descuento por cantidad", texto: "En la compra de 3 o más productos obtienes descuento." },
  ],
  destacadosTitulo: "Productos destacados",
  catalogoTitulo: "Nuestros productos",
  notaEntrega: "Tiempo de entrega de 15 a 20 días y posiblemente antes. La garantía de 3 días solo aplica en El Progreso, Sansare, Guastatoya, Agua Caliente, Sanarate, San Antonio La Paz, San Agustín Acasaguastlán y El Rancho.",
  direccion: "El Progreso, Guatemala",
  correo: "", telefono: "", facebook: "", instagram: "", youtube: "", tiktok: "",
};

const ICONOS = {
  "Auriculares": "🎧", "Altavoces": "🔊", "Cables": "🔌", "Bancos de energía": "🔋", "Cargadores": "⚡", "Estilo de vida": "✨", "Accesorios": "📱",
  "Audio": "🎧", "Autos": "🚗", "Hogar": "🏠", "Cuidado personal": "🪒", "Herramientas": "🛠️", "Iluminación": "💡",
  "Electricidad": "🔌", "Tecnología": "📷", "Ropa y accesorios": "🧢", "Deporte y juguetes": "🥊",
};

const BANNERS_EJEMPLO = [
  { id: "b1", imagen: H1 + "banner_30499bc1-9ef8-4eb3-9872-91c093f851a6.jpg?v=1757469540&width=2000", titulo: "Carga, escucha y sigue adelante", subtitulo: "Distribuidor de productos 1HORA y mucho más.", boton: "Ver productos", enlace: "#productos", orden: 1 },
  { id: "b2", imagen: H1 + "2_1_061c5606-f161-4638-adf0-ecc6ed8dcc99.jpg?v=1756698536&width=2000", titulo: "Energía en cualquier lugar", subtitulo: "Bancos de energía y cargadores para tu día.", boton: "Ver 1HORA", enlace: "#1hora", orden: 2 },
];

const CATEGORIAS_EJEMPLO = [
  ...[
    ["Auriculares", "1_24163dd0-b6d4-41b3-bb21-3c4ea71c7f08.png?v=1756698256"],
    ["Altavoces", "2_2167908e-5137-45a9-8149-ab8d48391574.png?v=1756698259"],
    ["Cables", "3_46933dfa-c336-46fc-974c-0e1602d8565d.png?v=1756698262"],
    ["Bancos de energía", "4_ab44629d-55ce-43e0-85eb-55fc03612bed.png?v=1756698273"],
    ["Cargadores", "5_d8d71e2c-bf4f-47ca-a23e-67c8830ada62.png?v=1756698273"],
    ["Estilo de vida", "6_aa60d0c1-0c6a-482d-ae75-06cac86a65c4.png?v=1756698274"],
    ["Accesorios", "7_1601112f-2a61-40b8-a546-9f5f1ed8d65e.png?v=1756698276"],
  ].map(([nombre, f], i) => ({ id: "c" + (i + 1), nombre, seccion: "1hora", imagen: H1 + f + "&width=600", orden: i + 1 })),
  ...["Audio", "Autos", "Hogar", "Cuidado personal", "Herramientas", "Iluminación", "Electricidad", "Tecnología", "Ropa y accesorios", "Deporte y juguetes"]
    .map((nombre, i) => ({ id: "c" + (8 + i), nombre, seccion: "otros", imagen: "", orden: 8 + i })),
];

/* Productos 1HORA de ejemplo. Los precios son inventados, cámbialos desde el panel */
const P1 = [
  { nombre: "CEP001 Cepillo eléctrico a prueba de agua", descripcion: "Limpieza profunda y cuidado suave cada día.", categoria: "Estilo de vida", precio: 225, imagen: H1 + "CEP001_a665d97a-92b5-435d-a73c-bba237e82f96.jpg?v=1756436841&width=1000", destacado: true },
  { nombre: "AUT210 Audífonos deportivos con clip", descripcion: "Se sujetan firme para correr, andar en bici o ir al gimnasio.", categoria: "Auriculares", precio: 199, imagen: H1 + "aut210.jpg?v=1757477654&width=1000", destacado: true },
  { nombre: "GAR264 Power bank 10000 mAh carga rápida 22.5W", descripcion: "Pantalla LED y linterna incluida para llevarlo a todo lado.", categoria: "Bancos de energía", precio: 249, imagen: H1 + "gar158.jpg?v=1757477663&width=1000", destacado: true },
  { nombre: "BOC244 Altavoz Bluetooth portátil 7W", descripcion: "Pequeño y con buen sonido para casa o viajes.", categoria: "Altavoces", precio: 175, enOferta: true, precioOferta: 149, imagen: H1 + "boc244.jpg?v=1757477664&width=1000", destacado: true },
  { nombre: "AUT211 Audífonos inalámbricos con cancelación de ruido", descripcion: "Sonido nítido y ajuste cómodo para todo el día.", categoria: "Auriculares", precio: 299, imagen: H1 + "1_86987f4c-c135-406b-aa8c-1f545f965875.jpg?v=1756716174&width=1000" },
];

/* Productos de la página venta: nombre, precio, descripción, categoría y archivo de foto */
const OTROS = [
  ["Auricular Bluetooth", 100, "Auricular bluetooth, transmisor FM, cargador USB, manos libres.", "Audio", "auricular_bluetooth%20_transmitir_fm_cargador_usb_llamadas_manos%20libres_100_quetzales.jpg"],
  ["Auriculares 200 Quetzales", 200, "Auriculares de alta calidad por 200 quetzales.", "Audio", "auriculares_bluetooth_de_200_quetzales.jpg"],
  ["Auriculares Inalámbricos 60 Quetzales", 60, "Auriculares inalámbricos económicos.", "Audio", "auriculares_bluetooth_60_quetzales%20.jpg"],
  ["Barras LED", 0, "Barras LED, el precio depende del tamaño.", "Iluminación", "barras_led_%20dependiendo_el_tamanio_es_el%20precio.jpg"],
  ["Bocina Inteligente y Cargador", 120, "Bocina inteligente y cargador por 120 quetzales.", "Audio", "bosina_inteligente_y_cargador_120_quetzales.jpg"],
  ["Bocinas para Computadora", 75, "Bocinas para computadora por 75 quetzales.", "Audio", "bosinas_para_computadora_75_quetzales.jpg"],
  ["Cable para Paso de Corriente", 100, "Cable para paso de corriente por 100 quetzales.", "Autos", "cable_para_paso%20de_corrinete_100_quetzales.jpg"],
  ["Cafetera", 155, "Cafetera por 155 quetzales.", "Hogar", "cafetera_155_quetzales.jpg"],
  ["Cámara para Casa", 255, "Cámara de seguridad para casa.", "Tecnología", "camara-para_casa_255_quetzales.jpg"],
  ["Gorras", 40, "Gorras de diferentes estilos.", "Ropa y accesorios", "gorras_40_quetzales.jpg"],
  ["Limpiador de Ruedas", 20, "Limpiador de ruedas por 20 quetzales.", "Autos", "limpiador-de_ruedas_20_quetzales.jpg"],
  ["Linternas", 100, "Linternas potentes por 100 quetzales.", "Iluminación", "linternas_100_quetzales.jpg"],
  ["Máquina de Rasurar 75 Quetzales", 75, "Máquina de rasurar económica.", "Cuidado personal", "maquina_de%20rasurar_de_75_quetzales.jpg"],
  ["Máquina de Rasurar 50 Quetzales", 50, "Máquina de rasurar por 50 quetzales.", "Cuidado personal", "maquina_para_rasurar_de%20_50_quetazales.jpg"],
  ["Máquina de Rasurar 150 Quetzales", 150, "Máquina de rasurar profesional.", "Cuidado personal", "maquina_para_rasurar_de_150_quetzales.jpg"],
  ["Placas para Carros", 45, "Placas para carros por 45 quetzales.", "Autos", "placas_para_carros_45_quetzales.jpg"],
  ["Placas para Moto", 25, "Placas para moto por 25 quetzales.", "Autos", "placas_para_moto-25_quetzaes.jpg"],
  ["Spray para Mosquitos", 25, "Spray para mosquitos por 25 quetzales.", "Hogar", "spray_para_mosquitos_25_quetzales.jpg"],
  ["Sujetador para Computadora o Televisión", 200, "Sujetador para computadora o televisión.", "Tecnología", "sujetador_para_computador_o_televicion_200_quetzales.jpg"],
  ["Espuma Sellador", 60, "Espuma selladora multiusos.", "Herramientas", "espuma_sellador_60_quetzales.jpg"],
  ["Espuma para Rellenar Agujeros", 50, "Espuma expansiva de alto rendimiento 750ml.", "Herramientas", "espuma_para_rellenar_agujeros_50_quetzales.jpg"],
  ["Insecticida", 25, "Insecticida efectivo para el hogar.", "Hogar", "insecticida_25_quetzales.jpg"],
  ["Máquina de Boxeo", 399, "Máquina de boxeo para entrenamiento.", "Deporte y juguetes", "maquina%20de%20boxeo%20Q399%20quetzales.jpg"],
  ["Mochila", 150, "Mochila resistente y espaciosa.", "Ropa y accesorios", "mochila_150_quetzales.jpg"],
  ["Mochila Morada", 150, "Mochila color morado, ideal para estudiantes.", "Ropa y accesorios", "mochila_morada_150_quetzales.jpg"],
  ["Perchero de 5 Niveles", 120, "Perchero de 5 niveles, práctico y moderno.", "Hogar", "perchero_de_5%20niveles_a_Q120_quetzales.jpg"],
  ["Zapatera", 110, "Zapatera para organizar tus zapatos.", "Hogar", "zaptera_Q110_quetzales.jpg"],
  ["Afeitadora", 125, "Afeitadora eléctrica de alta precisión.", "Cuidado personal", "afeitadora_125_quetzales.jpg"],
  ["Afeitadora Pequeña", 60, "Afeitadora compacta y portátil.", "Cuidado personal", "afeitadora_peque%C3%B1a_60_quetzales.jpg"],
  ["Aire Acondicionado Portátil", 110, "Aire acondicionado portátil para espacios pequeños.", "Hogar", "aire%20acondicionado%20Q110%20quetzales.jpg"],
  ["Abrillantador para Tablero", 25, "Abrillantador para tablero de automóvil.", "Autos", "abrillantador_para_tablero_25_quetzales.jpg"],
  ["Anti Mosquitos", 35, "Spray anti mosquitos efectivo.", "Hogar", "anti_mosquitos_35_quetzales.jpg"],
  ["Aromatizantes", 25, "Aromatizantes para ambientes frescos.", "Hogar", "aromatizantes_25_quetzales.jpg"],
  ["Auriculares 2", 200, "Auriculares de alta fidelidad.", "Audio", "auriculares2_200_quetzales.jpg"],
  ["Auriculares", 75, "Auriculares cómodos y ligeros.", "Audio", "auriculares_75_quetzales.jpg"],
  ["Barreno Pequeño", 250, "Barreno pequeño para trabajos precisos.", "Herramientas", "barreno_peque%C3%B1o_250_quetzales.jpg"],
  ["Bombilla 30W", 35, "Bombilla LED de 30 watts.", "Iluminación", "bombilla_30_wats_35_quetzales.jpg"],
  ["Bocina Mediana", 150, "Bocina mediana de gran potencia.", "Audio", "bosina_mediana_150_quetzales.jpg"],
  ["Carro a Control Remoto", 255, "Carro a control remoto para niños.", "Deporte y juguetes", "carro_a_control_remoto_255_quetzales.jpg"],
  ["Cigarro Electrónico", 100, "Cigarro electrónico recargable.", "Tecnología", "cigarroelectronico_100_quetzales.jpg"],
  ["Cualquier Tamaño", 25, "Producto disponible en cualquier tamaño.", "Hogar", "cualquier_tama%C3%B1o_25_quetzales.jpg"],
  ["Encendedor de Cocina", 15, "Encendedor largo para cocina.", "Hogar", "encendedor_cocina_15_quetzales.jpg"],
  ["Lámpara para Niño", 50, "Lámpara decorativa para niños.", "Iluminación", "lampara_ni%C3%B1o_50_quetzales.jpg"],
  ["Limpiador de Contactos Electrónicos", 30, "Limpiador para contactos electrónicos.", "Herramientas", "lmpiador_de_contactos_electronicos_30_quetzales.jpg"],
  ["Lámpara Nocturna", 220, "Lámpara nocturna de alta calidad.", "Iluminación", "lamparanocturna_220_quetzales.jpg"],
  ["Lubricante", 25, "Lubricante multiusos.", "Herramientas", "lubricante_25_quetzales.jpg"],
  ["Mini Kit", 25, "Mini kit de herramientas.", "Herramientas", "minikit_25_quetzales.jpg"],
  ["Palo Selfie", 150, "Palo selfie extensible.", "Tecnología", "palo_selfie_150_quetzales.jpg"],
  ["Cera para el Cabello", 15, "Cera Dexe Firm Hair Wax para peinar.", "Cuidado personal", "cera_paa_el_cabello_15_quetzales.jpg"],
  ["Encendedor Grande Flama Azul", 25, "Encendedor grande de flama azul.", "Hogar", "encendedo_grande_flama_azul_25_quetzales.jpg"],
  ["Apagador Blanco Doble", 25, "Apagador doble color blanco.", "Electricidad", "apagador_blanco_doble_25_quetzales.jpg"],
  ["Carrito a Control Remoto", 50, "Carrito pequeño a control remoto.", "Deporte y juguetes", "carrito_a_control_remoto_50_quetzales.jpg"],
  ["Cajita Rectangular de Plástico", 6, "Cajita rectangular de plástico multiusos.", "Hogar", "cajita_rectangular_de_plastico_6_quetzales.jpg"],
  ["Aromatizante para Carro", 15, "Aromatizante para carro, varios aromas.", "Autos", "aromatizante_para_carro.jpg"],
  ["Encendedor Flama Azul Pequeño", 8, "Encendedor pequeño de flama azul.", "Hogar", "encendedor_fama_azul_peque%C3%B1o_8_quetzales.jpg"],
  ["Apagador Simple Negro", 25, "Apagador simple color negro.", "Electricidad", "apagador_simple_negro_25_quetzales.jpg"],
  ["Cinta Doble Cara", 15, "Cinta doble cara para manualidades y reparaciones.", "Herramientas", "cinta_doble_cara_15_quetzaes.jpg"],
  ["Tomacorriente Blanco", 35, "Tomacorriente color blanco de alta calidad.", "Electricidad", "tomacorriente_blanco_35_quezales.jpg"],
];

const PRODUCTOS_EJEMPLO = [
  ...P1.map((p, i) => ({ id: "e" + (i + 1), seccion: "1hora", enOferta: false, precioOferta: null, disponible: true, visible: true, destacado: false, consultar: false, ...p, orden: i + 1 })),
  ...OTROS.map(([nombre, precio, descripcion, categoria, archivo], i) => ({
    id: "o" + (i + 1), nombre, descripcion, seccion: "otros", categoria, precio, enOferta: false, precioOferta: null,
    imagen: FOTOS + archivo, disponible: true, visible: true, destacado: false, consultar: precio === 0, orden: P1.length + i + 1,
  })),
];

/* ---------- Funciones comunes ---------- */
function esc(t) {
  return String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function cssUrl(u) { return `url("${String(u).replace(/"/g, "%22").replace(/\\/g, "%5C")}")`; }
function dinero(n, moneda) {
  return `${moneda} ${Number(n).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function tieneOferta(p) {
  return !!p.enOferta && p.precioOferta !== null && p.precioOferta !== "" && p.precioOferta !== undefined;
}
function precioFinal(p) { return tieneOferta(p) ? Number(p.precioOferta) : Number(p.precio); }
function iconoDe(cat) { return ICONOS[cat] || "🛍️"; }
function imagenDe(p) {
  if (p.imagen) return p.imagen;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'><rect width='100%' height='100%' fill='#f1efea'/><text x='50%' y='54%' font-size='130' text-anchor='middle' dominant-baseline='middle'>${iconoDe(p.categoria)}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function escucharColeccion(nombre, ejemplo, cb) {
  if (!FIREBASE_LISTO) { cb(ejemplo.map((x) => ({ ...x }))); return () => {}; }
  return db.collection(nombre).orderBy("orden").onSnapshot(
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => { console.error(err); cb([]); }
  );
}
const escucharProductos = (cb) => escucharColeccion("productos", PRODUCTOS_EJEMPLO, cb);
const escucharCategorias = (cb) => escucharColeccion("categorias", CATEGORIAS_EJEMPLO, cb);
const escucharBanners = (cb) => escucharColeccion("banners", BANNERS_EJEMPLO, cb);
function escucharAjustes(cb) {
  if (!FIREBASE_LISTO) { cb({ ...AJUSTES_BASE }); return () => {}; }
  return db.collection("config").doc("tienda").onSnapshot(
    (snap) => cb({ ...AJUSTES_BASE, ...(snap.exists ? snap.data() : {}) }),
    (err) => { console.error(err); cb({ ...AJUSTES_BASE }); }
  );
}
