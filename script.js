// Variables globales
var text02 = ["Aplicar", "Pausa", "Reanudar"]; // Textos para el botón 2 (varios estados)

// Variables para los símbolos y unidades
var decimalSeparator = ","; // Separador decimal

// Colores utilizados en el lienzo
var colorBackground = "#fff"; // Color de fondo
var colorClock3 = "#000000"; // Color para el reloj
var colorElongation = "#ff0000"; // Color para la elongación
var colorVelocity = "#ff00ff"; // Color para la velocidad
var colorAcceleration = "#0000ff"; // Color para la aceleración
var colorForce = "#008020"; // Color para la fuerza
var colorBody = "#ffffff"; // Color para el cuerpo

// Constantes y variables de cálculo
var deg = Math.PI / 180; // Conversión de grados a radianes
var ax = 120, ay = 30; // Posición del péndulo
var xD = 260; // Posición de los diagramas
var yD1 = 180, yD2 = 165; // Posiciones de los diagramas
var FONT1 = "normal normal bold 12px sans-serif"; // Fuente para el texto
var tPix = 20; // Tamaño del paso de tiempo en píxeles

// Variables del lienzo y estado del programa
var canvas, ctx; // Lienzo y contexto
var width, height; // Ancho y alto del lienzo
var bu1, bu2; // Botones
var cbSlow; // Casilla de verificación de ralentización
var cbAmort; // Casilla de verificación de amortiguados
var ipL, ipG, ipM, ipA, ipAm, ipMasb, posMas, radMas; // Entradas de longitud, gravedad, masa y amplitud
var rbY, rbV, rbA, rbF, rbE; // Botones de selección
var on; // Estado del péndulo (activo o inactivo)
var slow; // Estado de ralentización
var unlock; // Estado de activacion de campo amortiguacion
var t0; // Tiempo de inicio del programa
var t; // Tiempo transcurrido
var tU; // Tiempo transcurrido sin considerar los primeros 5 segundos
var l; // Longitud del péndulo
var lPix; // Longitud del péndulo en píxeles
var g; // Aceleración de la gravedad
var m; // masa
var r; // radio de la masa
var amortiguacion; // Amortiguacion
var masaBarra; // Masa de la barra
var posicionMasa; // Posicion de la masa
var omega; // Frecuencia angular
var tPer; // Período de oscilación
var phi; // Ángulo de oscilación
var sinPhi, cosPhi; // Seno y coseno del ángulo
var alpha0; // Amplitud de oscilación inicial
var alpha; // Amplitud de oscilación en el tiempo actual
var sinAlpha, cosAlpha; // Seno y coseno de la amplitud
var yPix; // Escala de eje Y en píxeles
var px, py; // Posición del péndulo en el lienzo
var nrSize; // Índice de tamaño para los diagramas (0 - 4)

// Función para obtener un elemento del DOM y opcionalmente establecer su texto
function getElement(id, text) {
  var e = document.getElementById(id);
  if (text) e.innerHTML = text;
  return e;
}

var ax, ay; // Nuevas variables para la posición del péndulo

