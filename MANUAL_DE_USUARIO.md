# Guía de Usuario Rápida y Completa: GastroPOS Suite v2.1
**Manual Operativo Integral para Personal de Sala, Barra, Cocina, Caja y Encargados**
*Dirección de Operaciones & Arquitectura de Software GastroPOS*

---

## 1. Módulo de Control de Acceso y Autenticación (PinPad)

### Propósito General y Flujo de Trabajo Principal
El módulo de Control de Acceso y Autenticación garantiza la seguridad operativa del restaurante y el cumplimiento de la Ley Antifraude 11/2021. Su propósito es identificar de forma inequívoca al empleado antes de permitir cualquier operación en el sistema (toma de pedidos, cobro, envío a cocina o arqueo de caja). 

El flujo de trabajo principal comienza en la pantalla de bienvenida con teclado numérico (PinPad). El empleado digita su código PIN personal de 4 dígitos. El sistema verifica instantáneamente las credenciales contra la base de datos local y remota, identifica el rol asignado (Camarero, Cocinero, Encargado, Administrador o Perfil Tour) y redirige al usuario de manera automática a su pantalla de trabajo correspondiente (los camareros acceden directamente al Plano de Mesas; los cocineros a la Pantalla KDS; y los administradores o encargados al Dashboard Central). Al finalizar el turno o al ausentarse del terminal, el usuario pulsa "Cerrar Sesión", volviendo a proteger el sistema.

### Catálogo de Elementos Funcionales

• **Teclado Numérico Táctil (Dígitos del 0 al 9):** Botones numéricos de gran dimensión optimizados para pantallas táctiles de TPV y tablets de sala.
• **Qué es / Para qué sirve:** Permite la introducción rápida del PIN personal de 4 dígitos sin necesidad de teclados físicos periféricos. Cuenta con retroalimentación háptica (vibración) y acústica configurable por usuario.
• **Cómo se usa:** Pulse consecutivamente los 4 números correspondientes a su PIN. Con cada pulsación se rellenará un indicador visual de punto. Tras introducir el cuarto dígito, el sistema valida automáticamente la clave sin requerir pulsar una tecla adicional de confirmación. Si el PIN es correcto, se abre su módulo de trabajo; si es incorrecto, el sistema emite una vibración de error y limpia los campos.

• **Indicador de Entrada de PIN (4 Burbujas de Estado / Dots):** Cuatro círculos concéntricos situados en la parte superior del teclado.
• **Qué es / Para qué sirve:** Ofrece confirmación visual confidencial de cuántos dígitos se han marcado, enmascarando los números reales para evitar que clientes o terceros visualicen la contraseña.
• **Cómo se usa:** Observe cómo se iluminan de izquierda a derecha al pulsar cada tecla. Si comete una equivocación, le indica cuántos dígitos debe borrar.

• **Botón de Borrado / Retroceso (Icono Flecha / Backspace):** Botón situado en la esquina inferior derecha del teclado.
• **Qué es / Para qué sirve:** Elimina el último dígito numérico marcado erróneamente sin necesidad de cancelar la secuencia completa.
• **Cómo se usa:** Pulse una vez para eliminar el último dígito (el último punto activo volverá a su estado vacío) y pulse seguidamente el dígito correcto.

• **Botón de Limpieza Completa (Icono Papelera / C):** Botón situado en la esquina inferior izquierda del teclado.
• **Qué es / Para qué sirve:** Restablece instantáneamente las 4 casillas de PIN a su estado inicial.
• **Cómo se usa:** Pulse este botón si duda de los números marcados; todos los indicadores se vacían de golpe y el terminal queda listo para introducir la combinación desde el primer dígito.

• **Selector de Perfil Rápido / Modo Demostración (Botón Tour):** Enlace o botón auxiliar para entornos de evaluación o formación de nuevos empleados.
• **Qué es / Para qué sirve:** Permite a los aprendices interactuar con una sesión protegida de prueba con datos simulados sin riesgo de alterar la facturación real del restaurante.
• **Cómo se usa:** Toque sobre "Modo Tour". El sistema inicializa un entorno de prácticas seguro con mesas y productos precargados.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Inicio de Turno y Entrada al Sistema:** 1. Diríjase al terminal TPV. 2. En el teclado numérico, marque sus 4 dígitos asignados. 3. Observe cómo las 4 burbujas se completan. 4. El sistema emite un suave clic sonoro de éxito y carga automáticamente su pantalla de trabajo (si es camarero, verá el Plano de Mesas; si es cocinero, la Pantalla KDS).
• **Caso 2: Cambio Rápido de Camarero en Terminal Compartido:** 1. Cuando termine de atender una mesa, pulse el botón "Cerrar Sesión" en la barra de navegación superior. 2. El terminal regresa inmediatamente al teclado de PIN. 3. Su compañero introduce sus 4 dígitos. 4. A partir de ese momento, todas las comandas y cobros quedarán registrados bajo el nombre del nuevo camarero en el registro de auditoría.

---

## 2. Módulo de Panel de Control Principal (Dashboard Central)

### Propósito General y Flujo de Trabajo Principal
El Dashboard Central es el centro de mando y supervisión operativa de GastroPOS Suite. Su propósito es proporcionar al personal directivo, encargados y administradores una panorámica inmediata de la salud del negocio, acceso directo con un solo toque a todos los módulos funcionales y control en tiempo real del estado de sincronización y conectividad.

El flujo de trabajo principal consiste en revisar los indicadores de conectividad (estado Online/Offline y cola de sincronización) al comenzar la jornada, seleccionar el módulo de trabajo deseado mediante tarjetas táctiles de navegación y supervisar el reloj del sistema para garantizar el cumplimiento de horarios de apertura y cierres de servicio.

### Catálogo de Elementos Funcionales

• **Tarjeta de Acceso "TPV / Comandas":** Botón de acceso directo con icono de Terminal de Ventas.
• **Qué es / Para qué sirve:** Da paso al núcleo de toma de comandas, catálogo de productos y cobro en sala y barra.
• **Cómo se usa:** Pulse la tarjeta. El sistema le redirige a la vista de ventas del TPV.

• **Tarjeta de Acceso "Plano de Mesas":** Botón con icono de distribución de salón (LayoutGrid).
• **Qué es / Para qué sirve:** Muestra la planta física del restaurante con todas las zonas y el estado de ocupación de las mesas.
• **Cómo se usa:** Pulse la tarjeta para comprobar qué mesas están libres, cuáles tienen cuentas abiertas y gestionar la ubicación de clientes.

• **Tarjeta de Acceso "Cocina (KDS)":** Botón con icono de gorro de chef (ChefHat).
• **Qué es / Para qué sirve:** Abre el sistema digital de visualización de pedidos para partidas de cocina y barra.
• **Cómo se usa:** Toque la tarjeta para entrar a la pantalla de preparación de platos en tiempo real.

• **Tarjeta de Acceso "Gestión de Caja":** Botón con icono de billete y gaveta (Banknote).
• **Qué es / Para qué sirve:** Permite realizar aperturas de caja, asentar movimientos extraordinarios y ejecutar el cierre diario Z.
• **Cómo se usa:** Pulse la tarjeta para acceder a la tesorería del turno activo.

• **Tarjeta de Acceso "Inventario y Carta":** Botón con icono de caja de existencias (Package).
• **Qué es / Para qué sirve:** Permite gestionar el catálogo de productos, recetas compuestas, escandallos, proveedores y pedidos de reposición.
• **Cómo se usa:** Pulse la tarjeta para consultar existencias físicas o actualizar precios y platos.

• **Tarjeta de Acceso "Finanzas y Analítica":** Botón con icono de gráfico de barras (BarChart3).
• **Qué es / Para qué sirve:** Despliega el informe de ventas del día, cuenta de explotación P&L, ventas por hora/camarero y módulo fiscal.
• **Cómo se usa:** Pulse la tarjeta para auditar el rendimiento económico de la jornada.

• **Tarjeta de Acceso "Ingeniería de Menú":** Botón con icono de estrella y rentabilidad (TrendingUp).
• **Qué es / Para qué sirve:** Abre la matriz BCG interactiva (Estrellas, Vacas, Interrogantes, Perros) y el simulador de precios What-If.
• **Cómo se usa:** Toque la tarjeta para analizar la rentabilidad de cada plato de la carta.

• **Tarjeta de Acceso "Visor de Cliente (CFD)":** Botón con icono de pantalla (Monitor).
• **Qué es / Para qué sirve:** Lanza la interfaz encarada al cliente para mostrar el desglose de cuenta y código QR de pago móvil.
• **Cómo se usa:** Pulse la tarjeta para vincular una mesa o mostrador a una pantalla externa.

• **Tarjeta de Acceso "Configuración del Sistema":** Botón con icono de engranajes (Settings).
• **Qué es / Para qué sirve:** Abre el panel de administración de usuarios, impresoras Bluetooth, pasarela Redsys y datos fiscales.
• **Cómo se usa:** Toque la tarjeta para ajustar parámetros globales de la aplicación.

• **Indicador de Sincronización y Red (Sync Status):** Badge situado en la cabecera con iconos de nube y check.
• **Qué es / Para qué sirve:** Informa si el terminal está operando con conexión a Supabase en la nube o en modo Offline-First local (Dexie/IndexedDB), y muestra si hay mutaciones pendientes de envío en cola.
• **Cómo se usa:** Monitorícelo de forma visual. Un icono verde "Sincronizado" confirma conexión perfecta; un icono ámbar "Sincronizando" o gris "Modo Local" indica que puede seguir trabajando con normalidad y el sistema se actualizará solo en cuanto regrese la cobertura.

• **Botón Cerrar Sesión (Logout):** Icono de salida situado en el extremo superior derecho.
• **Qué es / Para qué sirve:** Cierra la sesión activa del usuario actual y bloquea el terminal devolviéndolo al teclado de PIN.
• **Cómo se usa:** Pulse el botón al ausentarse del puesto o al terminar su turno para proteger la cuenta.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Navegación del Encargado al Inicio de la Mañana:** 1. Inicie sesión con su PIN de encargado. 2. Desde el Dashboard, verifique que el indicador de sincronización marque "Sincronizado". 3. Pulse la tarjeta "Gestión de Caja" para realizar el fondo de apertura del día. 4. Vuelva al Dashboard y pulse "Plano de Mesas" para organizar la distribución de la sala antes de abrir las puertas.

---

## 3. Módulo de Plano de Mesas y Distribución de Sala (TablePlan)

### Propósito General y Flujo de Trabajo Principal
El Plano de Mesas ofrece un mapa interactivo visual de todas las dependencias del local gastronómico (Salón Principal, Terraza Exterior, Barra, etc.). Su propósito es coordinar la rotación de comensales en sala, evitar duplicidad de cuentas y proporcionar una visión instantánea de qué mesas están libres, cuáles consumiendo y cuánto llevan acumulado en euros.

