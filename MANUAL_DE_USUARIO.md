# Guía y Manual de Usuario Definitivo: GastroPOS Suite v2.1
**Manual Operativo Integral para Personal de Sala, Barra, Cocina, Caja y Dirección**
*Dirección de Operaciones & Arquitectura de Software GastroPOS | Octubre 2026*

---

## 1. Portada y Metadatos

• **Título Oficial del Sistema:** GastroPOS Suite - Enterprise Hospitality POS Platform.
• **Subtítulo Operativo:** Guía Integral de Operaciones, Configuración, Control de Sala, Cocina y Gestión Fiscal.
• **Versión del Software:** Release 2.1 Oficial (Arquitectura Híbrida Offline-First con Dexie IndexedDB y Sincronización Supabase).
• **Fecha de Edición y Vigencia:** Octubre de 2026.
• **Destinatarios:** Personal de Sala (Camareros), Jefes de Rango, Personal de Barra, Cocineros, Jefes de Cocina, Cajeros, Encargados de Turno, Responsables de Compras y Dirección General.
• **Alcance del Manual:** Este documento constituye la guía definitiva para la operación diaria, administración y explotación analítica de GastroPOS Suite. Detalla la totalidad de pantallas, controles, atajos táctiles, procedimientos paso a paso y protocolos de contingencia ante fallos de conectividad.

> **Nota de Control de Calidad:** Este documento ha sido elaborado conforme a las directrices de Usabilidad y Experiencia de Usuario (UX) de hostelería, asegurando una lectura ágil tanto para nuevos empleados como para auditores y directores de operaciones.

---

## 2. Introducción y Bienvenida

### 2.1 ¿Qué es GastroPOS Suite?
GastroPOS Suite v2.1 es un sistema integral de punto de venta (TPV), gestión de cocina, control de existencias y analítica financiera de nueva generación, diseñado específicamente para establecimientos de hostelería y restauración (restaurantes de servicio a mesa, gastrobares, cafeterías, terrazas y locales con servicio de barra).

La plataforma opera bajo el paradigma **Offline-First**, lo que significa que el terminal funciona a pleno rendimiento de manera 100% autónoma en el navegador web local mediante una base de datos indexada ultrarrápida (Dexie). Cuando existe conexión a Internet, todos los tickets, movimientos de inventario y cierres fiscales se sincronizan de forma transparente e instantánea con la nube (Supabase), permitiendo la supervisión remota en tiempo real desde cualquier dispositivo.

### 2.2 ¿Para quién está diseñada?
GastroPOS Suite adapta su interfaz dinámicamente según las necesidades operativas de cada perfil en el restaurante:
• **Personal de Sala y Terraza:** Agiliza la toma de comandas táctil, selección de formatos, gestión de alérgenos y división de cuentas directamente al lado del comensal.
• **Personal de Barra y Cocina:** Coordina la preparación de platos en orden riguroso de llegada (FIFO) mediante la pantalla KDS sin depender de papel impreso.
• **Cajeros y Encargados:** Simplifica los cobros mixtos, arqueos ciegos y el Cierre Diario Z conforme a la Ley Antifraude española 11/2021.
• **Jefes de Cocina y Gestores de Compras:** Controlan escandallos con factor de rendimiento (Yield), mermas y recepción de albaranes con actualización del Precio Medio Ponderado (PMP).
• **Propietarios y Dirección:** Analizan la rentabilidad en tiempo real (P&L), la matriz BCG de platos e identifican oportunidades con el simulador What-If.

### 2.3 Beneficios Clave del Sistema
• **Resiliencia Operativa Total (Offline-First):** Si la conexión a Internet o el router del local fallan durante un servicio pico de viernes por la noche, el restaurante nunca se detiene. Se pueden seguir abriendo mesas, enviando platos a cocina, cobrando y emitiendo tickets.
• **Cero Errores en Cocina:** Indicación obligatoria de puntos de carne, guarniciones y alerta visual inmediata de los 14 alérgenos alimentarios de declaración obligatoria según el Reglamento UE 1169/2011.
• **Seguridad e Integridad Fiscal:** Registro inmutable de cada acción (anulaciones, aperturas de cajón, descuentos) en un log de auditoría trazable.
• **Máxima Velocidad de Servicio:** Flujo táctil optimizado para registrar un comensal completo en menos de 10 segundos.