// Función de inicio del programa
function start() {
  // Inicialización de variables y elementos del DOM
  canvas = getElement("cv"); // Obtener el lienzo
  // Establecer el ancho y alto del lienzo para que coincida con el tamaño de la ventana del navegador
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
  ctx = canvas.getContext("2d"); // Obtener el contexto 2D del lienzo
  ax = width / 5; // Centrar horizontalmente el péndulo
  ay = 30; // Posición vertical del péndulo
  xD = (width - 200) / 2; // Centrar horizontalmente los gráficos
  yD1 = 180; // Posición vertical del primer gráfico
  yD2 = 165; // Posición vertical del segundo gráfico
  bu1 = getElement("bu1", "Restablecer"); // Obtener el botón 1
  bu2 = getElement("bu2", text02[0]); // Obtener el botón 2
  bu2.state = 0; // Establecer el estado inicial del botón 2
  cbAmort = getElement("cbAmort"); // Obtener la casilla de verificación de amortiguados
  cbAmort.checked = false; // Desmarcar la casilla de verificación de amortiguados
  getElement("lbAmort", "Amortiguados"); // Obtener el texto para la casilla de verificación de amortiguados
  cbSlow = getElement("cbSlow"); // Obtener la casilla de verificación de ralentización
  cbSlow.checked = false; // Desmarcar la casilla de verificación de ralentización
  getElement("lbSlow", "Ralentizar"); // Obtener el texto para la casilla de verificación de ralentización
  ipL = getElement("longitudInput"); // Obtener la entrada de longitud
  var ipgx = getElement("ipGx"); // Obtener la entrada de aceleración de la gravedad (si existe)
  if (ipgx) ipgx.innerHTML = "Aceleración"; // Establecer el texto para la entrada de aceleración de la gravedad
  ipG = getElement("ipGb"); // Obtener la entrada de gravedad
  ipM = getElement("ipMb"); // Obtener la entrada de masa
  radMas = getElement('radMas');
  ipA = getElement("ipAb"); // Obtener la entrada de amplitud
  ipAm = getElement("ipAm"); // Obtener la entrada de amortiguacion
  ipMasb = getElement("ipMasb"); // Obtener la entrada de la masa de la barra
  posMas = getElement("posMas"); // Obtener posicion de la masa en la barra
  rbY = getElement("rbY"); // Obtener el botón de selección para elongación
  getElement("lbY", "Elongación"); // Obtener el texto para la selección de elongación
  rbY.checked = true; // Marcar el botón de selección para elongación por defecto
  rbV = getElement("rbV"); // Obtener el botón de selección para velocidad
  getElement("lbV", "Velocidad"); // Obtener el texto para la selección de velocidad
  rbA = getElement("rbA"); // Obtener el botón de selección para aceleración
  getElement("lbA", "Aceleración"); // Obtener el texto para la selección de aceleración
  rbF = getElement("rbF"); // Obtener el botón de selección para fuerza
  getElement("lbF", "Fuerza"); // Obtener el texto para la selección de fuerza
  rbE = getElement("rbE"); // Obtener el botón de selección para energía
  getElement("lbE", "Energía"); // Obtener el texto para la selección de energía

  // Establecer los valores iniciales de las entradas
  l = 15; // Longitud inicial
  g = 9.81; // Gravedad inicial
  m = 1; // Masa inicial
  r = 2;
  alpha0 = 10 * deg; // Amplitud inicial (en radianes)
  amortiguacion = 0;
  masaBarra = 1;
  posicionMasa = l;
  updateInput(); // Actualizar las entradas con los valores iniciales
  calculation(); // Realizar los cálculos iniciales
  focus(ipL); // Establecer el foco en la entrada de longitud
  on = false; // Inicializar el estado del péndulo como inactivo
  slow = false; // Inicializar el estado de ralentización como falso
  ipAm.disabled = true; // Inicializar el estado de amortiguacion como bloqueado
  t = 0; // Inicializar el tiempo transcurrido como cero
  t0 = new Date(); // Obtener la hora actual
  setInterval(paint, 40); // Establecer un intervalo de repintado

  // Asignar eventos a los elementos del DOM
  bu1.onclick = reactionReset; // Asignar evento de clic para el botón 1 (restablecer)
  bu2.onclick = reactionStart; // Asignar evento de clic para el botón 2 (comenzar/pausa)
  cbAmort.onclick = reactionUnlock; // Asignar evento de clic para la casilla de verificación de ralentización
  cbSlow.onclick = reactionSlow; // Asignar evento de clic para la casilla de verificación de ralentización
  ipL.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de longitud
  ipG.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de gravedad
  ipM.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de masa
  radMas.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de radio de masa
  ipA.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de amplitud
  ipAm.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de amortiguacion
  ipMasb.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de la masa de la barra
  posMas.onkeydown = reactionEnter; // Asignar evento de tecla presionada para la entrada de la posicion de la masa
  ipL.onblur = reaction; // Asignar evento de pérdida de foco para la entrada de longitud
  ipG.onblur = reaction; // Asignar evento de pérdida de foco para la entrada de gravedad
  ipM.onblur = reaction; // Asignar evento de pérdida de foco para la entrada de masa
  radMas.onblur = reaction; // Asignar evento de perdida de foco para la entrada de radio de masa
  ipA.onblur = reaction; // Asignar evento de pérdida de foco para la entrada de amplitud
  ipAm.onblur = reaction; // Asignar evento de pérdida de foco para la entrada de amortiguacion
  ipMasb.onblur = reaction; // Asignar evento de pérdida de foco para la entrada de la masa de la barra
  posMas.onblur = reaction; // Asignar evento de pérdida de foco para la entrada de la posicion de la masa
  rbY.onclick = reactionRadioButton; // Asignar evento de clic para el botón de selección de elongación
  rbV.onclick = reactionRadioButton; // Asignar evento de clic para el botón de selección de velocidad
  rbA.onclick = reactionRadioButton; // Asignar evento de clic para el botón de selección de aceleración
  rbF.onclick = reactionRadioButton; // Asignar evento de clic para el botón de selección de fuerza
  rbE.onclick = reactionRadioButton; // Asignar evento de clic para el botón de selección de energía

  nrSize = 0; // Establecer el número de tamaño inicial (para el tipo de gráfico predeterminado)
}

// Función para establecer el estado del botón 2 (comenzar/pausa)
function setButton2State(st) {
  bu2.state = st; // Establecer el estado del botón 2
  bu2.innerHTML = text02[st]; // Establecer el texto del botón 2 según el estado
}