El flujo de trabajo principal consiste en seleccionar la zona física donde se ubican los comensales, pulsar sobre una mesa libre para abrir una comanda en el TPV, o pulsar sobre una mesa ocupada para consultar o cobrar el pedido existente. Además, permite fusionar mesas físicamente contiguas cuando llega un grupo numeroso y desvincularlas de forma independiente tras la salida de los clientes.

### Catálogo de Elementos Funcionales

• **Pestañas de Selección de Zona (Salón, Terraza, Barra, etc.):** Barra superior horizontal con nombres e iconos semánticos de cada área del restaurante.
• **Qué es / Para qué sirve:** Filtra las mesas mostradas en pantalla según el ambiente físico seleccionado, mostrando además un contador numérico con las mesas activas de cada zona.
• **Cómo se usa:** Toque la pestaña correspondiente al área que desea atender (ej. "Terraza"). La pantalla actualizará de inmediato la cuadrícula con las mesas de esa zona.

• **Tarjeta de Mesa Libre (Estado Verde / Disponible):** Cuadro de mesa con micro-LED verde brillante superior y etiqueta "LIBRE".
• **Qué es / Para qué sirve:** Identifica mesas desocupadas listas para acomodar nuevos clientes.
• **Cómo se usa:** Toque la tarjeta. El sistema crea automáticamente una comanda en blanco y le traslada al TPV para registrar los productos que deseen los comensales.

• **Tarjeta de Mesa Ocupada (Estado Rojo / Pedido Abierto):** Cuadro de mesa con borde rojo carmesí, micro-LED pulsante y cifra de importe acumulado en euros (€).
• **Qué es / Para qué sirve:** Refleja mesas con un servicio en curso, permitiendo conocer de un vistazo el gasto acumulado de los clientes.
• **Cómo se usa:** Toque la tarjeta. El sistema carga de inmediato la comanda activa en el TPV con todos los platos servidos, tiempos y opciones de cobro.

• **Tarjeta de Mesa Vinculada / Hija (Estado Enlazado):** Cuadro con borde discontinuo (dashed) e icono de eslabón de cadena ("🔗 M1").
• **Qué es / Para qué sirve:** Indica que la mesa ha sido unida a una mesa principal para albergar a un grupo grande.
• **Cómo se usa:** Al tocar una mesa vinculada, el sistema le redirige de forma inteligente a la comanda de la Mesa Maestra, evitando cuentas huérfanas o duplicadas.

• **Modo Unir Mesas (Pulsación Prolongada de 600 ms):** Gesto táctil mantenido sobre cualquier mesa.
• **Qué es / Para qué sirve:** Activa el motor de agrupación para fusionar físicamente dos o más mesas en una sola cuenta conjunta.
• **Cómo se usa:** Mantenga pulsada una mesa durante algo más de medio segundo. El terminal vibrará y desplegará en la parte superior la barra de herramientas dorada "Modo Unir Mesas". A continuación, pulse las mesas que se van a juntar (quedarán marcadas con un tic) y pulse el botón "Unir". Si una de ellas ya tenía comanda abierta, se conservará como mesa matriz.

• **Modal de Desunión de Mesas:** Ventana emergente activada al mantener pulsada durante 600 ms una mesa vinculada/hija.
• **Qué es / Para qué sirve:** Separa una mesa agrupada para que vuelva a estar libre e independiente en el plano, conservando los consumos en la mesa matriz.
• **Cómo se usa:** Mantenga pulsada la mesa hija. Aparecerá el modal "Desunir Mesa"; confirme la acción pulsando "Desunir". La mesa volverá al estado Libre verde de inmediato.

• **Botón "Venta Directa / Barra":** Botón de acceso rápido situado en la barra de herramientas.
• **Qué es / Para qué sirve:** Abre una sesión de venta rápida en el TPV para clientes de paso que consumen de pie en barra o piden para llevar sin ocupar una mesa física.
• **Cómo se usa:** Pulse "Venta Directa". Se abrirá el TPV con una comanda provisional lista para añadir consumiciones y cobrar en el acto.

• **Botón Volver / Cerrar Sesión:** Controles de navegación en la cabecera.
• **Qué es / Para qué sirve:** Regresa al Dashboard (usuarios autorizados) o cierra la sesión del camarero para ceder el terminal.
• **Cómo se usa:** Pulse "Atrás" para ir al menú principal o "Cerrar Sesión" para volver al teclado de PIN.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Recepción y Apertura de Mesa Estándar:** 1. El cliente entra en el local y se sienta en la Mesa 4 del Salón. 2. En el Plano de Mesas, verifique que la pestaña activa sea "Salón". 3. Toque sobre la tarjeta "M4" (en verde "LIBRE"). 4. El sistema abre el TPV con la comanda de la Mesa 4. 5. Seleccione las consumiciones y pulse "Enviar Comanda". 6. Al volver al plano, observe que la Mesa 4 luce ahora en rojo con el total acumulado.
• **Caso 2: Agrupación de Tres Mesas para un Cumpleaños:** 1. Llega un grupo de 10 personas que ocupará las mesas M5, M6 y M7. 2. Mantenga pulsada la tarjeta M5 durante medio segundo hasta notar la vibración. 3. Aparecerá la barra superior "Modo Unir Mesas" y M5 quedará marcada con un tic. 4. Toque sobre M6 y M7 para marcarlas. 5. Pulse el botón "Unir" en la barra dorada y confirme la fusión. 6. A partir de ese momento, M5 actuará como mesa maestra y M6 y M7 mostrarán el enlace "🔗 M5". Toda la comanda se gestionará tocando M5.

---

## 4. Módulo Terminal Punto de Venta (TPV / POS Screen)

### Propósito General y Flujo de Trabajo Principal
El TPV es el corazón operativo del restaurante. Su propósito es permitir a los camareros y personal de barra tomar pedidos con extrema rapidez, especificar variantes de platos y bebidas, registrar notas de cocina y advertencias severas de alérgenos, modificar comandas en curso y enviar las órdenes de marcha al KDS de cocina y barra.

El flujo de trabajo principal inicia al acceder desde una mesa o venta directa. El camarero navega por las categorías gastronómicas de la carta, pulsa sobre los productos deseados (seleccionando formato o variantes si procede), ajusta notas culinarias o de alérgenos en caso necesario, revisa el ticket lateral y pulsa "Enviar Comanda" para que los cocineros inicien la preparación.

### Catálogo de Elementos Funcionales

• **Barra de Familias y Categorías Gastronómicas:** Pestañas horizontales superiores (Bebidas, Entrantes, Carnes, Pescados, Postres, etc.).
• **Qué es / Para qué sirve:** Segmenta el catálogo gastronómico para localizar platos en menos de dos segundos.
• **Cómo se usa:** Toque la familia deseada (ej. "Entrantes"). La cuadrícula mostrará inmediatamente todos los productos de esa categoría.

• **Subcategorías Dinámicas:** Botones secundarios que aparecen al filtrar por una categoría padre (ej. "Cervezas", "Vinos" dentro de Bebidas).
• **Qué es / Para qué sirve:** Refina la búsqueda dentro de categorías amplias para agilizar la comanda.
• **Cómo se usa:** Toque la subcategoría específica para ver únicamente sus referencias.

• **Buscador Rápido de Productos:** Campo de texto con icono de lupa situado en la cabecera.
• **Qué es / Para qué sirve:** Permite localizar al instante cualquier plato tecleando las primeras letras de su nombre o escaneando su código de barras.
• **Cómo se usa:** Escriba el nombre (ej. "solomillo") o escanee la etiqueta; los resultados coinciden en tiempo real. Pulse la cruz para limpiar la búsqueda.

• **Tarjeta Táctil de Producto:** Casilla con fotografía optimizada, nombre en tipografía legible, precio en euros y badge de stock.
• **Qué es / Para qué sirve:** Es el botón de acción para agregar una unidad del producto a la comanda activa.
• **Cómo se usa:** Pulse una vez sobre el plato. El artículo se suma instantáneamente al ticket de la derecha. Si el plato cuenta con variantes o notas obligatorias, se abrirá el modal de selección antes de añadirse. Si el stock está en niveles mínimos, muestra un aviso de advertencia.

• **Modal de Formato / Variante (ProductVariant):** Ventana emergente con opciones de presentación (ej. "Media Ración", "Ración Entera", "Copa", "Botella").
• **Qué es / Para qué sirve:** Permite elegir la presentación solicitada por el cliente, aplicando automáticamente el precio de venta y el descuento de inventario asociado.
• **Cómo se usa:** Seleccione la variante deseada tocando sobre ella. El producto se incorporará al ticket con la variante especificada.

• **Modal de Modificadores y Notas de Cocina:** Ventana con botones de opciones (Punto de carne: Poco hecho, Al punto, Muy hecho; Salsas; Guarnición).
• **Qué es / Para qué sirve:** Transmite a cocina las especificaciones exactas del cliente, soportando suplementos de precio si procede.
• **Cómo se usa:** Toque el plato en el ticket para abrir sus notas, marque las opciones deseadas o escriba un texto libre y pulse "Guardar".

• **Caja de Alerta de Alérgenos e Intolerancias:** Campo de notas con tipografía destacada e icono de advertencia.
• **Qué es / Para qué sirve:** Alerta a los cocineros en el KDS de alergias alimentarias críticas (Sin Gluten, Sin Lactosa, Alergia a Frutos Secos) para evitar contaminación cruzada.
• **Cómo se usa:** Escriba la alergia del cliente en las notas de cocina del plato. El sistema la encapsulará en una caja roja de alta visibilidad en la pantalla de cocina.

• **Panel Lateral de Comanda (Ticket Activo):** Columna derecha donde se detallan los platos pedidos, cantidades, precios unitarios y subtotales.
• **Qué es / Para qué sirve:** Muestra el estado completo de la cuenta, diferenciando entre artículos ya guardados/enviados a cocina y nuevos artículos añadidos en el turno actual.
• **Cómo se usa:** Revise la lista para verificar que la comanda coincide con lo solicitado por los comensales antes de procesarla.

• **Controles de Cantidad (+ / -) y Botón Eliminar (Papelera):** Botones situados junto a cada línea de producto en el ticket.
• **Qué es / Para qué sirve:** Modifica las unidades de un plato o elimina una línea introducida por error.
• **Cómo se usa:** Pulse "+" para añadir otra unidad, "-" para restar una unidad, o el icono de papelera roja para retirar el producto del ticket (solo permitido para artículos aún no cocinados o con permiso de encargado).

• **Selector de Comensales (Icono Users):** Contador numérico situado en la cabecera de la comanda.
• **Qué es / Para qué sirve:** Registra el número de personas sentadas en la mesa para calcular ratios de ticket medio por persona y facilitar la posterior división de cuenta.
• **Cómo se usa:** Pulse los botones de incremento/decremento para ajustar el número exacto de personas en la mesa.