---

## 3. Requisitos del Sistema y Primeros Pasos

### 3.1 Requisitos Técnicos y Navegadores Recomendados
GastroPOS Suite está construida sobre tecnología web moderna (Progressive Web Application - PWA), lo que permite ejecutarla sin instalaciones complejas en prácticamente cualquier dispositivo táctil o de sobremesa:
• **Navegadores Homologados:** Google Chrome (v115 o superior, recomendado), Microsoft Edge (v115 o superior), Safari en iPadOS (iOS 16 o superior) y Mozilla Firefox (v118 o superior).
• **Resolución de Pantalla:** Optimizado para pantallas táctiles de TPV de 15.6 pulgadas (1920x1080 o 1366x768) y tablets de 10 a 12.9 pulgadas para comanderos móviles.
• **Periféricos Compatibles:** Impresoras térmicas de tickets estándar (ESC/POS de 80mm o 58mm) mediante Bluetooth Web API o red local Ethernet/Wi-Fi, y cajones portamonedas con apertura RJ11 estándar.

> **Consejo de Rendimiento:** Para evitar cierres accidentales de pestañas durante el servicio, se recomienda configurar el navegador en modo quiosco o pantalla completa (F11 en Windows/Linux) o instalar la aplicación como PWA desde la barra de direcciones.

### 3.2 Proceso de Inicio de Sesión (Log In) mediante PIN Personal
A diferencia de los programas tradicionales de oficina con usuario y contraseña compleja, en hostelería la velocidad es crítica. GastroPOS Suite utiliza un teclado numérico táctil de acceso por PIN de 4 dígitos (PinPad):
1. Diríjase a cualquier terminal activo en el restaurante.
2. En el teclado numérico en pantalla, pulse consecutivamente los 4 dígitos de su PIN asignado.
3. Observe cómo se iluminan las 4 burbujas confidenciales de confirmación.
4. Tras marcar el cuarto dígito, el sistema valida automáticamente la clave:
   - Si es correcta, se emite un tono acústico suave y el sistema abre directamente su espacio de trabajo predeterminado según su rol.
   - Si es incorrecta, la pantalla vibrará levemente y limpiará los dígitos para que reintente la marcación.

### 3.3 Recuperación y Restablecimiento de PIN
Por motivos de seguridad, los camareros y cocineros no pueden modificar su propio PIN desde el terminal de cobro. Si un empleado olvida su código:
1. El Administrador o Encargado debe iniciar sesión con su PIN máster.
2. Acceder al módulo de Configuración y seleccionar la pestaña Gestión de Usuarios.
3. Localizar el perfil del empleado en la lista y pulsar Editar.
4. Escribir el nuevo PIN de 4 dígitos y pulsar Guardar Cambios.
5. El cambio tiene efecto inmediato en todos los terminales vinculados.

---

## 4. Guía de la Interfaz (Dashboard Principal)

### 4.1 Vista General del Panel de Control
El Dashboard Central es el centro de mando del restaurante. Presenta una visión panorámica de la actividad operativa, financiera y logística del establecimiento en tiempo real.

• **Barra Superior de Estado:**
  - **Identificador de Conexión:** Muestra un indicador verde ("Online") o ámbar ("Offline - Modo Local"). Junto a él, se refleja la cola de sincronización de datos pendientes.
  - **Reloj del Sistema y Turno Activo:** Hora actual en formato 24 horas y fecha del servicio.
  - **Perfil del Operador:** Nombre del empleado activo y etiqueta de rol (Admin, Camarero, Cocina).
  - **Botón de Cierre de Sesión:** Permite bloquear el terminal en 1 clic para el cambio de turno o relevo de camarero.