// Función para cambiar el estado del botón 2 (comenzar/pausa)
function switchButton2() {
  var st = bu2.state; // Obtener el estado actual del botón 2
  if (st == 0) st = 1; // Si está en estado 0, cambiar a estado 1 (comenzar)
  else st = 3 - st; // De lo contrario, cambiar entre estado 2 y 3 (pausa/reanudar)
  setButton2State(st); // Establecer el nuevo estado del botón 2
}

// Función para habilitar o deshabilitar las entradas de usuario
function enableInput(p) {
  // Establecer el atributo de solo lectura de las entradas según el valor booleano proporcionado
  ipL.readOnly = !p;
  ipG.readOnly = !p;
  ipM.readOnly = !p;
  ipA.readOnly = !p;
  ipAm.readOnly = !p;
  ipMasb.readOnly = !p;
  posMas.readOnly = !p;
  radMas.readOnly = !p;
}

// Función de reacción al hacer clic en el botón de restablecimiento
function reactionReset() {
  window.location.reload(); // Recargar la página
}


// Función de reacción al hacer clic en el botón de comenzar/pausa
function reactionStart() {
  if (bu2.state != 1) t0 = new Date(); // Si el estado actual del botón no es "comenzar", obtener la hora actual
  switchButton2(); // Cambiar el estado del botón 2
  enableInput(false); // Deshabilitar las entradas de usuario
  on = (bu2.state == 1); // Establecer el estado del péndulo según el estado actual del botón 2
  slow = cbSlow.checked; // Actualizar el estado de ralentización
  reaction(); // Realizar la reacción necesaria
}

// Función de reacción al cambiar el estado de la casilla de verificación de ralentización
function reactionSlow() {
  slow = cbSlow.checked; // Actualizar el estado de ralentización
}

// Función de reacción al cambiar el estado de la casilla de verificación de amortiguados
function reactionUnlock() {
  if (cbAmort.checked) {
    ipAm.disabled = false; // Si cbAmort está marcado, habilitar el campo de entrada de amortiguación
  } else {
    ipAm.disabled = true; // Si cbAmort no está marcado, deshabilitar el campo de entrada de amortiguación
  }
}

// Función de reacción a eventos de entrada de usuario
function reaction() {
  input(); // Obtener las entradas de usuario
  calculation(); // Realizar los cálculos necesarios
  paint(); // Repintar el lienzo
}

// Función de reacción a la tecla presionada en las entradas de usuario
function reactionEnter(e) {
  var enter = (e.key == "Enter" || e.code == "Enter"); // Verificar si la tecla presionada es "Enter"
  if (!enter) return; // Salir de la función si no es "Enter"
  reaction(); // Realizar la reacción necesaria
}

// Función para establecer el foco en una entrada de usuario y seleccionar su contenido
function focus(ip) {
  ip.focus(); // Establecer el foco en la entrada especificada
  var n = ip.value.length; // Obtener la longitud del contenido de la entrada
  ip.setSelectionRange(n, n); // Seleccionar todo el contenido de la entrada
}

// Función de reacción al cambiar la selección del botón de radio
function reactionRadioButton() {
  if (rbY.checked) nrSize = 0; // Si se selecciona el botón para elongación, establecer el número de tamaño en 0
  else if (rbV.checked) nrSize = 1; // Si se selecciona el botón para velocidad, establecer el número de tamaño en 1
  else if (rbA.checked) nrSize = 2; // Si se selecciona el botón para aceleración, establecer el número de tamaño en 2
  else if (rbF.checked) nrSize = 3; // Si se selecciona el botón para fuerza, establecer el número de tamaño en 3
  else nrSize = 4; // De lo contrario, establecer el número de tamaño en 4
}

// Función para realizar los cálculos necesarios
function calculation() {
  //omega = Math.sqrt(g / l); // Calcular la frecuencia angular
  tPer = 2 * Math.PI / omega; // Calcular el período
  lPix = 25 * l; // Convertir la longitud a píxeles
  omega = Math.sqrt(((masaBarra * g * (l / 2)) + (m * g * posicionMasa)) / ((1 / 3) * (masaBarra) * (l ** 2)) + ((1 / 2) * (m) * (r ** 2)) + ((m) * (posicionMasa ** 2)));
}

// Función para convertir un número en una cadena con el formato deseado
function ToString(n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d)); // Convertir el número según el formato especificado
  return s.replace(".", decimalSeparator); // Reemplazar el separador decimal según la configuración
}

