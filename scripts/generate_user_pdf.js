import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generateUserManualPDF() {
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

  const primaryColor = [15, 23, 42]; // slate-900
  const accentColor = [16, 185, 129]; // emerald-500
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightBg = [248, 250, 252]; // slate-50
  const cardBorder = [226, 232, 240]; // slate-200
  const infoBg = [236, 253, 245]; // emerald-50
  const infoBorder = [167, 243, 208]; // emerald-200
  const infoText = [6, 95, 70]; // emerald-800

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
    doc.text('GastroPOS Suite | Manual de Usuario: Guía Operativa y de Servicio', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  // Cover Page
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 85, 'F');

  doc.setFillColor(...accentColor);
  doc.rect(0, 85, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text('MANUAL DE OPERACIONES & GUÍA DE SERVICIO', margin, 32);

  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('Manual de Usuario TPV', margin, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(226, 232, 240);
  doc.text('Guía Práctica para Camareros, Personal de Barra y Sala', margin, 58);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('GastroPOS Suite v2.1 | Sistema Integrado de Comandas y Cobros', margin, 72);

  cursorY = 110;

  // Metadata Box
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(margin, cursorY, contentWidth, 36, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('Ficha de la Guía de Usuario', margin + 6, cursorY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text('• Destinatarios: Personal de Sala, Barra, Camareros y Jefes de Rango', margin + 6, cursorY + 16);
  doc.text('• Objetivo: Agilizar la toma de pedidos, marcha de cocina y cobros rápidos', margin + 6, cursorY + 22);
  doc.text('• Versión: 2.1 (Compatible con móviles, tablets táctiles y TPV de mostrador)', margin + 6, cursorY + 28);

  cursorY += 48;

  function addSection(title) {
    checkPageBreak(18);
    cursorY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...accentColor);
    doc.text(title, margin, cursorY);
    cursorY += 3;
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.4);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;
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

  addSection('1. Inicio de Sesión y Acceso con PIN');
  addPara('Cada empleado cuenta con un código PIN de 4 dígitos. Al iniciar sesión, el sistema identifica su rol (Camarero, Cocinero, Encargado, Administrador) y adapta automáticamente los menús y permisos visibles.');

  addSection('2. Primeros Pasos: Toma de Pedidos en Mesa y Venta Directa');
  addBullet('Venta en Mesa', 'Acceda al Plano de Mesas, elija la zona (Salón, Terraza, Barra) y toque la mesa deseada. Navegue por las familias de productos a la izquierda y añada los platos tocando sobre ellos.');
  addBullet('Venta Directa en Barra', 'Para clientes de paso que no ocupan mesa, seleccione "Venta Directa" para cobrar al vuelo en efectivo o tarjeta.');
  addBullet('Notas y Modificadores', 'Toque un producto en el ticket para añadir especificaciones de cocina (punto de carne, sin sal, intolerancias).');

  addSection('3. Envío a Cocina y Barra (Marcha de Platos)');
  addPara('Al pulsar "Enviar Comanda", los productos se transmiten instantáneamente al KDS de cocina o a la impresora de barra. El camarero puede seguir atendiendo otras mesas mientras el equipo de cocina prepara los pedidos.');

  addSection('4. Gestión de Cobros y División de Cuenta');
  addBullet('Cobro Íntegro', 'Pulse "Cobrar", seleccione Efectivo o Tarjeta. Al introducir el importe recibido en efectivo, el sistema calcula automáticamente el cambio exacto.');
  addBullet('Dividir Cuenta', 'Pulse "Dividir Cuenta" para repartir el importe entre varios comensales de forma equitativa o por artículos separados.');

  addSection('5. Preguntas Frecuentes de Sala (FAQ)');
  addBullet('¿Cómo cancelo un producto anotado por error?', 'Si no se ha enviado a cocina, pulse el icono de papelera. Si ya se envió, avise al encargado para que autorice la anulación.');
  addBullet('¿Qué hacer si el cliente se cambia de mesa?', 'Pulse el botón "Mover Mesa" en la comanda y seleccione la nueva mesa.');

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} — GastroPOS Suite | Manual de Usuario`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, 'manual_general_usuario.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`User manual PDF generated at: ${pdfPath}`);
}

generateUserManualPDF().catch(err => {
  console.error("Error generating user PDF:", err);
  process.exit(1);
});