• **Botón Descuento Manual (Icono Tag / %):** Botón para aplicar promociones o cortesías comerciales.
• **Qué es / Para qué sirve:** Permite descontar un porcentaje (ej. 10%) o una cantidad fija en euros de la cuenta, validado por rol.
• **Cómo se usa:** Pulse el botón, elija el tipo de descuento (Porcentaje o Importe Fijo), introduzca la cifra y confirme. El total del ticket se recalcula de inmediato.

• **Botón "Mover Mesa" (Icono Doble Flecha Contrapuesta):** Botón de cambio de ubicación física.
• **Qué es / Para qué sirve:** Traspasa la comanda íntegra a otra mesa si los clientes se mudan de sitio (ej. de Salón a Terraza), o fusiona ambas cuentas si la mesa de destino ya tenía consumiciones.
• **Cómo se usa:** Pulse "Mover Mesa", elija la zona y la mesa de destino en el modal y confirme. La mesa anterior queda libre y la comanda se traslada al nuevo destino.

• **Botón "Lanzar Visor de Cliente (CFD)" (Icono Monitor):** Botón con indicador de enlace.
• **Qué es / Para qué sirve:** Abre o sincroniza el visor de cliente externo para que el comensal visualice su ticket en tiempo real y el código QR de pago móvil.
• **Cómo se usa:** Pulse el botón. Se abrirá la ventana emergente del CFD en el monitor secundario y el icono se iluminará en color activo tras el handshake PING/PONG.

• **Botón "Enviar a Cocina" (Icono Avión de Papel / Send):** Botón de marcha de comanda.
• **Qué es / Para qué sirve:** Transmite inmediatamente todos los platos nuevos a la pantalla de cocina KDS y a la impresora de tickets de barra, guardando la comanda en base de datos.
• **Cómo se usa:** Una vez anotado el pedido completo, pulse "Enviar a Cocina". El sistema emitirá un sonido de confirmación, vaciará el carrito temporal y actualizará la mesa en el plano.

• **Botón "Cobrar" (Icono Tarjeta / CreditCard):** Botón destacado en color de acento de marca.
• **Qué es / Para qué sirve:** Da paso al modal de facturación, desglose de pagos y cierre de cuenta.
• **Cómo se usa:** Pulse "Cobrar" cuando los clientes soliciten la cuenta.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Toma Completa de Comanda con Puntos de Carne y Alérgenos:** 1. Abra la Mesa 2 desde el plano. 2. Toque la categoría "Bebidas" y pulse dos veces sobre "Cerveza Especial" (se añaden 2 unidades al ticket). 3. Toque la categoría "Carnes" y pulse "Solomillo de Ternera". 4. En el modal emergente, marque el punto de carne "Poco hecho" y en notas escriba "CELÍACO - SIN GLUTEN". 5. Guarde la nota. Verifique que en el ticket lateral el plato aparece con la advertencia en rojo. 6. Pulse "Enviar a Cocina". La orden viaja instantáneamente a la pantalla del cocinero.
• **Caso 2: Modificación de Comanda y Traspaso de Mesa:** 1. Los clientes de la Mesa 2 solicitan cambiarse a la Terraza en la Mesa T3. 2. Abra la comanda de la Mesa 2 en el TPV. 3. Pulse el botón "Mover Mesa". 4. En el selector, elija la zona "Terraza" y pulse sobre "T3". 5. Confirme el traspaso. La Mesa 2 queda libre al instante y la Mesa T3 se ilumina en rojo con la cuenta intacta.

---

## 5. Módulo de Gestión de Cobros, Facturación y Pago Dividido

### Propósito General y Flujo de Trabajo Principal
El módulo de Cobros y Facturación es el responsable de liquidar las comandas de forma rápida, exacta y conforme a las exigencias legales de facturación simplificada (TicketBAI / VeriFactu). Su propósito es admitir múltiples medios de pago (efectivo, datáfono bancario, propinas), calcular automáticamente los cambios a entregar y resolver situaciones complejas de división de cuenta entre comensales.

El flujo de trabajo principal se inicia al pulsar "Cobrar" desde el TPV. El usuario selecciona si el cobro será íntegro o dividido. Si es en efectivo, se introduce el dinero entregado por el cliente y el TPV calcula el cambio exacto; si es por tarjeta, se enlaza con el datáfono Redsys o terminal bancario. Tras confirmar el pago, se imprime el ticket simplificado mediante Bluetooth y la mesa queda automáticamente libre y desinfectada en el plano para nuevos clientes.

### Catálogo de Elementos Funcionales

• **Selector de Modo de Cobro:** Pestañas superiores en el modal de cobro: "Total Completo" (full), "Por Comensales" (diners), "Por Artículos" (items).
• **Qué es / Para qué sirve:** Determina la estrategia de liquidación: cobrar la mesa de una sola vez, repartir el importe a partes iguales entre varios pagadores, o cobrar productos individuales a cada persona.
• **Cómo se usa:** Toque la modalidad deseada según la petición de los clientes.

• **Selector de Medio de Pago (Efectivo vs. Tarjeta):** Botones con iconos de billete (Banknote) y tarjeta de crédito (CreditCard).
• **Qué es / Para qué sirve:** Asigna la transacción al canal contable correspondiente para el posterior arqueo de caja e informe Z.
• **Cómo se usa:** Toque "Efectivo" si el cliente abona en monedas/billetes, o "Tarjeta" si abona mediante TPV bancario.

• **Teclado Numérico de Entrega de Efectivo y Botones de Billetes Rápidos (5 €, 10 €, 20 €, 50 €):** Interfaz para introducir el dinero físico recibido.
• **Qué es / Para qué sirve:** Calcula al milímetro el cambio (vueltas) a entregar al cliente, evitando errores matemáticos durante las horas punta.
• **Cómo se usa:** Pulse el botón del billete entregado por el cliente (ej. billete de 50 €) o teclee el importe exacto. En la pantalla aparecerá de inmediato la casilla "Cambio a devolver" destacada en color verde con la cifra exacta.

• **Integración Datáfono Redsys:** Módulo de comunicación con el terminal bancario físico.
• **Qué es / Para qué sirve:** Envía el importe exacto al datáfono por red o Bluetooth para que el cliente acerque su tarjeta o teléfono (Apple Pay / Google Pay) sin necesidad de teclear la cantidad manualmente en el dispositivo.
• **Cómo se usa:** Al pulsar "Tarjeta", el datáfono se activa con el importe. Una vez aprobada la operación bancaria, el TPV marca el cobro como completado.

• **Función "Dividir Cuenta por Comensales" (Split Bill Equitativo):** Control de división con selector numérico.
• **Qué es / Para qué sirve:** Divide el total de la mesa en fracciones idénticas (ej. cuenta de 80 € entre 4 amigos = 20 € por persona), permitiendo que cada uno pague con un método distinto (unos en tarjeta y otros en efectivo).
• **Cómo se usa:** Seleccione "Por Comensales", elija el número de personas (ej. 4). El sistema mostrará la cuota de cada uno. Cobre la primera parte; el saldo restante se actualizará automáticamente hasta completar el 100% de la cuenta.

• **Función "Dividir Cuenta por Artículos" (Split Bill Selectivo):** Selector de líneas de platos individuales.
• **Qué es / Para qué sirve:** Permite cobrar a un cliente que se marcha antes únicamente las consumiciones que él disfrutó (ej. su café y su tostada), dejando el resto de la cuenta pendiente en la mesa.
• **Cómo se usa:** Seleccione "Por Artículos", marque las casillas de los productos que va a abonar este comensal y pulse cobrar. Los productos cobrados se retiran de la cuenta y la mesa permanece abierta con los artículos restantes.

• **Botón "Imprimir Ticket / Factura Simplificada" (Icono Printer):** Botón para lanzar la orden de impresión térmica Bluetooth.
• **Qué es / Para qué sirve:** Genera el comprobante físico con datos fiscales, desglose de IVA (10%), número de factura correlativo y código de verificación.
• **Cómo se usa:** Pulse "Imprimir Ticket". La impresora térmica de 58mm o 80mm emitirá el comprobante y el electroimán abrirá el cajón portamonedas.

• **Botón "Finalizar y Liberar Mesa":** Botón de cierre definitivo de la transacción.
• **Qué es / Para qué sirve:** Archiva la comanda con estado 'paid', registra las formas de pago en el módulo de caja y libera la mesa en el plano colocándola en verde "LIBRE".
• **Cómo se usa:** Pulse el botón tras entregar el cambio o el ticket al cliente.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Cobro Rápido en Efectivo con Cálculo de Vueltas:** 1. La Mesa 1 pide la cuenta (Total: 23,50 €). 2. En el TPV, pulse "Cobrar". 3. Seleccione el método "Efectivo". 4. El cliente le entrega un billete de 50 €. Pulse el botón rápido "50 €". 5. La pantalla le indica con claridad meridiana: "Cambio: 26,50 €". 6. Abra el cajón portamonedas, entregue los 26,50 € al cliente y pulse "Imprimir y Cerrar". La comanda se archiva y la Mesa 1 pasa a verde libre.
• **Caso 2: Cuenta Dividida entre Dos Personas (Pago Mixto Tarjeta + Efectivo):** 1. Una mesa con una cuenta de 40 € desea pagar la mitad en efectivo y la mitad con tarjeta. 2. Pulse "Cobrar" y seleccione la pestaña "Por Comensales". 3. Ajuste el contador a 2 personas (importe por persona: 20,00 €). 4. Seleccione "Efectivo" para el primer comensal, introduzca 20 € y confirme el cobro. El sistema emite el primer ticket de 20 € y muestra que quedan 20 € pendientes. 5. Seleccione "Tarjeta" para el segundo comensal y pase la tarjeta por el datáfono. 6. Al completarse los dos cobros, la cuenta queda totalmente saldada y la mesa se libera.

---

## 6. Módulo de Pantalla de Cocina y Barra (Kitchen Display System - KDS)

### Propósito General y Flujo de Trabajo Principal
El KDS sustituye los tradicionales tickets de papel impresos en cocina por una pantalla táctil interactiva en tiempo real. Su propósito es coordinar el ritmo de trabajo entre sala y cocina, garantizar que los platos se elaboren siguiendo un riguroso orden FIFO (First-In, First-Out), minimizar los tiempos de espera y erradicar cualquier error en notas de intolerancias o alérgenos.

El flujo de trabajo principal consiste en recibir las comandas en columnas dinámicas tan pronto como los camareros las envían desde el TPV. El personal de cocina visualiza los platos ordenados por familia, comprueba las alertas cromáticas de tiempo de espera y las notas de alérgenos, toca cada plato al finalizar su elaboración para marcarlo como "Listo" (notificando a sala que está listo para recoger), y vuelve a tocarlo al ser retirado hacia la mesa para marcarlo como "Servido". Cuando todos los platos de una orden han salido, el ticket se retira automáticamente de la pantalla.