// Función para procesar las entradas de números de usuario
function inputNumber(ef, d, fix, min, max) {
  var s = ef.value; // Obtener el valor de la entrada
  s = s.replace(",", "."); // Reemplazar las comas por puntos para el formato numérico
  var n = Number(s); // Convertir la cadena en número
  if (isNaN(n)) n = 0; // Si no es un número válido, establecerlo en cero
  if (n < min) n = min; // Limitar el número mínimo
  if (n > max) n = max; // Limitar el número máximo
  ef.value = ToString(n, d, fix); // Establecer el valor de la entrada según el número procesado
  return n; // Devolver el número procesado
}

// Función para procesar las entradas de usuario
function input() {
  var ae = document.activeElement; // Obtener el elemento activo
  l = inputNumber(ipL, 2, true, 0.01, 20); // Obtener y procesar la entrada de longitud
  g = inputNumber(ipG, 2, true, 1, 50); // Obtener y procesar la entrada de gravedad
  m = inputNumber(ipM, 2, true, 0.01, 10); // Obtener y procesar la entrada de masa
  r = inputNumber(radMas, 2, true, 0, 90); // Obtener y procesar la entrada del radio de la masa
  alpha0 = inputNumber(ipA, 2, true, 1, 90) * deg; // Obtener y procesar la entrada de amplitud en radianes
  amortiguacion = inputNumber(ipAm, 2, true, 0, 10); // Obtener y procesar la entrada de amortiguación
  masaBarra = inputNumber(ipMasb, 2, true, 0.01, 10); // Obtener y procesar la entrada de masa de la barra
  posicionMasa = inputNumber(posMas, 2, true, 0, l); // Obtener y procesar la entrada de masa de la barra
}

// Función para actualizar las entradas con los valores actuales
function updateInput() {
  ipL.value = ToString(l, 2, true); // Establecer el valor de la entrada de longitud
  ipG.value = ToString(g, 2, true); // Establecer el valor de la entrada de gravedad
  ipM.value = ToString(m, 2, true); // Establecer el valor de la entrada de masa
  radMas.value = ToString(r, 2, true); // Establecer el valor del radio de la masa
  ipA.value = ToString(alpha0 / deg, 2, true); // Establecer el valor de la entrada de amplitud en grados
  ipAm.value = ToString(amortiguacion, 2, true); // Establecer el valor de la entrada de amortiguacion
  ipMasb.value = ToString(masaBarra, 2, true); // Establecer el valor de la entrada de masa de la barra
  posMas.value = ToString(posicionMasa, 2, true); // Establecer el valor de la entrada de la posicion de la masa
}

function newPath() {
  // Comienza un nuevo camino en el lienzo
  ctx.beginPath();
  // Establece el color de trazo predeterminado en negro
  ctx.strokeStyle = "#000000";
  // Establece el ancho de línea predeterminado en 1 píxel
  ctx.lineWidth = 1;
}

function rectangle(x, y, w, h, c) {
  // Si se proporciona un color, establece el color de relleno en ese color
  if (c) ctx.fillStyle = c;
  // Calcula la coordenada x para centrar el rectángulo horizontalmente
  var rectX = x + (w - 500) / 2;
  // Llama a la función newPath para comenzar un nuevo camino
  newPath();
  // Dibuja un rectángulo relleno en el lienzo con la coordenada x calculada, ancho 500 y altura h
  ctx.fillRect(rectX, y, 500, h);
  // Dibuja el contorno del rectángulo en el lienzo
  ctx.strokeRect(rectX, y, 500, h);
}

function circle(x, y, r, c) {
  // Si se proporciona un color, establece el color de relleno en ese color
  if (c) ctx.fillStyle = c;
  // Coordenada x del centro del círculo
  var circleX = x;
  // Coordenada y del centro del círculo (ajustada para centrar verticalmente)
  var circleY = y - r + 2;
  // Llama a la función newPath para comenzar un nuevo camino
  newPath();
  // Dibuja un arco de círculo (círculo completo) en el lienzo con el centro (circleX, circleY), radio r, ángulo inicial 0 y ángulo final 2 * Math.PI (360 grados), en sentido contrario a las agujas del reloj
  ctx.arc(circleX, circleY, r, 0, 2 * Math.PI, true);
  // Rellena el círculo con el color especificado
  ctx.fill();
  // Dibuja el contorno del círculo
  ctx.stroke();
}

function pendulum() {
  // Calcula el ángulo de oscilación del péndulo
  alpha = alpha0 * cosPhi;
  // Calcula el seno y el coseno del ángulo de oscilación
  sinAlpha = Math.sin(alpha);
  cosAlpha = Math.cos(alpha);
  // Calcula las coordenadas del extremo del péndulo
  var px = ax + lPix * sinAlpha;
  var py = ay + lPix * cosAlpha;
  // Llama a la función newPath para comenzar un nuevo camino
  newPath();
  // Establece el punto de inicio del camino en el punto de suspensión del péndulo
  ctx.moveTo(ax, ay);
  // Dibuja una línea desde el punto de suspensión hasta el extremo del péndulo
  ctx.lineTo(px, py);
  // Cierra el camino
  ctx.closePath();
  // Dibuja el trazo del camino en el lienzo
  ctx.stroke();
  // Calcula el tamaño del cuerpo del péndulo
  var tamano = r * 5;
  // Dibuja un círculo para representar el cuerpo del péndulo en el extremo
  circle(px, py, tamano, colorBody);
}

