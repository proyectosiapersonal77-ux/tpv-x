import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Search, 
  X, 
  Printer, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  Sparkles,
  Clock,
  FileCheck,
  Loader2
} from 'lucide-react';

type DocTab = 'admin' | 'usuario';

interface ManualDoc {
  id: string;
  title: string;
  subtitle: string;
  category: 'admin' | 'usuario';
  version: string;
  pages: number;
  pdfUrl: string;
  filename: string;
  date: string;
  badge: string;
  summary: string;
  topics: string[];
  fullContentMarkdown: string;
}

const ADMIN_MANUAL_CONTENT = `# Manual del Administrador: Módulo Plano de Mesas
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Ingeniería de Software*
*Destinatario: Administradores de Sistema, Gerentes de Operaciones y Responsables de Sala*

---

## 1. Arquitectura y Filosofía del Sistema (Offline-First y Reactividad)
El módulo Plano de Mesas de GastroPOS está diseñado bajo el paradigma "Offline-First con Reactividad en Tiempo Real". A diferencia de los sistemas tradicionales basados en peticiones síncronas que se bloquean ante una pérdida de cobertura Wi-Fi, GastroPOS opera con una base de datos local embebida en el terminal cliente (Dexie/IndexedDB) sincronizada bidireccionalmente con Supabase (PostgreSQL).

• **Persistencia Local Inmediata:** Cualquier acción de apertura, cierre, unión o modificación de mesa se consolida en menos de 5ms en la memoria del dispositivo.
• **Canales de Suscripción en Tiempo Real:** Mediante WebSockets (Supabase Realtime Channel: table_plan_updates), todos los terminales de sala, la comanda móvil del camarero y la pantalla de cocina (KDS) reciben las transiciones de estado de forma instantánea sin necesidad de recargar la página.
• **Cola de Sincronización Resiliente (SyncQueue):** Si la conexión a Internet o el punto de acceso cae temporalmente, el personal puede continuar operando mesas y pedidos con total normalidad; en cuanto se restablece la conectividad, las mutaciones se transmiten de forma ordenada al servidor sin colisiones.

---

## 2. Topología de Sala: Zonas y Ambientes
El restaurante estructura la planta física en "Zonas" lógicas configurables desde el panel de administración. Esto permite segmentar el local según el tipo de servicio, la tarifa aplicable o el personal asignado.

### Detección Semántica Inteligente de Iconos:
• **Zonas Interiores ("Salón", "Comedor", "Interior"):** Identificadas con el icono de Sillón (Armchair). Representan el área estándar con servicio de mesa formal.
• **Zonas Exteriores ("Terraza", "Patio", "Jardín"):** Identificadas con el icono de Sol (Sun). Diseñadas para áreas al aire libre que pueden tener suplementos o dinámicas de servicio estacionales.
• **Zonas Rápidas ("Barra", "Taberna"):** Identificadas con el icono de Jarra (Beer). Orientadas a pedidos ágiles y rotación rápida.
• **Otras Zonas ("Reservado", "Planta 1", "Piscina"):** Identificadas con icono de Cuadrícula (LayoutGrid).

Cada pestaña de zona incorpora además un contador dinámico que refleja en tiempo real el número total de mesas activas que contiene.

---

## 3. Ciclo de Vida y Estados Visuales de una Mesa
• **Mesa Libre (Disponible):** Fondo neutro oscuro (brand-800), micro-LED verde brillante superior derecho, texto "LIBRE" en verde esmeralda y borde con efecto de elevación.
• **Mesa Ocupada (Con Pedido Abierto):** Fondo con sutil matiz carmesí (bg-red-900/20), borde rojo de alerta (border-red-500/50), micro-LED rojo pulsante e IMPORTE ACUMULADO en euros (€) destacado en tipografía monoespaciada para control visual del consumo.
• **Mesa Vinculada / Hija (Agrupada):** Fondo atenuado con borde discontinuo (dashed gray), icono de eslabón (Link) en la base de la tarjeta y mención explícita a la mesa matriz (ej. "🔗 M1").
• **Mesa en Modo Selección (Unión):** Borde resaltado con el color de acento de marca, reducción sutil de escala (scale-95) y marca de verificación activa (Checkmark).

---

## 4. Operativa de Sala: Apertura y Gestión
• **1. Toque simple sobre Mesa Libre:** El sistema crea o inicializa la sesión de pedido en el TPV y transfiere al camarero inmediatamente a la pantalla de selección de productos y categorías.
• **2. Toque simple sobre Mesa Ocupada:** Carga al instante el pedido en curso con todos sus platos, cantidades, estados en cocina (pendiente, preparando, listo, servido) y opciones de cobro o adición.
• **3. Toque sobre Mesa Hija (Vinculada):** Redirige automáticamente a la comanda de la Mesa Maestra, asegurando que nunca se abran cuentas paralelas o huérfanas en mesas que físicamente están compartiendo el mismo servicio.

---

## 5. Agrupación y Unión de Mesas (Banquetes y Grupos)
GastroPOS resuelve este problema mediante un mecanismo nativo de enlace relacional (Parent-Child Topology).

### Procedimiento de Unión Paso a Paso:
• **Paso 1 (Activación del Modo Unión):** Mantenga pulsada durante 600 milisegundos cualquier mesa que forme parte de la unión. El terminal emitirá una respuesta háptica de vibración (50ms) y desplegará la barra de herramientas superior dorada "Modo Unir Mesas".
• **Paso 2 (Selección de Mesas Adicionales):** Toque secuencialmente el resto de mesas que se van a juntar. Quedarán marcadas visualmente con un tic y el contador superior se actualizará.
• **Paso 3 (Confirmación y Fusión):** Pulse el botón "Unir". Se abrirá una ventana modal de confirmación indicando qué mesa actuará como matriz y cuántas quedarán supeditadas a ella.
• **Inteligencia en la Elección de Mesa Matriz:** Si alguna de las mesas seleccionadas ya tenía un pedido abierto con consumiciones previas, el algoritmo la designa automáticamente como Mesa Maestra. Si dos o más tenían pedidos, sus consumiciones se fusionan íntegramente en la comanda principal con total trazabilidad histórica.

---

## 6. Separación y Desunión de Mesas Agrupadas
• **Procedimiento:** Mantenga pulsada durante 600ms la mesa secundaria (hija) que desea desvincular. El sistema reconocerá su estado enlazado y abrirá directamente el modal "Desunir Mesa".
• **Resultado Inmediato:** La mesa desvinculada recupera su estado libre e independiente en el plano, lista para recibir a nuevos clientes.
• **Destino de los Consumos Anteriores:** Los artículos facturados o pedidos previamente se mantienen a buen recaudo en la cuenta de la Mesa Maestra para no provocar descuadres ni pérdidas de cobro. Si los comensales desean repartir o separar el pago, se utiliza la función "Dividir Cuenta" en el TPV.

---

## 7. Traspaso y Fusión de Comandas entre Mesas (Cambio de Ubicación)
• **1. Desde el TPV:** Acceda a la mesa de origen donde se encuentra la comanda activa y pulse el botón "Mover Mesa" (icono de doble flecha contrapuesta).
• **2. Selector de Destino:** Se abrirá un selector modal con pestañas de zonas. Seleccione la zona y la mesa de destino.
• **3. Caso Mesa Destino Libre:** El sistema reasigna el identificador table_id de la comanda a la nueva mesa. La mesa de origen queda automáticamente libre y la de destino pasa a estar ocupada con el pedido intacto.
• **4. Caso Mesa Destino Ocupada (Fusión de Clientes):** Si dos grupos de amigos se unen en una mesa que ya tenía consumiciones, el sistema invoca mergeOrders(), combinando ambas listas de platos, notas y subtotales en una única cuenta unificada.

---

## 8. Panel Administrativo: Configuración Estructural
El diseño y modificación de la distribución del restaurante se gestiona desde el menú Configuración > Mesas y Zonas (TableManagement.tsx).
• **Crear Nueva Zona:** Pulse "Gestionar Zonas" > escriba el nombre (ej. "Terraza Cubierta") y guarde. Aparecerá de inmediato en la barra superior de todo el sistema.
• **Crear Nueva Mesa:** Pulse el botón "+" (Añadir Mesa). Introduzca el nombre identificador (recomendado: M1, M2... o T1, T2 para terrazas) y vincúlela a su zona correspondiente.
• **Editar o Renombrar:** Haga clic en el icono de edición sobre cualquier mesa en la tabla administrativa para cambiar su nombre o reubicarla de zona.
• **Activar / Desactivar Mesas:** Permite ocultar mesas fuera de temporada (ej. mesas de terraza en invierno) sin borrar sus historiales de venta pasados.
• **Eliminar Zonas / Mesas:** El sistema incluye protección de integridad referencial. Se solicitará confirmación explícita para evitar borrados accidentales durante la jornada.

---

## 9. Protocolos de Seguridad, Auditoría y Conectividad
• **Audit Trail (Registro Inmutable):** Cada cierre de mesa, cobro, anulación o unión genera un registro con firma criptográfica SHA-256 e ID del empleado actuante, accesible en la tabla audit_logs.
• **Control de Acceso Basado en Roles (RBAC):** Los camareros estándar solo pueden visualizar, abrir y unir mesas. La anulación de pedidos de mesa o la modificación estructural de zonas requiere credenciales de Administrador o Encargado.
• **Sincronización en Cascada:** Si un terminal se apaga bruscamente o se agota su batería, ningún dato se pierde. El estado de las mesas permanece intacto en los demás dispositivos y en la nube.

---

## 10. Preguntas Frecuentes y Resolución de Incidencias
• **¿Qué ocurre si dos camareros intentan abrir la misma mesa al mismo tiempo?** El motor de base de datos local y la suscripción WebSocket resuelven la concurrencia: el primer pedido confirmado bloquea la mesa como ocupada y el segundo camarero visualiza el pedido ya abierto en menos de 100ms.
• **¿Cómo saber el tiempo que lleva una mesa ocupada?** En el KDS de cocina y en el panel TPV, cada comanda registra la marca temporal created_at, alertando con cambio de color conforme transcurre el tiempo de espera.
• **¿Puedo unir mesas de diferentes zonas?** Técnicamente el sistema lo permite mediante la selección global, aunque operacionalmente se aconseja agrupar mesas del mismo entorno para mantener la coherencia en cocina.
• **¿Una mesa hija puede tener su propio ticket independiente?** No mientras esté vinculada; su propósito es consolidar el consumo en un único grupo. Si una persona del grupo desea abonar únicamente su parte, el camarero debe utilizar "Dividir Cuenta" en el TPV.`;

