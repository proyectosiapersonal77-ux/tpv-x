import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generateAnalyticsManualPDF() {
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

  // Colors
  const primaryColor = [15, 23, 42]; // slate-900
  const accentColor = [59, 130, 246]; // blue-500 / analytics accent
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightBg = [248, 250, 252]; // slate-50
  const cardBorder = [226, 232, 240]; // slate-200
  const alertBg = [254, 242, 242]; // red-50
  const alertBorder = [252, 165, 165]; // red-300
  const alertText = [153, 27, 27]; // red-800
  const successBg = [240, 253, 244]; // green-50
  const successBorder = [187, 247, 208]; // green-200
  const successText = [22, 101, 52]; // green-800

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
    doc.text('GastroPOS Suite | Manual de Administrador: Módulo Finanzas y Analítica', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  function addCoverPage() {
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 85, 'F');

    doc.setFillColor(...accentColor);
    doc.rect(0, 85, pageWidth, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(96, 165, 250);
    doc.text('MANUAL DE ADMINISTRACIÓN & ARQUITECTURA FINANCIERA', margin, 32);

    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('Finanzas y Analítica', margin, 46);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(226, 232, 240);
    doc.text('Dashboard BI, Rentabilidad P&L, Cierre Z, Modelo 347 e Impuestos', margin, 58);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('GastroPOS Suite v2.1 | Inteligencia de Negocio & Cumplimiento Tributario', margin, 72);

    cursorY = 110;

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
    doc.text('• Autor: Dirección Financiera & Arquitectura de Software GastroPOS', margin + 6, cursorY + 16);
    doc.text('• Destinatarios: Gerentes, Controllers Financieros, Asesores Fiscales y Dirección', margin + 6, cursorY + 22);
    doc.text('• Módulos técnicos: AnalyticsScreen.tsx, TaxesReport.tsx, orderService.ts, cashService.ts', margin + 6, cursorY + 28);
    doc.text('• Normativa: Ley Antifraude 11/2021, Cierres Z, Modelo 347, IVA Repercutido/Soportado', margin + 6, cursorY + 34);

    cursorY += 56;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Índice de Contenidos', margin, cursorY);
    cursorY += 6;

    const sections = [
      '1. Introducción y Marco Estratégico de Inteligencia Financiera',
      '2. Arquitectura de Datos y Motor de Agregación Reactivo',
      '3. Dashboard Financiero Operativo (KPIs de Ventas y Tickets)',
      '4. Cuenta de Pérdidas y Ganancias (P&L): Costes Reales y Margen Bruto',
      '5. Segmentación Analítica con Recharts (Horas, Camareros, Zonas y Familias)',
      '6. Cierre Fiscal Diario Obligatorio (Informe Z Oficial)',
      '7. Módulo Tributario y Liquidación de Impuestos (IVA Repercutido vs. Soportado)',
      '8. Modelo 347: Auditoría y Declaración Anual de Operaciones con Terceros',
      '9. Exportación Contable a CSV para Gestoría y Software Fiscal (A3 / Sage)',
      '10. Auditoría de Tickets y Anulación Conforme a la Ley Antifraude',
      '11. Control de Permisos Granulares (RBAC) y Seguridad Financiera',
      '12. Preguntas Frecuentes y Guía de Resolución de Incidencias'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...secondaryColor);
    sections.forEach((sec) => {
      doc.text(sec, margin + 4, cursorY);
      cursorY += 6;
    });

    doc.addPage();
    cursorY = margin + 10;
    drawHeader();
  }

  function addSectionHeading(number, title) {
    checkPageBreak(22);
    cursorY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text(`${number}. ${title}`, margin, cursorY);
    cursorY += 2;
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.8);
    doc.line(margin, cursorY, margin + 35, cursorY);
    cursorY += 6;
  }

  function addParagraph(text) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...secondaryColor);
    const splitText = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(splitText.length * 5 + 4);
    doc.text(splitText, margin, cursorY);
    cursorY += (splitText.length * 5) + 3;
  }

  function addBullet(term, description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const prefix = `• ${term}: `;
    const fullText = `${prefix}${description}`;
    const splitText = doc.splitTextToSize(fullText, contentWidth - 4);
    checkPageBreak(splitText.length * 5 + 3);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`• ${term}: `, margin + 3, cursorY);

    const prefixWidth = doc.getTextWidth(`• ${term}: `);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);

    const restLines = doc.splitTextToSize(description, contentWidth - 4 - prefixWidth);
    if (restLines.length > 0) {
      doc.text(restLines[0], margin + 3 + prefixWidth, cursorY);
      if (restLines.length > 1) {
        const remaining = restLines.slice(1).join(' ');
        const remainingLines = doc.splitTextToSize(remaining, contentWidth - 4);
        cursorY += 4.5;
        doc.text(remainingLines, margin + 7, cursorY);
        cursorY += (remainingLines.length - 1) * 4.5;
      }
    }
    cursorY += 5;
  }

  function addCalloutBox(title, text, type = 'info') {
    const bg = type === 'alert' ? alertBg : type === 'success' ? successBg : lightBg;
    const border = type === 'alert' ? alertBorder : type === 'success' ? successBorder : cardBorder;
    const txtColor = type === 'alert' ? alertText : type === 'success' ? successText : primaryColor;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitText = doc.splitTextToSize(text, contentWidth - 12);
    const boxHeight = (splitText.length * 4.5) + 16;

    checkPageBreak(boxHeight + 4);

    doc.setFillColor(...bg);
    doc.setDrawColor(...border);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...txtColor);
    doc.text(title, margin + 6, cursorY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...secondaryColor);
    doc.text(splitText, margin + 6, cursorY + 13);

    cursorY += boxHeight + 4;
  }

  // --- CONTENT ---
  addCoverPage();

  // SECTION 1
  addSectionHeading('1', 'Introducción y Marco Estratégico');
  addParagraph(
    'El módulo de Finanzas y Analítica de GastroPOS Suite constituye el centro neurálgico de inteligencia empresarial (Business Intelligence) ' +
    'y liquidación tributaria del establecimiento. En el entorno de la restauración contemporánea, el éxito de un restaurante ' +
    'depende de la capacidad de monitorizar en tiempo real el margen de beneficio, auditar las ventas por turnos y cumplir con rigor ' +
    'las exigencias de la normativa fiscal (Ley Antifraude 11/2021, VeriFactu y Modelo 347).'
  );
  addParagraph(
    'Este módulo unifica en una sola consola ejecutiva cuatro áreas clave: Dashboard analítico visual, cuenta de explotación (P&L en vivo), ' +
    'emisión oficial de Cierres Z de caja y el módulo de gestión de impuestos con exportación estructurada para gestorías.'
  );

  // SECTION 2
  addSectionHeading('2', 'Arquitectura de Datos y Motor de Agregación');
  addParagraph(
    'GastroPOS Suite procesa millones de operaciones de sala y barra agregando datos locales en IndexedDB mediante Dexie.js ' +
    'y sincronizando con Supabase. El motor de consulta (TanStack React Query) recalcula de forma reactiva las métricas ' +
    'cuando se selecciona cualquier fecha en el selector superior.'
  );
  addBullet('db.orders', 'Colección de tickets cerrados (status: paid o voided) con desglose de métodos de cobro, propinas, marcas temporales e identificadores de empleado y mesa.');
  addBullet('db.products y Recetas', 'Base de datos de escandallos con coste unitario de materia prima (cost_price) y tipo impositivo de IVA (tax_rate) para deducir el coste de ventas.');
  addBullet('purchase_orders', 'Albaranes y pedidos de compra recepcionados a proveedores, base del cálculo del IVA soportado deducible.');

  // SECTION 3
  addSectionHeading('3', 'Dashboard Financiero Operativo');
  addParagraph(
    'Permite a la gerencia evaluar la actividad comercial de un vistazo para el día seleccionado:'
  );
  addBullet('Ventas Totales', 'Importe total facturado en euros con impuestos incluidos.');
  addBullet('Tickets Emitidos', 'Volumen de comandas cobradas a clientes.');
  addBullet('Ticket Medio', 'Gasto medio por ticket (Ventas Totales / Nº de Tickets), indicador clave para la estrategia de upselling y venta sugerida.');
  addBullet('Desglose Efectivo vs. Tarjeta', 'Visualización diferenciada de ingresos en metálico y cobros electrónicos por datáfono bancario.');

  // SECTION 4
  addSectionHeading('4', 'Rentabilidad y Cuenta de Explotación (P&L en Vivo)');
  addParagraph(
    'A diferencia de los sistemas tradicionales que solo registran facturación bruta, GastroPOS calcula en tiempo real la rentabilidad operativa:'
  );
  addCalloutBox(
    'Cálculo de Margen Bruto y Coste de Ventas (COGS)',
    '• Coste Total de Ventas = Suma (Cantidad Vendida x Coste de Escandallo de Ingredientes)\n' +
    '• Beneficio Bruto = Ventas Netas (sin IVA) - Coste Total de Ventas\n' +
    '• Margen Bruto (%) = (Beneficio Bruto / Ventas Netas) x 100\n\n' +
    'Un margen bruto saludable en restauración se sitúa entre el 68% y el 75%. Desviaciones por debajo del 65% activan alertas operativas.',
    'info'
  );

  // SECTION 5
  addSectionHeading('5', 'Segmentación Analítica Visual (Recharts)');
  addParagraph(
    'El módulo incorpora cuatro visualizadores gráficos de alta densidad analítica:'
  );
  addBullet('Ventas por Hora (Mapa de Ritmo)', 'Gráfico de barras de las 24 horas del día. Permite identificar momentos valle y horas punta para ajustar el cuadrante de personal.');
  addBullet('Ventas por Categoría', 'Gráfico de donut que muestra el peso porcentual de Bebidas, Entrantes, Principales y Postres en la facturación total.');
  addBullet('Ventas por Camarero', 'Gráfico de barras horizontal que refleja el desempeño y volumen de cobros gestionado por cada miembro de la sala.');
  addBullet('Ventas por Zona', 'Comparativa de recaudación entre Salón, Terraza y Barra para optimizar la ocupación de mesas.');

  // SECTION 6
  addSectionHeading('6', 'Cierre Fiscal Diario Obligatorio (Informe Z)');
  addParagraph(
    'El Cierre Z es el documento formal exigido por la Agencia Tributaria al finalizar la jornada comercial:'
  );
  addBullet('Resumen Oficial de Ventas', 'Total facturado, ventas en metálico, ventas en tarjeta y total de comprobantes.');
  addBullet('Desglose de IVA por Tramos', 'Tabla legal con desglose de Base Imponible y Cuota de IVA para el 4% (básicos), 10% (hostelería general) y 21% (alcohol/servicios).');
  addBullet('Cuadre de Efectivo y Auditoría de Arqueo', 'Conciliación matemática: Fondo Inicial + Ventas Efectivo + Entradas - Salidas = Saldo Esperado. Compara contra el dinero recontado y evidencia cualquier descuadre.');
  addBullet('Impresión Oficial', 'Estilos optimizados @media print para imprimir en impresora térmica de tickets (80mm) o formato folio A4 para el gestor.');

  // SECTION 7
  addSectionHeading('7', 'Módulo Tributario y Liquidación de Impuestos');
  addParagraph(
    'Desde la pestaña Impuestos (TaxesReport.tsx), la asesoría contable dispone de un panel especializado:'
  );
  addBullet('Selectores Trimestrales', 'Filtro por año y trimestre (T1, T2, T3, T4 o Anual) sincronizado con el calendario de declaraciones oficiales (Modelo 303 y Modelo 390).');
  addBullet('IVA Repercutido (Ventas)', 'Total acumulado repercutido a clientes clasificado por tramo de IVA.');
  addBullet('IVA Soportado (Compras)', 'Total deducible procedente de albaranes y facturas de compras a proveedores recibidas en almacén.');

  // SECTION 8
  addSectionHeading('8', 'Modelo 347 (Operaciones con Terceros)');
  addParagraph(
    'Obligación fiscal anual para el control de operaciones comerciales relevantes:'
  );
  addBullet('Umbral de 3.005,06 €', 'El sistema audita automáticamente el acumulado anual de cada proveedor. Aquellos que superan los 3.005,06 € (con IVA incluido) son listados automáticamente.');
  addBullet('Concordancia Fiscal', 'Permite cotejar las cifras antes de la presentación oficial para evitar discrepancias con los proveedores declarantes.');

  // SECTION 9
  addSectionHeading('9', 'Exportación Contable a CSV para Gestoría');
  addParagraph(
    'El botón "Exportar CSV para Gestor" compila un informe completo en formato delimitado por comas con codificación UTF-8 BOM, garantizando la apertura perfecta en Microsoft Excel, A3 Asesor, Sage 50 y Contasol.'
  );

  // SECTION 10
  addSectionHeading('10', 'Auditoría de Tickets y Ley Antifraude');
  addParagraph(
    'Conforme a la Ley Antifraude 11/2021 y VeriFactu, los tickets emitidos no pueden ser borrados ni alterados:'
  );
  addBullet('Trazabilidad Inmutable', 'Cada ticket conserva número correlativo de factura, fecha, hora, camarero y artículos.');
  addBullet('Anulación Auditada', 'Los administradores pueden anular tickets justificando el motivo en el modal obligatorio. El ticket queda marcado con tachado y estado VOIDED para auditorías tributarias.');

  // SECTION 11
  addSectionHeading('11', 'Permisos de Seguridad (RBAC)');
  addBullet('can_view_reports', 'Permite consultar el Dashboard de ventas y gráficas de rendimiento.');
  addBullet('can_close_register', 'Permite emitir e imprimir el Cierre Z oficial diario.');
  addBullet('can_void_ticket', 'Faculta la anulación justificada de facturas simplificadas.');
  addBullet('admin', 'Acceso completo a rentabilidad (P&L), costes de proveedores, liquidación de IVA y Modelo 347.');

  // SECTION 12
  addSectionHeading('12', 'Preguntas Frecuentes');
  addBullet('¿Por qué el margen bruto es inferior al previsto?', 'Compruebe si el coste de las materias primas en el catálogo de inventario ha sido actualizado tras recibir los últimos albaranes de compra.');
  addBullet('¿Se pueden consultar cierres Z de días pasados?', 'Sí. Basta con utilizar el selector de fecha superior para visualizar e imprimir el Cierre Z exacto de cualquier jornada previa.');

  // Page Numbers Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} — GastroPOS Suite | Manual Oficial de Finanzas y Analítica`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, 'manual_finanzas_analitica.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`PDF successfully generated at: ${pdfPath} (${pdfBuffer.length} bytes, ${totalPages} pages)`);
}

generateAnalyticsManualPDF().catch(err => {
  console.error("Error generating Analytics Manual PDF:", err);
  process.exit(1);
});
