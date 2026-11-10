/* admin.js - panel para manejar productos, portada, categorías y ajustes */
const $ = (id) => document.getElementById(id);
let productos = [], categorias = [], banners = [];
let ajustes = { ...AJUSTES_BASE };
let detener = [];

function mostrar(vista) {
  $("avisoFirebase").hidden = vista !== "aviso";
  $("loginBox").hidden = vista !== "login";
  $("panelAdmin").hidden = vista !== "panel";
  $("btnSalir").hidden = vista !== "panel";
}
function fallo(err) {
  alert("No se pudo guardar. " + (err.code === "permission-denied"
    ? "Revisa que las reglas de Firestore tengan tu correo de administrador."
    : err.message));
}
const maxOrden = (lista) => lista.reduce((a, x) => Math.max(a, x.orden || 0), 0);

/* ---------- Imágenes: enlace o foto subida y comprimida ---------- */
function comprimir(archivo, max, calidad, tipo) {
  return new Promise((ok, fail) => {
    const r = new FileReader();
    r.onerror = fail;
    r.onload = () => {
      const img = new Image();
      img.onerror = fail;
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL(tipo, calidad));
      };
      img.src = r.result;
    };
    r.readAsDataURL(archivo);
  });
}
function crearSelectorImagen(host, { max = 700, calidad = 0.75, tipo = "image/jpeg" } = {}) {
  host.className = "imgsel";
  host.innerHTML = `<img class="prev" alt="" hidden>
    <input type="text" class="img-url" placeholder="Pega aquí el enlace de la imagen">
    <div class="acc"><label class="subir">Subir foto<input type="file" accept="image/*" hidden></label><button type="button" class="enlace quitar">Quitar imagen</button></div>`;
  let valor = "";
  const prev = host.querySelector(".prev"), url = host.querySelector(".img-url"), file = host.querySelector("input[type=file]");
  const mostrarPrev = () => { prev.hidden = !valor; prev.src = valor || ""; };
  url.addEventListener("input", () => { valor = url.value.trim(); mostrarPrev(); });
  file.addEventListener("change", async () => {
    const f = file.files[0];
    if (!f) return;
    try { valor = await comprimir(f, max, calidad, tipo); url.value = ""; mostrarPrev(); }
    catch (e) { alert("No se pudo leer esa imagen."); }
    file.value = "";
  });
  host.querySelector(".quitar").addEventListener("click", () => { valor = ""; url.value = ""; mostrarPrev(); });
  return {
    get: () => valor,
    set: (v) => { valor = v || ""; url.value = valor.startsWith("data:") ? "" : valor; mostrarPrev(); },
  };
}
const selProducto = crearSelectorImagen($("pImgHost"), { max: 700, calidad: 0.75 });
const selPromo = crearSelectorImagen($("promoImgHost"), { max: 1600, calidad: 0.65 });
const selLogo = crearSelectorImagen($("logoImgHost"), { max: 400, calidad: 0.9, tipo: "image/png" });

$("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("loginError").textContent = "";
  try { await auth.signInWithEmailAndPassword($("lCorreo").value.trim(), $("lPass").value); }
  catch (err) { $("loginError").textContent = "Correo o contraseña incorrectos."; }
});
$("btnSalir").addEventListener("click", () => auth.signOut());

document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach((x) => x.classList.toggle("on", x === b));
  ["productos", "portada", "categorias", "ajustes"].forEach((t) => { $("tab-" + t).hidden = t !== b.dataset.tab; });
}));

/* ---------- Mover de orden dentro de un grupo ---------- */
async function moverOrden(coleccion, lista, item, dir, grupo) {
  const g = grupo ? grupo(item) : null;
  const l = lista.filter((x) => !grupo || grupo(x) === g).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const i = l.findIndex((x) => x.id === item.id);
  const otro = l[i + dir];
  if (!otro) return;
  const batch = db.batch();
  batch.update(db.collection(coleccion).doc(item.id), { orden: otro.orden || 0 });
  batch.update(db.collection(coleccion).doc(otro.id), { orden: item.orden || 0 });
  await batch.commit();
}