### Catálogo de Elementos Funcionales

• **Selector de Estación de Trabajo (TODO, COCINA, BARRA):** Pestañas superiores de filtrado inteligente.
• **Qué es / Para qué sirve:** Permite que cada partida física del restaurante vea únicamente los productos de su competencia. La pantalla de la cocina caliente filtra automáticamente las bebidas; la pantalla de la barra muestra solo cócteles, vinos y cafés; y la pantalla del Jefe de Pase o Encargado ("TODO") muestra la orden completa coordinada.
• **Cómo se usa:** Toque la pestaña correspondiente a su partida física (ej. "COCINA"). La pantalla adaptará la lista de pedidos al instante.

• **Tarjeta de Comanda Digital (Ticket de Pedido):** Columna vertical que representa una mesa o servicio.
• **Qué es / Para qué sirve:** Agrupa todos los platos pedidos para una misma mesa, indicando el nombre de la mesa (ej. "Mesa 3"), la hora de envío y el tiempo exacto transcurrido en minutos.
• **Cómo se usa:** Trabaje las comandas priorizando las que se ubiquen más a la izquierda de la pantalla, que son las que tienen mayor tiempo de espera acumulado.

• **Semáforo Cromático de Tiempos de Espera (SLA Visual):** Cabecera de la comanda con código de color dinámico.
• **Qué es / Para qué sirve:** Alerta a los cocineros del nivel de demora de la mesa sin necesidad de calcular la hora mentalmente.
• **Cómo se usa:** Identifique visualmente el estado:
  - **Verde Esmeralda (0 a 14 minutos):** Servicio en ritmo correcto.
  - **Amarillo Ámbar (15 a 30 minutos):** Tiempo de espera elevado; requiere priorizar la salida de estos platos.
  - **Rojo Carmesí Pulsante (> 30 minutos):** Alerta crítica con parpadeo; mesa con retraso severo que exige atención inmediata del jefe de cocina.

• **Renglón de Plato Interactivo con Formato:** Cada plato listado dentro de la comanda con su cantidad (ej. "2x Solomillo") y presentación ("Format: Ración").
• **Qué es / Para qué sirve:** Representa el ítem a cocinar y permite avanzar su estado de producción de forma táctil.
• **Cómo se usa:** 
  - **Toque 1 (Plato Pendiente -> Listo):** Al emplatar el producto, toque sobre el renglón. Su fondo cambiará a verde suave con una marca de verificación (CheckCircle), indicando a los camareros de sala que el plato está listo en el pase.
  - **Toque 2 (Plato Listo -> Servido):** Cuando el camarero retira el plato hacia la sala, toque nuevamente sobre el renglón. El plato queda registrado como "Servido" y se oculta.

• **Caja Roja de Alerta de Alérgenos e Intolerancias:** Contenedor destacado en color rojo de alto contraste situado bajo el nombre del plato.
• **Qué es / Para qué sirve:** Resalta de forma inequívoca peticiones críticas de comensales (ej. "CELÍACO - SIN GLUTEN", "Alérgico a mariscos") para evitar errores que comprometan la salud del cliente.
• **Cómo se usa:** Lea obligatoriamente el contenido de esta caja antes de iniciar la manipulación de ingredientes y aplique el protocolo de desinfección de utensilios correspondiente.

• **Autocierre de Ticket:** Comportamiento inteligente del sistema.
• **Qué es / Para qué sirve:** Despeja la pantalla automáticamente cuando el último plato de la comanda ha sido despachado como "Servido", manteniendo el área de trabajo limpia y enfocada en los pedidos pendientes.
• **Cómo se usa:** No requiere acción manual; ocurre automáticamente al marcar como servido el último artículo del ticket.

• **Botón de Refresco Manual (Icono Flecha Circular / RefreshCw):** Botón situado en la esquina superior derecha.
• **Qué es / Para qué sirve:** Fuerza una relectura instantánea de la base de datos en caso de microcortes en la red Wi-Fi del restaurante.
• **Cómo se usa:** Pulse el botón si sospecha que una comanda enviada desde sala no se ha reflejado de inmediato por problemas de cobertura.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Recepción, Marcha y Despacho de Platos en Cocina:** 1. En la pantalla táctil de la cocina, entra una nueva comanda para la Mesa 5 con dos platos: "1x Ensalada Mixta" y "1x Chuletón". 2. La cabecera luce en color verde (0 minutos). 3. El cocinero termina de preparar la ensalada: toca el renglón de la ensalada; esta cambia a verde con un tic "Listo". 4. Diez minutos más tarde, el chuletón sale de la parrilla: el cocinero toca el chuletón; cambia a "Listo". 5. El camarero llega al pase y retira ambos platos hacia la mesa: el jefe de pase toca ambos platos una segunda vez para marcarlos como "Servidos". 6. Al haberse servido todo, la tarjeta de la Mesa 5 desaparece de la pantalla.
• **Caso 2: Gestión de una Comanda con Alerta de Alérgeno Crítica:** 1. Aparece un ticket para la Mesa 2 con "1x Hamburguesa Gourmet". 2. Directamente debajo del plato, resalta una caja roja con el texto: "¡ALERGIA GRAVE AL SÉSAMO - PAN ESPECIAL!". 3. El cocinero utiliza guantes limpios y hornea el pan especial sin semillas en una bandeja aislada. 4. Una vez montada la hamburguesa, toca el plato para avisar a sala de que está lista y segura para su entrega.

---

## 7. Módulo de Pantalla Visor de Cliente (Customer Facing Display - CFD)

### Propósito General y Flujo de Trabajo Principal
El Visor de Cliente (CFD) es la pantalla secundaria orientada hacia los clientes en el mostrador o barra. Su propósito es brindar máxima transparencia comercial durante la transacción, proyectar la imagen corporativa de marca blanca del establecimiento y facilitar pagos móviles rápidos mediante códigos QR dinámicos.

El flujo de trabajo principal opera mediante sincronización continua broadcast con latencia inferior a 50 ms. Tan pronto como el camarero pulsa un producto en el TPV, el artículo, su precio y sus variantes se reflejan de inmediato en la pantalla del cliente. Al solicitar la cuenta, el CFD proyecta el importe total en tipografía gigante y genera un código QR dinámico de alta definición para que el cliente pueda abonar su consumición directamente con su teléfono inteligente (Bizum, Apple Pay, Google Pay).

### Catálogo de Elementos Funcionales

• **Selector de Vinculación de Mesa / Mostrador (Modo Kiosco):** Selector desplegable que permite asociar la pantalla CFD a una mesa física o puesto de barra determinado.
• **Qué es / Para qué sirve:** Conecta la pantalla del visor con el terminal de ventas que atiende ese punto concreto del mostrador.
• **Cómo se usa:** Seleccione la mesa o barra que desea monitorizar en este visor. A partir de ese momento, todos los movimientos de ese TPV se reflejarán en la pantalla.

• **Panel Izquierdo: Desglose de Pedido en Vivo:** Área izquierda de la pantalla en alto contraste.
• **Qué es / Para qué sirve:** Muestra al comensal cada artículo añadido al ticket en tiempo real (cantidad, nombre del plato, formato e importe en euros).
• **Cómo se usa:** El cliente lee el panel mientras el camarero marca las consumiciones, permitiendo detectar cualquier malentendido de viva voz antes de que el pedido sea marchado o cobrado.

• **Panel Derecho: Importe Total a Pagar:** Tipografía monoespaciada gigante de más de 60px de tamaño.
• **Qué es / Para qué sirve:** Proyecta la cifra final exacta en euros (€) con visibilidad nítida a varios metros de distancia, evitando que el cliente tenga que preguntar el importe al camarero.
• **Cómo se usa:** Se actualiza automáticamente con cada producto, descuento o modificación aplicada en el TPV.

• **Generador de Código QR Dinámico (Nivel H):** Módulo de código QR interactivo generado en tiempo real.
• **Qué es / Para qué sirve:** Permite al cliente escanear el código con la cámara de su teléfono móvil para proceder al pago digital directo de la cuenta o dejar propinas electrónicas.
• **Cómo se usa:** El cliente enfoca con la cámara de su móvil, se abre la pasarela de pago seguro en su navegador y abona el importe sin necesidad de entregar tarjetas físicas ni efectivo. El QR se oculta automáticamente si la cuenta está a 0,00 €.

• **Área de Marca Blanca y Mensajes de Cortesía:** Encabezado con logotipo del restaurante y pie con mensaje de bienvenida y agradecimiento ("¡Gracias por tu visita!").
• **Qué es / Para qué sirve:** Refuerza la identidad visual del negocio y ofrece una experiencia de compra moderna y profesional.
• **Cómo se usa:** Se configura de forma global desde el módulo de Configuración > Marca Blanca.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Puesta en Marcha en Segundo Monitor de Mostrador:** 1. Conecte un monitor secundario o tablet al terminal TPV. 2. En el TPV, abra la comanda de Barra y pulse el icono de monitor "CFD". 3. Se abrirá una ventana configurada para el visor; arrástrela al monitor del cliente y pulse F11 para activar la pantalla completa. 4. Marque un café y un cruasán en el TPV: observe cómo aparecen instantáneamente en el visor con su total de 3,20 €. 5. El cliente lee el importe y le entrega el dinero exacto con total confianza.

---

## 8. Módulo de Gestión de Caja y Tesorería Diaria (Cash Register)

### Propósito General y Flujo de Trabajo Principal
El módulo de Gestión de Caja controla todos los flujos monetarios en metálico del restaurante. Su propósito es custodiar el efectivo, registrar con estricta trazabilidad de auditoría cualquier entrada o salida manual de dinero, prevenir pérdidas y emitir el informe legal vinculante de Cierre Diario (Informe Z) exigido por la Agencia Tributaria.

El flujo de trabajo principal consta de cuatro fases diarias: 1) Al iniciar la jornada, el encargado realiza la "Apertura de Caja" introduciendo el fondo inicial de cambio (suelo de caja); 2) Durante el servicio, el sistema computa automáticamente las ventas cobradas en efectivo desde el TPV; 3) Si surge un gasto imprevisto (ej. compra urgente de hielo), se asienta una "Salida de Caja" justificada; 4) Al finalizar el servicio, se ejecuta el "Arqueo Ciego" (conteo físico de monedas y billetes), se valida si existe descuadre y se emite el Cierre Z definitivo.

### Catálogo de Elementos Funcionales

• **Monitor de Estado de Turno de Caja:** Indicador visual superior de gran visibilidad (Verde = CAJA ABIERTA, Rojo = CAJA CERRADA).
• **Qué es / Para qué sirve:** Informa al personal si la caja está operativa para admitir cobros en metálico o si requiere una apertura previa.
• **Cómo se usa:** Si se encuentra en rojo, debe introducirse el fondo de apertura antes de poder operar en sala.