• **Tarjetas de Métricas Clave (KPIs en Tiempo Real):**
  - **Ventas Brutas del Día:** Facturación acumulada durante la jornada (€), incluyendo impuestos.
  - **Ticket Medio por Mesa:** Promedio de consumo por cada comanda cerrada, facilitando el control de up-selling.
  - **Mesas Activas / Ocupación:** Número de mesas con clientes comiendo respecto a la capacidad total de la sala y terraza.
  - **Alertas de Stock Crítico:** Indicador numérico que parpadea si uno o más ingredientes escandallados han caído por debajo de su stock de seguridad.

• **Rejilla de Accesos Directos a Módulos:**
  - **TPV / Venta Rápida:** Acceso directo a la pantalla de comandas y cobros.
  - **Plano de Mesas:** Vista visual de mesas, terrazas y salones con estado de ocupación.
  - **Cocina (KDS):** Monitor de cocina en tiempo real con semáforos de tiempo SLA.
  - **Caja y Cierre Z:** Control de turnos, arqueo ciego y cierre diario oficial.
  - **Analítica y P&L:** Informes financieros, ventas por familia e impuestos.
  - **Ingeniería de Menú:** Matriz BCG, food cost de platos y simulador de márgenes.
  - **Configuración:** Ajustes de empresa, empleados, impresoras Bluetooth y marca blanca.

> **Atajo Rápido:** Los camareros que inician sesión son redirigidos directamente al Plano de Mesas para ahorrar tiempo, mientras que los administradores aterrizan en el Dashboard.

---

## 5. Funcionalidades Principales (Paso a Paso)

### 5.1 Módulo 1: Control de Acceso y Gestión de Personal (PinPad & Roles)
• **Objetivo:** Identificar de forma segura a cada miembro del personal, garantizando que cada comanda, cobro o anulación quede asignado a un usuario específico y restringiendo las operaciones sensibles según permisos.
• **Paso a paso para Iniciar Sesión:**
1. Encienda la pantalla táctil o abra la dirección web del TPV.
2. En el teclado numérico central, teclee sus 4 números asignados.
3. Si comete un error al digitar, pulse el botón con la flecha de borrado (esquina inferior derecha) o el botón "C" (esquina inferior izquierda) para reiniciar las 4 casillas.
4. Una vez introducido el cuarto número, el sistema verifica sus permisos y le dirige a su pantalla asignada.
• **Paso a paso para Cerrar Sesión:**
1. En la esquina superior derecha, pulse el botón rojo de candado o "Cerrar Sesión".
2. La pantalla se bloqueará inmediatamente, dejando el terminal listo para el siguiente empleado.
• **Consejos / Tips:**
- Nunca comparta su PIN personal; todas las acciones quedan registradas en el módulo de auditoría antifraude.
- Para formar a nuevos camareros, utilice el botón "Modo Tour" en el acceso inferior; cargará un entorno de demostración con datos de prueba que no alteran la facturación real.

> **Advertencia de Seguridad:** Tras 5 intentos fallidos consecutivos de PIN, el terminal aplicará un bloqueo temporal de 30 segundos con el fin de evitar intentos de fuerza bruta.

### 5.2 Módulo 2: Plano Interactivo de Mesas y Zonas (TablePlan)
• **Objetivo:** Ofrecer una representación visual del mapa del local, organizando las mesas por salas o zonas (Interior, Terraza, Barra, Reservados) y permitiendo la asignación y combinación de mesas para grupos.
• **Paso a paso para Abrir y Asignar una Mesa:**
1. En la barra de navegación superior, pulse sobre la zona deseada (ej. "Terraza").
2. Localice la mesa que desea abrir. Observe su color:
   - Verde: Mesa libre y disponible.
   - Azul: Mesa ocupada con pedido en curso.
   - Amarillo: Mesa con cuenta solicitada pendiente de pago.