/* ---------- Productos ---------- */
function filaProducto(p) {
  const m = ajustes.moneda;
  const precio = p.consultar ? "Precio a consultar" : p.enOferta && p.precioOferta != null ? `${dinero(p.precioOferta, m)} en oferta` : dinero(p.precio, m);
  return `<div class="fila ${p.visible === false ? "oculto" : ""}">
    <img src="${esc(imagenDe(p))}" alt="">
    <div class="dato"><b>${esc(p.nombre)}</b><small>${esc(p.categoria || "Sin categoría")} · ${precio}${p.destacado ? " · Destacado" : ""}</small></div>
    <div class="ctrl">
      <label class="sel">Sección
        <select data-acc="sec" data-id="${esc(p.id)}">
          <option value="1hora" ${p.seccion === "1hora" ? "selected" : ""}>1HORA</option>
          <option value="otros" ${p.seccion === "otros" ? "selected" : ""}>Otros</option>
        </select></label>
      <label class="sw"><input type="checkbox" data-acc="disp" data-id="${esc(p.id)}" ${p.disponible !== false ? "checked" : ""}> Disponible</label>
      <label class="sw"><input type="checkbox" data-acc="vis" data-id="${esc(p.id)}" ${p.visible !== false ? "checked" : ""}> Visible</label>
      <div class="acciones">
        <button type="button" class="ico-btn" data-acc="sube" data-id="${esc(p.id)}" title="Subir">↑</button>
        <button type="button" class="ico-btn" data-acc="baja" data-id="${esc(p.id)}" title="Bajar">↓</button>
        <button type="button" class="btn sm ghost" data-acc="edit" data-id="${esc(p.id)}">Editar</button>
        <button type="button" class="btn sm danger" data-acc="del" data-id="${esc(p.id)}">Borrar</button>
      </div>
    </div></div>`;
}
function pintarLista() {
  const sec = $("fSeccion").value;
  const q = $("fTexto").value.trim().toLowerCase();
  const lista = productos.filter((p) => (sec === "todas" || p.seccion === sec) && (!q || (p.nombre || "").toLowerCase().includes(q)));
  $("conteo").textContent = `${lista.length} de ${productos.length} productos`;
  $("lista").innerHTML = lista.map(filaProducto).join("") || `<p class="vacio">Todavía no hay productos. Usa Nuevo producto o carga la tienda de ejemplo.</p>`;
  const cats = [...new Set([...categorias.map((c) => c.nombre), ...productos.map((p) => p.categoria).filter(Boolean)])];
  $("listaCats").innerHTML = cats.map((c) => `<option value="${esc(c)}">`).join("");
}
$("fSeccion").addEventListener("change", pintarLista);
$("fTexto").addEventListener("input", pintarLista);

$("lista").addEventListener("change", async (e) => {
  const t = e.target, id = t.dataset.id;
  if (!id) return;
  try {
    if (t.dataset.acc === "sec") await db.collection("productos").doc(id).update({ seccion: t.value, orden: maxOrden(productos) + 1 });
    if (t.dataset.acc === "disp") await db.collection("productos").doc(id).update({ disponible: t.checked });
    if (t.dataset.acc === "vis") await db.collection("productos").doc(id).update({ visible: t.checked });
  } catch (err) { fallo(err); }
});
$("lista").addEventListener("click", async (e) => {
  const b = e.target.closest("button[data-acc]");
  if (!b) return;
  const p = productos.find((x) => x.id === b.dataset.id);
  if (!p) return;
  try {
    if (b.dataset.acc === "sube") await moverOrden("productos", productos, p, -1, (x) => x.seccion);
    if (b.dataset.acc === "baja") await moverOrden("productos", productos, p, 1, (x) => x.seccion);
    if (b.dataset.acc === "edit") abrirProducto(p);
    if (b.dataset.acc === "del" && confirm("¿Borrar este producto? No se puede deshacer.")) await db.collection("productos").doc(p.id).delete();
  } catch (err) { fallo(err); }
});

function abrirProducto(p) {
  $("modalTitulo").textContent = p ? "Editar producto" : "Nuevo producto";
  $("pId").value = p ? p.id : "";
  $("pNombre").value = p ? p.nombre : "";
  $("pDesc").value = p ? p.descripcion || "" : "";
  $("pSeccion").value = p ? p.seccion : "1hora";
  $("pCategoria").value = p ? p.categoria || "" : "";
  $("pPrecio").value = p ? p.precio : "";
  $("pPrecioOferta").value = p && p.precioOferta != null ? p.precioOferta : "";
  $("pOferta").checked = p ? !!p.enOferta : false;
  $("pConsultar").checked = p ? !!p.consultar : false;
  selProducto.set(p ? p.imagen : "");
  $("pDisponible").checked = p ? p.disponible !== false : true;
  $("pVisible").checked = p ? p.visible !== false : true;
  $("pDestacado").checked = p ? !!p.destacado : false;
  $("modal").hidden = false;
}
$("btnNuevo").addEventListener("click", () => abrirProducto(null));
$("btnCerrarModal").addEventListener("click", () => { $("modal").hidden = true; });

