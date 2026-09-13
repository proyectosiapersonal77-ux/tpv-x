import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generateInventoryManualPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);

  let cursorY = margin;

  // Palette
  const primaryColor = [15, 23, 42]; // slate-900
  const emeraldAccent = [16, 185, 129]; // emerald-500
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightBg = [248, 250, 252]; // slate-50
  const cardBorder = [226, 232, 240]; // slate-200
  const alertBg = [254, 242, 242]; // red-50
  const alertBorder = [252, 165, 165]; // red-300
  const alertText = [153, 27, 27]; // red-800
  const infoBg = [236, 253, 245]; // emerald-50
  const infoBorder = [167, 243, 208]; // emerald-200
  const infoText = [6, 78, 59]; // emerald-900

  function checkPageBreak(neededHeight) {
    if (cursorY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      cursorY = margin + 10;
      drawHeader();
    }
  }

  function drawHeader() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('GastroPOS Suite | Manual de Administrador: Inventario y Carta', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  // Cover Page Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 85, 'F');

  doc.setFillColor(...emeraldAccent);
  doc.rect(0, 85, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(110, 231, 183); // emerald-300
  doc.text('MANUAL DE ADMINISTRACIÓN & ARQUITECTURA TÉCNICA', margin, 30);

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('Módulo: Inventario y Carta', margin, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(226, 232, 240);
  doc.text('Catálogo Maestro, Escandallos (Yield Management), Albaranes y Stock', margin, 56);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('GastroPOS Suite v2.1 | Arquitectura Reactiva Offline-First con Dexie & Supabase', margin, 70);

  cursorY = 104;

  // Ficha Técnica
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(margin, cursorY, contentWidth, 44, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('Ficha Técnica del Documento', margin + 6, cursorY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text('• Módulo Auditado: InventoryManagement.tsx, inventoryService.ts, Dexie DB & Supabase', margin + 6, cursorY + 16);
  doc.text('• Destinatarios: Administradores de Sistemas, Gerentes de F&B, Jefes de Cocina y Encargados', margin + 6, cursorY + 22);
  doc.text('• Versión: 2.1 Oficial (Soporta escandallos con rendimiento %, PMP en albaranes y etiquetas)', margin + 6, cursorY + 28);
  doc.text('• Cobertura: Iconografía completa, Tabla Virtualizada, Albaranes, Mermas y Ley Antifraude', margin + 6, cursorY + 34);

  cursorY += 56;

  function addSection(title) {
    checkPageBreak(20);
    cursorY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...emeraldAccent);
    doc.text(title, margin, cursorY);
    cursorY += 3;
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.4);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;
  }

  function addSubSection(title) {
    checkPageBreak(14);
    cursorY += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryColor);
    doc.text(title, margin, cursorY);
    cursorY += 5;
  }

  function addPara(text) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...secondaryColor);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(lines.length * 4.8);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 4.8 + 2;
  }

  function addBullet(title, desc) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    const titleWidth = doc.getTextWidth(`• ${title}: `);

    checkPageBreak(10);
    doc.text(`• ${title}: `, margin + 2, cursorY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    const remainingWidth = contentWidth - titleWidth - 2;
    const lines = doc.splitTextToSize(desc, remainingWidth);

    if (lines.length > 0) {
      doc.text(lines[0], margin + 2 + titleWidth, cursorY);
      if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
          cursorY += 4.5;
          checkPageBreak(6);
          doc.text(lines[i], margin + 6, cursorY);
        }
      }
    }
    cursorY += 5.5;
  }

  function addAlertBox(title, text) {
    const lines = doc.splitTextToSize(text, contentWidth - 12);
    const boxHeight = 14 + (lines.length * 4.5);
    checkPageBreak(boxHeight + 5);

    doc.setFillColor(...alertBg);
    doc.setDrawColor(...alertBorder);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...alertText);
    doc.text(`ALERTA TÉCNICA: ${title}`, margin + 6, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(lines, margin + 6, cursorY + 13);

    cursorY += boxHeight + 6;
  }

  function addInfoBox(title, text) {
    const lines = doc.splitTextToSize(text, contentWidth - 12);
    const boxHeight = 14 + (lines.length * 4.5);
    checkPageBreak(boxHeight + 5);

    doc.setFillColor(...infoBg);
    doc.setDrawColor(...infoBorder);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...infoText);
    doc.text(`REGLA OPERATIVA: ${title}`, margin + 6, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(lines, margin + 6, cursorY + 13);

    cursorY += boxHeight + 6;
  }

  // --- SECCIÓN 1 ---
  addSection('1. Arquitectura General y Topología de Datos Híbrida');
  addPara('El módulo de Inventario y Carta es el corazón logístico y financiero de GastroPOS Suite. Centraliza la definición de platos y bebidas, el control de existencias físicas, la valoración de recetas mediante escandallos con rendimiento y la trazabilidad de albaranes y mermas.');

  addBullet('Persistencia Local Ultrarrápida (Dexie IndexedDB)', 'Catálogo, materias primas y relaciones se almacenan en 10 tablas locales de alta velocidad, garantizando tiempos de respuesta inferiores a 5 ms sin latencia de red.');
  addBullet('Sincronización en la Nube Asíncrona (Supabase)', 'Las modificaciones se encolan mediante queueChange() hacia tablas de PostgreSQL, garantizando consistencia y resiliencia ante caídas de conexión.');
  addBullet('Protección de Demostración (Tour Mode)', 'Las operaciones críticas de modificación de recetas, compras y borrado están custodiadas por applyTourRestriction() para preservar la integridad de la base.');

  // --- SECCIÓN 2 ---
  addSection('2. Desglose Exhaustivo de Pestañas e Iconografía');
  addPara('La cabecera de pestañas permite alternar entre las 9 dimensiones del catálogo. Cada icono representa un submódulo funcional especializado:');

  addBullet('Package — Productos y Platos (products)', 'Maestro de referencias de venta al público (PVP), bebidas, materias primas y recetas compuestas.');
  addBullet('Tag — Categorías (categories)', 'Familias gastronómicas principales (Entrantes, Carnes, Pescados, Bebidas, Postres), con asignación de estación KDS.');
  addBullet('GitFork — Subcategorías (subcategories)', 'Clasificación secundaria jerárquica vinculada a una categoría padre (ej. Refrescos dentro de Bebidas).');
  addBullet('Truck — Proveedores (suppliers)', 'Fichero de empresas mayoristas y distribuidores con contactos comerciales y teléfonos.');
  addBullet('Scroll — Pedidos de Compra (purchase_orders)', 'Gestor de órdenes de reposición emitidas a distribuidores, generadas manual o automáticamente por stock mínimo.');
  addBullet('Wheat — Alérgenos (allergens)', 'Catálogo de los 14 alérgenos alimentarios de declaración obligatoria según el Reglamento Europeo UE 1169/2011.');
  addBullet('Scale — Unidades de Medida (units)', 'Definición de magnitudes base (kg, g, l, ml, unidad, ración, caja) con abreviaturas unificadas.');
  addBullet('Ban — Tipos de Merma (waste_reasons)', 'Motivos estandarizados de pérdida de stock (Caducidad, Rotura, Plato defectuoso, Muestra comercial).');
  addBullet('Percent — Promociones (promotions)', 'Reglas de descuento programado por horario (Happy Hour), días de semana y categorías seleccionadas.');

  // --- SECCIÓN 3 ---
  addSection('3. Barra Superior de Acciones Globales');
  addPara('En el margen superior derecho se ubican los botones de procesamiento masivo y abastecimiento:');

  addBullet('Download — Exportar CSV', 'Genera y descarga un archivo delimitado por comas con 13 columnas completas para análisis en Excel o ERPs contables.');
  addBullet('Upload / Loader2 — Importar CSV Masivo', 'Carga por lotes con soporte multiformato (13 columnas actuales y 8 columnas heredadas) y barra de progreso animada.');
  addBullet('Search — Buscador Dinámico', 'Filtrado en tiempo real que inspecciona simultáneamente nombre de producto, categoría, proveedor y código de barras.');
  addBullet('FolderInput — Recibir Albarán', 'Panel de entrada rápida de mercancías con recálculo automático del Precio Medio Ponderado (PMP).');
  addBullet('Plus — Nuevo Registro', 'Botón de acción rápida en color acento que abre el modal correspondiente a la pestaña activa.');

  addInfoBox('Fórmula del Precio Medio Ponderado (PMP)', 'Al recibir mercancía mediante FolderInput, el sistema aplica la fórmula oficial contable: PMP = [(Stock_Actual * Coste_Actual) + (Cantidad_Entrante * Precio_Compra)] / [Stock_Actual + Cantidad_Entrante]. De esta forma, el escandallo refleja fielmente el coste de reposición real.');

  // --- SECCIÓN 4 ---
  addSection('4. Tabla Virtualizada de Productos y Edición Rápida');
  addPara('La visualización de productos emplea react-window para soportar catálogos extensos sin ralentizaciones.');

  addBullet('CheckSquare / Square — Selección por Lotes', 'Permite seleccionar uno o todos los productos para verificar auditorías o exportaciones selectivas.');
  addBullet('Edición In-Place en Celda', 'Permite alterar directamente Coste, PVP Venta y Stock Actual pulsando sobre la cifra. Se confirma con tecla Enter y se cancela con Escape.');
  addBullet('Semaforización de Stock', 'Verde (óptimo), Naranja con AlertTriangle (alerta de stock mínimo alcanzado) y Rojo (agotado en almacén).');
  addBullet('Interruptor Activo (TPV)', 'Casilla rápida para activar u ocultar un plato de la botonera del camarero sin eliminar su histórico.');

  // --- SECCIÓN 5 ---
  addSection('5. Menú Contextual de Fila (Acciones por Producto)');
  addPara('Al pulsar sobre el selector de opciones de cualquier producto, se despliega el menú flotante con 5 herramientas:');

  addBullet('Barcode — Imprimir Etiqueta', 'Genera código de barras Code128 / EAN y precio en formato térmico con estilos de impresión rápida para adhesivos de 50x30 mm.');
  addBullet('TrendingDown — Registrar Merma', 'Abre el formulario para asentar pérdidas especificando motivo tipificado y deduciendo stock de forma justificada.');
  addBullet('History — Historial de Movimientos', 'Auditoría cronológica con fecha, empleado, motivo (Venta, Albarán, Merma, Ajuste), variación y saldo final resultante.');
  addBullet('Edit2 — Editar Ficha Completa', 'Abre el formulario maestro con acceso a foto, escandallo, modificadores y variantes.');
  addBullet('Trash2 — Eliminar con Doble Validación', 'Aplica salvaguardas legales que impiden borrar productos con ventas históricas o presentes en recetas activas.');

  addAlertBox('Inmutabilidad Fiscal y Ley Antifraude', 'Si un plato ha sido cobrado en tickets históricos, GastroPOS Suite bloquea su borrado físico (foreignKeyViolation). El sistema ofrece la alternativa segura de "Desactivar / Archivar", preservando la trazabilidad exigida por la Agencia Tributaria.');

  // --- SECCIÓN 6 ---
  addSection('6. Formulario Maestro, Escandallos (Yield Management) y KDS');
  addPara('El modal de edición permite configurar todos los parámetros gastronómicos y de producción:');

  addBullet('Compresión Inteligente de Foto', 'El motor fileToOptimizedBase64 reescala y optimiza imágenes a 600px en memoria mediante Canvas, reduciendo peso sin perder definición.');
  addBullet('Escandallo con Rendimiento (Utensils)', 'En productos compuestos, permite asociar materias primas con su Factor de Rendimiento (%). Coste = (Coste_Unitario * Cantidad) / (Rendimiento_% / 100). El coste del plato se recalcula automáticamente.');
  addBullet('Descuento Automático en Venta TPV', 'Al cobrar un plato en sala, deductProductStock() descuenta proporcionalmente los gramos de cada ingrediente del almacén.');
  addBullet('Variantes y Formatos (Layers)', 'Soporte para múltiples presentaciones (ej. Caña, Pinta, Copa, Botella) con PVP, coste y stock independientes.');
  addBullet('Modificadores y Notas de Cocina', 'Opciones de comanda (Punto de carne, Salsas) con selección obligatoria/múltiple, suplemento de precio y descuento de stock vinculado.');
  addBullet('Enrutamiento KDS por Categoría', 'Asignación directa de familias de platos hacia pantalla de Cocina (kitchen), Barra (bar) o Sin Envío (none).');

  // --- SECCIÓN 7 ---
  addSection('7. Automatización de Compras y Promociones');
  addPara('El sistema cuenta con motores en segundo plano para optimizar la rentabilidad y el abastecimiento:');

  addBullet('Órdenes de Compra Automáticas', 'Al cruzar el umbral stock_min, checkAndGeneratePurchaseOrder() genera una orden borrador con el proveedor asignado.');
  addBullet('Motor de Promociones Temporales', 'Permite configurar Happy Hours por franjas horarias y días de la semana con descuentos automáticos en comanda.');

  // Final Footer
  checkPageBreak(15);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Fin del Documento Técnico — Módulo Inventario y Carta GastroPOS Suite v2.1', margin, cursorY + 8);

  const outputPath = path.join(process.cwd(), 'public', 'manual_inventario_y_carta.pdf');
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
  console.log(`Inventory manual PDF generated at: ${outputPath}`);
}

generateInventoryManualPDF().catch(console.error);