3. Toque sobre una mesa verde. Se abrirá una ventana emergente solicitando el número de comensales (pax).
4. Seleccione el número de personas y confirme. La mesa cambiará a color azul y se abrirá automáticamente el TPV para iniciar la toma de comanda.
• **Paso a paso para Unir Mesas (Grupos Grandes):**
1. En la parte superior del plano, pulse el botón "Unir Mesas".
2. Toque la mesa principal (ej. Mesa 4).
3. Toque la mesa secundaria que desea acoplar (ej. Mesa 5).
4. Confirme la operación en el diálogo. A partir de ese momento, ambas mesas operarán bajo una comanda única unificada.
• **Paso a paso para Desunir Mesas:**
1. Toque la mesa agrupada y pulse "Separar Mesas".
2. El sistema liberará la mesa secundaria manteniendo los pedidos en la principal.
• **Consejos / Tips:**
- El plano muestra un temporizador dentro de cada mesa ocupada que indica cuántos minutos llevan los clientes en la mesa, ayudando a controlar la rotación de sala.

### 5.3 Módulo 3: Terminal Punto de Venta (TPV / POS), Comandas y Alérgenos
• **Objetivo:** Registrar pedidos con extrema rapidez, especificar puntos de cocción, guarniciones, notas de cocina y alertar sobre intolerancias o alérgenos alimentarios.
• **Paso a paso para Tomar un Pedido:**
1. Con la mesa seleccionada, navegue por las categorías táctiles situadas en la barra superior o lateral (Bebidas, Entrantes, Carnes, Pescados, Postres).
2. Toque sobre un producto para agregarlo a la cesta de comanda (panel lateral derecho).
3. Si el plato cuenta con formatos (ej. Tapa, Media Ración, Ración Completa), aparecerá un selector; toque el formato deseado.
4. Para modificar un producto (ej. "Entrecot"):
   - Pulse sobre el plato en la cesta de la derecha.
   - Seleccione el punto de la carne ("Poco hecho", "Al punto", "Muy hecho").
   - Seleccione guarnición o escriba una indicación especial ("Salsa a la pimienta aparte").
5. Verifique la pestaña o icono de Alérgenos. Si el cliente manifiesta una alergia (ej. Celiaquía / Sin Gluten), marque la casilla de alerta crítica; el KDS de cocina recibirá el pedido resaltado con un aviso sonoro especial.
6. Pulse el botón verde grande "Enviar a Cocina".
• **Consejos / Tips:**
- Utilice la barra de búsqueda rápida situada arriba del catálogo escribiendo 2 o 3 letras (ej. "cer" para Cervezas) para localizar platos en segundos durante horas pico.
- Para aumentar o disminuir cantidades de un plato en la cesta, pulse los botones "+" y "-" situados al lado de cada línea.

> **Importante sobre Alérgenos:** La indicación de alérgenos se sincroniza en tiempo real con la pantalla del cliente (CFD) y con la comanda de cocina, previniendo cualquier contaminación cruzada.

### 5.4 Módulo 4: Gestión de Cobros, Pagos Divididos y Facturación
• **Objetivo:** Liquidar comandas de forma segura, gestionar pagos en efectivo con cálculo automático de cambio, cobros con tarjeta o pasarela Redsys, división equitativa de cuentas y emisión de facturas oficiales.
• **Paso a paso para Cobro en Efectivo:**
1. Desde el TPV de la mesa activa, pulse el botón azul "Cobrar Mesa".
2. En la pantalla de cobro, seleccione el método "Efectivo".
3. El sistema muestra el total adeudado. Pulse los botones de billetes rápidos (5 €, 10 €, 20 €, 50 €) o teclee el importe entregado por el cliente.
4. El sistema calcula al instante el cambio a devolver y envía la señal de apertura automática al cajón portamonedas.
5. Pulse "Finalizar y Emitir Ticket". La mesa quedará automáticamente liberada en el plano.
• **Paso a paso para Dividir una Cuenta (Split Bill):**
1. En la pantalla de cobro, pulse la pestaña "Dividir Cuenta".
2. Escoja la modalidad deseada:
   - División Equitativa: Introduzca el número de personas (ej. 4 comensales). El sistema dividirá el importe total en 4 partes iguales exactas.
   - División por Artículos: Seleccione individualmente los platos que va a pagar el primer cliente, cóbrelos mediante tarjeta o efectivo, y repita la operación para los platos restantes.