$("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();
  const enOferta = $("pOferta").checked;
  const consultar = $("pConsultar").checked;
  const precio = Number($("pPrecio").value) || 0;
  if (!consultar && precio <= 0) { alert("Escribe el precio o marca Precio a consultar."); return; }
  const datos = {
    nombre: $("pNombre").value.trim(),
    descripcion: $("pDesc").value.trim(),
    seccion: $("pSeccion").value,
    categoria: $("pCategoria").value.trim(),
    precio,
    enOferta,
    precioOferta: enOferta && $("pPrecioOferta").value !== "" ? Number($("pPrecioOferta").value) : null,
    consultar,
    imagen: selProducto.get(),
    disponible: $("pDisponible").checked,
    visible: $("pVisible").checked,
    destacado: $("pDestacado").checked,
  };
  try {
    const id = $("pId").value;
    if (id) await db.collection("productos").doc(id).update(datos);
    else await db.collection("productos").add({ ...datos, orden: maxOrden(productos) + 1, creado: firebase.firestore.FieldValue.serverTimestamp() });
    $("modal").hidden = true;
  } catch (err) { fallo(err); }
});

$("btnEjemplo").addEventListener("click", async () => {
  if (!confirm("Se agregan los productos, categorías y banners de ejemplo. Después los puedes editar o borrar.")) return;
  try {
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    const base = { p: maxOrden(productos), c: maxOrden(categorias), b: maxOrden(banners) };
    const batch = db.batch();
    PRODUCTOS_EJEMPLO.forEach((x, i) => { const { id, ...d } = x; batch.set(db.collection("productos").doc(), { ...d, orden: base.p + i + 1, creado: ts }); });
    CATEGORIAS_EJEMPLO.forEach((x, i) => { const { id, ...d } = x; batch.set(db.collection("categorias").doc(), { ...d, orden: base.c + i + 1 }); });
    BANNERS_EJEMPLO.forEach((x, i) => { const { id, ...d } = x; batch.set(db.collection("banners").doc(), { ...d, orden: base.b + i + 1 }); });
    await batch.commit();
  } catch (err) { fallo(err); }
});

/* ---------- Formulario genérico para banners y categorías ---------- */
function abrirGenerico({ titulo, campos, valores = {}, guardar }) {
  $("genTitulo").textContent = titulo;
  const cont = $("genCampos");
  cont.innerHTML = "";
  const getters = {};
  campos.forEach((c) => {
    const val = valores[c.id] ?? "";
    const w = document.createElement("div");
    if (c.tipo === "imagen") {
      w.className = "campo";
      w.innerHTML = `<span class="etq">${esc(c.etiqueta)}</span><div></div>`;
      const sel = crearSelectorImagen(w.querySelector("div"), { max: c.max, calidad: c.calidad });
      sel.set(val);
      getters[c.id] = () => sel.get();
    } else {
      const lab = document.createElement("label");
      lab.append(c.etiqueta);
      let el;
      if (c.tipo === "select") {
        el = document.createElement("select");
        el.innerHTML = c.opciones.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join("");
      } else {
        el = document.createElement("input");
        el.type = "text";
      }
      el.value = val;
      if (c.requerido) el.required = true;
      if (c.placeholder) el.placeholder = c.placeholder;
      lab.appendChild(el);
      w.appendChild(lab);
      getters[c.id] = () => el.value.trim();
    }
    cont.appendChild(w);
  });
  $("formGen").onsubmit = async (e) => {
    e.preventDefault();
    const datos = {};
    Object.entries(getters).forEach(([k, g]) => { datos[k] = g(); });
    try { await guardar(datos); $("modalGen").hidden = true; } catch (err) { fallo(err); }
  };
  $("modalGen").hidden = false;
}
$("btnCerrarGen").addEventListener("click", () => { $("modalGen").hidden = true; });

