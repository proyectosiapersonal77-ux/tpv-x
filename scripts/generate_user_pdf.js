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
  const contentWidth = pageWidth - (margin * 2); // 174 mm
  const bottomThreshold = pageHeight - margin - 15; // 264 mm

  let cursorY = margin;

  const primaryColor = [15, 23, 42]; // slate-900
  const accentColor = [16, 185, 129]; // emerald-500
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightBg = [248, 250, 252]; // slate-50
  const cardBorder = [226, 232, 240]; // slate-200

  function checkPageBreak(neededHeight) {
    if (cursorY + neededHeight > bottomThreshold) {
      doc.addPage();
      cursorY = margin + 10;
      drawHeader();
    }
  }

  function drawHeader() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('GastroPOS Suite | Guía de Usuario Rápida y Completa', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  // Cover Page Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 85, 'F');

  doc.setFillColor(...accentColor);
  doc.rect(0, 85, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text('GUÍA DE USUARIO RÁPIDA Y COMPLETA', margin, 30);

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('GastroPOS Suite v2.1', margin, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(226, 232, 240);
  doc.text('Manual Operativo Integral para Sala, Barra, Cocina, Caja y Encargados', margin, 56);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Dirección de Operaciones & Arquitectura de Software GastroPOS | Septiembre 2026', margin, 70);

  cursorY = 102;

  // Metadata Box
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(margin, cursorY, contentWidth, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('Ficha Técnica del Manual de Usuario', margin + 6, cursorY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text('• Destinatarios: Personal de Sala, Barra, Cocina, Caja, Encargados y Dirección', margin + 6, cursorY + 16);
  doc.text('• Alcance: Cobertura total de módulos funcionales y catálogo completo de elementos', margin + 6, cursorY + 22);
  doc.text('• Versión: 2.1 Oficial (Arquitectura Offline-First con Dexie y Supabase)', margin + 6, cursorY + 28);
  doc.text('• Metodología: Propósito general, catálogo de controles, uso paso a paso y casos de uso', margin + 6, cursorY + 34);

  cursorY += 46;

  function addH2(title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    const titleLines = doc.splitTextToSize(title, contentWidth);
    const needed = titleLines.length * 5.5 + 14;
    checkPageBreak(needed);
    
    cursorY += 4;
    doc.setTextColor(...accentColor);
    for (let i = 0; i < titleLines.length; i++) {
      doc.text(titleLines[i], margin, cursorY);
      if (i < titleLines.length - 1) cursorY += 5.5;
    }
    cursorY += 3.5;
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.4);
    doc.line(margin, cursorY, margin + contentWidth, cursorY);
    cursorY += 5;
  }

  function addH3(title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    const titleLines = doc.splitTextToSize(title, contentWidth);
    const needed = titleLines.length * 4.8 + 7;
    checkPageBreak(needed);
    
    cursorY += 3;
    doc.setTextColor(...primaryColor);
    for (let i = 0; i < titleLines.length; i++) {
      doc.text(titleLines[i], margin, cursorY);
      if (i < titleLines.length - 1) cursorY += 4.8;
    }
    cursorY += 4.5;
  }

  function addPara(text) {
    const cleanText = text.replace(/\*\*/g, '').trim();
    if (!cleanText) return;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...secondaryColor);
    const lines = doc.splitTextToSize(cleanText, contentWidth);
    checkPageBreak(lines.length * 4.4 + 4);

    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], margin, cursorY);
      if (i < lines.length - 1) cursorY += 4.3;
    }
    cursorY += 4.8;
  }

  function addBulletItem({ isSubBullet, title, desc, rawText }) {
    const bulletSymbol = isSubBullet ? '–' : '•';
    const indent = isSubBullet ? 5 : 0;
    const availWidth = contentWidth - indent;

    // Case 1: Plain bullet without bold title
    if (!title) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...secondaryColor);
      const textLines = doc.splitTextToSize(rawText || desc, availWidth - 4);
      checkPageBreak(textLines.length * 4.3 + 3);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(bulletSymbol, margin + indent, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...secondaryColor);
      const textX = margin + indent + 4;
      for (let i = 0; i < textLines.length; i++) {
        doc.text(textLines[i], textX, cursorY);
        if (i < textLines.length - 1) cursorY += 4.3;
      }
      cursorY += 4.8;
      return;
    }

    // Case 2: Bold title but NO description
    if (!desc) {
      const titlePrefix = `${bulletSymbol} ${title}:`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...primaryColor);
      const titleLines = doc.splitTextToSize(titlePrefix, availWidth);
      checkPageBreak(titleLines.length * 4.3 + 3);

      for (let i = 0; i < titleLines.length; i++) {
        doc.text(titleLines[i], margin + indent, cursorY);
        if (i < titleLines.length - 1) cursorY += 4.3;
      }
      cursorY += 4.8;
      return;
    }

    // Case 3: Bold title WITH description
    const titlePrefix = `${bulletSymbol} ${title}: `;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const titleWidth = doc.getTextWidth(titlePrefix);
    const availFirstLine = availWidth - titleWidth;

    // Subcase 3A: Short title - fits inline with first line of description
    if (availFirstLine >= 40) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const words = desc.split(/\s+/);
      let line0Words = [];
      let restWords = [];

      for (let i = 0; i < words.length; i++) {
        const candidate = line0Words.length > 0 ? line0Words.join(' ') + ' ' + words[i] : words[i];
        if (doc.getTextWidth(candidate) <= availFirstLine) {
          line0Words.push(words[i]);
        } else {
          restWords = words.slice(i);
          break;
        }
      }

      const line0Text = line0Words.join(' ');
      let remainingLines = [];
      if (restWords.length > 0) {
        remainingLines = doc.splitTextToSize(restWords.join(' '), availWidth - 4);
      }

      const totalLines = 1 + remainingLines.length;
      checkPageBreak(totalLines * 4.3 + 3);

      // Render line 0
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(titlePrefix, margin + indent, cursorY);

      if (line0Text) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...secondaryColor);
        doc.text(line0Text, margin + indent + titleWidth, cursorY);
      }

      // Render subsequent lines
      if (remainingLines.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...secondaryColor);
        const subX = margin + indent + 4;
        for (let i = 0; i < remainingLines.length; i++) {
          cursorY += 4.3;
          doc.text(remainingLines[i], subX, cursorY);
        }
      }
      cursorY += 4.8;
      return;
    }

    // Subcase 3B: Long title - render title block, then description indented below
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const titleLines = doc.splitTextToSize(titlePrefix, availWidth);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(desc, availWidth - 4);

    const totalLines = titleLines.length + descLines.length;
    checkPageBreak(totalLines * 4.3 + 3);

    // Draw title lines
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    for (let i = 0; i < titleLines.length; i++) {
      doc.text(titleLines[i], margin + indent, cursorY);
      if (i < titleLines.length - 1) cursorY += 4.3;
    }

    // Draw description lines
    if (descLines.length > 0) {
      cursorY += 4.3;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...secondaryColor);
      const descX = margin + indent + 4;
      for (let i = 0; i < descLines.length; i++) {
        doc.text(descLines[i], descX, cursorY);
        if (i < descLines.length - 1) cursorY += 4.3;
      }
    }
    cursorY += 4.8;
  }

  // Read MANUAL_DE_USUARIO.md
  const mdPath = path.join(process.cwd(), 'MANUAL_DE_USUARIO.md');
  const content = fs.readFileSync(mdPath, 'utf-8');
  const lines = content.split('\n');

  let inCoverHeader = true;
  let currentParaLines = [];

  function flushCurrentPara() {
    if (currentParaLines.length > 0) {
      addPara(currentParaLines.join(' '));
      currentParaLines = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines
    if (!trimmed) {
      flushCurrentPara();
      continue;
    }

    // Detect section 1 start to end cover header zone
    if (trimmed.startsWith('## 1. ')) {
      inCoverHeader = false;
    }

    // Skip metadata headers from markdown that are already displayed in cover block
    if (inCoverHeader) {
      if (trimmed.startsWith('# ') || trimmed.startsWith('**Manual Operativo') || trimmed.startsWith('*Dirección de Operaciones') || trimmed === '---') {
        continue;
      }
    }

    // Dividers
    if (trimmed === '---') {
      flushCurrentPara();
      continue;
    }

    // H2 Section Headers
    if (trimmed.startsWith('## ')) {
      flushCurrentPara();
      addH2(trimmed.replace(/^##\s*/, ''));
      continue;
    }

    // H3 Subsection Headers
    if (trimmed.startsWith('### ')) {
      flushCurrentPara();
      addH3(trimmed.replace(/^###\s*/, ''));
      continue;
    }

    // Bullets and Sub-bullets
    const isSubBullet = rawLine.startsWith('  -') || rawLine.startsWith('    -') || rawLine.startsWith('\t-');
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');

    if (isBullet) {
      flushCurrentPara();
      const clean = trimmed.replace(/^[•\-]\s*/, '');
      const boldMatch = clean.match(/^\*\*([^*]+)\*\*(?::)?\s*(.*)$/);

      if (boldMatch) {
        const rawTitle = boldMatch[1].replace(/:$/, '').trim();
        const desc = boldMatch[2].trim();
        addBulletItem({
          isSubBullet,
          title: rawTitle,
          desc
        });
      } else {
        addBulletItem({
          isSubBullet,
          rawText: clean
        });
      }
      continue;
    }

    // Plain Paragraph Line (accumulate adjacent lines)
    currentParaLines.push(trimmed);
  }

  flushCurrentPara();

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} — GastroPOS Suite v2.1 | Guía de Usuario Oficial`,
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

  console.log(`User manual PDF generated successfully (${totalPages} pages) at: ${pdfPath}`);
}

generateUserManualPDF().catch(err => {
  console.error("Error generating user PDF:", err);
  process.exit(1);
});