function clock(x, y) {
  // Establece el color de relleno en rojo
  ctx.fillStyle = "#ff0000";
  // Establece la fuente de texto
  ctx.font = "normal normal bold 16px monospace";
  // Establece la alineación del texto en el centro
  ctx.textAlign = "center";
  // Calcula el número de segundos
  var n = Math.floor(t / 1000);
  // Formatea el tiempo en segundos
  var s = (t - n * 1000).toFixed(3) + " " + "s";
  // Reemplaza el separador decimal por el especificado
  s = s.replace(".", decimalSeparator);
  // Asegura que el tiempo tenga una longitud mínima de 9 caracteres agregando espacios en blanco si es necesario
  while (s.length < 9) s = " " + s;
  // Dibuja el texto en el lienzo en las coordenadas especificadas
  ctx.fillText(s, x, y + 400);
}

function arrow(x1, y1, x2, y2, w) {
  // Si no se proporciona un ancho de línea, establece el ancho de línea en 1 píxel
  if (!w) w = 1;
  // Calcula las diferencias en coordenadas x e y
  var dx = x2 - x1, dy = y2 - y1;
  // Calcula la longitud de la flecha
  var length = Math.sqrt(dx * dx + dy * dy);
  // Si la longitud es 0, no dibuja la flecha
  if (length == 0) return;
  // Normaliza las diferencias en coordenadas x e y
  dx /= length; dy /= length;
  // Calcula las coordenadas del punto de inicio de la punta de la flecha
  var s = 2.5 * w + 7.5;
  var xSp = x2 - s * dx, ySp = y2 - s * dy;
  // Calcula las coordenadas de los extremos de la punta de la flecha
  var h = 0.5 * w + 3.5;
  var xSp1 = xSp - h * dy, ySp1 = ySp + h * dx;
  var xSp2 = xSp + h * dy, ySp2 = ySp - h * dx;
  // Calcula las coordenadas del punto final de la flecha
  xSp = x2 - 0.6 * s * dx; ySp = y2 - 0.6 * s * dy;
  // Comienza un nuevo camino en el lienzo
  ctx.beginPath();
  // Establece el ancho de línea en el valor especificado
  ctx.lineWidth = w;
  // Establece el punto de inicio del camino en las coordenadas especificadas
  ctx.moveTo(x1, y1);
  // Si la longitud es menor que 5, dibuja una línea recta hasta el punto final de la flecha
  if (length < 5) ctx.lineTo(x2, y2);
  // De lo contrario, dibuja una línea hasta el punto de inicio de la punta de la flecha
  else ctx.lineTo(xSp, ySp);
  // Dibuja el trazo
  ctx.stroke();
  // Si la longitud es menor que 5, termina aquí
  if (length < 5) return;
  // Comienza un nuevo camino para dibujar la punta de la flecha
  ctx.beginPath();
  // Establece el color de relleno en el mismo color que el color de trazo
  ctx.fillStyle = ctx.strokeStyle;
  // Establece el punto de inicio del camino en el punto de inicio de la punta de la flecha
  ctx.moveTo(xSp, ySp);
  // Dibuja la forma de la punta de la flecha
  ctx.lineTo(xSp1, ySp1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(xSp2, ySp2);
  ctx.closePath();
  // Rellena la punta de la flecha con el color de trazo
  ctx.fill();
}

function arrowPendulum(r, phi) {
  // Calcula las coordenadas del extremo de la flecha utilizando la longitud y el ángulo especificados
  var x = px + r * Math.cos(phi);
  var y = py - r * Math.sin(phi);
  // Dibuja una flecha desde el punto de suspensión del péndulo hasta el extremo calculado
  arrow(px, py, x, y, 3);
}

function alignText(s, t, x, y) {
  // Establece la fuente de texto
  ctx.font = FONT1;
  // Establece la alineación del texto según el valor de t
  if (t == 0) ctx.textAlign = "left";
  else if (t == 1) ctx.textAlign = "center";
  else ctx.textAlign = "right";
  // Dibuja el texto en las coordenadas especificadas
  ctx.fillText(s, x, y);
}

function horizontalAxis(x, y) {
  // Nueva longitud del eje horizontal
  var axisLength = 400;
  // Establece el color de trazo en negro
  ctx.strokeStyle = "#000000";
  // Dibuja una flecha horizontal desde la posición especificada
  arrow(x - 20, y, x + axisLength, y);
  // Dibuja el texto "t" y "(s)" en el extremo del eje horizontal
  alignText("t", 1, x + axisLength, y + 30);
  alignText("(s)", 1, x + axisLength, y + 47);
  // Calcula el valor redondeado de tU y ajusta la posición de las marcas de graduación
  var t0 = Math.ceil(tU);
  var x0 = Math.round(x + tPix * (t0 - tU));
  for (i = 0; i <= 10; i++) {
    var xs = x0 + (i / 10) * (axisLength - 10);
    ctx.moveTo(xs, y - 3);
    ctx.lineTo(xs, y + 3);
    if (xs >= x + 5 && xs <= x + axisLength - 15 && (t0 + i) <= 100 || (t0 + i) % 2 == 0)
      alignText("" + (t0 + i), 1, xs, y + 13);
  }
  // Dibuja las marcas de graduación en el eje horizontal
  ctx.stroke();
}

function verticalAxis(x, y, yLow, yHigh, maxSI) {
  // Longitud del eje vertical
  var axisLengthV = 150;
  // Calcula el exponente de la notación científica del máximo valor de la escala
  var pot10 = Math.pow(10, Math.floor(Math.log(maxSI) / Math.LN10));
  var q = maxSI / pot10;
  var n;
  // Determina el número de marcas de graduación en el eje vertical
  if (q > 5) n = 10; else if (q > 2) n = 5; else n = 2;
  // Establece el color de trazo en negro
  ctx.strokeStyle = "#000000";
  // Dibuja una flecha vertical desde la posición especificada
  arrow(x, yLow - axisLengthV / 2, x, yHigh);
  var n0 = (nrSize < 4 ? -n : 0);
  ctx.beginPath();
  for (i = n0; i <= n; i++) {
    var ys = y - i * axisLengthV / n;
    ctx.moveTo(x - 3, ys);
    ctx.lineTo(x + 3, ys);
    // Calcula el valor de la marca de graduación y lo muestra al lado del eje
    var s = Number(i * pot10).toPrecision(1);
    if (Math.abs(i * pot10) >= 10)
      s = "" + Math.round(i * pot10);
    s = s.replace(".", decimalSeparator);
    if ((n < 10 || i % 2 == 0) && i != 0)
      alignText(s, 2, x - 20, ys + 4);
  }
  // Dibuja las marcas de graduación en el eje vertical
  ctx.stroke();
  // Calcula el factor de conversión de unidades de píxeles a unidades de escala en el eje vertical
  yPix = axisLengthV / n / pot10;
}

function sinus(x, y, per, ampl, xMin, xMax) {
  // Calcula la frecuencia angular de la onda sinusoidal
  var omega = 2 * Math.PI / per;
  // Comienza un nuevo camino en el lienzo
  newPath();
  var xx = xMin;
  // Mueve el punto inicial del camino a la posición inicial de la onda sinusoidal
  ctx.moveTo(xx, y - ampl * Math.sin(omega * (xx - x)));
  // Dibuja la onda sinusoidal
  while (xx < xMax) {
    xx++;
    ctx.lineTo(xx, y - ampl * Math.sin(omega * (xx - x)));
  }
  // Dibuja la onda sinusoidal en el lienzo
  ctx.stroke();
}

function diagram(type, x, y, yMax) {
  // Dibuja el eje horizontal
  horizontalAxis(x, y);
  // Dibuja el eje vertical
  verticalAxis(x, y, y + 120, y - 135, yMax);
  // Dibuja una onda sinusoidal en el gráfico
  sinus(x - type * tPer * 5 - tU * tPix, y, tPer * tPix, yMax * yPix, x, x + 200);
}

function drawMomVal(val, x, y, c) {
  // Ajusta las coordenadas x e y según el tiempo actual y el valor especificado
  x += (t - tU) * tPix; 
  y -= val * yPix;
  // Dibuja un círculo en las coordenadas calculadas para representar el valor
  circle(x, y, 2, c);
}

function writeValue(s, v, u, n, x1, x2, y) {
  // Escribe el nombre del valor seguido de su valor y unidad en dos posiciones específicas
  alignText(s + ":", 0, x1, y);
  s = v.toPrecision(n);
  s = s.replace(".", decimalSeparator);
  alignText(s + " " + u, 0, x2, y);
}

function centerTextIndex(s1, s2, x, y) {
  // Centra dos textos en la misma línea horizontalmente
  var w1 = ctx.measureText(s1).width;
  var w2 = ctx.measureText(s2).width;
  var x0 = x - (w1 + w2) / 2;
  alignText(s1, 0, x0, y);
  alignText(s2, 0, x0 + w1 + 1, y + 5);
}

function drawElongation() {
  // Calcula la elongación máxima y actual del péndulo
  var sMax = l * alpha0;
  var s = sMax * cosPhi;
  // Dibuja el gráfico de la elongación
  diagram(1, xD, yD1, sMax);
  alignText("s", 1, xD - 50, yD1 - 130);
  alignText("(m)", 1, xD - 50, yD1 - 118);
  // Dibuja el arco que representa la elongación actual
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = colorElongation;
  var pos = (alpha >= 0);
  var w0 = (pos ? Math.PI / 2 : Math.PI / 2 - alpha);
  var w1 = (pos ? Math.PI / 2 - alpha : Math.PI / 2);
  ctx.arc(ax, ay, lPix, w0, w1, true);
  ctx.stroke();
  // Dibuja la elongación actual como un punto
  drawMomVal(s, xD, yD1, colorElongation);
  ctx.fillStyle = colorElongation;
  // Escribe el valor de la elongación actual y máxima
  writeValue("Elongación", s, "m", 3, xD, xD + 200, height - 50);
  writeValue("(" + "Máximo", sMax, "m" + ")", 3, xD, xD + 200, height - 30);
}

function drawVelocity() {
  // Calcula la velocidad máxima y actual del péndulo
  var vMax = l * alpha0 * omega;
  var v = -vMax * sinPhi;
  // Dibuja el gráfico de la velocidad
  diagram(2, xD, yD1, vMax);
  alignText("v", 1, xD - 50, yD1 - 130);
  alignText("(m/s)", 1, xD - 50, yD1 - 118);
  // Dibuja la flecha que representa la velocidad actual
  ctx.strokeStyle = colorVelocity;
  arrowPendulum(v * yPix, alpha0 * cosPhi);
  // Dibuja la velocidad actual como un punto
  drawMomVal(v, xD, yD1);
  ctx.fillStyle = colorVelocity;
  // Escribe el valor de la velocidad actual y máxima
  writeValue("Velocidad", v, "m/s", 3, xD, xD + 200, height - 50);
  writeValue("(" + "Máximo", vMax, "m/s" + ")", 3, xD, xD + 200, height - 30);
}

function drawAcceleration() {
  // Calcula la aceleración máxima y actual del péndulo
  var aMax = l * alpha0 * omega * omega;
  var a = -aMax * cosPhi;
  // Dibuja el gráfico de la aceleración
  diagram(3, xD, yD1, aMax);
  centerTextIndex("a", "tang", xD - 50, yD1 - 130);
  alignText("(m/s²)", 1, xD - 50, yD1 - 113);
  // Dibuja la flecha que representa la aceleración actual
  ctx.strokeStyle = colorAcceleration;
  arrowPendulum(a * yPix, alpha0 * cosPhi);
  // Dibuja la aceleración actual como un punto
  drawMomVal(a, xD, yD1);
  ctx.fillStyle = colorAcceleration;
  // Escribe el valor de la aceleración actual y máxima
  var mps2 = "m/s²";
  writeValue("Aceleración (Componente Tangencial)", a, mps2, 3, xD - 30, xD + 220, height - 50);
  writeValue("(" + "Máximo", aMax, mps2 + ")", 3, xD - 30, xD + 220, height - 30);
}

function drawForce() {
  // Calcula la fuerza máxima y actual del péndulo
  var fMax = m * l * alpha0 * omega * omega;
  var f = -fMax * cosPhi;
  // Dibuja el gráfico de la fuerza
  diagram(3, xD, yD1, fMax);
  centerTextIndex("F", "tang", xD - 50, yD1 - 130);
  alignText("(N)", 1, xD - 50, yD1 - 113);
  // Dibuja la flecha que representa la fuerza actual
  ctx.strokeStyle = colorForce;
  arrowPendulum(f * yPix, alpha0 * cosPhi);
  // Dibuja la fuerza actual como un punto
  drawMomVal(f, xD, yD1);
  ctx.fillStyle = colorForce;
  // Escribe el valor de la fuerza actual y máxima
  writeValue("Fuerza (Componente Tangencial)", f, "N", 3, xD - 30, xD + 220, height - 50);
  writeValue("(" + "Máximo", fMax, "N" + ")", 3, xD - 30, xD + 220, height - 30);
}

function diagramEnergy(x, y, e) {
  // Dibuja un gráfico de energía en las coordenadas especificadas
  horizontalAxis(x, y);
  verticalAxis(x, y, y + 20, y - 125, e);
  var x1 = x + 200;
  var y1 = y - e * yPix;
  // Dibuja una línea horizontal que representa la energía
  ctx.beginPath();
  ctx.moveTo(x, y1); 
  ctx.lineTo(x1, y1);
  ctx.stroke();
  // Dibuja dos ondas sinusoidales que representan la energía
  var xx = x - tU * tPix;
  var per = tPer * 10;
  var ampl = e * yPix / 2;
  sinus(xx - tPer * 2.5, y - ampl, per, ampl, x, x + 200);
  sinus(xx - tPer * 7.5, y - ampl, per, ampl, x, x + 200);
}

function drawEnergy() {
  // Calcula la energía total del sistema, la energía potencial y la energía cinética
  var e = l * alpha0 * omega; // Energía total
  e = m * e * e / 2; // Conversión de energía angular a energía lineal
  var part = cosPhi * cosPhi; // Parte proporcional de la energía potencial
  var eP = e * part, eK = e - eP; // Energía potencial y energía cinética respectivamente

  // Dibuja el diagrama de energía
  diagramEnergy(xD, yD2, e);
  // Escribe las etiquetas y unidades para la energía potencial y cinética
  centerTextIndex("E", "P-K", xD - 50, yD2 - 125);
  alignText("(J)", 1, xD - 50, yD2 - 108);

  // Escribe los valores de la energía potencial y cinética
  ctx.fillStyle = colorElongation;
  writeValue("Energía Potencial", eP, "J", 3, xD, xD + 200, height - 70);
  ctx.fillStyle = colorVelocity;
  writeValue("Energía Cinética", eK, "J", 3, xD, xD + 200, height - 50);
  ctx.fillStyle = "#000000";
  writeValue("Energía Total", e, "J", 3, xD, xD + 200, height - 30);

  // Dibuja las barras de energía potencial y cinética
  var dy = part * 100;
  rectangle(300, 205, 50, dy, colorElongation);
  if (part > 0.001 || on)
    alignText("Energía Potencial", 0, 360, 220);
  rectangle(300, 205 + dy, 50, 100 - dy, colorVelocity);
  if (part < 0.999 || on)
    alignText("Energía Cinética", 0, 360, 300);
  // Dibuja los puntos que representan la energía potencial y cinética
  drawMomVal(eP, xD, yD2, colorElongation);
  drawMomVal(eK, xD, yD2, colorVelocity);
}

function drawTransportador(x, y, radius) {
  // Configuraciones de color y grosor del trazo
  ctx.strokeStyle = "#000"; 
  ctx.lineWidth = 2; 

  // Dibuja el círculo exterior del transportador
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 1 * Math.PI);
  ctx.stroke();

  // Dibuja las marcas de medida y sus etiquetas
  ctx.font = '10px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';

  for (let i = -90; i <= 90; i += 10) {
    let anguloRadianes = ((90 - i) * Math.PI) / 180;
    let startX = x + radius * Math.cos(anguloRadianes);
    let startY = y + radius * Math.sin(anguloRadianes);
    let endX = x + (radius + 10) * Math.cos(anguloRadianes);
    let endY = y + (radius + 10) * Math.sin(anguloRadianes);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.fillText(i.toString() + '°', endX, endY + 10);
  }
}