const gestores = {
  banners: {
    coleccion: "banners", lista: "listaBanners", nuevo: "Nuevo banner", editar: "Editar banner",
    campos: [
      { id: "imagen", etiqueta: "Imagen de fondo", tipo: "imagen", max: 1600, calidad: 0.65 },
      { id: "titulo", etiqueta: "Título grande" },
      { id: "subtitulo", etiqueta: "Texto debajo del título" },
      { id: "boton", etiqueta: "Texto del botón. Déjalo vacío si no quieres botón" },
      { id: "enlace", etiqueta: "A dónde lleva el botón", placeholder: "#productos, #1hora, #otros o https://" },
    ],
    datos: () => banners,
    fila: (b) => ({ img: b.imagen, cat: "", t: b.titulo || "Sin título", d: b.boton ? `Botón ${b.boton}` : "Sin botón" }),
    grupo: null,
  },
  categorias: {
    coleccion: "categorias", lista: "listaCategorias", nuevo: "Nueva categoría", editar: "Editar categoría",
    campos: [
      { id: "nombre", etiqueta: "Nombre de la categoría", requerido: true },
      { id: "seccion", etiqueta: "Sección", tipo: "select", opciones: [["1hora", "1HORA"], ["otros", "Otros"]] },
      { id: "imagen", etiqueta: "Imagen. Si la dejas vacía uso la foto de un producto", tipo: "imagen", max: 600, calidad: 0.75 },
    ],
    datos: () => categorias,
    fila: (c) => ({ img: c.imagen, cat: c.nombre, t: c.nombre, d: c.seccion === "1hora" ? "Sección 1HORA" : "Sección Otros" }),
    grupo: (c) => c.seccion,
  },
};

function pintarGestor(clave) {
  const g = gestores[clave];
  const items = g.datos();
  $(g.lista).innerHTML = items.map((x) => {
    const f = g.fila(x);
    return `<div class="fila"><img src="${esc(imagenDe({ imagen: f.img, categoria: f.cat }))}" alt="">
      <div class="dato"><b>${esc(f.t)}</b><small>${esc(f.d)}</small></div>
      <div class="acciones">
        <button type="button" class="ico-btn" data-g="${clave}" data-acc="sube" data-id="${esc(x.id)}" title="Subir">↑</button>
        <button type="button" class="ico-btn" data-g="${clave}" data-acc="baja" data-id="${esc(x.id)}" title="Bajar">↓</button>
        <button type="button" class="btn sm ghost" data-g="${clave}" data-acc="edit" data-id="${esc(x.id)}">Editar</button>
        <button type="button" class="btn sm danger" data-g="${clave}" data-acc="del" data-id="${esc(x.id)}">Borrar</button>
      </div></div>`;
  }).join("") || `<p class="vacio">Todavía no hay nada aquí. Usa el botón de arriba para agregar.</p>`;
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button[data-g]");
  if (!b) return;
  const g = gestores[b.dataset.g];
  const item = g.datos().find((x) => x.id === b.dataset.id);
  if (!item) return;
  try {
    if (b.dataset.acc === "sube") await moverOrden(g.coleccion, g.datos(), item, -1, g.grupo);
    if (b.dataset.acc === "baja") await moverOrden(g.coleccion, g.datos(), item, 1, g.grupo);
    if (b.dataset.acc === "edit") abrirGenerico({ titulo: g.editar, campos: g.campos, valores: item, guardar: (d) => db.collection(g.coleccion).doc(item.id).update(d) });
    if (b.dataset.acc === "del" && confirm("¿Borrar esto? No se puede deshacer.")) await db.collection(g.coleccion).doc(item.id).delete();
  } catch (err) { fallo(err); }
});
$("btnNuevoBanner").addEventListener("click", () => {
  const g = gestores.banners;
  abrirGenerico({ titulo: g.nuevo, campos: g.campos, guardar: (d) => db.collection(g.coleccion).add({ ...d, orden: maxOrden(banners) + 1 }) });
});
$("btnNuevaCat").addEventListener("click", () => {
  const g = gestores.categorias;
  abrirGenerico({ titulo: g.nuevo, campos: g.campos, valores: { seccion: "otros" }, guardar: (d) => db.collection(g.coleccion).add({ ...d, orden: maxOrden(categorias) + 1 }) });
});

/* ---------- Ajustes, aviso y promoción ---------- */
const guardarConfig = (datos) => db.collection("config").doc("tienda").set(datos, { merge: true });
const mensaje = (id, t) => { $(id).textContent = t; setTimeout(() => { $(id).textContent = ""; }, 2500); };
const editando = (form) => document.activeElement && form.contains(document.activeElement) && document.activeElement.matches("input,textarea,select");

