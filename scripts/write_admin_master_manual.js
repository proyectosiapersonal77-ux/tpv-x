import fs from 'fs';

const adminManualContent = `# Manual de Administración Definitivo: GastroPOS Suite v2.1
**Guía Integral de Arquitectura, Configuración, Gestión Fiscal, Control de Sala, Cocina y Seguridad RBAC**
*Dirección de Operaciones & Arquitectura de Software GastroPOS | Octubre 2026*

---

## 1. Portada y Metadatos de Administración

• **Título Oficial del Documento:** GastroPOS Suite - Master Administration & Technical Governance Manual.
• **Subtítulo Estratégico:** Guía Integral de Arquitectura, Configuración, Gestión Fiscal, Control de Sala, Cocina y Seguridad RBAC.
• **Versión del Software:** Release 2.1 Oficial (Arquitectura Híbrida Offline-First con Dexie IndexedDB y Sincronización Supabase PostgreSQL).
• **Fecha de Edición y Vigencia:** Octubre de 2026.
• **Nivel de Confidencialidad:** Uso Interno Exclusivo para Gerencia, Directores de Operaciones, Administradores de Sistemas, Jefes de Sala y Asesores Contables.
• **Destinatarios:** Administradores Generales, Directores de Restauración, Jefes de Operaciones, Responsables de Compras y Auditores de Sistemas.
• **Alcance del Manual:** Esta documentación cubre la totalidad de directrices técnicas, gobernanza de datos, parametrización de hardware periférico, auditoría antifraude bajo la Ley 11/2021 y control financiero avanzado de GastroPOS Suite.

> **Nota de Gobernanza y Seguridad:** El acceso a las pantallas de configuración y analítica descritas en este manual debe estar estrictamente restringido a usuarios con rol 'admin' o permisos específicos asignados en la matriz RBAC.

---

## 2. Arquitectura del Sistema y Resiliencia Operativa

### 2.1 Filosofía Híbrida Offline-First
GastroPOS Suite está concebida para operar sin interrupciones incluso ante caídas totales del suministro de Internet o averías del router local. A diferencia de los TPVs convencionales en la nube que quedan inutilizados sin conexión:
• **Persistencia Local Inmediata (Dexie IndexedDB):** Cada creación de comanda, modificación de plato, cambio de estado en KDS o cobro se almacena localmente en milisegundos en la base de datos indexada del navegador.
• **Canales Reactivos en Tiempo Real (Supabase Realtime WebSockets):** En condiciones normales de conexión, los terminales suscritos intercambian eventos de sala, cocina y caja de forma instantánea mediante canales WebSockets seguros (WSS).
• **Cola Transaccional Inteligente (SyncQueue):** Cuando el sistema detecta pérdida de red, activa el modo autónomo y encola cada mutación. Al restaurarse la conexión, la cola se vacía de manera ordenada resolviendo marcas de tiempo sin duplicar tickets ni generar descuadres contables.

### 2.2 Seguridad, Privacidad y Almacenamiento Local
• Las claves y tokens de sincronización se gestionan mediante variables de entorno protegidas.
• Los datos de auditoría se almacenan con sellos temporales inmutables (timestamp UTC) vinculados al ID del usuario autenticado.
• El visor de cliente (CFD) y los canales de comunicación local utilizan Broadcast Channels en memoria sin exponer datos confidenciales a la red pública.

---

## 3. Gestión de Personal, Seguridad y Matriz RBAC

### 3.1 Modelo de Control de Acceso Basado en Roles (RBAC)
La suite implementa un modelo jerárquico de permisos granulares que delimita las atribuciones de cada empleado:

• **Rol Administrador (admin):** Acceso irrestricto a todas las funcionalidades del sistema, incluyendo analítica financiera, P&L, Cierre Z, escandallos, tarifas, configuración de impresoras y gestión de usuarios.
• **Rol Camarero / Personal de Sala (waiter):** Acceso optimizado al Plano de Mesas y TPV. Puede abrir comandas, seleccionar formatos, indicar alérgenos, enviar a cocina y procesar cobros estándar.
• **Rol Cocina / Jefe de Partida (kitchen):** Acceso exclusivo a la pantalla KDS de pedidos en tiempo real. Puede avanzar estados de preparación y filtrar por estación de trabajo.
• **Rol Demostración / Formación (tour):** Permite la formación interactiva de aprendices en un entorno simulado sin riesgo de alterar las bases de datos fiscales o el stock real.

### 3.2 Catálogo de Permisos Granulares
1. **can_manage_settings:** Habilita el acceso al panel global de Configuración y Marca Blanca.
2. **can_view_analytics:** Permite consultar los informes de ventas, P&L e histórico de facturación.
3. **can_manage_inventory:** Autoriza la edición de escandallos, costes de ingredientes y recepción de albaranes.
4. **can_manage_cash:** Permite registrar movimientos manuales de caja y ejecutar el Cierre Diario Z.
5. **can_void_orders:** Autoriza la anulación de platos o comandas una vez enviadas a cocina.
6. **can_apply_discounts:** Faculta la aplicación de descuentos comerciales porcentuales o en importe fijo.

### 3.3 Protocolo de Asignación y Recuperación de PIN
• Cada empleado dispone de un PIN único e intransferible de 4 dígitos.
• Para dar de alta o modificar un PIN:
1. Acceda a Configuración > Gestión de Usuarios.
2. Pulse 'Nuevo Usuario' o 'Editar'.
3. Introduzca nombre, rol y el código PIN de 4 dígitos.
4. Guarde los cambios; el sistema los sincroniza de inmediato en toda la red de terminales.
• En caso de 5 intentos erróneos consecutivos en el PinPad, el terminal activa un bloqueo temporal disuasorio de 30 segundos.

---

## 4. Topología de Sala, Zonas y Configuración de Mesas

### 4.1 Definición de Ambientes y Zonas de Servicio
GastroPOS Suite permite estructurar el espacio físico del establecimiento en zonas lógicas para adaptar la operativa a las características de cada área:
• **Salón Principal / Comedor:** Servicio formal de mesa con comanda secuenciada (primeros, segundos, postres).
• **Terraza / Espacios Exteriores:** Servicio dinámico con control visual de tiempos de estancia y opciones de recargo por terraza.
• **Barra / Taberna:** Venta rápida por consumición directa con rotación continua.
• **Reservados y Plantas Superiores:** Atención de grupos con comanda predeterminada y cierre consolidado.

### 4.2 Topología Relacional de Mesas: Motor Padre-Hijo (Parent-Child)
Para banquetes, eventos y grupos numerosos, el sistema incorpora un algoritmo nativo de agrupación de mesas:
• **Unión de Mesas (Long Press 600ms):** El encargado mantiene pulsada una mesa en el plano durante 600 milisegundos para activar el modo de selección múltiple, toca las mesas a juntar y confirma la unión.
• **Designación de Mesa Maestra:** El algoritmo designa automáticamente como matriz la mesa que ya contenía un pedido activo. Si varias tenían consumos previos, sus líneas de comanda se fusionan de forma transparente manteniendo la trazabilidad del camarero original.
• **Desunión Segura:** Al separar mesas agrupadas, la mesa hija recupera su estado disponible en el plano, mientras que los consumos consolidados permanecen a buen recaudo en la comanda maestra para evitar descuadres de cobro.

---

## 5. Administración de Inventario, Escandallos y Valoración de Existencias

### 5.1 Catálogo Maestro de Productos y Recetas Compuestas
El inventario admite dos tipologías fundamentales de artículos:
• **Artículos Simples (Mercaderías):** Productos que se compran y venden sin transformación (refrescos, cervezas, vinos embotellados). El stock se descuenta en unidades exactas (1:1).
• **Artículos Compuestos (Elaboraciones de Cocina):** Platos que integran múltiples ingredientes mediante una ficha técnica de escandallo (ej. Paella de Mariscos, Hamburguesa Gourmet, Solomillo Ibérico).

### 5.2 Factor de Rendimiento (Yield Management) y Mermas
• **Fórmula de Rendimiento:** Rendimiento (%) = (Peso Neto Aprovechable / Peso Bruto Comprado) * 100.
• Al configurar una receta, el administrador indica el porcentaje de aprovechamiento. Si una pieza de carne sufre un 15% de merma en limpieza y despiece, se fija un Yield del 85%.
• El sistema calcula automáticamente el Coste Real de Materia Prima ponderando la merma, lo que asegura que el margen sobre el PVP sea exacto y realista.

### 5.3 Recepción de Albaranes y Precio Medio Ponderado (PMP)
• Al registrar una factura o albarán de compra en 'Albaranes de Entrada', el sistema actualiza el stock físico y aplica la fórmula legal del Precio Medio Ponderado:
  PMP = [(Stock Anterior * Coste Anterior) + (Cantidad Entrada * Coste Entrada)] / (Stock Anterior + Cantidad Entrada).
• Esta valoración actualiza en cascada el coste de todos los escandallos donde interviene dicho ingrediente, garantizando la fiabilidad del margen bruto en el análisis de explotación.

---

## 6. Ingeniería de Menú y Maximización de Margen (Matriz BCG)

### 6.1 Fundamentos de la Matriz Kasavana & Smith
El módulo cruza en tiempo real dos variables críticas: Popularidad (unidades vendidas) y Margen de Contribución Unitario (PVP - Coste de Ingrediente):
• **⭐ Cuadrante Estrellas (Alta Popularidad, Alto Margen):** Son los pilares de rentabilidad del restaurante. Directriz: Mantener calidad estricta, ubicación destacada en carta y formación del personal para su venta prioritaria.
• **🐄 Cuadrante Vacas Lecheras (Alta Popularidad, Bajo Margen):** Platos muy demandados pero con bajo margen unitario. Directriz: Aumentar el PVP de forma paulatina (0,30 € - 0,60 €), renegociar precios de ingredientes o ajustar el gramaje de guarniciones.
• **❓ Cuadrante Interrogantes (Baja Popularidad, Alto Margen):** Recetas rentables que los clientes apenas conocen. Directriz: Mejorar su posición visual en la carta, sugerirlos como recomendación del día o rediseñar su denominación gastronómica.
• **🐕 Cuadrante Perros (Baja Popularidad, Bajo Margen):** Platos que consumen inventario y mano de obra sin aportar beneficio ni volumen. Directriz: Reformular su receta o eliminarlos definitivamente de la oferta gastronómica.

### 6.2 Simulador Interactivo What-If
• Permite proyectar el impacto económico de variar el precio o el coste de un plato antes de imprimir nuevas cartas físicas.
• El administrador ajusta los controles deslizantes y el motor calcula la variación estimada de facturación y beneficio bruto mensual basándose en el histórico de consumo.

---

## 7. Tesorería, Fiscalidad Legal y Cumplimiento Antifraude (Ley 11/2021)

### 7.1 Marco Legal y Ley Antifraude 11/2021 (VeriFactu / TicketBAI)
GastroPOS Suite cumple con las exigencias normativas españolas relativas a la inalterabilidad, trazabilidad y conservación de registros de facturación:
• Cada ticket emitido cuenta con un identificador unívoco y un registro secuencial correlativo sin saltos de numeración.
• Los tickets cerrados quedan bloqueados contra edición retroactiva.
• Cualquier modificación posterior (anulación justificada, devolución parcial o emisión de factura rectificativa) genera un contra-asiento auditable con fecha, hora y usuario responsable.

### 7.2 Ciclo de Vida de Caja: Arqueo Ciego y Cierre Diario Z
• **Apertura de Turno:** Registro del fondo inicial de maniobra para cambio en monedas y billetes.
• **Movimientos Extraordinarios:** Registro obligatorio con concepto justificativo de cualquier extracción de efectivo (adelantos, compras urgentes de cocina) o entrada de cambio exterior.
• **Arqueo Ciego:** El cajero cuenta el dinero sin conocer la cifra calculada por el sistema. Esta práctica suprime cualquier posibilidad de manipulación o redondeo forzado.
• **Cierre Diario Z Oficial:** Liquidación fiscal definitiva que consolida las ventas brutas, bases imponibles desglosadas por tipo de IVA (4%, 10%, 21%), pagos con tarjeta, efectivo y descuadre real de tesorería.

### 7.3 Modelos Tributarios (303 y 347)
• **Preparación del Modelo 303:** Desglose automático de IVA Devengado en sala y comanda frente a IVA Soportado deducible en albaranes procesados.
• **Detección para Modelo 347:** Identificación automática de proveedores con operaciones acumuladas que superen los 3.005,06 € en el año fiscal.

---

## 8. Periféricos, Impresión Bluetooth ESC/POS y Marca Blanca

### 8.1 Conectividad Web Bluetooth API para Impresoras Térmicas
• Compatible con comanderas de 80mm y 58mm bajo protocolo estándar ESC/POS.
• Vinculación directa desde el navegador web sin necesidad de controladores propietarios complejos ni software intermediario (middleware).
• Envío automático de pulso eléctrico por patilla RJ11 para apertura del cajón portamonedas en cada cobro en metálico.

### 8.2 Personalización de Marca Blanca (White-Label)
• En Configuración > Marca Blanca, el administrador puede:
1. Cargar el logotipo institucional del restaurante (PNG transparente).
2. Establecer el color primario de marca (CSS Hexadecimal).
3. Configurar los datos de la empresa: Razón Social, CIF/NIF, Dirección fiscal, Registro Mercantil y pie de ticket personalizado con información de protección de datos (RGPD).

---

## 9. Políticas de Copias de Seguridad, Mantenimiento y Soporte L2

• **Políticas de Respaldo:** El sistema almacena copias de seguridad continuas en la base de datos Supabase en la nube. Localmente, la base de datos Dexie mantiene la última réplica persistente en el dispositivo.
• **Protocolo ante Caída de Red:** No reiniciar el navegador ni borrar cookies o datos de sitio durante un corte de red. Mantener el terminal operando en modo local; la cola se sincronizará automáticamente al restablecerse la conectividad.
• **Canal de Soporte L2 para Administradores:** Email directo: soporte@gastropos.local | Guardia telefónica de emergencia 24/7 para incidencias críticas en servicio.
`;

fs.writeFileSync('docs/manual_general_administrador.md', adminManualContent, 'utf-8');
fs.writeFileSync('MANUAL_DE_ADMINISTRADOR.md', adminManualContent, 'utf-8');
console.log('Admin master manual markdown files written successfully!');

const tsContent = 'export const ADMIN_MASTER_MANUAL_CONTENT = ' + JSON.stringify(adminManualContent) + ';\n';
fs.writeFileSync('components/config/adminMasterManualContent.ts', tsContent, 'utf-8');
console.log('components/config/adminMasterManualContent.ts written successfully!');
