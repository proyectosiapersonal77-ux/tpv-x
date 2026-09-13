import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generateKitchenManualPDF() {
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
  const kitchenAccent = [234, 88, 12]; // orange-600
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightBg = [248, 250, 252]; // slate-50
  const cardBorder = [226, 232, 240]; // slate-200
  const alertBg = [254, 242, 242]; // red-50
  const alertBorder = [252, 165, 165]; // red-300
  const alertText = [153, 27, 27]; // red-800
  const greenBadge = [16, 185, 129]; // emerald-500
  const yellowBadge = [234, 179, 8]; // amber-500

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
    doc.text('GastroPOS Suite | Manual de Administrador: Módulo Cocina (KDS)', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  // Cover Page
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 85, 'F');

  doc.setFillColor(...kitchenAccent);
  doc.rect(0, 85, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(251, 146, 60); // orange-400
  doc.text('MANUAL DE ADMINISTRACIÓN & ARQUITECTURA TÉCNICA', margin, 32);

  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('Módulo: Cocina (KDS)', margin, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(226, 232, 240);
  doc.text('Kitchen Display System, Tiempos, Enrutamiento & Alertas SLA', margin, 58);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('GastroPOS Suite v2.1 | Arquitectura WebSocket & Offline-First', margin, 72);

  cursorY = 108;

  // Metadata Card
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(margin, cursorY, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('Ficha Técnica del Documento', margin + 6, cursorY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text('• Módulo Auditado: KitchenDisplay.tsx, orderService.ts, Supabase Realtime Channel', margin + 6, cursorY + 16);
  doc.text('• Destinatarios: Administradores de Sistema, Gerentes de F&B, Jefes de Cocina y Pase', margin + 6, cursorY + 22);
  doc.text('• Versión: 2.1 Oficial (Soporta pantallas táctiles horizontales 15" - 24", tablets e impresoras)', margin + 6, cursorY + 28);
  doc.text('• Cobertura: Enrutamiento Cocina/Barra, Semáforo SLA, Alérgenos y Permisos RBAC', margin + 6, cursorY + 34);

  cursorY += 54;

  function addSection(title) {
    checkPageBreak(20);
    cursorY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...kitchenAccent);
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
    checkPageBreak(boxHeight + 4);

    doc.setFillColor(...alertBg);
    doc.setDrawColor(...alertBorder);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...alertText);
    doc.text(`[!] ALERTA CRÍTICA: ${title}`, margin + 6, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(lines, margin + 6, cursorY + 13);

    cursorY += boxHeight + 5;
  }

  // --- SECTION 1 ---
  addSection('1. Arquitectura y Filosofía del Sistema KDS');
  addPara('El módulo de Cocina (Kitchen Display System - KDS) reemplaza los tickets térmicos tradicionales por una pantalla digital interactiva, reactiva y sincronizada en tiempo real.');
  addBullet('Suscripción WebSockets Reactiva', 'El KDS se conecta al canal Supabase kitchen-orders escuchando eventos INSERT y UPDATE en orders y order_items en menos de 200 ms.');
  addBullet('Motor Local-First Resiliente', 'La función getKitchenOrders() combina órdenes de IndexedDB (Dexie) y Postgres, garantizando que el servicio continúe sin interrupciones ante caídas del Wi-Fi.');
  addBullet('Resolución Dinámica de Mesas', 'Cada orden se mapea al instante con el nombre real de su mesa física (ej. "Mesa 4", "Terraza 2"), eliminando errores de pase.');

  // --- SECTION 2 ---
  addSection('2. Topología de Estaciones y Enrutamiento Inteligente');
  addPara('El sistema analiza dinámicamente la categoría de cada producto en la base de datos de inventario para decidir qué artículos deben mostrarse en cada pantalla física:');
  addBullet('Estación TODO (General)', 'Muestra la comanda completa para el jefe de cocina o encargado de pase de platos.');
  addBullet('Estación COCINA (Naranja)', 'Filtra automáticamente la carta excluyendo las bebidas. Solo muestra entrantes, carnes, pescados y postres.');
  addBullet('Estación BARRA (Azul)', 'Filtra exclusivamente productos pertenecientes a la familia "Bebidas" (cafés, cervezas, copas, refrescos).');

  // --- SECTION 3 ---
  addSection('3. Algoritmo FIFO y Medición de Tiempos de Espera');
  addPara('La pantalla ordena las tarjetas de izquierda a derecha siguiendo una estricta cola FIFO (First-In, First-Out):');
  addBullet('Cálculo por Plato Más Antiguo (oldestItemTime)', 'Para evitar penalizar mesas con comandas escalonadas, el tiempo se mide a partir del created_at del artículo activo más antiguo.');
  addBullet('Reorganización Dinámica', 'Las mesas con más tiempo de espera se desplazan automáticamente hacia el margen izquierdo prioritario.');

  // --- SECTION 4 ---
  addSection('4. Semáforo SLA y Alertas Cromáticas en Tiempo Real');
  addPara('El encabezado de cada comanda cambia de color según el tiempo transcurrido desde la marcha del pedido:');
  addBullet('Verde Esmeralda (0 - 14 min)', 'Dentro del tiempo estándar del servicio. Ritmo de elaboración correcto.');
  addBullet('Amarillo Ámbar (15 - 30 min)', 'Alerta de retraso moderado. El jefe de partida debe priorizar este ticket.');
  addBullet('Rojo Pulsante (> 30 min)', 'Alerta crítica con parpadeo continuo (animate-pulse). Requiere intervención inmediata del responsable de cocina.');

  // --- SECTION 5 ---
  addSection('5. Ciclo de Vida del Plato y Operativa Táctil');
  addPara('Los cocineros interactúan directamente con la pantalla táctil para comunicar el progreso a la sala:');
  addBullet('Toque 1: Marcar como Listo (ready)', 'El plato pasa a fondo verde esmeralda con icono de verificación (CheckCircle). Notifica a los camareros que está emplatado.');
  addBullet('Toque 2: Marcar como Servido (served)', 'El plato se retira de la comanda activa.');
  addBullet('Auto-Cierre del Ticket', 'Cuando todos los platos de una mesa se han marcado como servidos, la comanda desaparece automáticamente del KDS.');

  // --- SECTION 6 ---
  addSection('6. Seguridad Alimentaria: Variantes y Alérgenos');
  addPara('La interfaz destaca elementos críticos con alta visibilidad cromática:');
  addBullet('Formatos y Variantes', 'Mostrados en texto ámbar brillante (ej. "Format: Media Ración", "Format: Tapa").');
  addBullet('Notas de Alérgenos e Intolerancias', 'Recuadro rojo de alto contraste con icono AlertTriangle para instrucciones críticas ("CELÍACO", "Sin cebolla", "Poco hecho").');

  addAlertBox('Protocolo de Alérgenos', 'Las notas de alérgenos enviadas desde el TPV deben verificarse visualmente en la pantalla KDS antes de emplatar cualquier plato para evitar contaminaciones cruzadas.');

  // --- SECTION 7 ---
  addSection('7. Control de Acceso por Roles (RBAC)');
  addBullet('Camareros (waiter)', 'Acceso en modo Solo Lectura. Pueden consultar la pantalla pero no pueden marcar platos como listos o servidos por error.');
  addBullet('Cocineros y Chefs (cook/chef)', 'Control táctil total para cambiar estados y despachar platos.');
  addBullet('Encargados y Administradores', 'Control total, cambio de estaciones y forzado de sincronización.');

  // --- SECTION 8 ---
  addSection('8. Preguntas Frecuentes de la Administración (FAQ)');
  addBullet('¿Qué pasa si se pulsa un plato por error?', 'Se marca como servido; el encargado puede auditar o reabrir la comanda desde el TPV central.');
  addBullet('¿Se puede forzar la sincronización si hay microcortes?', 'Sí, pulsando el botón circular de refresco (RefreshCw) en la barra superior.');

  // Footer page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} — GastroPOS Suite | Manual de Administrador: Módulo Cocina (KDS)`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, 'manual_modulo_cocina.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`Kitchen manual PDF generated at: ${pdfPath}`);
}

generateKitchenManualPDF().catch(err => {
  console.error("Error generating kitchen PDF:", err);
  process.exit(1);
});