const KITCHEN_ADMIN_MANUAL_CONTENT = `# Manual de Administración y Arquitectura: Módulo Cocina (KDS)
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Ingeniería de Software*
*Destinatario: Administradores del Sistema, Gerentes de F&B y Jefes de Cocina*

---

## 1. Arquitectura y Reactividad en Tiempo Real
El módulo de Cocina (Kitchen Display System - KDS) reemplaza los tickets térmicos físicos por una interfaz digital táctil y reactiva que sincroniza los pedidos de toda la sala sin retardos.

• **Suscripciones WebSocket (Supabase Realtime):** El KDS escucha continuamente el canal kitchen-orders ante eventos de inserción o modificación en orders y order_items (postgres_changes). La latencia entre el envío desde el TPV y la recepción en cocina es inferior a 200 ms.
• **Integración Local-First (getKitchenOrders):** El sistema combina las órdenes de la base de datos local embebida (Dexie / IndexedDB) con las del servidor remoto, permitiendo que la cocina continúe operando con normalidad incluso durante microcortes del router o del enlace de fibra óptica.
• **Resolución Automática de Mesas:** El componente enriquece cada orden con el nombre descriptivo de la mesa (ej. "Mesa 4", "Terraza 1"), facilitando la identificación visual inmediata.

---

## 2. Topología de Estaciones y Enrutamiento Inteligente
Para optimizar el flujo de trabajo según la partida física del restaurante, la cabecera del KDS dispone de un selector de estaciones:

• **TODO (General):** Muestra todas las comandas y partidas simultáneamente. Diseñado para la pantalla del Jefe de Pase o Encargado de Sala.
• **COCINA (Naranja):** Filtra dinámicamente la carta excluyendo las bebidas. Solo presenta platos de cocina caliente, cuarto frío y postres.
• **BARRA (Azul):** Filtra exclusivamente los productos clasificados bajo la categoría "Bebidas" (cafés, cervezas, vinos, cócteles y refrescos).

---

## 3. Algoritmo de Priorización FIFO y Tiempos de Espera
Las comandas se organizan en columnas de izquierda a derecha siguiendo una estricta cola FIFO (First-In, First-Out):

• **Cálculo por Plato Activo Más Antiguo (oldestItemTime):** En lugar de tomar la hora de inicio de la mesa (que pudo abrirse hace horas), el algoritmo calcula la espera a partir del created_at del artículo activo más antiguo que sigue pendiente de entrega.
• **Reorganización Dinámica:** Las comandas con mayor tiempo de retraso se desplazan automáticamente hacia el margen izquierdo prioritario de la pantalla.

---

## 4. Semáforo SLA y Alertas Cromáticas en Tiempo Real
El encabezado de cada tarjeta cuenta con un sistema de semáforo visual visible desde varios metros de distancia:

• **Verde Esmeralda (0 - 14 minutos):** Servicio en tiempo reglamentario. Ritmo de elaboración correcto.
• **Amarillo Ámbar (15 - 30 minutos):** Alerta de demora moderada. Los cocineros deben priorizar la marcha de este ticket frente a los verdes.
• **Rojo Carmesí Pulsante (> 30 minutos):** Alerta crítica con efecto de parpadeo (animate-pulse). Requiere atención inmediata del jefe de cocina.

---

## 5. Ciclo de Vida del Plato y Operativa Táctil
Dentro de cada comanda, los platos aparecen ordenados por familia gastronómica (Entrantes, Segundos, etc.):

• **Paso 1: Toque sobre plato pendiente:** Su estado avanza inmediatamente a "Listo" (ready). El fondo cambia a verde esmeralda suave (bg-green-500/20) con borde verde y marca de verificación (CheckCircle). Notifica a sala que el plato está emplatado.
• **Paso 2: Toque sobre plato listo:** El plato avanza a "Servido" (served) y se retira de la comanda activa.
• **Auto-Cierre del Ticket:** Cuando todos los platos de una orden han sido servidos, la comanda desaparece automáticamente de la pantalla KDS para despejar el espacio de trabajo.

---

## 6. Seguridad Alimentaria: Variantes, Notas y Alérgenos
• **Formatos y Puntos de Cocción:** Destacados en tipografía ámbar de alto contraste (ej. "Format: Media Ración", "Format: Ración").
• **Caja de Alerta de Alérgenos:** Toda indicación de alergias o intolerancias alimentarias (ej. "CELÍACO - SIN GLUTEN", "Alérgico al marisco") se encapsula en una caja roja de advertencia con icono de alerta para evitar cualquier contaminación cruzada.

---

## 7. Control de Acceso por Roles (RBAC)
• **Camareros (waiter):** Modo de Solo Lectura. Pueden acceder a la pantalla KDS para comprobar el estado de sus comandas pero los clics sobre los platos están deshabilitados para evitar despachos involuntarios.
• **Cocineros, Encargados y Administradores:** Control táctil total para cambiar estados, alternar estaciones y forzar sincronizaciones.

---

## 8. Preguntas Frecuentes y Resolución de Incidencias
• **¿Cómo forzar una actualización manual si hay microcortes?** Pulse el botón circular de refresco (RefreshCw) en la barra superior del KDS.
• **¿Qué hacer si un plato se marcó como servido por error?** El encargado puede reabrir o consultar el ticket histórico en cualquier momento desde el TPV central.`;