3. El sistema emite un ticket simplificado independiente para cada cliente.
• **Paso a paso para Emitir Factura Completa (con NIF/CIF):**
1. Antes de finalizar el cobro, active la casilla "Solicitar Factura con Datos Fiscales".
2. Rellene los campos obligatorios: Razón Social / Nombre, NIF/CIF, Dirección Postal y Código Postal.
3. Confirme el cobro. El ticket impreso y descargable en PDF incluirá todos los requisitos fiscales de la Agencia Tributaria.
• **Consejos / Tips:**
- Si un cliente desea pagar una parte en efectivo y otra con tarjeta, seleccione "Pago Mixto", introduzca el importe en efectivo y el resto se cargará automáticamente al datáfono.

### 5.5 Módulo 5: Pantalla de Cocina y Barra (Kitchen Display System - KDS)
• **Objetivo:** Organizar visualmente los pedidos en cocina y barra, erradicar los tickets de papel perdidos y supervisar los tiempos de servicio mediante semáforos de advertencia.
• **Paso a paso para Gestionar una Comanda en Cocina:**
1. Las nuevas comandas enviadas desde el TPV entran por la izquierda de la pantalla acompañadas de un aviso acústico.
2. Cada tarjeta de comanda muestra: Número de Mesa, Nombre del Camarero, Hora de Entrada, Temporizador en vivo y lista de platos con sus notas.
3. Observar el Semáforo de Tiempo (SLA):
   - Verde (0 a 14 min): Preparación dentro del tiempo objetivo.
   - Amarillo (15 a 30 min): Espera prolongada; priorizar en fogones.
   - Rojo Parpadeante (> 30 min): Alerta crítica de retraso severo.
4. Marcar Plato Preparado: Al emplatar una línea, toque directamente sobre el renglón del plato. Cambiará a color verde con un icono de verificación, indicando a los camareros que el plato está listo en el pase.
5. Completar Comanda: Cuando todos los platos de la tarjeta estén listos, pulse el botón verde inferior "Despachar Comanda". La tarjeta se archivará en el historial.
• **Consejos / Tips:**
- Si un cocinero despacha una comanda por error, pulse el botón "Historial" en la esquina superior para recuperar la tarjeta a su estado activo en un toque.
- Puede filtrar la pantalla por partidas (ej. solo "Parrilla" o solo "Barra") desde el menú superior de filtros.

### 5.6 Módulo 6: Pantalla Visor de Cliente (Customer Facing Display - CFD)
• **Objetivo:** Brindar máxima transparencia al consumidor proyectando en una segunda pantalla táctil el desglose de su cuenta, alérgenos, promociones y un código QR dinámico para pago instantáneo.
• **Paso a paso para su Operación:**
1. Conecte un segundo monitor o tablet orientada hacia el cliente y abra la URL con el parámetro de visor (?view=cfd).
2. Cuando el camarero añade productos en el TPV, el cliente visualiza en tiempo real el nombre del plato, fotografía, unidades, precio unitario y total.
3. En el momento de cobro, el visor genera automáticamente un código QR dinámico compatible con Bizum y pagos móviles.
4. El cliente escanea el código con su teléfono, autoriza la transacción en su banco y el TPV recibe la confirmación de cobro instantánea.
• **Consejos / Tips:**
- En periodos de inactividad, el visor entra en "Modo Promocional", mostrando un carrusel con el plato estrella del restaurante y mensajes de bienvenida personalizados desde la configuración de Marca Blanca.