• **Formulario de Apertura de Caja (Fondo Inicial / Suelo):** Campo numérico para introducir el dinero base de cambio.
• **Qué es / Para qué sirve:** Asienta el importe en metálico disponible en la gaveta portamonedas para dar cambio a los primeros clientes del turno.
• **Cómo se usa:** Cuente el dinero base disponible en el cajón (ej. 150,00 €), escriba la cantidad en el campo y pulse "Abrir Caja". El estado cambiará de inmediato a verde "CAJA ABIERTA".

• **Botón "Apertura de Cajón" (Icono Impresora / Drawer Kick):** Botón para accionar la gaveta portamonedas a distancia.
• **Qué es / Para qué sirve:** Envía un pulso eléctrico ESC/POS a través de la impresora térmica Bluetooth emparejada para que el electroimán libere la apertura del cajón sin necesidad de registrar una venta. Requiere permiso de encargado.
• **Cómo se usa:** Pulse el botón; el cajón se abrirá con un chasquido físico característico. La acción queda registrada en el registro de auditoría con la hora y el nombre del empleado actuante.

• **Botón "Entrada de Efectivo" (Icono Flecha Abajo / In):** Botón para registrar ingresos extraordinarios de dinero.
• **Qué es / Para qué sirve:** Registra aportaciones manuales de efectivo no procedentes de tickets de clientes (ej. ingreso de monedas de cambio traídas del banco).
• **Cómo se usa:** Pulse el botón, introduzca el importe ingresado (ej. 50,00 €), escriba el motivo obligatorio (ej. "Monedas de cambio del banco") y confirme. El saldo esperado de caja se incrementará en esa cantidad.

• **Botón "Salida de Efectivo" (Icono Flecha Arriba / Out):** Botón para registrar pagos o extracciones menores en metálico.
• **Qué es / Para qué sirve:** Asienta pagos de gastos imprevistos de caja chica (ej. compra urgente de limones en el mercado, pago al repartidor de hielo) para que el arqueo nocturno cuadre al céntimo.
• **Cómo se usa:** Pulse el botón, introduzca el importe extraído (ej. 15,00 €), redacte el motivo (ej. "Compra de limones en frutería según ticket 45") y confirme. El saldo esperado se reducirá automáticamente.

• **Tarjetas KPI en Tiempo Real:** Cuatro paneles de control contable continuo:
  - **Fondo Inicial:** Cifra con la que se abrió el turno.
  - **Ventas en Efectivo:** Total acumulado de tickets cobrados en metálico en el TPV.
  - **Movimientos Netos:** Balance resultante de Entradas Menos Salidas manuales.
  - **Saldo Esperado en Cajón:** Cifra teórica calculada por el sistema: Fondo Inicial + Ventas Efectivo + Entradas - Salidas.
• **Qué es / Para qué sirve:** Proporciona supervisión continua de la tesorería en curso sin necesidad de esperar al final de la jornada.
• **Cómo se usa:** Verifique periódicamente que las cifras coinciden con la actividad del negocio.

• **Formulario de Arqueo Físico Ciego y Cierre de Caja (Cierre Z):** Campo para introducir el dinero real contado en el cajón.
• **Qué es / Para qué sirve:** El encargado cuenta físicamente todo el dinero en monedas y billetes presentes en el cajón e introduce la cifra real sin que el sistema le revele previamente si falta o sobra dinero (arqueo ciego para evitar manipulaciones).
• **Cómo se usa:** Cuente el dinero físico del cajón, introduzca la cantidad en el campo "Efectivo Contado" y pulse "Cerrar Caja". El sistema comparará la cifra con el Saldo Esperado y mostrará el balance:
  - **Descuadre = 0,00 €:** Cuadre contable perfecto.
  - **Descuadre Positivo (> 0):** Sobrante de caja (dinero de más).
  - **Descuadre Negativo (< 0):** Faltante de caja (falta dinero). En caso de descuadre, el sistema solicitará una justificación obligatoria antes de sellar el Cierre Z.

• **Historial de Movimientos de Caja:** Lista cronológica con fecha, hora, tipo de movimiento, importe, motivo y nombre del empleado responsable.
• **Qué es / Para qué sirve:** Ofrece trazabilidad forense completa ante cualquier auditoría o discrepancia de caja.
• **Cómo se usa:** Consulte la lista para verificar quién realizó cada extracción o entrada de dinero durante el turno.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Apertura de Turno Matinal:** 1. Inicie sesión como encargado y pulse "Gestión de Caja". 2. La pantalla indica "Caja Cerrada". 3. Cuente el dinero del cajón: hay exactamente 120,00 € en monedas y billetes pequeños. 4. Escriba 120 en el campo de importe y pulse "Abrir Caja". 5. La caja pasa a estado "Abierta" y los camareros ya pueden registrar ventas en efectivo en el TPV.
• **Caso 2: Registro de Salida de Dinero para un Gasto Urgente:** 1. El repartidor de pan entrega un albarán de 18,50 € que debe pagarse en mano. 2. El encargado accede a "Gestión de Caja" y pulsa "Salida de Efectivo". 3. Introduce el importe "18.50" y en el motivo escribe "Pago panadería albarán 1042". 4. Confirma la salida. El cajón se abre, retira los 18,50 € y el sistema anota la salida. En el panel KPI, el saldo esperado se ajusta de inmediato.
• **Caso 3: Arqueo Nocturno y Emisión del Cierre Z:** 1. Al terminar el servicio de cenas, acceda a "Gestión de Caja". 2. Extraiga la gaveta portamonedas y cuente el dinero: totaliza 542,00 €. 3. En el campo de cierre, introduzca 542 y pulse "Cerrar Caja". 4. El sistema indica que el saldo esperado era de 542,00 €: "¡Descuadre 0,00 €! Cuadre perfecto". 5. Confirme el cierre. Se imprime el informe fiscal Z y la caja queda sellada hasta la mañana siguiente.

---

## 9. Módulo de Inventario, Gestión de Carta, Almacén y Escandallos (Inventory Management)

### Propósito General y Flujo de Trabajo Principal
El módulo de Inventario y Carta es el motor logístico y técnico de GastroPOS Suite. Su propósito es centralizar la gestión de productos de venta y materias primas, definir escandallos con factor de rendimiento real (Yield Management), controlar las existencias físicas en almacén, recepcionar albaranes de proveedores recalculando automáticamente el Precio Medio Ponderado (PMP) y cumplir estrictamente la normativa comunitaria sobre los 14 alérgenos alimentarios obligatorios.

El flujo de trabajo principal abarca: 1) Alta y categorización de productos (simples y recetas compuestas); 2) Configuración de escandallos donde se detallan los gramos o mililitros de ingredientes que componen cada plato; 3) Recepción de albaranes de compra mediante la herramienta "Recibir Albarán", que actualiza el stock y el coste unitario; 4) Deducción automática de materias primas cada vez que se cobra un plato en el TPV; y 5) Registro de mermas por rotura o caducidad.

### Catálogo de Elementos Funcionales

• **Pestañas de Navegación del Catálogo Logístico:** Nueve pestañas especializadas situadas en la cabecera:
  - **Productos (Package):** Catálogo maestro de referencias de venta al público y materias primas.
  - **Categorías (Tag):** Familias gastronómicas principales con asignación de estación KDS (Cocina, Barra, Ninguna).
  - **Subcategorías (GitFork):** Familias secundarias dependientes de una categoría padre.
  - **Proveedores (Truck):** Fichero de empresas distribuidoras con teléfonos y datos de contacto comercial.
  - **Pedidos de Compra (Scroll):** Gestor de órdenes de reposición emitidas manual o automáticamente.
  - **Alérgenos (Wheat):** Catálogo de los 14 alérgenos de declaración obligatoria según la UE (Gluten, Crustáceos, Huevos, Pescado, Cacahuetes, Soja, Lácteos, Frutos de cáscara, Apio, Mostaza, Sésamo, Sulfitos, Altramuces, Moluscos).
  - **Unidades de Medida (Scale):** Magnitudes base del restaurante (kg, g, l, ml, unidad, ración, botella).
  - **Tipos de Merma (Ban):** Motivos estandarizados de pérdida de producto (Caducidad, Rotura, Elaboración defectuosa).
  - **Promociones (Percent):** Reglas de descuento programado por horario (Happy Hour) o días de semana.
• **Qué es / Para qué sirve:** Estructura todo el entramado de compras, almacenamiento y comercialización del restaurante.
• **Cómo se usa:** Toque la pestaña correspondiente para gestionar esa área logística.

• **Buscador Dinámico y Filtro de Categorías:** Campos de filtrado reactivo superior.
• **Qué es / Para qué sirve:** Filtra al vuelo entre miles de referencias por nombre, código de barras o proveedor.
• **Cómo se usa:** Teclee el término buscado o seleccione una categoría del menú desplegable.

• **Botón "Recibir Albarán" (Icono FolderInput):** Herramienta de entrada masiva de compras.
• **Qué es / Para qué sirve:** Permite registrar la mercancía recibida de un proveedor introduciendo cantidades y precios de compra. Aplica automáticamente la fórmula contable del **Precio Medio Ponderado (PMP)** para recalcular el coste real de los ingredientes:
  *PMP = [(Stock Actual * Coste Anterior) + (Cantidad Entrante * Precio Compra)] / (Stock Total Resultante)*.
• **Cómo se usa:** Pulse el botón, elija el proveedor, seleccione los productos recibidos con sus unidades y precios de albarán, y pulse "Registrar Albarán". El stock y los costes de escandallo se actualizan al instante.

• **Botón "Nuevo Producto / Plato" (Icono Plus / +):** Botón principal de alta de referencias.
• **Qué es / Para qué sirve:** Abre el formulario maestro para dar de alta una nueva comida, bebida o ingrediente.
• **Cómo se usa:** Pulse el botón, rellene nombre, PVP con IVA, categoría, seleccione la foto (optimizada automáticamente a 600px en memoria) y defina si es producto simple o receta compuesta.

• **Interruptor de Visibilidad TPV (Casilla Checkbox / Switch Activo):** Control individual por producto en la tabla.
• **Qué es / Para qué sirve:** Permite ocultar temporalmente un plato de la botonera del TPV de los camareros (ej. si se ha agotado un pescado fresco en mitad del servicio) sin borrar el plato ni alterar sus recetas históricas.
• **Cómo se usa:** Desmarque la casilla; el producto desaparecerá inmediatamente del TPV de sala. Cuando vuelva a haber stock, márquela de nuevo para activarlo.

• **Ficha de Escandallos con Factor de Rendimiento (Yield Management):** Subsección del formulario de productos compuestos.
• **Qué es / Para qué sirve:** Vincula las materias primas necesarias para elaborar un plato, aplicando el porcentaje de merma limpia o rendimiento. Por ejemplo, en un solomillo con 80% de rendimiento, el sistema calcula: *Coste Real = (Coste Kilo * Gramos) / 0,80*.
• **Cómo se usa:** Añada los ingredientes uno a uno indicando la cantidad requerida por ración. El coste total del plato se recalcula automáticamente y el margen bruto se actualiza en pantalla.