const CFD_ADMIN_MANUAL_CONTENT = `# Manual de Administración y Arquitectura: Visor de Cliente (CFD)
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Ingeniería de Software*
*Destinatario: Administradores del Sistema, Gerentes de Operaciones y Responsables TPV*

---

## 1. Topología de Red y Arquitectura de Sincronización
El Visor de Cliente (Customer Facing Display - CFD) opera mediante una doble capa de sincronización que combina eventos broadcast de ultrabaja latencia con suscripciones de persistencia:

• **Canal Broadcast en Tiempo Real (cfd-sync-\${tableId}):** A diferencia de sistemas que requieren guardar el pedido en base de datos para mostrarlo en el visor, GastroPOS Suite transmite el estado del carrito en memoria a través de WebSockets. Cada vez que el camarero añade un producto, altera cantidades o aplica notas en el TPV, el evento SYNC_ORDER envía de inmediato la combinación de comanda y carrito al visor con latencia inferior a 50 ms.
• **Protocolo de Handshake (PING / PONG):** El TPV envía periódicamente señales PING por el canal. Si el CFD está activo en otra pantalla o tablet, responde con CFD_STATUS ('OPENED' o 'PONG'), iluminando el icono de monitor en el TPV en color activo. Al cerrarse la pestaña, el evento beforeunload emite CFD_STATUS ('CLOSED').
• **Suscripción de Respaldo a Base de Datos:** En caso de corte momentáneo del canal broadcast, el CFD escucha mutaciones en orders y order_items mediante postgres_changes en Supabase.

---

## 2. Opciones de Despliegue Físico de Hardware
El módulo admite tres arquitecturas de montaje según la configuración del mostrador:

• **Doble Monitor TPV (Escritorio Extendido):** Monitor secundario HDMI o USB-C orientado al cliente. Se lanza pulsando el icono Monitor en el TPV, abriendo una ventana emergente de 800x600 px (pulsar F11 para pantalla completa).
• **Tablet Inalámbrica en Peana:** iPad o tablet Android en soporte de mostrador sobre peana giratoria conectada a la Wi-Fi del local, cargando la URL /?view=cfd&tableId=<UUID_MESA>.
• **Modo Terminal Kiosco:** Acceso desde el menú principal o Dashboard > "Pantalla CFD" con selector táctil para vincular cualquier mesa o barra.

---

## 3. Composición Visual de la Pantalla CFD
La interfaz está dividida en dos paneles de alto contraste optimizados para lectura a media distancia (1 a 3 metros):

• **Panel Izquierdo (Desglose del Pedido):** Logotipo personalizado de marca blanca (brandLogo), nombre de la mesa o barra, badge de cantidad destacado (1x, 2x), nombre del plato, variantes, notas de alérgenos e importe desglosado en euros.
• **Panel Derecho (Total a Pagar y QR Dinámico):** Cifra total en tipografía gigante de 60px visible antes de cobrar. Código QR dinámico generado con qrcode.react (Nivel H) para pago móvil (Apple Pay, Google Pay, Bizum) o propinas digitales.
• **Mensajes de Cortesía:** Animación elegante cuando la cuenta está vacía ("Esperando artículos...") y pie de agradecimiento ("¡Gracias por tu visita!").

---

## 4. Guía de Puesta en Marcha Paso a Paso
1. En el TPV, abra la comanda de la barra o mesa en la pantalla POS.
2. En la barra superior derecha de la orden, pulse sobre el botón con icono de pantalla Monitor.
3. El sistema abrirá automáticamente una ventana pop-up configurada a 800x600 px apuntando a /?view=cfd&tableId=<UUID_MESA>.
4. Arrastre esa ventana al monitor secundario encarado al cliente y presione F11 para activar la vista a pantalla completa.
5. Verifique que el icono de pantalla en el TPV cambia a color activo y compruebe que al marcar un producto aparece en el visor.

---

## 5. Seguridad, Privacidad RGPD y Preguntas Frecuentes
• **¿Por qué no aparece el código QR?** El código QR se oculta automáticamente cuando el total acumulado es 0.00 € para evitar lecturas accidentales antes de registrar productos.
• **Aislamiento de Datos Confidenciales:** El visor no proyecta datos fiscales de otros clientes, nombres de camareros, contraseñas ni resúmenes de facturación de caja. Cumple estrictamente con la normativa de privacidad y RGPD.
• **Reconexión:** Si el visor muestra "Esperando artículos..." existiendo productos en el TPV, pulse el icono de monitor en la cabecera del CFD para volver a asociar la mesa o recargue la página (F5).`;

const INVENTORY_ADMIN_MANUAL_CONTENT = `# Manual de Administración y Arquitectura: Módulo de Inventario y Carta
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Ingeniería de Software y Gestión de Operaciones F&B*
*Destinatario: Administradores de Sistema, Gerentes de F&B, Jefes de Cocina y Responsables de Almacén*

---

## 1. Arquitectura General y Topología de Datos Híbrida
El módulo de Inventario y Carta es el núcleo logístico, operativo y financiero de GastroPOS Suite. Centraliza la definición del catálogo gastronómico, el control de existencias físicas, la gestión de compras y albaranes, la ingeniería de escandallos con rendimiento (Yield Management) y la trazabilidad de mermas y auditoría.

• **Persistencia Local Ultrarrápida (Dexie IndexedDB):** Catálogo, materias primas y relaciones se gestionan sobre tablas locales de alta velocidad (db.products, db.categories, db.subcategories, db.suppliers, db.allergens, db.units, db.waste_reasons, db.promotions, db.stock_movements), garantizando tiempos de respuesta inferiores a 5 ms sin latencia de red.
• **Sincronización en la Nube Asíncrona (Supabase):** Las modificaciones se encolan mediante queueChange() hacia tablas de PostgreSQL, garantizando consistencia y resiliencia ante caídas de conexión.
• **Protección de Demostración (Tour Mode):** Las operaciones críticas de modificación de recetas, compras y borrado están custodiadas por applyTourRestriction() para preservar la integridad de la base de datos.

---

## 2. Desglose Exhaustivo de Pestañas e Iconografía
La cabecera de pestañas permite alternar entre las 9 dimensiones del catálogo. Cada icono representa un submódulo funcional especializado:

• **Package — Productos y Platos (products):** Maestro de referencias de venta al público (PVP), bebidas, materias primas y recetas compuestas.
• **Tag — Categorías (categories):** Familias gastronómicas principales (Entrantes, Carnes, Pescados, Bebidas, Postres), con asignación de estación KDS.
• **GitFork — Subcategorías (subcategories):** Clasificación secundaria jerárquica vinculada a una categoría padre (ej. Refrescos dentro de Bebidas).
• **Truck — Proveedores (suppliers):** Fichero de empresas mayoristas y distribuidores con contactos comerciales y teléfonos.
• **Scroll — Pedidos de Compra (purchase_orders):** Gestor de órdenes de reposición emitidas a distribuidores, generadas manual o automáticamente por stock mínimo.
• **Wheat — Alérgenos (allergens):** Catálogo de los 14 alérgenos alimentarios de declaración obligatoria según el Reglamento Europeo UE 1169/2011.
• **Scale — Unidades de Medida (units):** Definición de magnitudes base (kg, g, l, ml, unidad, ración, caja) con abreviaturas unificadas.
• **Ban — Tipos de Merma (waste_reasons):** Motivos estandarizados de pérdida de stock (Caducidad, Rotura, Plato defectuoso, Muestra comercial).
• **Percent — Promociones (promotions):** Reglas de descuento programado por horario (Happy Hour), días de semana y categorías seleccionadas.

---

## 3. Barra Superior de Herramientas y Acciones Globales
En el margen superior derecho se ubican las herramientas de procesamiento masivo y abastecimiento:

• **Download — Exportar CSV:** Genera y descarga un archivo delimitado por comas con 13 columnas completas (Nombre, Categoria, Subcategoria, Proveedor, Coste, PVP, Stock, Minimo, IVA, Unidad, Codigo de Barras, Compuesto, Activo) para análisis en Excel o ERPs contables.
• **Upload / Loader2 — Importar CSV Masivo:** Carga por lotes con soporte multiformato (13 columnas actuales y 8 columnas heredadas) y barra de progreso animada.
• **Search — Buscador Dinámico:** Filtrado reactivo en tiempo real que inspecciona simultáneamente nombre de producto, categoría, proveedor y código de barras.
• **FolderInput — Recibir Albarán:** Panel de entrada rápida de mercancías con recálculo automático del Precio Medio Ponderado (PMP).
• **Plus — Nuevo Registro:** Botón de acción rápida en color acento que abre el modal correspondiente a la pestaña activa.

### Fórmula Oficial del Precio Medio Ponderado (PMP):
Al recibir mercancía mediante FolderInput, el sistema aplica la fórmula contable:
PMP = [(Stock_Actual * Coste_Actual) + (Cantidad_Entrante * Precio_Compra)] / [Stock_Actual + Cantidad_Entrante]
De esta forma, el escandallo refleja fielmente el coste de reposición real del restaurante.

---

## 4. Tabla Virtualizada de Productos y Edición Rápida
La visualización de productos emplea react-window para soportar catálogos extensos de miles de referencias sin ralentizaciones:

• **CheckSquare / Square — Selección por Lotes:** Permite seleccionar uno o todos los productos para verificar auditorías o exportaciones selectivas.
• **Edición In-Place en Celda:** Permite alterar directamente Coste, PVP Venta y Stock Actual pulsando sobre la cifra. Se confirma con tecla Enter y se cancela con Escape.
• **Semaforización de Stock:** Verde (óptimo), Naranja con AlertTriangle (alerta de stock mínimo alcanzado) y Rojo (agotado en almacén).
• **Interruptor Activo (TPV):** Casilla rápida para activar u ocultar un plato de la botonera del camarero sin eliminar su histórico contable ni recetas.

---

## 5. Menú Contextual de Fila (Acciones por Producto)
Al pulsar sobre el selector de opciones de cualquier producto, se despliega el menú flotante con 5 herramientas:

• **Barcode — Imprimir Etiqueta:** Genera código de barras Code128 / EAN y precio en formato térmico con estilos de impresión rápida para adhesivos de 50x30 mm.
• **TrendingDown — Registrar Merma:** Abre el formulario para asentar pérdidas especificando motivo tipificado y deduciendo stock de forma justificada en stock_movements.
• **History — Historial de Movimientos:** Auditoría cronológica con fecha, empleado, motivo (Venta, Albarán, Merma, Ajuste), variación y saldo final resultante.
• **Edit2 — Editar Ficha Completa:** Abre el formulario maestro con acceso a foto, escandallo, modificadores y variantes.
• **Trash2 — Eliminar con Doble Validación:** Aplica salvaguardas legales que impiden borrar productos con ventas históricas o presentes en recetas activas.

### Inmutabilidad Fiscal y Ley Antifraude:
Si un plato ha sido cobrado en tickets históricos, GastroPOS Suite bloquea su borrado físico (foreignKeyViolation). El sistema ofrece la alternativa segura de "Desactivar / Archivar", preservando la trazabilidad exigida por la Agencia Tributaria.

---

## 6. Formulario Maestro, Escandallos (Yield Management) y KDS
El modal de edición permite configurar todos los parámetros gastronómicos y de producción:

• **Compresión Inteligente de Foto:** El motor fileToOptimizedBase64 reescala y optimiza imágenes a 600px en memoria mediante Canvas, reduciendo peso sin perder definición.
• **Escandallo con Rendimiento (Utensils):** En productos compuestos, permite asociar materias primas con su Factor de Rendimiento (%). Coste = (Coste_Unitario * Cantidad) / (Rendimiento_% / 100). El coste del plato se recalcula automáticamente sumando todos los ingredientes.
• **Descuento Automático en Venta TPV:** Al cobrar un plato en sala, deductProductStock() descuenta proporcionalmente los gramos de cada ingrediente del almacén en cascada.
• **Variantes y Formatos (Layers):** Soporte para múltiples presentaciones (ej. Caña, Pinta, Copa, Botella) con PVP, coste y stock independientes.
• **Modificadores y Notas de Cocina:** Opciones de comanda (Punto de carne, Salsas) con selección obligatoria/múltiple, suplemento de precio y descuento de stock vinculado.
• **Enrutamiento KDS por Categoría:** Asignación directa de familias de platos hacia pantalla de Cocina (kitchen), Barra (bar) o Sin Envío (none).

---

## 7. Automatización de Compras y Promociones
• **Órdenes de Compra Automáticas:** Al cruzar el umbral stock_min, checkAndGeneratePurchaseOrder() genera una orden borrador con el proveedor asignado.
• **Motor de Promociones Temporales:** Permite configurar Happy Hours por franjas horarias y días de la semana con descuentos automáticos en comanda.`;