### 5.7 Módulo 7: Gestión de Caja, Movimientos, Arqueo Ciego y Cierre Diario Z
• **Objetivo:** Asegurar el control milimétrico del efectivo en el local, evitar descuadres, registrar gastos menores y generar el cierre fiscal diario exigido por la normativa.
• **Paso a paso para Apertura de Caja (Inicio de Jornada):**
1. Acceda al módulo Caja desde el Dashboard.
2. Pulse "Apertura de Caja".
3. Introduzca el fondo de caja inicial (cambio dejado en el cajón el día anterior, ej. 150,00 €).
4. Pulse "Confirmar Apertura". El cajón queda formalmente activado para el turno.
• **Paso a paso para Registrar Entradas y Salidas de Efectivo:**
1. Si necesita retirar efectivo para un pago urgente (ej. compra imprevista de hielo en el supermercado), pulse "Movimiento de Caja".
2. Seleccione "Salida de Efectivo", teclee el importe (ej. 12,50 €) y escriba el motivo obligatorio.
3. Pulse "Guardar Movimiento". El sistema ajustará el saldo teórico de caja y emitirá un comprobante de justificante.
• **Paso a paso para Realizar el Arqueo Ciego y Cierre Z:**
1. Al término de la jornada comercial, pulse "Cierre Diario Z".
2. El sistema aplica el protocolo de Arqueo Ciego: oculta el saldo teórico para evitar que el empleado manipule el conteo.
3. Cuente físicamente las monedas y billetes presentes en el cajón portamonedas e introduzca las unidades en el desglose táctil.
4. Pulse "Validar Arqueo".
5. En este momento, el sistema compara el dinero contado contra las ventas registradas y muestra el balance: "Caja Cuadrada" o "Descuadre (+/- X €)".
6. Pulse "Emitir Cierre Z Definitivo". Se imprimirá el ticket fiscal numerado e inalterable, y el turno quedará cerrado.

> **Aviso Fiscal:** Una vez emitido el Cierre Z, los tickets de ese día quedan bloqueados contra modificaciones o borrados, garantizando la inviolabilidad contable de la empresa.

### 5.8 Módulo 8: Inventario, Escandallos (Yield) y Recepción de Albaranes
• **Objetivo:** Conocer el coste exacto de cada plato, descontar automáticamente las existencias de ingredientes con cada venta y gestionar albaranes de proveedores recalculando el Precio Medio Ponderado (PMP).
• **Paso a paso para Crear un Escandallo con Rendimiento (Yield):**
1. Vaya a Configuración > Inventario y seleccione la pestaña "Escandallos".
2. Pulse "Nuevo Escandallo" y seleccione el plato de la carta (ej. "Solomillo Ibérico").
3. Añada los ingredientes que lo componen:
   - "Solomillo fresco": 250 gramos.
   - "Aceite de Oliva Virgen": 15 ml.
   - "Sal en escamas": 3 gramos.
4. Configure el Factor de Rendimiento (Yield %): si una pieza de carne sufre una merma de limpieza del 15%, establezca un rendimiento del 85%. El sistema recalculará el coste real del plato considerando el peso bruto pagado al proveedor.
5. El sistema indicará el Coste Total de Materia Prima y el margen sobre el PVP.
• **Paso a paso para Recibir un Albarán de Proveedor:**
1. Seleccione la pestaña "Albaranes de Entrada" y pulse "Nuevo Albarán".
2. Seleccione el proveedor e introduzca el número de documento de entrega.
3. Añada los productos recibidos con sus cantidades y precio de compra de la factura.
4. Pulse "Procesar Albarán". El sistema sumará el stock a los almacenes y recalculará de forma inmediata el Precio Medio Ponderado (PMP) de los ingredientes.

