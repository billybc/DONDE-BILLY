/* tienda.js - página pública */
const $ = (id) => document.getElementById(id);
let productos = [], categorias = [], banners = [];
let ajustes = { ...AJUSTES_BASE };
let cargado = false;
const vista = { sec: "todos", cat: "Todos", texto: "" };
let carrito = [];
try { carrito = JSON.parse(localStorage.getItem("carritoTienda") || "[]"); } catch (e) { carrito = []; }

const visibles = () => productos.filter((p) => p.visible !== false);
const enSec = () => visibles().filter((p) => vista.sec === "todos" || p.seccion === vista.sec);
const numWa = () => String(ajustes.whatsapp).replace(/\D/g, "");
const waUrl = (t) => `https://wa.me/${numWa()}` + (t ? `?text=${encodeURIComponent(t)}` : "");

/* ---------- Textos y ajustes ---------- */
function pintarAjustes() {
  document.title = ajustes.nombreTienda;
  $("aviso").hidden = !ajustes.avisoSuperior;
  $("aviso").textContent = ajustes.avisoSuperior || "";
  $("marca").innerHTML = ajustes.logo ? `<img src="${esc(ajustes.logo)}" alt="${esc(ajustes.nombreTienda)}">` : esc(ajustes.nombreTienda);
  $("pieMarca").textContent = ajustes.nombreTienda;
  $("copy").textContent = `© ${new Date().getFullYear()} ${ajustes.nombreTienda}. Las marcas pertenecen a sus dueños.`;
  $("catalogoTitulo").textContent = ajustes.catalogoTitulo;
  $("porqueTitulo").textContent = ajustes.porQueTitulo;
  $("destacadosTitulo").textContent = ajustes.destacadosTitulo;
  $("notaEntrega").hidden = !ajustes.notaEntrega;
  $("notaEntrega").textContent = ajustes.notaEntrega || "";
  $("linkWa").href = waUrl();

  const pq = (ajustes.porQue || []).filter((x) => x.titulo || x.texto);
  $("porque").hidden = pq.length === 0;
  $("navPorque").hidden = pq.length === 0;
  $("porqueGrid").innerHTML = pq.map((x, i) => `<div class="pq"><span class="pq-n">${i + 1}</span><h3>${esc(x.titulo)}</h3><p>${esc(x.texto)}</p></div>`).join("");

  const pr = ajustes.promo || {};
  $("promo").hidden = !(pr.imagen || pr.titulo);
  $("promo").style.backgroundImage = pr.imagen ? cssUrl(pr.imagen) : "";
  $("promoTxt").innerHTML = `<h2>${esc(pr.titulo)}</h2><p>${esc(pr.subtitulo)}</p>` +
    (pr.boton ? `<a class="btn-claro" href="${esc(pr.enlace || "#productos")}" data-enlace>${esc(pr.boton)}</a>` : "");

  const lineas = [];
  if (ajustes.direccion) lineas.push(`<span>${esc(ajustes.direccion)}</span>`);
  if (ajustes.correo) lineas.push(`<a href="mailto:${esc(ajustes.correo)}">${esc(ajustes.correo)}</a>`);
  if (ajustes.telefono) lineas.push(`<span>Teléfono ${esc(ajustes.telefono)}</span>`);
  $("pieContacto").innerHTML = lineas.join("");
  const redes = [["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"], ["tiktok", "TikTok"]];
  $("pieRedes").innerHTML = redes.filter(([k]) => ajustes[k]).map(([k, n]) => `<a href="${esc(ajustes[k])}" target="_blank" rel="noopener">${n}</a>`).join("");
}