const MENU_ENGINEERING_ADMIN_MANUAL_CONTENT = `# Manual de Administración y Arquitectura: Módulo de Ingeniería de Menú
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Operaciones F&B e Inteligencia Financiera*
*Destinatario: Gerentes de Restaurante, Chefs Ejecutivos, Controllers y Administradores*

---

## 1. Fundamentos y Objetivos del Módulo
El módulo de **Ingeniería de Menú** de GastroPOS Suite constituye la herramienta estratégica de mayor impacto económico para el negocio hostelero. Su objetivo prioritario es maximizar el beneficio bruto de la carta sin perjudicar el volumen de clientela, combinando:

1. **Datos de Venta Reales:** Lectura directa de las transacciones cerradas y tickets cobrados en el TPV (tablas orders y order_items en Dexie IndexedDB y Supabase).
2. **Costes de Escandallo Actualizados:** Integración de la ficha técnica de producto con su Precio Medio Ponderado (PMP) y Factor de Rendimiento (yield_percentage).
3. **Modelos de Clasificación BCG:** Segmentación automática de platos en 4 cuadrantes (Estrellas, Vacas Lecheras, Interrogantes y Perros).
4. **Inteligencia Artificial Estratégica (Google Gemini 3.8):** Generación de auditorías y diagnósticos ejecutivos accionables sobre la carta.

---

## 2. Los 4 Cuadrantes de la Matriz BCG (Kasavana & Smith)
La metodología de Ingeniería de Menú cruza dos variables cuantitativas clave:
• **Popularidad (Volumen de Unidades Vendidas):** Eje X.
• **Rentabilidad (Margen de Contribución Unitario en Euros):** Eje Y, donde Margen = PVP - Coste.

Los umbrales divisorios se fijan matemáticamente mediante la Media de Unidades Vendidas y la Media de Margen de Contribución del catálogo analizado:

• **⭐ Platos Estrella (Alta Popularidad + Alto Margen):** Son las joyas de tu restaurante. Los clientes los adoran y generan el mayor beneficio neto. Estrategia: mantener inalterada la receta y calidad de los ingredientes; garantizar un lugar destacado en el diseño visual de la carta.
• **🐄 Vacas Lecheras (Alta Popularidad + Bajo Margen):** Platos insignia o clásicos de la casa muy demandados por el público pero con coste elevado o precio de venta demasiado contenido. Estrategia: subir ligeramente el PVP (+0,20 € a +0,50 €), reducir gramajes o renegociar el precio de compra con los proveedores.
• **❓ Interrogantes / Puzles (Baja Popularidad + Alto Margen):** Platos sumamente rentables pero que el cliente pide con poca frecuencia. Estrategia: incrementar su visibilidad en sala mediante pizarras de sugerencias del día, entrenar al personal de camareros para que los recomienden al tomar comanda, o revisar el naming y descripción del plato.
• **🐕 Perros (Baja Popularidad + Bajo Margen):** Platos que se venden poco y además aportan un margen escaso, inmovilizando stock y generando mermas de almacén. Estrategia: reformular la receta para abaratar costes o sustituirlos definitivamente en la próxima renovación de carta.

---

## 3. Desglose de las 4 Vistas Especializadas

### Pestaña 1: Matriz BCG & Gráfica de Dispersión
• **Tarjetas KPI por Cuadrante:** Conteo de productos clasificados y suma total del beneficio generado por cada grupo.
• **Gráfica Interactiva Scatter (Recharts):** Dispersión bidimensional de puntos de colores según el cuadrante, con líneas de corte en las medias y tooltips enriquecidos con datos de ventas y food cost.
• **Tabla Detallada con Filtros:** Búsqueda por nombre de producto, selector de familia y ventana temporal (Últimos 7 días, 30 días, 90 días o Histórico completo).

### Pestaña 2: Análisis de Food Cost (Recetas Compuestas)
• **Semáforo Financiero de Escandallo:**
  - Verde (< 28%): Coste de materia prima bajo control y margen óptimo.
  - Naranja (28% - 35%): Margen ajustado; requiere monitorización ante subidas de precios de materias primas.
  - Rojo (> 35%): Alerta financiera; el coste de ingredientes absorbe un porcentaje excesivo del precio final.

### Pestaña 3: Cálculo Automático y Ajuste Masivo de PVP
• **Fórmula de Fijación de Precios:** PVP Sugerido = Coste / (1 - Margen Objetivo / 100).
• **Selector de Margen (%) y Familia:** Permite recalcular instantáneamente cartas enteras o familias específicas (ej. fijar 75% en Vinos o 70% en Carnes).
• **Redondeo Comercial Amigable:** Redondea automáticamente al múltiplo de 0,10 € superior para agilizar los cobros en efectivo en sala.
• **Confirmación Segura:** Modal de confirmación con recuento de productos afectados antes de aplicar cambios a la base de datos.

### Pestaña 4: Simulador What-If (Escenarios de Rentabilidad)
• **Sliders Táctiles Dinámicos:** Permiten experimentar variaciones hipotéticas de PVP (+/- 0,10 €) o coste (+/- 0,05 €).
• **KPIs Predictivos en Tiempo Real:** Variación del margen unitario, nuevo Food Cost resultante y proyección de beneficio total en base a las ventas históricas.
• **Botón de Guardado Selectivo:** Guarda el precio únicamente cuando el encargado aprueba la simulación.

---

## 4. Consultor e Informes Estratégicos con IA (Gemini 3.8)
Al pulsar el botón superior "Generar Informe Estratégico IA", GastroPOS Suite empaqueta los datos agregados de coste, PVP, unidades vendidas y clasificación BCG y realiza una llamada segura a Google Gemini 3.8:
• Identifica desequilibrios críticos en la carta.
• Sugiere platos candidatos a subida de precio inmediata.
• Propone técnicas de neuromarketing (orden de lectura, anclaje de precios y platos señuelo).
• Entrega un informe formal estructurado en Markdown con recomendaciones accionables.`;