• **Menú Contextual de Fila (Tres Puntos / Opciones por Producto):**
  - **Editar (Edit2):** Modifica precios, recetas o información general.
  - **Historial de Movimientos (History):** Auditoría cronológica de entradas, ventas en TPV y mermas.
  - **Registrar Merma (TrendingDown):** Da de baja unidades de producto especificando el motivo legal.
  - **Imprimir Etiqueta Código de Barras (Barcode):** Emite etiquetas térmicas adhesivas con código Code128 o QR para productos envasados.
  - **Eliminar con Salvaguarda Fiscal (Trash2):** Si el producto tiene ventas históricas, el sistema bloquea su borrado físico para cumplir la Ley Antifraude y ofrece la opción segura de "Desactivar".
• **Qué es / Para qué sirve:** Proporciona control total sobre el ciclo de vida de cada referencia individual.
• **Cómo se usa:** Pulse sobre los tres puntos de la fila del producto deseado y elija la acción.

• **Botones Exportar CSV e Importar CSV Masivo:** Herramientas de procesamiento por lotes en la barra superior.
• **Qué es / Para qué sirve:** Permite volcar todo el catálogo a una hoja Excel con 13 columnas o importar catálogos masivos desde proveedores.
• **Cómo se usa:** Pulse "Exportar CSV" para descargar el archivo o "Importar CSV" para subir un catálogo por lotes.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Creación de un Plato Compuesto con Escandallo y Alérgenos:** 1. Acceda a "Inventario y Carta" y pulse "Nuevo Producto". 2. Rellene: Nombre = "Hamburguesa Angus Gourmet", PVP = "14,50 €", Categoría = "Carnes". 3. Marque la casilla "Producto Compuesto (Receta)". 4. En la sección de escandallo, añada: "Carne Angus" (200 gramos), "Pan Brioche" (1 unidad), "Queso Cheddar" (2 lonchas). El sistema calcula que el coste total de ingredientes es de 3,80 € (Margen: 73,8%). 5. En alérgenos, marque "Gluten" y "Lácteos". 6. Guarde el plato. A partir de ahora, cada vez que se venda una hamburguesa en el TPV, el almacén descontará automáticamente 200g de carne, 1 pan y 2 lonchas de queso.
• **Caso 2: Recepción de Albarán de Proveedor con Actualización de Costes:** 1. Llega el camión de carnes con un albarán de compra. 2. Pulse "Recibir Albarán", seleccione el proveedor "Carnes del Norte". 3. Seleccione "Carne Angus", introduzca 10 kg y precio de 12,00 €/kg. 4. Pulse "Registrar Albarán". El stock de carne sube de inmediato en 10 kg y el PMP se recalcula contablemente.
• **Caso 3: Registro de Merma por Rotura de Botella:** 1. Durante el servicio se cae una botella de vino en bodega y se rompe. 2. En la lista de inventario, busque la referencia "Vino Rioja Crianza". 3. Pulse sobre sus tres puntos y elija "Registrar Merma". 4. Seleccione Motivo = "Rotura accidental", Cantidad = "1", Observaciones = "Caída en bodega". 5. Confirme. El stock se deduce justificadamente en el registro de auditoría.

---

## 10. Módulo de Ingeniería de Menú y Rentabilidad Estratégica (Menu Engineering)

### Propósito General y Flujo de Trabajo Principal
El módulo de Ingeniería de Menú es la herramienta de inteligencia de negocio que optimiza el margen de beneficio de la carta. Su propósito es cruzar automáticamente los costes reales de los escandallos (Inventory) con las ventas reales registradas en el TPV (POS) para clasificar cada plato dentro de la prestigiosa **Matriz BCG de Kasavana & Smith**, diagnosticar anomalías de rentabilidad y simular cambios de precios antes de aplicarlos.

El flujo de trabajo principal consiste en: 1) Seleccionar una ventana temporal de análisis (últimos 7, 30, 90 días o histórico); 2) Examinar la gráfica de dispersión y la clasificación en los cuatro cuadrantes (Estrellas, Vacas Lecheras, Interrogantes y Perros); 3) Revisar el semáforo de Food Cost de recetas compuestas; 4) Utilizar el simulador What-If para evaluar el impacto de subir o bajar precios; y 5) Pulsar el botón de IA (Google Gemini) para obtener una auditoría ejecutiva personalizada con recomendaciones directas.

### Catálogo de Elementos Funcionales

• **Selector de Ventana Temporal (Filtros de Fecha):** Botones superiores: "7 Días", "30 Días", "90 Días", "Todo el Histórico".
• **Qué es / Para qué sirve:** Delimita el periodo de cálculo de ventas para evaluar la evolución estacional de la carta.
• **Cómo se usa:** Pulse la pestaña temporal que desee estudiar (se recomienda 30 días para cartas habituales).

• **Los Cuatro Cuadrantes de la Matriz BCG:** Segmentación automática de todos los platos de la carta:
  - **⭐ Platos Estrella (Alta Popularidad + Alto Margen):** Son los platos líderes del restaurante. Los clientes los piden masivamente y generan un elevado margen de contribución. Estrategia: mantener rigurosamente la calidad de la receta y darles visibilidad privilegiada en la carta.
  - **🐄 Vacas Lecheras (Alta Popularidad + Bajo Margen):** Platos clásicos con gran volumen de pedidos pero cuyo margen de beneficio es escaso (por coste alto o precio contenido). Estrategia: subir el PVP de 0,30 € a 0,60 €, optimizar gramajes o renegociar con proveedores.
  - **❓ Interrogantes / Puzles (Baja Popularidad + Alto Margen):** Platos sumamente rentables que los clientes piden poco. Estrategia: entrenar a los camareros para que los recomienden de viva voz, ubicarlos en pizarras de sugerencias o mejorar su nombre y foto.
  - **🐕 Perros (Baja Popularidad + Bajo Margen):** Platos que casi nadie pide y que además dejan poco beneficio, inmovilizando stock. Estrategia: rediseñar su receta para abaratar costes o retirarlos definitivamente de la carta.
• **Qué es / Para qué sirve:** Identifica con rigor matemático el papel económico de cada plato del menú.
• **Cómo se usa:** Revise las tarjetas resumen de cada cuadrante para tomar decisiones de gestión de carta.

• **Gráfica Interactiva de Dispersión (Scatter Chart con Recharts):** Gráfico bidimensional donde cada plato es un punto de color.
• **Qué es / Para qué sirve:** Permite visualizar visualmente la posición de toda la carta. El eje horizontal X representa la Popularidad (unidades vendidas) y el eje vertical Y el Margen de Ganancia unitario en euros (€). Las líneas divisorias señalan la media de la carta.
• **Cómo se usa:** Pase el cursor o toque cualquier punto del gráfico; se desplegará una ficha informativa con el nombre del plato, unidades vendidas, food cost y beneficio total generado.

• **Pestaña Semáforo de Food Cost (% de Coste de Materia Prima):** Monitor financiero porcentual.
• **Qué es / Para qué sirve:** Evalúa si el coste de los ingredientes absorbe un porcentaje razonable del precio de venta al público:
  - **Verde (< 28%):** Food cost óptimo y alta rentabilidad.
  - **Naranja (28% a 35%):** Nivel de alerta; margen ajustado ante inflación de ingredientes.
  - **Rojo (> 35%):** Nivel crítico; el plato tiene un coste desmedido para el precio que se cobra.
• **Cómo se usa:** Revise los platos en rojo y aplique medidas correctoras de precio o gramaje.

• **Pestaña "Cálculo y Ajuste Masivo de PVP con Margen Objetivo":** Herramienta de fijación comercial de precios.
• **Qué es / Para qué sirve:** Aplica la fórmula: *PVP Sugerido = Coste / (1 - Margen Objetivo / 100)* con redondeo comercial automático al múltiplo superior de 0,10 € (ej. convierte 12,43 € en 12,50 €) para agilizar cobros en sala.
• **Cómo se usa:** Elija el margen deseado (ej. 72%), seleccione si aplica a toda la carta o solo a una familia (ej. "Vinos"), revise la vista previa y pulse "Aplicar Nuevos Precios".

• **Pestaña "Simulador Interactivo What-If":** Laboratorio de escenarios financieros.
• **Qué es / Para qué sirve:** Permite mover controles deslizantes (sliders) táctiles de precio (+/- 0,10 €) y de coste de ingredientes (+/- 0,05 €) en cualquier plato seleccionado, para ver en tiempo real cómo variaría el beneficio anual neto antes de modificar la base de datos.
• **Cómo se usa:** Seleccione un plato (ej. "Paella de Marisco"), mueva el control de precio hacia la derecha (+0,50 €); el simulador proyectará inmediatamente cuánto dinero extra ganará el restaurante al año manteniendo las mismas ventas históricas. Si aprueba el cambio, pulse "Guardar Precio Simulado".

• **Botón "Generar Informe Estratégico IA (Gemini 3.8)":** Botón con icono de destellos (Sparkles).
• **Qué es / Para qué sirve:** Envía de forma segura los datos agregados de ventas, costes y matriz BCG a la inteligencia artificial de Google Gemini 3.8, generando un informe directivo formal con recomendaciones tácticas, detección de platos trampa y sugerencias de neuromarketing gastronómico.
• **Cómo se usa:** Pulse el botón, espere unos segundos mientras se procesa el análisis y lea el informe ejecutivo resultante en pantalla.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Optimización de un Plato "Vaca Lechera" Mediante el Simulador:** 1. Acceda a "Ingeniería de Menú" y revise el cuadrante "Vacas Lecheras". 2. Observa que la "Hamburguesa Clásica" es el plato más vendido (450 unidades al mes) pero su margen es de solo 1,80 € por unidad. 3. Vaya a la pestaña "Simulador What-If" y seleccione la "Hamburguesa Clásica". 4. Mueva el slider de precio de 9,50 € a 10,20 € (+0,70 €). 5. El simulador le indica que esta pequeña subida reportará 315 € netos extra de beneficio al mes sin afectar perceptiblemente la demanda. 6. Pulse "Guardar Precio Simulado" para aplicar el nuevo PVP en el TPV.
• **Caso 2: Detección y Acción sobre Platos "Perro":** 1. En la Matriz BCG, filtre por el cuadrante "Perro". 2. Encuentra un "Carpaccio de Ciervo" del que solo se vendieron 3 raciones en el último mes con un food cost rojo del 42%. 3. La carne inmovilizada corre riesgo de caducar. 4. Decide retirarlo de la carta: accede a Inventario y desmarca su casilla "Activo en TPV" para dar paso a un nuevo plato de temporada.

