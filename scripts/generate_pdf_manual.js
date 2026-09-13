import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generateManualPDF() {
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
  const accentColor = [225, 29, 72]; // rose-600 / brand accent
  const secondaryColor = [71, 85, 105]; // slate-600
  const lightBg = [248, 250, 252]; // slate-50
  const cardBorder = [226, 232, 240]; // slate-200
  const alertBg = [254, 242, 242]; // red-50
  const alertBorder = [252, 165, 165]; // red-300
  const alertText = [153, 27, 27]; // red-800
  const infoBg = [239, 246, 255]; // blue-50
  const infoBorder = [191, 219, 254]; // blue-200
  const infoText = [30, 58, 138]; // blue-900

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
    doc.text('GastroPOS Suite | Manual de Administrador: Módulo Plano de Mesas', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
  }

  function addCoverPage() {
    // Header brand bar
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 85, 'F');

    // Accent line
    doc.setFillColor(...accentColor);
    doc.rect(0, 85, pageWidth, 4, 'F');

    // Super Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(244, 63, 94);
    doc.text('MANUAL DE ADMINISTRACIÓN & ARQUITECTURA FUNCIONAL', margin, 32);

    // Main Title
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('Módulo: Plano de Mesas', margin, 46);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(226, 232, 240);
    doc.text('Gestión de Zonas, Topología de Sala, Fusión, Traspaso y Operativa', margin, 58);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('GastroPOS Suite v2.1 | Arquitectura Distribuida Offline-First & Supabase Realtime', margin, 72);

    cursorY = 110;

    // Metadata Box
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...cardBorder);
    doc.roundedRect(margin, cursorY, contentWidth, 38, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('Ficha Técnica del Documento', margin + 6, cursorY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...secondaryColor);
    doc.text('• Autor: Equipo de Ingeniería de Software (Senior Core Developer)', margin + 6, cursorY + 16);
    doc.text('• Destinatario: Administradores de Sistema, Gerentes de Operaciones y Encargados de Sala', margin + 6, cursorY + 22);
    doc.text('• Módulos involucrados: TablePlan.tsx, TableManagement.tsx, tableService.ts, orderService.ts', margin + 6, cursorY + 28);
    doc.text('• Vigencia: Versión 2.1 en adelante (Compatible con TPV táctil, tablet y pantallas KDS)', margin + 6, cursorY + 34);

    cursorY += 50;

    // Table of Contents Preview
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Índice de Contenidos', margin, cursorY);
    cursorY += 8;

    const sections = [
      '1. Arquitectura y Filosofía del Sistema (Offline-First y Reactividad)',
      '2. Topología de Sala: Zonas y Ambientes',
      '3. Ciclo de Vida y Estados Visuales de una Mesa',
      '4. Operativa de Sala: Apertura de Pedidos y Visualización en Vivo',
      '5. Agrupación y Unión de Mesas (Mesas Compuestas / Banquetes)',
      '6. Separación y Desunión de Mesas Agrupadas',
      '7. Traspaso y Fusión de Comandas entre Mesas (Cambio de Ubicación)',
      '8. Panel Administrativo: Alta, Edición y Mantenimiento Estructural',
      '9. Protocolos de Seguridad, Auditoría y Fallo de Conectividad',
      '10. Preguntas Frecuentes y Guía de Resolución de Incidencias (Troubleshooting)'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...secondaryColor);
    sections.forEach((sec, idx) => {
      doc.text(sec, margin + 4, cursorY);
      cursorY += 6.5;
    });

    doc.addPage();
    cursorY = margin + 10;
    drawHeader();
  }

  function addSectionHeading(number, title) {
    checkPageBreak(18);
    cursorY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...accentColor);
    doc.text(`${number}.`, margin, cursorY);

    doc.setTextColor(...primaryColor);
    doc.text(title, margin + 8, cursorY);
    cursorY += 3;

    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.4);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;
  }

  function addSubHeading(title) {
    checkPageBreak(14);
    cursorY += 3;
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

  function addCalloutBox(type, title, text) {
    const isAlert = type === 'alert';
    const bgColor = isAlert ? alertBg : infoBg;
    const borderColor = isAlert ? alertBorder : infoBorder;
    const textColor = isAlert ? alertText : infoText;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    const textLines = doc.splitTextToSize(text, contentWidth - 14);
    const boxHeight = textLines.length * 4.5 + 14;

    checkPageBreak(boxHeight + 4);

    doc.setFillColor(...bgColor);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...textColor);
    doc.text(title, margin + 6, cursorY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.text(textLines, margin + 6, cursorY + 12);

    cursorY += boxHeight + 5;
  }

  // BUILD CONTENT
  addCoverPage();

  // SECTION 1
  addSectionHeading('1', 'Arquitectura y Filosofía del Sistema');
  addParagraph(
    'El módulo Plano de Mesas de GastroPOS está diseñado bajo el paradigma "Offline-First con Reactividad en Tiempo Real". ' +
    'A diferencia de los sistemas tradicionales basados en peticiones síncronas a un servidor central que se bloquean ante una pérdida de cobertura Wi-Fi, ' +
    'GastroPOS opera con una base de datos local embebida en el terminal cliente (Dexie/IndexedDB) sincronizada bidireccionalmente con Supabase (PostgreSQL).'
  );
  addBullet('Persistencia Local Inmediata', 'Cualquier acción de apertura, cierre, unión o modificación de mesa se consolida en menos de 5ms en la memoria del dispositivo.');
  addBullet('Canales de Suscripción en Tiempo Real', 'Mediante WebSockets (Supabase Realtime Channel: table_plan_updates), todos los terminales de sala, la comanda móvil del camarero y la pantalla de cocina (KDS) reciben las transiciones de estado de forma instantánea sin necesidad de recargar la página.');
  addBullet('Cola de Sincronización Resiliente (SyncQueue)', 'Si la conexión a Internet o el punto de acceso cae temporalmente, el personal puede continuar operando mesas y pedidos con total normalidad; en cuanto se restablece la conectividad, las mutaciones se transmiten de forma ordenada al servidor sin colisiones.');

  addCalloutBox('info', 'Ventaja Clave para el Administrador', 
    'Sus empleados nunca se quedarán bloqueados en medio del servicio por un corte de red. La sala sigue funcionando, los totales se calculan localmente y la integridad de los datos está matemáticamente asegurada.'
  );

  // SECTION 2
  addSectionHeading('2', 'Topología de Sala: Zonas y Ambientes');
  addParagraph(
    'El restaurante no es un espacio homogéneo. GastroPOS estructura la planta física en "Zonas" lógicas configurables desde el panel de administración. ' +
    'Esto permite segmentar el local según el tipo de servicio, la tarifa aplicable o el personal asignado.'
  );
  addSubHeading('Detección Semántica Inteligente de Iconos');
  addParagraph(
    'La interfaz analiza automáticamente el nombre asignado a cada zona e inyecta la iconografía representativa en la botonera superior:'
  );
  addBullet('Zonas Interiores ("Salón", "Comedor", "Interior")', 'Identificadas con el icono de Sillón (Armchair). Representan el área estándar con servicio de mesa formal.');
  addBullet('Zonas Exteriores ("Terraza", "Patio", "Jardín")', 'Identificadas con el icono de Sol (Sun). Diseñadas para áreas al aire libre que pueden tener suplementos o dinámicas de servicio estacionales.');
  addBullet('Zonas Rápidas ("Barra", "Taberna")', 'Identificadas con el icono de Jarra (Beer). Orientadas a pedidos ágiles y rotación rápida.');
  addBullet('Otras Zonas ("Reservado", "Planta 1", "Piscina")', 'Identificadas con icono de Cuadrícula (LayoutGrid).');

  addParagraph(
    'Cada pestaña de zona incorpora además un contador dinámico que refleja en tiempo real el número total de mesas activas que contiene.'
  );

  // SECTION 3
  addSectionHeading('3', 'Ciclo de Vida y Estados Visuales de una Mesa');
  addParagraph(
    'En un entorno de hostelería de alto rendimiento, la comunicación visual debe ser intuitiva y sin ambigüedades. ' +
    'Cada tarjeta de mesa comunica su estado operativo mediante un código de colores y microindicadores luminosos LED:'
  );
  addBullet('Mesa Libre (Disponible)', 'Fondo neutro oscuro (brand-800), micro-LED verde brillante superior derecho, texto "LIBRE" en verde esmeralda y borde con efecto de elevación al posar el cursor o dedo.');
  addBullet('Mesa Ocupada (Con Pedido Abierto)', 'Fondo con sutil matiz carmesí (bg-red-900/20), borde rojo de alerta (border-red-500/50), micro-LED rojo pulsante e IMPORTE ACUMULADO en euros (€) destacado en tipografía monoespaciada para control visual del consumo.');
  addBullet('Mesa Vinculada / Hija (Agrupada)', 'Fondo atenuado con borde discontinuo (dashed gray), icono de eslabón (Link) en la base de la tarjeta y mención explícita a la mesa matriz (ej. "🔗 M1").');
  addBullet('Mesa en Modo Selección (Unión)', 'Borde resaltado con el color de acento de marca, reducción sutil de escala (scale-95) y marca de verificación activa (Checkmark).');

  // SECTION 4
  addSectionHeading('4', 'Operativa de Sala: Apertura y Gestión');
  addParagraph(
    'El flujo de interacción del personal de sala ha sido optimizado para minimizar el número de pulsaciones requeridas:'
  );
  addBullet('1. Toque simple sobre Mesa Libre', 'El sistema crea o inicializa la sesión de pedido en el TPV y transfiere al camarero inmediatamente a la pantalla de selección de productos y categorías.');
  addBullet('2. Toque simple sobre Mesa Ocupada', 'Carga al instante el pedido en curso con todos sus platos, cantidades, estados en cocina (pendiente, preparando, listo, servido) y opciones de cobro o adición.');
  addBullet('3. Toque sobre Mesa Hija (Vinculada)', 'Redirige automáticamente a la comanda de la Mesa Maestra, asegurando que nunca se abran cuentas paralelas o huérfanas en mesas que físicamente están compartiendo el mismo servicio.');

  // SECTION 5
  addSectionHeading('5', 'Agrupación y Unión de Mesas (Banquetes y Grupos)');
  addParagraph(
    'Una de las situaciones más habituales y propensas a errores en restauración es cuando un grupo de clientes junta varias mesas (por ejemplo, unir las mesas 4, 5 y 6 para un grupo de 12 comensales). ' +
    'GastroPOS resuelve este problema mediante un mecanismo nativo de enlace relacional (Parent-Child Topology).'
  );
  addSubHeading('Procedimiento de Unión Paso a Paso:');
  addBullet('Paso 1 (Activación del Modo Unión)', 'Mantenga pulsada durante 600 milisegundos cualquier mesa que forme parte de la unión. El terminal emitirá una respuesta háptica de vibración (50ms) y desplegará la barra de herramientas superior dorada "Modo Unir Mesas".');
  addBullet('Paso 2 (Selección de Mesas Adicionales)', 'Toque secuencialmente el resto de mesas que se van a juntar. Quedarán marcadas visualmente con un tic y el contador superior se actualizará.');
  addBullet('Paso 3 (Confirmación y Fusión)', 'Pulse el botón "Unir". Se abrirá una ventana modal de confirmación indicando qué mesa actuará como matriz y cuántas quedarán supeditadas a ella.');

  addCalloutBox('info', 'Inteligencia en la Elección de Mesa Matriz',
    'Si alguna de las mesas seleccionadas ya tenía un pedido abierto con consumiciones previas, el algoritmo la designa automáticamente como Mesa Maestra. Si dos o más tenían pedidos, sus consumiciones se fusionan íntegramente en la comanda principal con total trazabilidad histórica.'
  );

  // SECTION 6
  addSectionHeading('6', 'Separación y Desunión de Mesas Agrupadas');
  addParagraph(
    'Cuando el grupo termina el servicio o parte de los comensales se marchan y las mesas físicas se vuelven a separar:'
  );
  addBullet('Procedimiento', 'Mantenga pulsada durante 600ms la mesa secundaria (hija) que desea desvincular. El sistema reconocerá su estado enlazado y abrirá directamente el modal "Desunir Mesa".');
  addBullet('Resultado Inmediato', 'La mesa desvinculada recupera su estado libre e independiente en el plano, lista para recibir a nuevos clientes.');
  addBullet('Destino de los Consumos Anteriores', 'Los artículos facturados o pedidos previamente se mantienen a buen recaudo en la cuenta de la Mesa Maestra para no provocar descuadres ni pérdidas de cobro. Si los comensales desean repartir o separar el pago, se utiliza la función "Dividir Cuenta" en el TPV.');

  // SECTION 7
  addSectionHeading('7', 'Traspaso y Fusión de Comandas entre Mesas');
  addParagraph(
    'Cuando un cliente solicita cambiarse de mesa (por ejemplo, pasar de la Barra a la Terraza o de una mesa pequeña a un salón interior), ' +
    'el sistema permite realizar el traspaso de forma limpia y transparente para cocina y facturación.'
  );
  addSubHeading('Cómo ejecutar el traspaso:');
  addBullet('1. Desde el TPV', 'Acceda a la mesa de origen donde se encuentra la comanda activa y pulse el botón "Mover Mesa" (icono de doble flecha contrapuesta).');
  addBullet('2. Selector de Destino', 'Se abrirá un selector modal con pestañas de zonas. Seleccione la zona y la mesa de destino.');
  addBullet('3. Caso Mesa Destino Libre', 'El sistema reasigna el identificador table_id de la comanda a la nueva mesa. La mesa de origen queda automáticamente libre y la de destino pasa a estar ocupada con el pedido intacto.');
  addBullet('4. Caso Mesa Destino Ocupada (Fusión de Clientes)', 'Si dos grupos de amigos se unen en una mesa que ya tenía consumiciones, el sistema invoca mergeOrders(), combinando ambas listas de platos, notas y subtotales en una única cuenta unificada.');

  // SECTION 8
  addSectionHeading('8', 'Panel Administrativo: Configuración Estructural');
  addParagraph(
    'El diseño y modificación de la distribución del restaurante se gestiona desde el menú Configuración > Mesas y Zonas (TableManagement.tsx).'
  );
  addSubHeading('Operaciones Clave para el Administrador:');
  addBullet('Crear Nueva Zona', 'Pulse "Gestionar Zonas" > escriba el nombre (ej. "Terraza Cubierta") y guarde. Aparecerá de inmediato en la barra superior de todo el sistema.');
  addBullet('Crear Nueva Mesa', 'Pulse el botón "+" (Añadir Mesa). Introduzca el nombre identificador (recomendado: M1, M2... o T1, T2 para terrazas) y vincúlela a su zona correspondiente.');
  addBullet('Editar o Renombrar', 'Haga clic en el icono de edición sobre cualquier mesa en la tabla administrativa para cambiar su nombre o reubicarla de zona.');
  addBullet('Activar / Desactivar Mesas', 'Permite ocultar mesas fuera de temporada (ej. mesas de terraza en invierno) sin borrar sus historiales de venta pasados.');
  addBullet('Eliminar Zonas / Mesas', 'El sistema incluye protección de integridad referencial. Se solicitará confirmación explícita para evitar borrados accidentales durante la jornada.');

  // SECTION 9
  addSectionHeading('9', 'Protocolos de Seguridad, Auditoría y Conectividad');
  addParagraph(
    'Como administrador, es vital comprender las salvaguardas que garantizan el cumplimiento normativo (Ley Antifraude / VeriFactu) y la estabilidad del negocio:'
  );
  addBullet('Audit Trail (Registro Inmutable)', 'Cada cierre de mesa, cobro, anulación o unión genera un registro con firma criptográfica SHA-256 e ID del empleado actuante, accesible en la tabla audit_logs.');
  addBullet('Control de Acceso Basado en Roles (RBAC)', 'Los camareros estándar solo pueden visualizar, abrir y unir mesas. La anulación de pedidos de mesa o la modificación estructural de zonas requiere credenciales de Administrador o Encargado.');
  addBullet('Sincronización en Cascada', 'Si un terminal se apaga bruscamente o se agota su batería, ningún dato se pierde. El estado de las mesas permanece intacto en los demás dispositivos y en la nube.');

  // SECTION 10
  addSectionHeading('10', 'Preguntas Frecuentes y Resolución de Incidencias');
  addBullet('¿Qué ocurre si dos camareros intentan abrir la misma mesa al mismo tiempo?', 'El motor de base de datos local y la suscripción WebSocket resuelven la concurrencia: el primer pedido confirmado bloquea la mesa como ocupada y el segundo camarero visualiza el pedido ya abierto en menos de 100ms.');
  addBullet('¿Cómo saber el tiempo que lleva una mesa ocupada?', 'En el KDS de cocina y en el panel TPV, cada comanda registra la marca temporal created_at, alertando con cambio de color conforme transcurre el tiempo de espera.');
  addBullet('¿Puedo unir mesas de diferentes zonas?', 'Técnicamente el sistema lo permite mediante la selección global, aunque operacionalmente se aconseja agrupar mesas del mismo entorno para mantener la coherencia en cocina.');
  addBullet('¿Una mesa hija puede tener su propio ticket independiente?', 'No mientras esté vinculada; su propósito es consolidar el consumo en un único grupo. Si una persona del grupo desea abonar únicamente su parte, el camarero debe utilizar "Dividir Cuenta" en el TPV.');

  // Page Numbers Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} — GastroPOS Suite | Documentación Oficial para Administradores`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, 'manual_plano_de_mesas.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`PDF successfully generated at: ${pdfPath} (${pdfBuffer.length} bytes, ${totalPages} pages)`);
}

generateManualPDF().catch(err => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});