### 5.9 Módulo 9: Ingeniería de Menú (Matriz BCG y Simulador What-If)
• **Objetivo:** Optimizar la carta del restaurante identificando platos rentables o deficitarios mediante la matriz clásica de Boston Consulting Group (BCG) adaptada a hostelería.
• **Paso a paso para Analizar la Carta:**
1. Acceda al módulo "Ingeniería de Menú" desde el Dashboard.
2. Seleccione el rango de fechas a examinar (últimos 7 días, 30 días o trimestre).
3. Observe el gráfico de dispersión con los cuatro cuadrantes:
   - Platos Estrella (Alto Margen, Alta Venta): Platos bandera del local; mantener calidad y visibilidad prioritaria.
   - Vacas Lecheras (Bajo Margen, Alta Venta): Platos muy populares pero con poco beneficio; candidatos ideales para subir precio ligeramente o renegociar costes de ingrediente.
   - Interrogantes (Alto Margen, Baja Venta): Platos con gran margen pero poco solicitados; requieren mejor posición en carta o recomendación activa por camareros.
   - Perros (Bajo Margen, Baja Venta): Platos problemáticos; deben reformularse o retirarse de la carta.
4. Uso del Simulador What-If:
   - En la tabla inferior, localice un plato "Vaca Lechera".
   - Desplace el control deslizante de PVP aumentando 0,50 €.
   - El simulador proyectará matemáticamente el incremento estimado de beneficio bruto mensual manteniendo el volumen de consumo.

### 5.10 Módulo 10: Analítica Financiera, P&L, Impuestos y Registro de Auditoría
• **Objetivo:** Supervisar la rentabilidad neta del restaurante, generar la información necesaria para el Modelo 303 de IVA trimestral y auditar la transparencia de los empleados.
• **Paso a paso para Consultar el Estado de Pérdidas y Ganancias (P&L):**
1. Ingrese a Analítica.
2. Examine las tarjetas de consolidación: Ventas Netas, Coste de Mercancías Vendidas (COGS acumulado por escandallos), Margen Bruto de Explotación y Beneficio Operativo.
3. Descargue el informe en formato PDF o CSV para su gestoría.
• **Paso a paso para Auditar Acciones Sospechosas (Log Antifraude):**
1. Pulse en la pestaña "Registro de Auditoría".
2. Filtre por tipo de evento: "Líneas Anuladas tras Envío", "Aperturas Manuales de Cajón" o "Descuentos Aplicados".
3. El sistema muestra la hora exacta, el nombre del empleado que ejecutó la acción y el motivo introducido en el sistema.

### 5.11 Módulo 11: Configuración del Sistema, Impresoras Bluetooth y Marca Blanca
• **Objetivo:** Adaptar el aspecto estético del TPV a la identidad de marca del restaurante y enlazar comanderas térmicas e impresoras de tickets.
• **Paso a paso para Vincular una Impresora Bluetooth ESC/POS:**
1. Vaya a Configuración > Impresoras.
2. Encienda la impresora térmica y active el modo emparejamiento.
3. Pulse el botón azul "Buscar Impresoras Bluetooth".
4. En el diálogo nativo del navegador, seleccione el dispositivo (ej. "TPV-Printer-80") y pulse "Vincular".
5. Pulse "Imprimir Ticket de Prueba" para verificar el corte de papel y la alineación tipográfica.
• **Paso a paso para Personalizar la Marca Blanca (White-Label):**
1. En Configuración, seleccione la pestaña "Marca Blanca".
2. Suba el logotipo de su restaurante en formato PNG o JPG.
3. Seleccione el color corporativo primario mediante la paleta interactiva.
4. Introduzca el Nombre Comercial, NIF, Teléfono y Texto Legal del pie de ticket (ej. "¡Gracias por su visita!").
5. Guarde los cambios; el TPV y los tickets adoptarán al instante su identidad visual.

---

## 6. Preguntas Frecuentes (FAQ)

• **1. ¿Qué ocurre si se corta la conexión a Internet o el router del restaurante se apaga?**
GastroPOS Suite continuará funcionando sin interrupciones gracias a su motor Dexie IndexedDB. Podrá abrir mesas, tomar comandas, enviarlas al KDS local, cobrar y emitir tickets. En cuanto la conexión Wi-Fi o 4G se restablezca, todos los datos encolados se sincronizarán de forma automática con la nube sin pérdida de información.