---

## 11. Módulo de Finanzas, Analítica, Cierre Fiscal Z e Impuestos (Analytics & Taxes)

### Propósito General y Flujo de Trabajo Principal
El módulo de Finanzas y Analítica consolida la inteligencia de negocio (Business Intelligence), la cuenta de explotación operativa en vivo (P&L), el cumplimiento tributario obligatorio y la auditoría de seguridad legal Antifraude. Su propósito es ofrecer a gerentes y contables información fidedigna de ingresos netos, rentabilidad real de ingredientes, reparto de ventas por camarero y zona, y facilitar la liquidación trimestral de impuestos para la asesoría contable.

El flujo de trabajo principal consiste en: 1) Seleccionar el día o periodo de análisis en el calendario; 2) Monitorizar las ventas brutas, ventas netas y el Coste de Ventas (COGS) para conocer el Beneficio Bruto real; 3) Analizar las horas punta del restaurante para optimizar turnos de personal; 4) Emitir el informe legal vinculante de Cierre Z diario; 5) Consultar el informe trimestral de IVA y Modelo 347 para la declaración tributaria; y 6) Auditar las facturas simplificadas emitidas, permitiendo anulaciones justificadas conforme a la Ley Antifraude.

### Catálogo de Elementos Funcionales

• **Selector de Fecha y Pestañas Principales:** Control de calendario superior y cuatro pestañas:
  - **Dashboard Financiero:** Métricas clave de ventas y gráficos analíticos interactivos.
  - **Informe Z Diario:** Cierre fiscal oficial con desglose de bases de IVA y conciliación de caja.
  - **Impuestos & Modelo 347:** Liquidación de IVA Repercutido vs. Soportado y operaciones con terceros.
  - **Auditoría de Tickets:** Listado de facturas simplificadas y registro inmutable de anulaciones.
• **Qué es / Para qué sirve:** Centraliza la información fiscal y económica en un solo panel navegable.
• **Cómo se usa:** Elija la fecha que desea examinar y pulse la pestaña de su interés.

• **Tarjetas KPI Financieras Globales (Dashboard):**
  - **Ventas Totales Brutas:** Importe facturado total con IVA incluido.
  - **Ventas Netas:** Facturación limpia sin impuestos (base imponible).
  - **Coste de Ventas (COGS):** Sumatorio del coste de escandallo de todos los ingredientes de los platos cobrados en el día.
  - **Beneficio Bruto & Margen Bruto (%):** *Ventas Netas - COGS*, expresado en euros y porcentaje de margen operativo.
  - **Ticket Medio:** Facturación media por ticket emitido y ratio medio de consumo por comensal.
  - **Reparto por Canal de Pago:** Porcentaje y volumen cobrado en Efectivo frente a Tarjeta bancaria.
• **Qué es / Para qué sirve:** Permite conocer si el restaurante ha ganado o perdido dinero en el día con total precisión.
• **Cómo se usa:** Revise estas tarjetas al final del servicio de almuerzo y cena.

• **Gráficos Analíticos Dinámicos (Recharts):**
  - **Ventas por Hora:** Curva de demanda a lo largo de las 24 horas del día para detectar horas valle y picos de servicio.
  - **Ventas por Categoría (Gráfico Donut):** Porcentaje de facturación correspondiente a comidas, bebidas y postres.
  - **Ventas por Camarero (Barras Horizontales):** Rendimiento comercial de cada miembro del equipo de sala.
  - **Ventas por Zona:** Comparativa de facturación entre Salón, Terraza y Barra.
• **Qué es / Para qué sirve:** Proporciona datos cuantitativos para planificar compras y organizar horarios laborales.
• **Cómo se usa:** Pase el ratón sobre los gráficos para leer los datos desglosados.

• **Pestaña "Informe Z Fiscal Oficial" (Cierre Diario):**
  - **Desglose de Bases Imponibles y Cuotas de IVA:** Cuadre formal de ventas al 4% (superreducido), 10% (hostelería general) y 21% (bebidas alcohólicas).
  - **Conciliación de Caja y Arqueo:** Fondo inicial + ventas efectivo + entradas - salidas vs. efectivo contado = Descuadre oficial.
  - **Botón "Imprimir Informe Z":** Formatea el cierre en un ticket térmico de 80mm o folio A4 listo para encuadernar o entregar a la gestoría.
• **Qué es / Para qué sirve:** Cumple el mandato legal de emitir un cierre diario inmutable al término de la jornada.
• **Cómo se usa:** Al cerrar el día, entre a la pestaña y pulse "Imprimir Informe Z".

• **Pestaña "Impuestos y Modelo 347" (TaxesReport):**
  - **Selector Trimestral (T1, T2, T3, T4 o Ejercicio Completo):** Agrupa los datos según los periodos fiscales de la Agencia Tributaria.
  - **Balance de IVA Repercutido vs. IVA Soportado:** Cruza el IVA devengado en las ventas de sala con el IVA deducible de los albaranes de compra a proveedores.
  - **Módulo Modelo 347:** Identifica automáticamente a aquellos distribuidores cuya facturación acumulada anual supere el umbral legal de 3.005,06 €.
  - **Botón "Exportar a CSV":** Descarga un archivo compatible con Excel, A3 y Sage.
• **Qué es / Para qué sirve:** Facilita la presentación de los Modelos 303 (IVA trimestral), 390 (resumen anual) y 347.
• **Cómo se usa:** Al finalizar el trimestre contable, pulse "Exportar a CSV" y envíe el documento a su asesor fiscal.

• **Pestaña "Auditoría de Tickets y Ley Antifraude" (VeriFactu / TicketBAI):**
  - **Listado Histórico de Tickets:** Registro inalterable de todas las facturas simplificadas del día con ID correlativo, hora, importe, camarero y estado (Pagado o Anulado).
  - **Modal de Anulación Justificada:** En caso de error manifiesto de cobro, permite anular una factura previa introducción obligatoria del motivo legal (ej. "Ticket duplicado por error de camarero"). La anulación genera una contrapartida contable y queda firmada con la huella digital del usuario administrador actuante en el Audit Trail.
• **Qué es / Para qué sirve:** Garantiza el cumplimiento de la estricta legislación antifraude, que prohíbe el software de doble uso o el borrado silencioso de ventas.
• **Cómo se usa:** Para anular un ticket erróneo, localícelo en la tabla, pulse "Anular", redacte el motivo justificado y confirme la operación.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Análisis de Productividad del Turno de Comidas:** 1. Acceda a "Finanzas y Analítica" y asegúrese de que la fecha seleccionada sea la de hoy. 2. En el gráfico de "Ventas por Hora", compruebe que el pico de facturación se concentró entre las 14:00 y las 15:30. 3. En el gráfico de "Ventas por Camarero", verifique el volumen de mesas atendido por cada camarero. 4. En el KPI de Beneficio Bruto, constate que el margen operativo se sitúa en un saludable 71,4%.
• **Caso 2: Extracción de Datos de IVA para el Gestor Contable:** 1. Entre a la pestaña "Impuestos & Modelo 347". 2. Seleccione el trimestre correspondiente (ej. "T2 - Segundo Trimestre"). 3. El sistema muestra el IVA repercutido por ventas (10% y 21%) y el IVA deducible soportado en compras a proveedores. 4. Revise el apartado del Modelo 347 para confirmar qué distribuidores han superado los 3.005,06 €. 5. Pulse "Exportar a CSV" y guarde el archivo para enviarlo a la asesoría.

---

## 12. Módulo de Configuración del Sistema y Administración (Config Screen)

### Propósito General y Flujo de Trabajo Principal
El módulo de Configuración es el panel de control técnico de GastroPOS Suite. Su propósito es permitir a los administradores y gerentes adaptar la plataforma a la realidad física de su negocio: dar de alta empleados con roles y permisos específicos, configurar las zonas y mesas de sala, vincular impresoras térmicas Bluetooth, integrar pasarelas de pago bancarias (Redsys), personalizar la identidad de marca blanca (colores, logotipos corporativos y modo oscuro/claro) y consultar el repositorio oficial de manuales y documentación.

El flujo de trabajo principal abarca: 1) Creación de usuarios con asignación de PIN y permisos granulares (RBAC); 2) Definición estructural de la sala y número de mesas; 3) Emparejamiento de impresoras térmicas de tickets y pruebas de pulso para la apertura de cajón; 4) Introducción de datos fiscales de la empresa; y 5) Personalización visual de marca blanca para que la aplicación muestre los colores y el logotipo corporativo en todos los terminales.

### Catálogo de Elementos Funcionales

• **Menú de Pestañas de Configuración Administrativa:** Menú lateral o superior con 7 submódulos:
  - **Usuarios (Users):** Gestión de empleados, roles, PIN de 4 dígitos, permisos granulares y preferencias individuales de sonido y vibración.
  - **Mesas y Zonas (Tables):** Topología física de salas, terrazas y barras.
  - **General (Settings):** Datos fiscales de la empresa (Razón social, CIF/NIF, dirección, serie de facturación e IVA por defecto).
  - **Impresoras (Printer):** Conectividad Web Bluetooth, ancho térmico (58mm / 80mm) y pruebas de corte y apertura de cajón.
  - **Datáfono / Redsys (CreditCard):** Integración bancaria con código FUC, terminal y clave secreta de comercio.
  - **Marca Blanca / White-Label (Palette):** Personalización estética: subida de logotipo en base64, selector de color de acento primario y conmutador Modo Oscuro / Modo Claro.
  - **Documentación & Manuales (BookOpen):** Repositorio oficial con subpestañas "Docu Admin" (manuales técnicos) y "Docu Usuario" (esta guía operativa) con descarga directa en PDF y lector interactivo.
• **Qué es / Para qué sirve:** Centraliza la administración integral del software en una interfaz unificada.
• **Cómo se usa:** Pulse sobre el submódulo que necesite parametrizar.

• **Submódulo Usuarios y Permisos (UserManagement):**
  - **Botón "Nuevo Usuario" (+):** Añade un empleado especificando nombre, rol (Camarero, Cocinero, Encargado, Administrador, Tour) y PIN personal de 4 dígitos.
  - **Matriz Granular de Permisos (RBAC):** Casillas de verificación para autorizaciones individuales: *can_open_drawer* (abrir cajón), *can_manage_cash* (movimientos de caja), *can_close_register* (Cierre Z), *can_void_ticket* (anular facturas), *can_apply_discounts* (hacer descuentos), *can_manage_inventory* (editar carta y costes) y *can_manage_settings* (ajustes globales).
  - **Ajustes de Sonido y Vibración Háptica por Usuario:** Conmutadores para activar o desactivar sonidos táctiles y vibraciones en el teclado numérico y en los botones del TPV según las preferencias de cada trabajador.
