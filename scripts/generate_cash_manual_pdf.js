import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generateCashManualPDF() {
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
  const accentColor = [242, 125, 38]; // amber-600 / brand accent
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
    doc.text('GastroPOS Suite | Manual de Administrador y Operativa: Módulo Gestión de Caja', margin, margin);
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
    doc.setTextColor(242, 125, 38);
    doc.text('MANUAL DE ADMINISTRACIÓN & ARQUITECTURA CONTABLE', margin, 32);

    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('Módulo: Gestión de Caja', margin, 46);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(226, 232, 240);
    doc.text('Arqueo de Efectivo, Cierre Z, Movimientos de Caja y Trazabilidad Fiscal', margin, 58);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('GastroPOS Suite v2.1 | Conforme a Ley Antifraude 11/2021 y VeriFactu / TicketBAI', margin, 72);

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
    doc.text('• Autor: Dirección de Operaciones & Arquitectura de Software GastroPOS', margin + 6, cursorY + 16);
    doc.text('• Destinatarios: Gerentes, Jefes de Sala, Auditores Internos y Personal de Caja', margin + 6, cursorY + 22);
    doc.text('• Archivos fuente: CashRegisterScreen.tsx, cashService.ts, BluetoothPrinterService.ts', margin + 6, cursorY + 28);
    doc.text('• Normativa: Inmutabilidad contable, control de descuadres y apertura eléctrica ESC/POS', margin + 6, cursorY + 34);

    cursorY += 56;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Índice de Contenidos', margin, cursorY);
    cursorY += 6;

    const sections = [
      '1. Introducción y Marco Normativo Legal (Ley Antifraude)',
      '2. Arquitectura de Datos y Ciclo de Vida del Turno de Caja',
      '3. Algoritmo Financiero: Saldo Esperado y Desviación (Descuadre)',
      '4. Desglose de Controles, Iconografía y Pantalla Operativa',
      '5. Flujo de Apertura de Caja y Conteo de Maniobra Inicial',
      '6. Movimientos Manuales de Efectivo (Entradas y Salidas Auditadas)',
      '7. Procedimiento de Arqueo y Cierre Definitivo (Cierre Z)',
      '8. Comparativa Fiscal: Arqueo Parcial (Informe X) vs. Cierre Diario (Informe Z)',
      '9. Integración Hardware: Apertura de Cajón ESC/POS (Web Bluetooth)',
      '10. Permisos de Usuario (RBAC) y Registro de Auditoría (Audit Log)',
      '11. Preguntas Frecuentes y Protocolos de Resolución de Incidencias'
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

  function addSubHeading(title) {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(title, margin, cursorY);
    cursorY += 5;
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

  // --- BUILD PDF CONTENT ---
  addCoverPage();

  // SECTION 1
  addSectionHeading('1', 'Introducción y Marco Normativo Legal');
  addParagraph(
    'El módulo de Gestión de Caja de GastroPOS Suite constituye el núcleo financiero responsable del control de tesorería, ' +
    'custodia de fondos en metálico y trazabilidad integral de cada movimiento económico realizado en el restaurante. ' +
    'En el marco fiscal español y europeo, el cumplimiento de la Ley Antifraude 11/2021 exige garantizar la inmutabilidad, ' +
    'trazabilidad y conservación de todos los registros de cobro, impidiendo la alteración oculta de ventas o saldos.'
  );
  addParagraph(
    'GastroPOS Suite resuelve esta exigencia mediante un esquema de auditoría por eventos (Audit Trail), donde cada apertura, ' +
    'movimiento extraordinario y cierre queda sellado con identificador de empleado, marca de tiempo y cálculo criptográfico.'
  );

  // SECTION 2
  addSectionHeading('2', 'Arquitectura de Datos y Ciclo de Vida del Turno');
  addParagraph(
    'El sistema de caja opera mediante una máquina de estados estricta gestionada en IndexedDB (Dexie) y sincronizada con Supabase. ' +
    'No es posible cobrar pedidos en efectivo si no existe un turno de caja formalmente abierto en el terminal.'
  );
  addBullet('CashRegister', 'Representa la sesión o turno de caja. Contiene identificador único (UUID), fechas de apertura/cierre, fondo inicial, saldo esperado, saldo real recontado y notas de descuadre.');
  addBullet('CashMovement', 'Registros de entrada o salida de efectivo ajenos a las comandas (pagos a proveedores al contado, inyección de cambio o retiradas de caja chica).');
  addBullet('Sincronización Offline-First', 'En caso de caída de la red Wi-Fi o internet, todas las transacciones se acumulan en la cola de sincronización local (SyncQueue) y se replican al servidor central tan pronto se recupera la conexión.');

  // SECTION 3
  addSectionHeading('3', 'Algoritmo Financiero: Saldo Esperado y Descuadre');
  addParagraph(
    'Durante el servicio, el sistema calcula de manera continua y desatendida el Saldo Teórico o Esperado en la gaveta portamonedas:'
  );
  addCalloutBox(
    'Fórmula Maestra de Saldo Teórico en Efectivo',
    'Saldo Esperado = Fondo Inicial + Total Entradas Manuales - Total Salidas Manuales + Ventas TPV en Efectivo\n\n' +
    'Donde las Ventas TPV en Efectivo se computan filtrando órdenes pagadas (status = paid, payment_method = cash) ' +
    'cerradas dentro del intervalo de tiempo comprendido entre opened_at y closed_at.',
    'info'
  );
  addParagraph(
    'Al finalizar la jornada, la diferencia entre el dinero contado por el operario y el Saldo Esperado determina el descuadre contable:'
  );
  addBullet('Descuadre Cero (0.00€)', 'Conciliación contable perfecta. Los ingresos físicos coinciden exactamente con los tickets expedidos.');
  addBullet('Descuadre Positivo (+X.XX€)', 'Sobrante de caja. Indica cobros percibidos en exceso o errores de cambio a favor del negocio.');
  addBullet('Descuadre Negativo (-X.XX€)', 'Faltante de caja. Implica pérdidas de cambio o extracciones de efectivo no declaradas formalmente.');

  // SECTION 4
  addSectionHeading('4', 'Desglose de Controles e Iconografía de Pantalla');
  addParagraph(
    'La interfaz de Gestión de Caja (CashRegisterScreen.tsx) está optimizada para pantallas táctiles de TPV y tabletas en formato horizontal:'
  );
  addBullet('Indicador Superior de Estado', 'Chapa visual de alto contraste: Verde (CAJA ABIERTA con candado abierto Unlock) o Rojo (CAJA CERRADA con candado cerrado Lock).');
  addBullet('Botón "Abrir Cajón" (Printer)', 'Envía de forma remota un pulso eléctrico a la gaveta mediante Bluetooth/USB sin necesidad de cobrar un ticket.');
  addBullet('Tarjetas de Métricas en Vivo', 'Cuatro paneles de control: Fondo Inicial, Ventas Efectivo (+), Movimientos Netos (+/-) y Total Esperado en Cajón.');
  addBullet('Historial de Movimientos', 'Lista cronológica de entradas y salidas manuales con icono de flujo, hora, concepto y cuantía monetaria.');

  // SECTION 5
  addSectionHeading('5', 'Flujo de Apertura de Caja (Inicio de Jornada)');
  addParagraph(
    'Al iniciar el primer turno del día o el cambio de relevo, el responsable debe establecer el fondo de maniobra:'
  );
  addBullet('Paso 1: Acceso', 'Navegue desde el menú principal o menú lateral al módulo "Gestión de Caja".');
  addBullet('Paso 2: Introducción de Fondo', 'Teclee en el campo numérico central el importe exacto en efectivo con el que arranca el cajón (ej. 150.00€).');
  addBullet('Paso 3: Confirmación', 'Pulse el botón verde "ABRIR CAJA". El sistema cambia a estado verde y autoriza inmediatamente el cobro en efectivo en el TPV.');

  // SECTION 6
  addSectionHeading('6', 'Movimientos Manuales de Efectivo (Entradas y Salidas)');
  addParagraph(
    'Para garantizar que cada céntimo que entra o sale de la caja esté documentado, el personal debe registrar los movimientos extraordinarios:'
  );
  addBullet('Entrada (Inyección de Cambio)', 'Se utiliza cuando se aporta efectivo externo al cajón. Se especifica el importe, el motivo (ej. "Cambio de monedas de 1€ y 2€") y se pulsa ENTRADA.');
  addBullet('Salida (Gasto de Caja Chica)', 'Se utiliza para pagos inmediatos en metálico (ej. "Compra de limones en frutería de urgencia: 12.50€"). Se pulsa SALIDA.');
  addCalloutBox(
    'Auditoría y Trazabilidad Obligatoria',
    'El sistema no permite registrar movimientos sin indicar un texto en el campo "Motivo / Concepto". ' +
    'Cada movimiento queda asociado al empleado autenticado en el turno para prevenir fraudes o extravíos.',
    'alert'
  );

  // SECTION 7
  addSectionHeading('7', 'Procedimiento de Arqueo y Cierre Definitivo (Cierre Z)');
  addParagraph(
    'El Cierre Z es el procedimiento oficial de liquidación diaria. Requiere un conteo físico deliberado del dinero existente en el cajón:'
  );
  addBullet('Conteo Físico Ciego', 'El empleado cuenta todos los billetes y monedas de la gaveta e introduce el valor total en "Efectivo real en cajón (€)".');
  addBullet('Anotaciones de Cierre', 'En caso de incidencias extraordinarias, se cumplimenta el campo "Notas de cierre".');
  addBullet('Validación Antidescuadre', 'Si el valor introducido difiere del Saldo Esperado, se despliega el modal de advertencia mostrando la cuantía exacta del descuadre. El usuario debe confirmar conscientemente para forzar el cierre.');
  addBullet('Sellado del Turno', 'El estado pasa a CERRADO, se imprimen los resúmenes y se registran los valores en la base de datos de manera irreversible.');

  // SECTION 8
  addSectionHeading('8', 'Comparativa Fiscal: Informe X vs. Informe Z');
  addParagraph(
    'Es imprescindible que tanto la dirección como los empleados distingan con claridad la diferencia entre ambos informes:'
  );
  addBullet('Arqueo Parcial (Informe X)', 'Informe de consulta provisional. Permite auditar la caja en mitad del turno sin cerrar la sesión ni alterar los acumuladores fiscales.');
  addBullet('Cierre Diario (Informe Z)', 'Informe definitivo y legalmente vinculante. Cierra el turno, congela las ventas del día, desglosa bases imponibles de IVA y resetea los contadores del TPV.');

  // SECTION 9
  addSectionHeading('9', 'Integración Hardware: Cajón Portamonedas ESC/POS');
  addParagraph(
    'GastroPOS Suite se comunica con impresoras térmicas ESC/POS y cajones mediante la Web Bluetooth API:'
  );
  addBullet('Comando de Pulso', 'Se transmite la secuencia hexadecimal estándar ESC p 0 25 250 (pin 2 de la clavija RJ-11 del cajón).');
  addBullet('Apertura Automática tras Cobro', 'Al liquidar un pedido en efectivo en el TPV, el cajón salta automáticamente para facilitar el cambio.');
  addBullet('Apertura Manual Auditada', 'El botón de la barra superior permite abrir el cajón sin cobro previo únicamente a los usuarios con permiso can_open_drawer.');

  // SECTION 10
  addSectionHeading('10', 'Permisos de Usuario (RBAC) y Seguridad');
  addParagraph(
    'El control de tesorería se rige por el sistema de permisos granulares:'
  );
  addBullet('can_open_drawer', 'Apertura física del cajón.');
  addBullet('can_manage_cash', 'Registro de cobros y movimientos manuales.');
  addBullet('can_close_register', 'Realización de arqueos de caja y cierres Z.');
  addBullet('can_view_reports', 'Acceso a estadísticas de ventas e históricos.');

  // SECTION 11
  addSectionHeading('11', 'Preguntas Frecuentes y Resolución de Incidencias');
  addBullet('¿Qué hacer si hay un descuadre al cerrar?', 'Verifique si se ha omitido registrar algún ticket de proveedor pagado en metálico o propinas retiradas. Anote la incidencia en las notas de cierre.');
  addBullet('¿Por qué no salta el cajón eléctrico?', 'Revise que la impresora esté encendida, emparejada por Bluetooth y que el cable RJ-11 no esté desconectado en la parte trasera de la impresora.');
  addBullet('¿Se pueden anular movimientos de caja erróneos?', 'Por seguridad legal antifraude, los movimientos no se borran; se debe emitir un contramovimiento de signo opuesto explicando la rectificación.');

  // Page Numbers Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} — GastroPOS Suite | Manual de Gestión de Caja y Arqueo Oficial`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, 'manual_gestion_caja.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`PDF successfully generated at: ${pdfPath} (${pdfBuffer.length} bytes, ${totalPages} pages)`);
}

generateCashManualPDF().catch(err => {
  console.error("Error generating Cash Manual PDF:", err);
  process.exit(1);
});
