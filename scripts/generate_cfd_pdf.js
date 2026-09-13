import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generateCFDManualPDF() {
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
  const cfdAccent = [14, 165, 233]; // sky-500 / cyan
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightBg = [248, 250, 252]; // slate-50
  const cardBorder = [226, 232, 240]; // slate-200
  const alertBg = [254, 242, 242]; // red-50
  const alertBorder = [252, 165, 165]; // red-300
  const alertText = [153, 27, 27]; // red-800
  const infoBg = [240, 249, 255]; // sky-50
  const infoBorder = [186, 230, 253]; // sky-200
  const infoText = [12, 74, 110]; // sky-900

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
    doc.text('GastroPOS Suite | Manual de Administrador: Visor de Cliente (CFD)', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  // Cover Page Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 85, 'F');

  doc.setFillColor(...cfdAccent);
  doc.rect(0, 85, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('MANUAL DE ADMINISTRACIÓN & ARQUITECTURA TÉCNICA', margin, 32);

  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('Módulo: Visor de Cliente (CFD)', margin, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(226, 232, 240);
  doc.text('Customer Facing Display, Sincronización Broadcast & Pagos QR', margin, 58);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('GastroPOS Suite v2.1 | Arquitectura WebSocket Broadcast & Doble Monitor', margin, 72);

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
  doc.text('• Módulo Auditado: CFDScreen.tsx, POSScreen.tsx (Broadcast Channel), Supabase Realtime', margin + 6, cursorY + 16);
  doc.text('• Destinatarios: Administradores de Sistemas, Gerentes de Operaciones y Personal de Mantenimiento TPV', margin + 6, cursorY + 22);
  doc.text('• Versión: 2.1 Oficial (Soporta pantallas secundarias HDMI, tablets Wi-Fi en peana y móviles)', margin + 6, cursorY + 28);
  doc.text('• Cobertura: Despliegue de Hardware, Handshake PING/PONG, Carrito en Vivo, Pagos QR Dinámicos', margin + 6, cursorY + 34);

  cursorY += 54;

  function addSection(title) {
    checkPageBreak(20);
    cursorY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...cfdAccent);
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
    doc.text(`[!] REQUISITO TÉCNICO: ${title}`, margin + 6, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(lines, margin + 6, cursorY + 13);

    cursorY += boxHeight + 5;
  }

  function addInfoBox(title, text) {
    const lines = doc.splitTextToSize(text, contentWidth - 12);
    const boxHeight = 14 + (lines.length * 4.5);
    checkPageBreak(boxHeight + 4);

    doc.setFillColor(...infoBg);
    doc.setDrawColor(...infoBorder);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...infoText);
    doc.text(`[i] INFORMACIÓN: ${title}`, margin + 6, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(lines, margin + 6, cursorY + 13);

    cursorY += boxHeight + 5;
  }

  // --- SECTION 1 ---
  addSection('1. Arquitectura y Sincronización Broadcast');
  addPara('El Visor de Cliente (Customer Facing Display - CFD) proporciona una pantalla secundaria transparente que muestra al cliente el detalle de su pedido y el total antes de abonarlo.');
  addBullet('Canal Broadcast en Memoria (cfd-sync-${tableId})', 'Cada pulsación en el TPV emite un evento SYNC_ORDER transmitiendo el pedido combinado (comanda existente + borrador en carrito) con latencia < 50 ms.');
  addBullet('Protocolo Handshake PING / PONG', 'El TPV comprueba periódicamente el estado del visor. Si la pantalla está abierta, el icono de monitor en el TPV se ilumina en color acento.');
  addBullet('Suscripción de Respaldo a Base de Datos', 'En caso de desconexión del canal broadcast, el CFD escucha mutaciones en orders y order_items mediante postgres_changes en Supabase.');

  // --- SECTION 2 ---
  addSection('2. Opciones de Despliegue Físico de Hardware');
  addPara('El módulo admite tres arquitecturas de montaje según la configuración del mostrador:');
  addBullet('Opción 1: Monitor Secundario HDMI / USB-C', 'Conectado al mismo terminal TPV en modo escritorio extendido. Se lanza directamente mediante ventana emergente (F11 pantalla completa).');
  addBullet('Opción 2: Tablet Inalámbrica en Peana', 'iPad o tablet Android conectada a la Wi-Fi del restaurante. Carga la URL ?view=cfd&tableId=<UUID> en modo pantalla completa / PWA.');
  addBullet('Opción 3: Kiosco o Selector General', 'Acceso desde el panel principal con selector táctil para que el empleado escoja qué barra o mesa reflejar.');

  // --- SECTION 3 ---
  addSection('3. Anatomía Visual y Experiencia de Cliente');
  addPara('La pantalla se compone de dos zonas complementarias de alta legibilidad:');
  addBullet('Panel Izquierdo (Desglose del Pedido)', 'Muestra el logotipo de marca blanca (brandLogo), nombre de la mesa, badge de cantidad (ej. 2x), nombre del plato, variantes y notas de alérgenos.');
  addBullet('Panel Derecho (Total y Pago QR Dinámico)', 'Importe total en tipografía gigante de 60px y código QR dinámico generado con qrcode.react (Nivel H) para pago móvil.');
  addBullet('Mensajes de Cortesía', 'Animación de espera cuando el pedido está vacío y pie con agradecimiento al cliente ("¡Gracias por tu visita!").');

  // --- SECTION 4 ---
  addSection('4. Guía de Configuración Paso a Paso para Administradores');
  addBullet('Paso 1: Configurar Mesa en el TPV', 'Abra la comanda de la barra o mesa en la pantalla POS.');
  addBullet('Paso 2: Pulsar Icono Monitor', 'Haga clic en el icono Monitor de la barra superior. Se abrirá la ventana emergente optimizada a 800x600 px.');
  addBullet('Paso 3: Posicionar en Pantalla de Cliente', 'Arrastre la ventana al monitor encarado al público y pulse F11 para activar pantalla completa.');
  addBullet('Paso 4: Verificación Visual', 'Observe cómo el icono de pantalla en el TPV cambia a color activo y compruebe que al marcar un producto aparece en el visor.');

  addInfoBox('Personalización de Marca Blanca', 'El logotipo visible en la cabecera del visor se configura en Configuración > Marca Blanca. El sistema almacena la imagen en el almacenamiento seguro y la proyecta automáticamente.');

  // --- SECTION 5 ---
  addSection('5. Seguridad y Cumplimiento Normativo (RGPD)');
  addPara('El visor ha sido diseñado con estrictos principios de seguridad por diseño:');
  addBullet('Aislamiento de Datos Confidenciales', 'El visor no proyecta datos fiscales de otros clientes, nombres de camareros, contraseñas ni resúmenes de facturación de caja.');
  addBullet('Protección de Pagos', 'El código QR solo transmite el identificador único del pedido; la transacción bancaria se ejecuta en la pasarela segura del cliente.');

  // --- SECTION 6 ---
  addSection('6. Preguntas Frecuentes y Diagnóstico (FAQ)');
  addBullet('¿Por qué no aparece el código QR?', 'El código QR se oculta automáticamente cuando el total es 0.00 € para evitar lecturas accidentales antes de registrar productos.');
  addBullet('¿Qué hacer si el visor no actualiza los artículos?', 'Haga clic en el icono superior del monitor en el visor para volver a vincular la mesa o pulse F5 para reconectar el canal WebSocket.');

  addAlertBox('Requisitos de Red Local', 'Para una experiencia óptima de sincronización instantánea, los terminales TPV y las pantallas CFD deben compartir la misma red local Wi-Fi o conexión cableada Ethernet.');

  // Footer page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} — GastroPOS Suite | Manual de Administrador: Visor de Cliente (CFD)`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, 'manual_visor_de_cliente.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`CFD manual PDF generated at: ${pdfPath}`);
}

generateCFDManualPDF().catch(err => {
  console.error("Error generating CFD PDF:", err);
  process.exit(1);
});