• **2. ¿Qué debo hacer si al final del día el efectivo real en caja no coincide con el sistema?**
Introduzca exactamente la cantidad física que ha contado durante el Arqueo Ciego. El sistema registrará el descuadre con fecha y hora. En el campo de observaciones, indique la causa si se conoce (ej. "Diferencia de 1 € por redondeo en cambio"). Nunca modifique los tickets anteriores para forzar el cuadre, ya que esto violaría la trazabilidad del registro de auditoría.

• **3. ¿Cómo puedo reimprimir un ticket anterior o generar una factura nominativa para una empresa?**
Acceda a Caja o al módulo de Ventas, pulse sobre el historial de tickets del día o busque por número de mesa. Al tocar sobre el ticket, pulse "Reimprimir Ticket" o pulse "Convertir en Factura Completa" para introducir el NIF y dirección de la empresa solicitante.

• **4. ¿Cómo gestiona el sistema los platos con alérgenos e intolerancias alimentarias?**
Cada plato tiene asociados sus alérgenos oficiales en la ficha técnica. Al tomar el pedido en el TPV, el camarero puede marcar notas específicas de alergia que viajan en rojo al KDS de cocina y quedan impresas en la comanda con una advertencia visual prominente, garantizando la seguridad alimentaria del cliente.

• **5. He olvidado el PIN de mi usuario y el terminal está bloqueado. ¿Cómo lo recupero?**
Solicite a un compañero con rol de Administrador o Encargado que inicie sesión en su terminal, entre en Configuración > Gestión de Usuarios, seleccione su nombre y asigne un nuevo PIN de 4 dígitos. El restablecimiento es inmediato.

• **6. La impresora de tickets no imprime ningún comprobante. ¿Cuáles son los pasos a seguir?**
1. Verifique que la impresora tiene papel térmico con la orientación correcta y la tapa bien cerrada.
2. Compruebe que el indicador luminoso de la impresora no esté en rojo por falta de papel o sobrecalentamiento.
3. En el TPV, acceda a Configuración > Impresoras y verifique si el estado indica "Conectado". Si está desconectada, pulse "Reconectar Impresora Bluetooth" para renovar la conexión del navegador.

• **7. ¿Se puede anular un plato si ya ha sido enviado a la cocina?**
Sí, pero por motivos de seguridad antifraude requiere permiso autorizado. El camarero debe pulsar sobre la línea en la comanda, seleccionar "Anular Producto" y escoger obligatoriamente un motivo justificado (ej. "Error de toma", "Comensal cambió de opinión"). La cocina recibirá una alerta inmediata de cancelación y el evento quedará anotado en el informe de auditoría.

---

## 7. Soporte y Ayuda

• **Centro de Soporte Técnico Especializado:**
GastroPOS Suite pone a disposición de sus clientes un equipo de asistencia técnica para resolver incidencias de hardware, conectividad o configuración:
  - **Canal de Incidencias Operativas (Urgencias en Servicio):** soporte@gastropos.local | Teléfono de guardia 24/7 para locales en servicio activo.
  - **Portal de Ayuda y Base de Conocimiento:** Accesible directamente desde el menú de Documentación en la propia aplicación, donde podrá descargar manuales específicos de cada módulo en formato PDF.
  - **Actualizaciones del Sistema:** Las actualizaciones de versión se aplican de forma silenciosa en la nube sin interrumpir las sesiones activas de trabajo en sala.

• **Buenas Prácticas de Mantenimiento Recomendadas:**
  - Limpie las pantallas táctiles con paños de microfibra secos o ligeramente humedecidos con solución desinfectante neutra al finalizar el turno.
  - Asegúrese de emitir el Cierre Diario Z cada noche para consolidar el ciclo fiscal de la jornada.
  - Mantenga el navegador web actualizado a su última versión estable para disfrutar de las mejores optimizaciones de velocidad y seguridad.