function paint() {
  // Limpia el lienzo y dibuja el fondo
  ctx.fillStyle = colorBackground;
  ctx.fillRect(0, 0, width, height);
  // Dibuja una línea horizontal en el extremo del péndulo
  rectangle(ax - 50, ay - 5, 100, 5, "#000000");
  if (on) {
    // Actualiza el tiempo si la animación está activa
    var t1 = new Date();
    var dt = (t1 - t0) / 1000;
    if (slow) dt /= 10;
    t += dt;
    t0 = t1;
  }
  // Calcula el ángulo, seno y coseno en el tiempo actual
  tU = (t < 5 ? 0 : t - 5);
  phi = omega * t;
  sinPhi = Math.sin(phi); cosPhi = Math.cos(phi);
  // Dibuja el péndulo, el reloj y el gráfico correspondiente según el modo seleccionado
  pendulum();
  clock(ax, 340);
  switch (nrSize) {
    case 0: drawElongation(); break;
    case 1: drawVelocity(); break;
    case 2: drawAcceleration(); break;
    case 3: drawForce(); break;
    case 4: drawEnergy(); break;
  }
  // Escribe el período de oscilación del péndulo
  var s = "Período de Oscilación:  " + tPer.toPrecision(3) + " " + "s";
  s = s.replace(".", decimalSeparator);
  ctx.fillStyle = "#000000";
  alignText(s, 1, ax, height - 30);
  // Calcula omega y lo formatea según sea necesario
  var omegaFormatted = omega.toPrecision(3).replace(".", decimalSeparator);
  // Escribe el valor de omega
  var sOmega = "Valor de Omega: " + omegaFormatted;
  sOmega = sOmega.replace(".", decimalSeparator);
  alignText(sOmega, 1, ax, height - 10); // Coloca el texto debajo del período
  // Dibuja el transportador
  drawTransportador(ax, ay, 150);
}

document.addEventListener("DOMContentLoaded", start, false);