• **Qué es / Para qué sirve:** Controla qué puede y qué no puede hacer cada persona en el TPV, garantizando la seguridad contable.
• **Cómo se usa:** Para crear un camarero: pulse "+", introduzca su nombre, asigne un PIN de 4 dígitos, active las casillas básicas de venta y desactive las de cierre de caja o anulación de tickets.

• **Submódulo Mesas y Zonas (TableManagement):**
  - **Botón "Gestionar Zonas":** Crea o renombra áreas físicas (ej. "Salón Comedor", "Terraza Piscina", "Barra Principal").
  - **Botón "Añadir Mesa" (+):** Crea una nueva mesa indicando su nombre identificador (ej. M1, M2, T1) y su zona asignada.
  - **Interruptor de Actividad de Mesa:** Permite ocultar mesas estacionales (ej. terraza en invierno) sin borrar su historial contable pasado.
• **Qué es / Para qué sirve:** Dibuja el mapa que posteriormente utilizarán los camareros en el Plano de Mesas.
• **Cómo se usa:** Cree primero las zonas del local y seguidamente agregue las mesas vinculadas a cada zona.

• **Submódulo Impresoras (PrinterManagement):**
  - **Botón "Buscar Impresora Web Bluetooth":** Escanea dispositivos Bluetooth cercanos desde el navegador sin necesidad de instalar controladores complejos.
  - **Selector de Ancho de Papel:** Alterna entre 58 mm (impresoras compactas de cinturón o barra) y 80 mm (impresoras estándar de caja).
  - **Botón "Test de Impresión":** Emite un ticket térmico de prueba para validar que la conexión y el texto son correctos.
  - **Botón "Test Abrir Cajón":** Emite el pulso ESC/POS para comprobar que la gaveta portamonedas abre físicamente.
• **Qué es / Para qué sirve:** Enlaza el TPV con las impresoras térmicas de tickets y pedidos de cocina.
• **Cómo se usa:** Encienda la impresora Bluetooth, pulse "Buscar Impresora", selecciónela en el diálogo del navegador y realice un test de impresión.

• **Submódulo Marca Blanca y Aspecto (WhiteLabelManagement):**
  - **Carga de Logotipo Corporativo:** Selector de archivo que comprime y guarda la imagen en memoria para proyectarla en tickets, CFD y cabeceras.
  - **Selector de Color Primario de Acento:** Paleta táctil para fijar el color corporativo del restaurante (ej. naranja ámbar, verde esmeralda, azul náutico o burdeos).
  - **Conmutador Modo Oscuro / Modo Claro:** Alterna entre interfaz oscura de alto contraste para locales nocturnos o interfaz clara diurna para terrazas soleadas. Los cambios se guardan en la nube para que todos los terminales muestren la misma imagen corporativa.
• **Qué es / Para qué sirve:** Adapta la identidad visual del software a la imagen de marca corporativa del restaurante.
• **Cómo se usa:** Cargue el logotipo de su empresa, elija su color institucional y guarde los cambios.

• **Submódulo Documentación y Manuales (DocumentationManagement):**
  - **Subpestaña "Docu Admin":** Biblioteca de manuales técnicos de arquitectura, plano de mesas, KDS, inventario, caja y finanzas.
  - **Subpestaña "Docu Usuario":** Esta Guía Rápida pero Completa de Operaciones para todo el equipo de sala, cocina y caja.
  - **Botón "Leer Online":** Abre el visor interactivo con buscador de términos en tiempo real.
  - **Botón "Descargar PDF":** Descarga el manual completo en formato binario PDF oficial listo para imprimir o enviar por correo electrónico.
• **Qué es / Para qué sirve:** Proporciona formación continua y manuales de referencia oficiales al equipo del restaurante.
• **Cómo se usa:** Pulse "Leer Online" para consultar cualquier duda o "Descargar PDF" para tener una copia en papel en el establecimiento.

### Casos de Uso Clave: Paso a Paso para Nuevos Usuarios

• **Caso 1: Alta de un Nuevo Camarero con Restricción de Permisos:** 1. El encargado entra en Configuración > Usuarios y pulsa el botón "+". 2. Escribe el nombre "Carlos Méndez", rol "Camarero" y asigna el PIN "4826". 3. En permisos, deja marcadas únicamente las opciones de tomar pedidos y enviar a cocina; desmarca "Cierre de Caja" y "Anular Tickets". 4. En preferencias de sonido, activa la vibración táctil. 5. Guarda el usuario. Carlos ya puede identificarse en el terminal con el PIN 4826 de forma segura.
• **Caso 2: Emparejamiento de la Impresora de Tickets:** 1. Encienda la impresora térmica de tickets y asegúrese de que el Bluetooth esté activo. 2. Acceda a Configuración > Impresoras. 3. Pulse "Buscar Impresora Web Bluetooth". 4. En el diálogo del navegador, seleccione el dispositivo "Thermal Printer 80mm" y pulse "Vincular". 5. Pulse "Test de Impresión"; la impresora emitirá un ticket de bienvenida. 6. Pulse "Test Abrir Cajón"; el cajón portamonedas se abrirá instantáneamente.

---

## 13. Recorrido Integral de Principio a Fin (Flujo Maestro del Restaurante: Casos de Uso Clave End-to-End)

Para que cualquier usuario novato comprenda el funcionamiento global de GastroPOS Suite, a continuación se detalla el ciclo completo de una jornada real de trabajo en un restaurante de principio a fin, dividido en 8 etapas cronológicas:

### Etapa 1: Apertura de Jornada y Tesorería
• El encargado de sala llega al restaurante e introduce su PIN de 4 dígitos en el teclado de acceso.
• Desde el Dashboard Central, pulsa la tarjeta "Gestión de Caja".
• La pantalla indica "Caja Cerrada". El encargado cuenta el dinero disponible en la gaveta portamonedas (150,00 €) e introduce la cifra en el campo de Fondo Inicial.
• Al pulsar "Abrir Caja", el estado pasa a verde "CAJA ABIERTA" y el terminal queda habilitado para registrar cobros en sala.

### Etapa 2: Preparación de Sala y Menú
• El encargado accede a Configuración > "Mesas y Zonas" para verificar que las mesas de terraza y salón estén activas.
• Accede a "Inventario y Carta", revisa las existencias y activa los platos especiales del día mediante la casilla de visibilidad TPV.
• En la cocina, el cocinero enciende la pantalla KDS, introduce su PIN y selecciona la estación "COCINA".

### Etapa 3: Llegada de Clientes y Apertura de Mesa
• Un grupo de cuatro clientes entra en el local y se sienta en la Mesa 3 del Salón Principal.
• El camarero abre el sistema con su PIN personal; el sistema le dirige de inmediato al "Plano de Mesas".
• El camarero toca sobre la tarjeta "M3" (en verde "LIBRE"). El sistema inicializa la comanda y abre el TPV de la Mesa 3.
• El camarero ajusta el número de comensales a 4 pulsando los controles de comensales en la cabecera.

### Etapa 4: Toma de Comanda, Modificadores y Alérgenos
• Los clientes piden bebidas: el camarero toca la pestaña "Bebidas" y pulsa dos veces sobre "Cerveza Especial" y dos veces sobre "Agua Mineral". Los artículos se añaden al ticket lateral.
• Los clientes piden comida: el camarero toca "Entrantes" y marca "1x Jamón Ibérico". Luego toca "Carnes" y selecciona "1x Solomillo de Ternera".
• Al pulsar el solomillo, se abre el modal de notas: selecciona el punto "Al punto" y en notas añade la advertencia: "CLIENTE CELÍACO - SIN GLUTEN".
• Revisa el ticket lateral y pulsa el botón destacado "Enviar a Cocina".

### Etapa 5: Marcha y Elaboración en Cocina (KDS)
• En menos de 200 ms, la comanda de la Mesa 3 entra en la pantalla táctil KDS de la cocina con cabecera en color verde (0 minutos transcurridos).
• Las bebidas se envían a la barra y las comidas a la cocina caliente.
• El cocinero lee la caja roja destacada "CLIENTE CELÍACO - SIN GLUTEN" y prepara el solomillo con utensilios limpios e ingredientes certificados sin gluten.
• Al emplatar el solomillo, el cocinero toca el renglón del plato en la pantalla táctil: el plato pasa a verde suave con una marca de verificación ("Listo"), avisando a sala de que puede retirarse.
• El camarero recoge los platos en el pase; el jefe de cocina toca el plato una segunda vez para marcarlo como "Servido".

### Etapa 6: Solicitud de Cuenta, Visor CFD y Cobro
• Tras los postres y cafés, los clientes de la Mesa 3 solicitan la cuenta (Total acumulado: 84,60 €).
• En el TPV, el camarero pulsa "Lanzar Visor CFD": en la pantalla del mostrador orientada al cliente aparece el desglose completo del pedido y el total de 84,60 € en números gigantes.
• Los clientes solicitan pagar una mitad en tarjeta y otra en efectivo: el camarero pulsa "Cobrar" y selecciona la modalidad "Por Comensales" (2 personas x 42,30 €).
• El primer cliente paga 42,30 € con tarjeta en el datáfono Redsys; la operación se aprueba.
• El segundo cliente entrega un billete de 50,00 € en efectivo: el camarero pulsa el botón rápido "50 €"; el TPV calcula instantáneamente: "Cambio: 7,70 €".
• El camarero entrega los 7,70 € de cambio y pulsa "Imprimir y Cerrar". La impresora térmica emite la factura simplificada legal con su desglose de IVA y la Mesa 3 vuelve al estado verde "LIBRE" en el plano.

### Etapa 7: Cierre Fiscal Diario y Arqueo de Caja (Cierre Z)
• Al finalizar el servicio nocturno, el encargado accede a "Gestión de Caja".
• Extrae la gaveta portamonedas y realiza el arqueo ciego: cuenta meticulosamente las monedas y billetes presentes en el cajón (total: 782,30 €).
• Introduce los 782,30 € en el campo de conteo físico y pulsa "Cerrar Caja".
• El sistema compara el saldo esperado (Fondo Inicial + Ventas en Efectivo - Salidas) con el dinero real contado y concluye: "Descuadre 0,00 € - Cuadre Perfecto".
• El encargado confirma el cierre: el turno queda sellado y se emite el **Informe Z Oficial**, con el desglose de bases imponibles al 10% y 21% de IVA exigido legalmente.

### Etapa 8: Auditoría Financiera e Inteligencia de Menú
• Desde el Dashboard, el gerente pulsa "Finanzas y Analítica": comprueba que las ventas del día alcanzaron los 1.640,00 €, con un margen bruto del 72,1% tras deducir el coste de ingredientes de los escandallos.
• A continuación, accede a "Ingeniería de Menú", revisa la Matriz BCG y utiliza el simulador What-If para ajustar el precio de dos platos con alta demanda antes del fin de semana.
• Pulsa "Cerrar Sesión", dejando el terminal bloqueado y completamente protegido para la jornada siguiente.