/* ---------- Portada con banners ---------- */
let slideActual = 0, timerSlides = null;
function pintarBanners() {
  const lista = banners.length ? banners : [{ titulo: ajustes.nombreTienda, subtitulo: ajustes.eslogan || "", imagen: "", boton: "Ver productos", enlace: "#productos" }];
  $("slides").innerHTML = lista.map((b, i) => `
    <div class="slide ${i === 0 ? "on" : ""} ${b.imagen ? "" : "sin-img"}" ${b.imagen ? `style="background-image:${esc(cssUrl(b.imagen))}"` : ""}>
      <div class="slide-in">
        <div class="slide-tit">${esc(b.titulo)}</div>
        ${b.subtitulo ? `<p class="slide-sub">${esc(b.subtitulo)}</p>` : ""}
        ${b.boton ? `<a class="btn-claro" href="${esc(b.enlace || "#productos")}" data-enlace>${esc(b.boton)}</a>` : ""}
      </div>
    </div>`).join("");
  $("puntos").innerHTML = lista.length > 1 ? lista.map((_, i) => `<button class="punto ${i === 0 ? "on" : ""}" data-slide="${i}" aria-label="Banner ${i + 1}"></button>`).join("") : "";
  $("prevSlide").hidden = $("nextSlide").hidden = lista.length < 2;
  slideActual = 0;
  clearInterval(timerSlides);
  if (lista.length > 1) timerSlides = setInterval(() => irSlide(slideActual + 1), 6000);
}
function irSlide(i) {
  const s = document.querySelectorAll(".slide");
  if (!s.length) return;
  slideActual = (i + s.length) % s.length;
  s.forEach((el, k) => el.classList.toggle("on", k === slideActual));
  document.querySelectorAll(".punto").forEach((el, k) => el.classList.toggle("on", k === slideActual));
}
$("prevSlide").addEventListener("click", () => irSlide(slideActual - 1));
$("nextSlide").addEventListener("click", () => irSlide(slideActual + 1));
let toqueX = null;
$("inicio").addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
$("inicio").addEventListener("touchend", (e) => {
  if (toqueX === null) return;
  const d = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(d) > 50) irSlide(slideActual + (d < 0 ? 1 : -1));
  toqueX = null;
});

/* ---------- Categorías ---------- */
function catsDe(sec) {
  const pv = visibles().filter((p) => p.seccion === sec);
  const nombres = [...new Set(pv.map((p) => p.categoria).filter(Boolean))];
  const reg = categorias.filter((c) => c.seccion === sec && nombres.includes(c.nombre));
  const faltan = nombres.filter((n) => !reg.some((c) => c.nombre === n)).map((n) => ({ nombre: n, seccion: sec, imagen: "" }));
  return [...reg, ...faltan];
}
function imagenCategoria(c) {
  if (c.imagen) return c.imagen;
  const p = visibles().find((x) => x.categoria === c.nombre && x.seccion === c.seccion && x.imagen);
  return p ? p.imagen : "";
}
function tileHtml(c) {
  const img = imagenCategoria(c);
  return `<button class="tile" data-ir-cat="${esc(c.nombre)}" data-sec="${esc(c.seccion)}">
    <span class="tile-img">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `<i>${iconoDe(c.nombre)}</i>`}</span><b>${esc(c.nombre)}</b></button>`;
}
function pintarCategorias() {
  const a = catsDe("1hora"), b = catsDe("otros");
  $("categorias").hidden = !cargado || (!a.length && !b.length);
  $("categorias").classList.toggle("dos", a.length > 0 && b.length > 0);
  $("g1").hidden = !a.length;
  $("gO").hidden = !b.length;
  $("tiles1").innerHTML = a.map(tileHtml).join("");
  $("tilesO").innerHTML = b.map(tileHtml).join("");
  $("pieCats").innerHTML = [...a, ...b].map((c) => `<a href="#productos" data-ir-cat="${esc(c.nombre)}" data-sec="${esc(c.seccion)}">${esc(c.nombre)}</a>`).join("");
}
function pintarNav() {
  const a = catsDe("1hora");
  $("dropMenu").innerHTML = a.map((c) => `<a href="#productos" data-ir-cat="${esc(c.nombre)}" data-sec="1hora">${iconoDe(c.nombre)} ${esc(c.nombre)}</a>`).join("");
  $("navOtros").hidden = !visibles().some((p) => p.seccion === "otros");
}

/* ---------- Destacados ---------- */
function precioHtml(p) {
  const m = ajustes.moneda;
  if (p.consultar) return `<span class="pr">Precio a consultar</span>`;
  return tieneOferta(p)
    ? `<span class="pr-of">${dinero(p.precioOferta, m)}</span><s>${dinero(p.precio, m)}</s>`
    : `<span class="pr">${dinero(p.precio, m)}</span>`;
}
function pintarDestacados() {
  const d = visibles().filter((p) => p.destacado);
  $("destacados").hidden = d.length === 0;
  if (!d.length) return;
  const [g, ...r] = d;
  $("destGrande").innerHTML = `
    <div class="dg-img" data-ver="${esc(g.id)}"><img src="${esc(imagenDe(g))}" alt="${esc(g.nombre)}" loading="lazy"></div>
    <div class="dg-txt"><small>${esc(g.categoria || "")}</small><h3>${esc(g.nombre)}</h3><p>${esc(g.descripcion || "")}</p>
      <div class="precio">${precioHtml(g)}</div><button class="btn-oscuro" data-ver="${esc(g.id)}">Ver producto</button></div>`;
  $("destTiles").innerHTML = r.slice(0, 3).map((p) => `
    <article class="dtile" data-ver="${esc(p.id)}"><div class="dt-img"><img src="${esc(imagenDe(p))}" alt="${esc(p.nombre)}" loading="lazy"></div>
      <h4>${esc(p.nombre)}</h4><p>${esc(p.descripcion || "")}</p><span>Ver más →</span></article>`).join("");
}

/* ---------- Catálogo ---------- */
function pintarTabs() {
  const v = visibles();
  const hay1 = v.some((p) => p.seccion === "1hora");
  const hayO = v.some((p) => p.seccion === "otros");
  $("tab1hora").hidden = !hay1;
  $("tabOtros").hidden = !hayO;
  $("tabs").hidden = !(hay1 && hayO);
  if ((vista.sec === "1hora" && !hay1) || (vista.sec === "otros" && !hayO)) vista.sec = "todos";
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.sec === vista.sec));
}
function pintarChips() {
  const cats = [...new Set(enSec().map((p) => p.categoria).filter(Boolean))];
  if (vista.cat !== "Todos" && !cats.includes(vista.cat)) vista.cat = "Todos";
  $("chips").hidden = cats.length < 2;
  $("chips").innerHTML = ["Todos", ...cats].map((c) =>
    `<button class="chip ${c === vista.cat ? "on" : ""}" data-cat="${esc(c)}">${c === "Todos" ? "Todas" : iconoDe(c) + " " + esc(c)}</button>`).join("");
}
function accionHtml(p) {
  if (p.disponible === false) return `<button class="btn block" disabled>No disponible</button>`;
  if (p.consultar) return `<button class="btn block btn-preg" data-id="${esc(p.id)}">Preguntar precio</button>`;
  const it = carrito.find((c) => c.id === p.id);
  if (!it) return `<button class="btn block btn-add" data-id="${esc(p.id)}">Agregar</button>`;
  return `<div class="stepper"><button data-id="${esc(p.id)}" data-q="-1" aria-label="Quitar uno">−</button><b>${it.qty}</b><button data-id="${esc(p.id)}" data-q="1" aria-label="Agregar uno">+</button></div>`;
}
function cardHtml(p) {
  const agotado = p.disponible === false;
  return `<article class="card ${agotado ? "agotado" : ""}">
    <div class="foto" data-ver="${esc(p.id)}"><img src="${esc(imagenDe(p))}" alt="${esc(p.nombre)}" loading="lazy" decoding="async">
      ${p.seccion === "1hora" ? '<span class="sello s1h">1HORA</span>' : ""}
      ${agotado ? '<span class="sello ag">Agotado</span>' : tieneOferta(p) ? '<span class="sello of">Oferta</span>' : ""}</div>
    <div class="cuerpo">
      <h3 data-ver="${esc(p.id)}">${esc(p.nombre)}</h3>
      <div class="precio">${precioHtml(p)}</div>
      <div class="accion" data-accion="${esc(p.id)}">${accionHtml(p)}</div>
    </div></article>`;
}
function pintarGrid() {
  $("cargando").hidden = cargado;
  if (!cargado) { $("grid").innerHTML = ""; return; }
  const q = vista.texto.toLowerCase();
  const lista = enSec().filter((p) =>
    (vista.cat === "Todos" || p.categoria === vista.cat) &&
    (!q || `${p.nombre} ${p.descripcion}`.toLowerCase().includes(q)));
  $("grid").innerHTML = lista.map(cardHtml).join("") ||
    `<p class="vacio">${visibles().length ? "No encontramos productos con esa búsqueda." : "Pronto vamos a publicar productos aquí."}</p>`;
}
function verDetalle(id) {
  const p = productos.find((x) => x.id === id);
  if (!p) return;
  $("detalleCuerpo").innerHTML = `
    <img class="det-img" src="${esc(imagenDe(p))}" alt="${esc(p.nombre)}">
    <small class="cat">${p.seccion === "1hora" ? "1HORA · " : ""}${esc(p.categoria || "")}</small>
    <h2 class="det-tit">${esc(p.nombre)}</h2>
    <p class="det-desc">${esc(p.descripcion || "")}</p>
    <div class="precio grande">${precioHtml(p)}</div>
    <div class="accion" data-accion="${esc(p.id)}">${accionHtml(p)}</div>`;
  abrirHoja("hojaDetalle");
}

/* ---------- Hojas ---------- */
function abrirHoja(id) {
  cerrarHojas();
  $(id).classList.add("abierto");
  $("fondo").classList.add("abierto");
  document.body.classList.add("sin-scroll");
}
function cerrarHojas() {
  document.querySelectorAll(".hoja").forEach((h) => h.classList.remove("abierto"));
  $("fondo").classList.remove("abierto");
  document.body.classList.remove("sin-scroll");
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarHojas(); });

/* ---------- Carrito ---------- */
function guardar() { localStorage.setItem("carritoTienda", JSON.stringify(carrito)); pintarCarrito(); }
function agregar(id) {
  const p = productos.find((x) => x.id === id);
  if (!p || p.disponible === false || p.consultar) return;
  const it = carrito.find((c) => c.id === id);
  if (it) it.qty++; else carrito.push({ id, qty: 1 });
  guardar();
}
function cambiar(id, d) {
  const it = carrito.find((c) => c.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) carrito = carrito.filter((c) => c.id !== id);
  guardar();
}
function calcular() {
  const items = carrito.map((c) => {
    const p = productos.find((x) => x.id === c.id);
    return p && p.disponible !== false && p.visible !== false && !p.consultar ? { p, qty: c.qty, precio: precioFinal(p) } : null;
  }).filter(Boolean);
  const unidades = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.precio * i.qty, 0);
  const min = Number(ajustes.descuentoUnidades) || 3;
  const pct = Number(ajustes.descuentoPorcentaje) || 0;
  const aplica = !!ajustes.descuentoActivo && unidades >= min;
  const descuento = aplica ? (subtotal * pct) / 100 : 0;
  return { items, unidades, subtotal, descuento, total: subtotal - descuento, aplica, min, pct };
}
function pintarCarrito() {
  const c = calcular();
  const m = ajustes.moneda;
  $("contador").textContent = c.unidades;
  $("contador").hidden = c.unidades === 0;
  $("barraCarrito").hidden = c.unidades === 0;
  document.body.classList.toggle("con-barra", c.unidades > 0);
  $("bcCantidad").textContent = `${c.unidades} producto${c.unidades === 1 ? "" : "s"}`;
  $("bcTotal").textContent = dinero(c.total, m);
  $("bcAviso").textContent = !ajustes.descuentoActivo ? "" : c.aplica ? `Descuento ${c.pct}% aplicado` : `Agrega ${c.min - c.unidades} más y ahorra ${c.pct}%`;

  if (!c.items.length) {
    $("carritoItems").innerHTML = `<p class="vacio">Todavía no agregas productos.</p>`;
    $("carritoResumen").hidden = true;
  } else {
    $("carritoResumen").hidden = false;
    $("carritoItems").innerHTML = c.items.map(({ p, qty, precio }) => `
      <div class="item">
        <img src="${esc(imagenDe(p))}" alt="">
        <div class="it-dat"><b>${esc(p.nombre)}</b><small>${dinero(precio, m)}</small></div>
        <div class="stepper chico"><button data-id="${esc(p.id)}" data-q="-1" aria-label="Quitar uno">−</button><b>${qty}</b><button data-id="${esc(p.id)}" data-q="1" aria-label="Agregar uno">+</button></div>
        <button class="x" data-del="${esc(p.id)}" aria-label="Quitar">✕</button>
      </div>`).join("");
    $("avisoDesc").textContent = ajustes.descuentoActivo && !c.aplica ? `Agrega ${c.min - c.unidades} más y ahorra ${c.pct}%` : "";
    $("resSubtotal").textContent = dinero(c.subtotal, m);
    $("filaDesc").hidden = !c.aplica;
    $("txtDesc").textContent = `Descuento ${c.pct}%`;
    $("resDesc").textContent = "-" + dinero(c.descuento, m);
    $("resTotal").textContent = dinero(c.total, m);
  }
  document.querySelectorAll("[data-accion]").forEach((el) => {
    const p = productos.find((x) => x.id === el.dataset.accion);
    if (p) el.innerHTML = accionHtml(p);
  });
}

$("btnWa").addEventListener("click", () => {
  const c = calcular();
  if (!c.items.length) return;
  const m = ajustes.moneda;
  let msg = "Hola, quiero hacer este pedido:\n\n";
  c.items.forEach(({ p, qty, precio }) => { msg += `${qty} x ${p.nombre} - ${dinero(precio, m)} c/u\n`; });
  msg += `\nSubtotal: ${dinero(c.subtotal, m)}`;
  if (c.aplica) msg += `\nDescuento ${c.pct}%: -${dinero(c.descuento, m)}`;
  msg += `\nTotal: ${dinero(c.total, m)}`;
  window.open(waUrl(msg), "_blank");
});
$("btnVaciar").addEventListener("click", () => { carrito = []; guardar(); });
$("btnCarrito").addEventListener("click", () => abrirHoja("hojaCarrito"));
$("btnVerPedido").addEventListener("click", () => abrirHoja("hojaCarrito"));

/* ---------- Navegación ---------- */
function irACatalogo(sec, cat) {
  vista.sec = sec; vista.cat = cat;
  pintarTabs(); pintarChips(); pintarGrid();
  $("productos").scrollIntoView({ behavior: "smooth" });
}
function irA(destino) {
  if (!destino) return;
  if (/^https?:/i.test(destino)) { window.open(destino, "_blank", "noopener"); return; }
  if (destino === "#1hora" || destino === "#otros") { irACatalogo(destino.slice(1), "Todos"); return; }
  const el = document.getElementById(destino.replace(/^#/, ""));
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

$("btnMenu").addEventListener("click", () => $("nav").classList.toggle("abierto"));
$("btnBuscar").addEventListener("click", () => {
  $("buscadorFila").hidden = !$("buscadorFila").hidden;
  if (!$("buscadorFila").hidden) $("buscar").focus();
});
let buscando = false;
$("buscar").addEventListener("input", (e) => {
  vista.texto = e.target.value.trim();
  if (vista.texto && !buscando) { vista.sec = "todos"; vista.cat = "Todos"; pintarTabs(); pintarChips(); $("productos").scrollIntoView({ behavior: "smooth" }); }
  buscando = !!vista.texto;
  pintarGrid();
});

document.addEventListener("click", (e) => {
  const t = e.target;
  let el;
  if (t.closest("#nav a")) $("nav").classList.remove("abierto");
  if ((el = t.closest("[data-ir-cat]"))) { e.preventDefault(); irACatalogo(el.dataset.sec || "todos", el.dataset.irCat); }
  else if ((el = t.closest("[data-sec-link]"))) { e.preventDefault(); irACatalogo(el.dataset.secLink, "Todos"); }
  else if ((el = t.closest("a[data-enlace]"))) { e.preventDefault(); irA(el.getAttribute("href")); }
  else if ((el = t.closest("#tabs button"))) { vista.sec = el.dataset.sec; vista.cat = "Todos"; pintarTabs(); pintarChips(); pintarGrid(); }
  else if ((el = t.closest(".chip"))) { vista.cat = el.dataset.cat; pintarChips(); pintarGrid(); }
  else if ((el = t.closest(".btn-add"))) agregar(el.dataset.id);
  else if ((el = t.closest(".btn-preg"))) { const p = productos.find((x) => x.id === el.dataset.id); if (p) window.open(waUrl(`Hola, quiero preguntar por: ${p.nombre}`), "_blank"); }
  else if ((el = t.closest("[data-q]"))) cambiar(el.dataset.id, Number(el.dataset.q));
  else if ((el = t.closest("[data-del]"))) cambiar(el.dataset.del, -999);
  else if ((el = t.closest("[data-slide]"))) irSlide(Number(el.dataset.slide));
  else if ((el = t.closest("[data-ver]"))) verDetalle(el.dataset.ver);
  else if (t.closest("[data-cerrar]")) cerrarHojas();
});

/* ---------- Arranque: va al final para que todo ya esté definido ---------- */
function pintarTodo() { pintarNav(); pintarCategorias(); pintarDestacados(); pintarTabs(); pintarChips(); pintarGrid(); pintarCarrito(); }
escucharAjustes((a) => { ajustes = a; pintarAjustes(); pintarBanners(); pintarGrid(); pintarCarrito(); });
escucharBanners((l) => { banners = l; pintarBanners(); });
escucharCategorias((l) => { categorias = l; pintarCategorias(); pintarNav(); });
escucharProductos((l) => { productos = l; cargado = true; pintarTodo(); });