const CASH_ADMIN_MANUAL_CONTENT = `# Manual del Administrador y Operativa: Módulo Gestión de Caja
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Operaciones & Arquitectura de Software*
*Destinatarios: Gerencia, Dirección Financiera, Jefes de Sala y Personal de Caja*

---

## 1. Introducción y Marco Legal
El módulo de **Gestión de Caja** de GastroPOS Suite constituye el pilar operativo y contable responsable de la custodia, trazabilidad y cuadre de todos los flujos monetarios originados en el establecimiento hostelero.

En el marco de la **Ley Antifraude 11/2021** y los reglamentos de facturación electrónica (**VeriFactu / TicketBAI**), la gestión del efectivo garantiza la inmutabilidad de cada transacción, el control estricto de accesos mediante RBAC (Control de Acceso Basado en Roles) y la emisión auditada de los informes de cierre ciego (**Arqueo Parcial / Informe X**) y cierre definitivo (**Informe Z**).

---

## 2. Arquitectura de Datos y Ciclo de Vida de Caja
El motor de caja opera bajo una máquina de estados finitos estricta gestionada en la base de datos distribuida (IndexedDB local y Supabase PostgreSQL en la nube):

• **CashRegister:** Registro de sesión o turno de caja con identificador UUIDv4, fecha de apertura (opened_at), fecha de cierre (closed_at), responsable de apertura (opened_by), responsable de cierre (closed_by), fondo inicial (opening_balance), efectivo contado (closing_balance), saldo teórico (expected_balance), estado (open | closed) y notas de justificación.
• **CashMovement:** Movimientos extraordinarios de efectivo vinculados a la caja activa, categorizados en entrada (in) o salida (out), con importe, motivo auditado obligatorio y firma digital del empleado.
• **Sincronización Resiliente:** En caso de corte de red, las operaciones se consolidan localmente en Dexie.js y se replican al servidor mediante la cola de sincronización (SyncQueue).

---

## 3. Algoritmo Financiero de Saldo Esperado y Descuadre
Durante el servicio en vivo, GastroPOS calcula en tiempo real el **Total Esperado** en cajón mediante la siguiente fórmula estandarizada:

> **Saldo Esperado = Fondo Inicial + Total Entradas Manuales - Total Salidas Manuales + Ventas TPV en Efectivo**

Donde las ventas en efectivo se computan exclusivamente para las órdenes con estado 'paid' y método 'cash' cerradas dentro del intervalo de apertura del turno.

### Cálculo de la Desviación (Descuadre):
> **Descuadre = Efectivo Real Recontado - Saldo Esperado**

• **Descuadre Positivo (> 0):** Sobrante de caja (dinero en exceso respecto a los tickets cobrados).
• **Descuadre Cero (= 0):** Cuadre exacto (concordancia contable perfecta).
• **Descuadre Negativo (< 0):** Faltante de caja (pérdida o error de cambio).

---

## 4. Desglose de Funciones, Pantallas y Controles
• **Cabecera y Monitor de Estado:** Indicador visual de estado en alto contraste (Verde = CAJA ABIERTA, Rojo = CAJA CERRADA).
• **Apertura de Cajón Remota (Printer):** Acciona el electroimán de la gaveta conectada a la impresora ESC/POS vía Web Bluetooth mediante la secuencia ESC p 0 25 250 (disponible para roles autorizados can_open_drawer).
• **Formulario de Apertura:** Solicitud del fondo de caja inicial al comenzar la jornada antes de permitir cobros en metálico en el TPV.
• **Movimientos Manuales:** Registro tipificado de entradas de cambio y salidas de gastos de caja chica con validación obligatoria de motivo e importe.
• **Arqueo y Cierre de Caja (Cierre Z):** Conteo físico ciego del efectivo real en cajón, cálculo automático de diferencias, modal de confirmación forzada ante descuadres y sellado inmutable del turno.
• **Tarjetas KPI en Tiempo Real:** Visualización instantánea de Fondo Inicial, Ventas en Efectivo, Movimientos Netos y Total Esperado.
• **Historial Cronológico:** Monitor con desglose de movimientos y trazabilidad horaria.

---

## 5. Diferenciación Legal: Informe X vs. Informe Z
• **Arqueo Parcial (Informe X):** Consulta provisional durante el servicio. No cierra la caja ni reinicia contadores fiscales.
• **Cierre Diario (Informe Z):** Documento fiscal oficial y vinculante. Cierra definitivamente el turno, bloquea nuevos cobros en esa sesión, desglosa bases de IVA y sella el registro para inspección tributaria.

---

## 6. Seguridad y Permisos Granulares (RBAC)
• **can_open_drawer:** Apertura manual de la gaveta portamonedas.
• **can_manage_cash:** Inserción de movimientos manuales de caja chica.
• **can_close_register:** Ejecución del arqueo y cierre Z definitivo.
• **can_view_reports:** Consulta de saldos teóricos y descuadres contables.`;

const ANALYTICS_ADMIN_MANUAL_CONTENT = `# Manual del Administrador: Módulo Finanzas y Analítica
**GastroPOS Suite v2.1**
*Elaborado por: Dirección Financiera & Arquitectura de Software GastroPOS*
*Destinatarios: Gerencia, Dirección Contable, Controllers Financieros y Administradores de Sistema*

---

## 1. Introducción y Marco Estratégico
El módulo de **Finanzas y Analítica** consolida el motor de inteligencia de negocio (BI), control de rentabilidad operativa y liquidación tributaria de GastroPOS Suite:
• **Dashboard Financiero de Rendimiento Operativo:** Ventas totales, tickets emitidos, ticket medio, split efectivo/tarjeta y visualizadores interactivos por hora, categoría, camarero y zona.
• **Control de Rentabilidad & Cuenta P&L en Vivo:** Cruce automático del coste de escandallos con los precios netos cobrados en el TPV para calcular el Coste de Ventas (COGS), Beneficio Bruto y Margen Bruto (%).
• **Cierre Fiscal Diario Obligatorio (Informe Z):** Resumen diario legalmente vinculante, desglose de bases imponibles y cuotas de IVA (4%, 10%, 21%), conciliación del arqueo de caja con control de descuadre e impresión oficial.
• **Módulo Tributario e Impuestos (Modelo 347):** Liquidación trimestral (T1-T4) y anual de IVA Repercutido (Ventas) e IVA Soportado (Compras/Albaranes), auditoría de operaciones con terceros (> 3.005,06 €) y exportación limpia a CSV para asesorías fiscales.
• **Auditoría de Tickets y Ley Antifraude (VeriFactu / TicketBAI):** Trazabilidad de comandas del día y anulación justificada de facturas simplificadas con registro inmutable.

---

## 2. Arquitectura de Datos y Motor de Agregación
El motor analítico consulta reactivamente IndexedDB (Dexie.js) y Supabase para consolidar en memoria:
• **db.orders:** Facturas simplificadas pagadas y anuladas.
• **db.products:** Precios de coste de recetas/escandallos y tipos impositivos de IVA.
• **purchase_orders:** Albaranes y pedidos de compra recepcionados a proveedores para el cómputo del IVA deducible.

---

## 3. Cuenta de Pérdidas y Ganancias (P&L en Vivo)
• **Coste Total (COGS):** Sumatorio del coste de escandallo de todos los artículos vendidos en el día (incluyendo variantes y suplementos).
• **Beneficio Bruto:** Ventas Netas (sin IVA) - Coste Total de Ingredientes.
• **Margen Bruto (%):** (Beneficio Bruto / Ventas Netas) * 100. Permite supervisar en tiempo real si el negocio se mantiene en el margen objetivo (68% - 75%).

---

## 4. Segmentación Analítica con Recharts
• **Ventas por Hora:** Identifica la curva de demanda a lo largo de las 24 horas del día para optimizar la planificación de turnos de personal y pre-elaboraciones en cocina.
• **Ventas por Categoría:** Gráfico de donut con el reparto porcentual de facturación entre familias de platos.
• **Ventas por Camarero:** Gráfico de barras horizontal que refleja las ventas cerradas por cada miembro del equipo de sala.
• **Ventas por Zona:** Comparativa de rendimiento entre Salón, Terraza y Barra.

---

## 5. Cierre Fiscal Diario (Informe Z)
• **Resumen de Ventas:** Total facturado desglosado por medios de pago (efectivo, tarjeta, otros).
• **Desglose de IVA:** Cuadre formal de bases imponibles y cuotas impositivas por tramo (4%, 10%, 21%).
• **Cuadre de Efectivo:** Fondo Inicial + Ventas Efectivo + Entradas Manuales - Salidas Manuales = Saldo Esperado vs. Efectivo Real = Descuadre.
• **Impresión Optimizada:** Formateo nativo sin elementos superfluos para impresoras térmicas de 80mm o formato A4.

---

## 6. Módulo Tributario y Modelo 347 (TaxesReport.tsx)
• **Selectores Trimestrales:** Filtro por ejercicio y periodo (T1, T2, T3, T4, Anual) para la preparación del Modelo 303 y 390.
• **IVA Repercutido vs. Soportado:** Balance fiscal entre impuestos devengados en sala y deducibles en compras.
• **Modelo 347:** Identificación automática de proveedores que superan los 3.005,06 € anuales.
• **Exportación a CSV:** Generación instantánea de archivos compatibles con Excel, A3 y Sage.

---

## 7. Permisos de Seguridad (RBAC)
• **can_view_reports:** Visualización del Dashboard y gráficas.
• **can_close_register:** Emisión del Cierre Z oficial diario.
• **can_void_ticket:** Anulación justificada de tickets emitidos.
• **admin:** Acceso total a P&L, márgenes, costes de proveedores y datos fiscales.`;