function llenarFormularios() {
  if (!editando($("formAviso"))) $("aviso").value = ajustes.avisoSuperior || "";
  if (!editando($("formPromo"))) {
    const p = ajustes.promo || {};
    selPromo.set(p.imagen);
    $("prTitulo").value = p.titulo || "";
    $("prSub").value = p.subtitulo || "";
    $("prBoton").value = p.boton || "";
    $("prEnlace").value = p.enlace || "";
  }
  if (!editando($("formAjustes"))) {
    $("aNombre").value = ajustes.nombreTienda;
    selLogo.set(ajustes.logo);
    $("aWa").value = ajustes.whatsapp;
    $("aMoneda").value = ajustes.moneda;
    $("aCatTitulo").value = ajustes.catalogoTitulo || "";
    $("aDescActivo").checked = !!ajustes.descuentoActivo;
    $("aDescUnid").value = ajustes.descuentoUnidades;
    $("aDescPct").value = ajustes.descuentoPorcentaje;
    $("aPqTitulo").value = ajustes.porQueTitulo || "";
    [1, 2, 3].forEach((n) => {
      const x = (ajustes.porQue || [])[n - 1] || {};
      $(`aPq${n}t`).value = x.titulo || "";
      $(`aPq${n}x`).value = x.texto || "";
    });
    $("aDestTitulo").value = ajustes.destacadosTitulo || "";
    $("aNota").value = ajustes.notaEntrega || "";
    $("aDir").value = ajustes.direccion || "";
    $("aCorreo").value = ajustes.correo || "";
    $("aTel").value = ajustes.telefono || "";
    $("aFb").value = ajustes.facebook || "";
    $("aIg").value = ajustes.instagram || "";
    $("aYt").value = ajustes.youtube || "";
    $("aTt").value = ajustes.tiktok || "";
  }
}

$("formAviso").addEventListener("submit", async (e) => {
  e.preventDefault();
  try { await guardarConfig({ avisoSuperior: $("aviso").value.trim() }); mensaje("avisoMsg", "Listo, guardado."); } catch (err) { fallo(err); }
});
$("formPromo").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await guardarConfig({ promo: { imagen: selPromo.get(), titulo: $("prTitulo").value.trim(), subtitulo: $("prSub").value.trim(), boton: $("prBoton").value.trim(), enlace: $("prEnlace").value.trim() } });
    mensaje("promoMsg", "Listo, guardado.");
  } catch (err) { fallo(err); }
});
$("formAjustes").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await guardarConfig({
      nombreTienda: $("aNombre").value.trim(),
      logo: selLogo.get(),
      whatsapp: $("aWa").value.replace(/\D/g, ""),
      moneda: $("aMoneda").value.trim(),
      catalogoTitulo: $("aCatTitulo").value.trim(),
      descuentoActivo: $("aDescActivo").checked,
      descuentoUnidades: Number($("aDescUnid").value),
      descuentoPorcentaje: Number($("aDescPct").value),
      porQueTitulo: $("aPqTitulo").value.trim(),
      porQue: [1, 2, 3].map((n) => ({ titulo: $(`aPq${n}t`).value.trim(), texto: $(`aPq${n}x`).value.trim() })),
      destacadosTitulo: $("aDestTitulo").value.trim(),
      notaEntrega: $("aNota").value.trim(),
      direccion: $("aDir").value.trim(),
      correo: $("aCorreo").value.trim(),
      telefono: $("aTel").value.trim(),
      facebook: $("aFb").value.trim(),
      instagram: $("aIg").value.trim(),
      youtube: $("aYt").value.trim(),
      tiktok: $("aTt").value.trim(),
    });
    mensaje("ajMsg", "Listo, ajustes guardados.");
  } catch (err) { fallo(err); }
});

/* ---------- Arranque: va al final para que todo ya esté definido ---------- */
if (!FIREBASE_LISTO || !auth) {
  mostrar("aviso");
} else {
  auth.onAuthStateChanged((u) => {
    detener.forEach((f) => f());
    detener = [];
    if (!u) { mostrar("login"); return; }
    mostrar("panel");
    detener.push(escucharProductos((l) => { productos = l; pintarLista(); }));
    detener.push(escucharCategorias((l) => { categorias = l; pintarGestor("categorias"); }));
    detener.push(escucharBanners((l) => { banners = l; pintarGestor("banners"); }));
    detener.push(escucharAjustes((a) => { ajustes = a; llenarFormularios(); pintarLista(); }));
  });
}