const USER_MANUAL_CONTENT = `# Manual de Usuario y Operativa de Sala TPV
**GastroPOS Suite v2.1**
*Guía de Operaciones para Personal de Sala, Barra y Camareros*

---

## 1. Inicio de Sesión y Acceso con PIN
• Al abrir la aplicación, introduzca su código PIN personal de 4 dígitos.
• El sistema detecta automáticamente su puesto de trabajo (Camarero, Cocinero, Encargado o Administrador) y adapta los módulos visibles.

---

## 2. Toma de Pedidos: Mesas y Venta Directa
• **Toma en Mesa:** Ingrese a "Mesas", seleccione la zona (Salón, Terraza o Barra) y pulse sobre una mesa libre (verde).
• **Selección de Productos:** Navegue por las familias de platos situadas a la izquierda. Cada pulsación añadirá el plato a la comanda activa.
• **Venta Directa:** En la barra para clientes de paso, utilice la opción "Venta Directa" para añadir consumiciones y cobrar sin reservar una mesa.
• **Notas y Modificadores de Cocina:** Al pulsar sobre un plato en el ticket, puede especificar puntos de cocción (poco hecho, al punto), adición o retirada de ingredientes y advertencias de alérgenos con alta visibilidad.

---

## 3. Marcha de Platos y Comunicación con Cocina (KDS)
• Una vez completado el pedido, pulse "Enviar Comanda".
• Los platos se envían automáticamente a la pantalla de cocina KDS o impresora de barra según su categoría.
• La mesa cambia a color rojo en el plano de mesas y comienza a mostrar el acumulado en euros.

---

## 4. Cobros, Pagos Mixtos y División de Cuentas
• **Cobro Completo:** Pulse "Cobrar". Seleccione Efectivo o Tarjeta. Al introducir las monedas o billetes recibidos, el TPV calculará el cambio a devolver.
• **Cobro Dividido por Comensales:** Si un grupo desea abonar su cuenta a partes iguales o por productos separados, pulse "Dividir Cuenta". El sistema desglosa los tickets individuales y calcula el saldo pendiente en tiempo real.

---

## 5. Preguntas Frecuentes de Servicio
• **¿Cómo anular un producto marcado por error?** Si la comanda aún no ha sido enviada a cocina, pulse el icono de papelera sobre el plato. Si ya fue procesada, solicite la anulación a un encargado.
• **¿Cómo cambiar a un cliente de mesa?** Pulse "Mover Mesa" en la comanda activa y seleccione la nueva ubicación.`;

const MANUALS: ManualDoc[] = [
  {
    id: 'admin_plano_mesas',
    title: 'Manual de Administración: Módulo Plano de Mesas',
    subtitle: 'Gestión de Zonas, Topología de Sala, Fusión, Traspaso y Operativa',
    category: 'admin',
    version: '2.1 Oficial',
    pages: 5,
    pdfUrl: '/manual_plano_de_mesas.pdf',
    filename: 'manual_plano_de_mesas.pdf',
    date: 'Septiembre 2026',
    badge: 'Arquitectura & Sala',
    summary: 'Documento técnico integral que detalla la arquitectura Offline-First con IndexedDB, sincronización WebSocket en tiempo real, ciclo de vida de mesas, motor de fusión y enlace padre-hijo, traspasos con merge de comandas y auditoría inmutable.',
    topics: [
      'Arquitectura Offline-First y Supabase Realtime',
      'Topología de Zonas y Detección Semántica de Iconos',
      'Ciclo de Vida y Microindicadores LED',
      'Procedimiento de Unión de Mesas (Long Press 600ms)',
      'Desunión y Conservación de Facturación Maestra',
      'Traspasos y Fusión de Cuentas (mergeOrders)',
      'Configuración Estructural (TableManagement)',
      'Cumplimiento Ley Antifraude y Audit Trail'
    ],
    fullContentMarkdown: ADMIN_MANUAL_CONTENT
  },
  {
    id: 'admin_modulo_cocina',
    title: 'Manual de Administración: Módulo Cocina (KDS)',
    subtitle: 'Kitchen Display System, Tiempos de Espera, Enrutamiento & Alertas SLA',
    category: 'admin',
    version: '2.1 Oficial',
    pages: 4,
    pdfUrl: '/manual_modulo_cocina.pdf',
    filename: 'manual_modulo_cocina.pdf',
    date: 'Septiembre 2026',
    badge: 'Cocina & KDS',
    summary: 'Documentación exhaustiva sobre la arquitectura del sistema de pantallas de cocina (KDS): enrutamiento por estaciones (Cocina/Barra), semaforización cromática temporal, algoritmo FIFO por oldestItemTime, notas críticas de alérgenos y permisos RBAC.',
    topics: [
      'Arquitectura WebSockets Reactiva (Supabase Realtime)',
      'Enrutamiento Inteligente por Estación (Cocina vs. Barra)',
      'Algoritmo FIFO y Tiempo por Plato Activo (oldestItemTime)',
      'Semáforo de Tiempos SLA (Verde, Amarillo, Rojo Pulsante)',
      'Ciclo de Vida del Plato (pending, ready, served)',
      'Alertas Visuales de Alérgenos e Intolerancias',
      'Control de Acceso RBAC (Camarero solo lectura)',
      'Modo Offline y Resiliencia en Red Local (Dexie.js)'
    ],
    fullContentMarkdown: KITCHEN_ADMIN_MANUAL_CONTENT
  },
  {
    id: 'admin_visor_cliente',
    title: 'Manual de Administración: Visor de Cliente (CFD)',
    subtitle: 'Customer Facing Display, Sincronización Broadcast & Pagos QR',
    category: 'admin',
    version: '2.1 Oficial',
    pages: 4,
    pdfUrl: '/manual_visor_de_cliente.pdf',
    filename: 'manual_visor_de_cliente.pdf',
    date: 'Septiembre 2026',
    badge: 'Visor & Pantalla',
    summary: 'Arquitectura completa del Visor de Cliente (CFD): canal broadcast de ultrabaja latencia (cfd-sync), protocolo de handshake PING/PONG, despliegue en doble monitor HDMI o tablets en peana, marca blanca y código QR dinámico para pagos móviles.',
    topics: [
      'Canal Broadcast en Memoria (cfd-sync-${tableId})',
      'Handshake Bidireccional PING/PONG y Estado',
      'Despliegue Físico: Doble Monitor HDMI y Tablets',
      'Marca Blanca (brandLogo) y Nombre de Ubicación',
      'Desglose en Vivo de Artículos y Variantes',
      'Total a Pagar e Integración QR Dinámico (Nivel H)',
      'Seguridad y Cumplimiento Normativo (RGPD)',
      'Puesta en Marcha y Resolución de Incidencias'
    ],
    fullContentMarkdown: CFD_ADMIN_MANUAL_CONTENT
  },
  {
    id: 'admin_inventario_carta',
    title: 'Manual de Administración: Inventario y Carta',
    subtitle: 'Catálogo Maestro, Escandallos (Yield Management), Albaranes y Control de Stock',
    category: 'admin',
    version: '2.1 Oficial',
    pages: 5,
    pdfUrl: '/manual_inventario_y_carta.pdf',
    filename: 'manual_inventario_y_carta.pdf',
    date: 'Septiembre 2026',
    badge: 'Inventario & Escandallos',
    summary: 'Guía técnica y operativa integral del módulo más crítico de GastroPOS Suite: catálogo de productos simples y compuestos, escandallos con factor de rendimiento (%), recepción de albaranes con recálculo de PMP, mermas, órdenes automáticas, códigos de barras e inmutabilidad legal antifraude.',
    topics: [
      'Topología Híbrida Offline-First (Dexie IndexedDB & Supabase)',
      'Desglose de las 9 Pestañas e Iconografía Completa',
      'Exportación e Importación Masiva CSV (13 y 8 columnas)',
      'Recepción de Albaranes y Fórmula de Valoración PMP',
      'Tabla Virtualizada (react-window) y Edición In-Place',
      'Escandallos Avanzados y Factor de Rendimiento (Yield %)',
      'Descuento Automático en Cascada tras Venta TPV',
      'Etiquetas Barcode (Code128 / QR) y Registro de Mermas',
      'Enrutamiento KDS por Categoría (Cocina/Barra/Ninguna)',
      'Protección Ley Antifraude y Bloqueo por Claves Foráneas'
    ],
    fullContentMarkdown: INVENTORY_ADMIN_MANUAL_CONTENT
  },
  {
    id: 'admin_ingenieria_menu',
    title: 'Manual de Administración: Ingeniería de Menú',
    subtitle: 'Matriz BCG (Estrellas, Vacas, Interrogantes, Perros), Food Cost, Simulador What-If y Asesor IA',
    category: 'admin',
    version: '2.1 Oficial',
    pages: 4,
    pdfUrl: '/manual_ingenieria_menu.pdf',
    filename: 'manual_ingenieria_menu.pdf',
    date: 'Septiembre 2026',
    badge: 'Rentabilidad & Matriz BCG',
    summary: 'Guía metodológica y técnica del motor de optimización de rentabilidad de GastroPOS Suite: cruce de escandallos con ventas reales del TPV, clasificación en 4 cuadrantes BCG (Kasavana & Smith), semáforo de food cost, recálculo masivo de PVP con margen objetivo, simulador interactivo What-If y auditoría estratégica con Google Gemini 3.8.',
    topics: [
      'Fundamentos y Objetivos Estratégicos del Módulo',
      'Metodología Matriz BCG (Kasavana & Smith)',
      '⭐ Platos Estrella: Alta Popularidad + Alto Margen',
      '🐄 Vacas Lecheras: Alta Popularidad + Bajo Margen',
      '❓ Interrogantes: Baja Popularidad + Alto Margen',
      '🐕 Perros: Baja Popularidad + Bajo Margen',
      'Gráfica Interactiva de Dispersión (Recharts Scatter)',
      'Semáforo Financiero de Food Cost (<28%, 28-35%, >35%)',
      'Cálculo Masivo de PVP con Margen Objetivo y Redondeo Comercial',
      'Simulador Interactivo What-If con Sliders de Precio y Coste',
      'Auditoría y Consultoría Estratégica con Gemini 3.8'
    ],
    fullContentMarkdown: MENU_ENGINEERING_ADMIN_MANUAL_CONTENT
  },
  {
    id: 'admin_gestion_caja',
    title: 'Manual de Administración: Gestión de Caja',
    subtitle: 'Arqueo de Efectivo, Cierre Z, Movimientos de Caja y Trazabilidad Fiscal',
    category: 'admin',
    version: '2.1 Oficial',
    pages: 4,
    pdfUrl: '/manual_gestion_caja.pdf',
    filename: 'manual_gestion_caja.pdf',
    date: 'Septiembre 2026',
    badge: 'Tesorería & Cierre Z',
    summary: 'Guía técnica y operativa completa para el control de efectivo en GastroPOS Suite: ciclo de vida de caja (apertura, movimientos extraordinarios, ventas en metálico y cierre Z ciego), fórmula algorítmica de saldo esperado, detección de descuadres, apertura remota de cajón por pulsos ESC/POS Web Bluetooth y cumplimiento de la Ley Antifraude 11/2021.',
    topics: [
      'Marco Legal y Ley Antifraude 11/2021 (VeriFactu / TicketBAI)',
      'Máquina de Estados de Caja (CashRegister & CashMovement)',
      'Algoritmo de Saldo Esperado y Cálculo de Descuadre',
      'Desglose de Controles, Iconografía e Indicadores en Vivo',
      'Apertura de Turno y Fondo de Maniobra Inicial',
      'Movimientos Manuales (Entradas de Cambio y Salidas de Gastos)',
      'Arqueo Físico Ciego y Cierre Diario Definitivo (Cierre Z)',
      'Diferenciación Fiscal: Informe X (Parcial) vs. Informe Z (Definitivo)',
      'Integración ESC/POS Web Bluetooth para Apertura de Cajón',
      'Control de Acceso Basado en Roles (RBAC) y Audit Trail'
    ],
    fullContentMarkdown: CASH_ADMIN_MANUAL_CONTENT
  },
  {
    id: 'admin_finanzas_analitica',
    title: 'Manual de Finanzas, Cierre Z y Fiscalidad',
    subtitle: 'Business Intelligence, Rentabilidad P&L, Impuestos y Modelo 347',
    category: 'administrador',
    version: '2.1 Oficial',
    pages: 4,
    pdfUrl: '/manual_finanzas_analitica.pdf',
    filename: 'manual_finanzas_analitica.pdf',
    date: 'Septiembre 2026',
    badge: 'Finanzas & Fiscal',
    summary: 'Documentación técnica y directiva completa del módulo de Finanzas y Analítica: Dashboard de KPIs en vivo, cálculo del Coste de Ventas (COGS) y Margen Bruto, segmentación por horas/camarero/zona con Recharts, Cierre Z legal, liquidación de IVA trimestral (Repercutido vs. Soportado), Modelo 347 y anulación justificada de tickets conforme a la Ley Antifraude.',
    topics: [
      'Dashboard Financiero y KPIs de Venta en Vivo',
      'Cuenta de Pérdidas y Ganancias (P&L): Coste de Ingredientes y Margen Bruto',
      'Segmentación Analítica con Recharts (Horas, Categorías, Camareros y Zonas)',
      'Informe Z Oficial de Cierre Diario y Desglose de Bases de IVA',
      'Conciliación de Caja: Saldo Esperado vs. Efectivo Real y Descuadre',
      'Liquidación Trimestral de IVA (Repercutido vs. Soportado)',
      'Modelo 347: Detección Automática de Operaciones Superiores a 3.005,06 €',
      'Exportación a CSV Limpio para Asesorías y Software Contable (A3 / Sage)',
      'Auditoría y Anulación Justificada de Tickets según la Ley Antifraude',
      'Matriz de Permisos Granulares (RBAC) para Finanzas'
    ],
    fullContentMarkdown: ANALYTICS_ADMIN_MANUAL_CONTENT
  },
  {
    id: 'user_tpv_general',
    title: 'Manual de Usuario y Operativa de Sala TPV',
    subtitle: 'Guía de Servicio para Camareros, Personal de Barra y Encargados de Sala',
    category: 'usuario',
    version: '2.1 Práctica',
    pages: 3,
    pdfUrl: '/manual_general_usuario.pdf',
    filename: 'manual_general_usuario.pdf',
    date: 'Septiembre 2026',
    badge: 'Operativa de Servicio',
    summary: 'Guía paso a paso diseñada para capacitar a camareros y personal de barra en el uso diario: inicio con PIN, toma de comandas, modificadores para cocina, marcha de platos al KDS y división de cuentas en caja.',
    topics: [
      'Inicio de sesión y control de acceso por PIN',
      'Toma de comandas en mesa y Venta Directa',
      'Notas de cocina y alérgenos de alto contraste',
      'Envío a cocina y pantallas KDS',
      'Cobros en efectivo, cálculo de cambio y datáfono',
      'División de cuenta entre comensales',
      'Resolución rápida de incidencias durante el servicio'
    ],
    fullContentMarkdown: USER_MANUAL_CONTENT
  }
];

const DocumentationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocTab>('admin');
  const [selectedDoc, setSelectedDoc] = useState<ManualDoc | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const adminDocs = MANUALS.filter(d => d.category === 'admin');
  const userDocs = MANUALS.filter(d => d.category === 'usuario');

  const currentDocs = activeTab === 'admin' ? adminDocs : userDocs;

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async (doc: ManualDoc) => {
    try {
      setDownloadingId(doc.id);
      // Fetch the binary PDF from the current origin with credentials included
      const response = await fetch(doc.pdfUrl, {
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: No se pudo descargar el archivo`);
      }

      const blob = await response.blob();

      // Verify that what we received is actually a valid PDF binary and not an HTML redirect/cookie-check page
      if (blob.type.includes('text/html') || blob.size < 1000) {
        const textPreview = await blob.slice(0, 200).text();
        if (textPreview.includes('<!doctype') || textPreview.includes('<html')) {
          throw new Error('El servidor devolvió una página HTML en lugar del binario PDF.');
        }
      }

      // Create a local blob URL and trigger clean download
      const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL after short timeout
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 5000);
    } catch (err) {
      console.error('Error al descargar el PDF:', err);
      // Fallback: trigger direct link navigation
      const fallbackLink = document.createElement('a');
      fallbackLink.href = doc.pdfUrl;
      fallbackLink.download = doc.filename;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenPDFInNewTab = async (doc: ManualDoc) => {
    try {
      setDownloadingId(doc.id);
      const response = await fetch(doc.pdfUrl, { credentials: 'same-origin' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(blobUrl, '_blank');
    } catch {
      window.open(doc.pdfUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredContent = selectedDoc ? selectedDoc.fullContentMarkdown : '';

  return (
    <div className="p-4 md:p-6 h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-brand-accent/20 text-brand-accent rounded-xl">
              <BookOpen size={22} />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Documentación & Manuales</h2>
          </div>
          <p className="text-sm text-gray-400">
            Repositorio centralizado de manuales oficiales, guías técnicas y documentación operativa del sistema.
          </p>
        </div>

        {/* Sub-tabs Selector */}
        <div className="flex items-center bg-brand-800 p-1.5 rounded-2xl border border-brand-700 shrink-0 self-start sm:self-auto">
          <button
            id="tab-docu-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/25'
                : 'text-gray-400 hover:text-white hover:bg-brand-700/50'
            }`}
          >
            <ShieldCheck size={17} />
            Docu Admin
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'admin' ? 'bg-white/20 text-white' : 'bg-brand-900 text-gray-400'}`}>
              {adminDocs.length}
            </span>
          </button>

          <button
            id="tab-docu-usuario"
            onClick={() => setActiveTab('usuario')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'usuario'
                ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/25'
                : 'text-gray-400 hover:text-white hover:bg-brand-700/50'
            }`}
          >
            <Users size={17} />
            Docu Usuario
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'usuario' ? 'bg-white/20 text-white' : 'bg-brand-900 text-gray-400'}`}>
              {userDocs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-tab description banner */}
      <div className="mb-6 p-4 rounded-2xl border border-brand-700/70 bg-gradient-to-r from-brand-800 to-brand-800/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${activeTab === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {activeTab === 'admin' ? <ShieldCheck size={22} /> : <Users size={22} />}
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              {activeTab === 'admin' ? 'Subapartado: Documentación para Administradores (Docu Admin)' : 'Subapartado: Documentación para Personal y Usuarios (Docu Usuario)'}
            </h3>
            <p className="text-xs md:text-sm text-gray-400">
              {activeTab === 'admin' 
                ? 'Manuales técnicos, arquitectura de software, protocolos de seguridad, configuración avanzada y cumplimiento normativo.'
                : 'Guías de servicio ágiles, procedimientos para camareros, manejo de comanderos, cobros y pantallas KDS de cocina.'}
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-400 bg-brand-900/60 px-3 py-1.5 rounded-xl border border-brand-700">
          <FileCheck size={15} className="text-brand-accent" />
          Formatos: PDF descargable & Visor interactivo
        </div>
      </div>

      {/* Grid of Manual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {currentDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-brand-800 border border-brand-700 hover:border-brand-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl group hover:shadow-brand-accent/5"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-accent/20 text-brand-accent border border-brand-accent/30 flex items-center gap-1.5">
                  <FileText size={13} />
                  {doc.badge}
                </span>
                <span className="text-xs font-mono text-gray-400 bg-brand-900 px-2 py-0.5 rounded border border-brand-700">
                  {doc.version}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors mb-1.5 leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                {doc.subtitle}
              </p>

              {/* Summary */}
              <p className="text-xs md:text-sm text-gray-300 mb-4 bg-brand-900/50 p-3 rounded-xl border border-brand-700/50 leading-relaxed">
                {doc.summary}
              </p>

              {/* Topics preview */}
              <div className="mb-5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Temas clave incluidos:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {doc.topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-4 border-t border-brand-700 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={14} />
                <span>{doc.date}</span>
                <span>•</span>
                <span>{doc.pages} páginas</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id={`btn-read-${doc.id}`}
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-700 hover:bg-brand-600 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen size={14} />
                  Leer Online
                </button>

                <button
                  id={`btn-download-${doc.id}`}
                  onClick={() => handleDownloadPDF(doc)}
                  disabled={downloadingId === doc.id}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-accent hover:bg-brand-accentHover disabled:opacity-50 text-white flex items-center gap-1.5 shadow-md shadow-brand-accent/20 transition-all cursor-pointer active:scale-95"
                >
                  {downloadingId === doc.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  {downloadingId === doc.id ? 'Descargando...' : 'Descargar PDF'}
                </button>

                <button
                  id={`btn-open-${doc.id}`}
                  onClick={() => handleOpenPDFInNewTab(doc)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white bg-brand-900 hover:bg-brand-700 border border-brand-700 transition-colors cursor-pointer"
                  title="Abrir PDF en nueva pestaña para imprimir"
                >
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Upcoming Manuals Placeholders */}
        {activeTab === 'admin' && (
          <div className="bg-brand-800/40 border border-dashed border-brand-700/80 rounded-2xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden">
            <div className="my-auto py-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-700/40 flex items-center justify-center text-brand-accent mx-auto mb-3">
                <Sparkles size={24} />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Próximos Manuales de Administración</h4>
              <p className="text-xs text-gray-400 max-w-sm mb-4">
                Módulos en redacción para incorporar al repositorio oficial de Docu Admin:
              </p>
              <div className="space-y-2 text-xs text-left max-w-xs mx-auto">
                <div className="p-2 rounded-lg bg-brand-900/60 border border-brand-700 text-gray-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span>Manual Cierre de Caja (Z) y Arqueo Diario</span>
                </div>
                <div className="p-2 rounded-lg bg-brand-900/60 border border-brand-700 text-gray-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span>Manual Normativa Antifraude & VeriFactu</span>
                </div>
                <div className="p-2 rounded-lg bg-brand-900/60 border border-brand-700 text-gray-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span>Manual Ingeniería de Menú & Matriz BCG</span>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-gray-500">Se añadirán de forma automática con las próximas versiones</span>
          </div>
        )}

        {activeTab === 'usuario' && (
          <div className="bg-brand-800/40 border border-dashed border-brand-700/80 rounded-2xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden">
            <div className="my-auto py-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-700/40 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <Layers size={24} />
              </div>
              <h4 className="font-bold text-white text-base mb-1">Próximas Guías de Usuario</h4>
              <p className="text-xs text-gray-400 max-w-sm mb-4">
                Fichas rápidas de entrenamiento operativo para sala y cocina:
              </p>
              <div className="space-y-2 text-xs text-left max-w-xs mx-auto">
                <div className="p-2 rounded-lg bg-brand-900/60 border border-brand-700 text-gray-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span>Guía Rápida: Pantalla de Cocina KDS y Tiempos</span>
                </div>
                <div className="p-2 rounded-lg bg-brand-900/60 border border-brand-700 text-gray-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span>Guía Rápida: División de Tickets y Propinas</span>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-gray-500">Documentación de inducción para nuevos empleados</span>
          </div>
        )}
      </div>

      {/* ONLINE READER MODAL */}
      {selectedDoc && (
        <div 
          id="doc-reader-modal" 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
          onClick={() => setSelectedDoc(null)}
        >
          <div 
            className="bg-brand-900 border border-brand-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-brand-700 flex items-center justify-between bg-brand-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-accent/20 text-brand-accent shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base md:text-lg leading-tight">
                    {selectedDoc.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="text-brand-accent font-semibold">{selectedDoc.badge}</span>
                    <span>•</span>
                    <span>{selectedDoc.version}</span>
                    <span>•</span>
                    <span>{selectedDoc.pages} Páginas (PDF Oficial)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPDF(selectedDoc)}
                  disabled={downloadingId === selectedDoc.id}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-accent hover:bg-brand-accentHover disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Descargar versión PDF"
                >
                  {downloadingId === selectedDoc.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  <span className="hidden sm:inline">
                    {downloadingId === selectedDoc.id ? 'Descargando...' : 'Descargar PDF'}
                  </span>
                </button>

                <button
                  onClick={() => handleCopyText(selectedDoc.fullContentMarkdown)}
                  className="p-2 rounded-xl text-gray-300 hover:text-white bg-brand-700 hover:bg-brand-600 transition-colors"
                  title="Copiar texto completo al portapapeles"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white bg-brand-700/60 hover:bg-brand-700 transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Search Filter Inside Modal */}
            <div className="p-3 bg-brand-800/60 border-b border-brand-700 flex items-center gap-2 shrink-0">
              <Search size={16} className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Buscar término en el documento (ej. 'unir', 'offline', 'caja', 'rollback')..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none px-2"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-white text-xs px-2"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto flex-1 text-gray-200 text-sm leading-relaxed space-y-4 font-sans selection:bg-brand-accent selection:text-white">
              {filteredContent.split('\n\n').map((block, idx) => {
                // If searching, check if block contains search term
                if (searchTerm && !block.toLowerCase().includes(searchTerm.toLowerCase())) {
                  return null;
                }

                if (block.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-2xl font-black text-white border-b border-brand-700 pb-3 mb-2">
                      {block.replace('# ', '')}
                    </h1>
                  );
                }
                if (block.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-lg font-bold text-brand-accent mt-6 mb-2 flex items-center gap-2">
                      <ChevronRight size={18} className="text-brand-accent" />
                      {block.replace('## ', '')}
                    </h2>
                  );
                }
                if (block.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base font-bold text-amber-400 mt-4 mb-1">
                      {block.replace('### ', '')}
                    </h3>
                  );
                }
                if (block.startsWith('• ') || block.includes('\n• ')) {
                  const items = block.split('\n');
                  return (
                    <ul key={idx} className="space-y-1.5 my-2">
                      {items.map((item, itemIdx) => {
                        const cleanItem = item.replace(/^•\s*/, '');
                        const parts = cleanItem.split(':** ');
                        return (
                          <li key={itemIdx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-brand-accent mt-1">•</span>
                            <span>
                              {parts.length > 1 ? (
                                <>
                                  <strong className="text-white">{parts[0].replace(/\*\*/g, '')}: </strong>
                                  <span>{parts[1]}</span>
                                </>
                              ) : (
                                <span>{cleanItem}</span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                if (block.startsWith('---')) {
                  return <hr key={idx} className="border-brand-700/60 my-4" />;
                }

                return (
                  <p key={idx} className="text-gray-300 leading-relaxed">
                    {block}
                  </p>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-brand-700 bg-brand-800 flex items-center justify-between shrink-0 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <FileCheck size={15} className="text-green-400" />
                <span>Documento oficial verificado para GastroPOS Suite</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-medium transition-colors"
                >
                  Cerrar Lectura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationManagement;
