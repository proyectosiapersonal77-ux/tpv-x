# Manual del Administrador: Módulo Plano de Mesas
**GastroPOS Suite v2.1**  
*Elaborado por: Dirección de Ingeniería de Software*  
*Destinatario: Administradores de Sistema, Gerentes de Operaciones y Responsables de Sala*  
*Archivo descargable en PDF: `/manual_plano_de_mesas.pdf`*

---

## 1. Arquitectura y Filosofía del Sistema (Offline-First y Reactividad)

El módulo **Plano de Mesas** de GastroPOS ha sido desarrollado sobre una arquitectura resiliente y distribuida de alta disponibilidad. En un entorno de hostelería de alto volumen (horas punta, rotación constante, áreas con cobertura irregular como terrazas o sótanos), un fallo en la red local o en el proveedor de Internet no puede paralizar la toma de comandas ni el cobro.

### Principios Arquitecturales Clave:
* **Persistencia Local Inmediata (IndexedDB / Dexie.js):** Toda lectura o escritura en el plano de mesas (apertura de comanda, cambio de estado, adición de platos) se realiza en primera instancia contra la base de datos embebida en el propio navegador/terminal en menos de 5 milisegundos.
* **Sincronización Asíncrona Resiliente (`syncService.ts`):** Las mutaciones se colocan en una cola de sincronización transaccional (`sync_queue`). Si el terminal pierde la señal Wi-Fi, el sistema continúa funcionando al 100% de sus capacidades; en cuanto se recupera el enlace, los cambios se aplican automáticamente en la base de datos cloud (PostgreSQL en Supabase).
* **Reactividad en Tiempo Real (WebSockets / Supabase Realtime):** El canal `table_plan_updates` emite eventos push instantáneos cada vez que se produce una mutación en las tablas `orders` o `tables`. Esto garantiza que si el Camarero 1 abre o cobra la Mesa 4 desde su terminal móvil, la pantalla del TPV central y la pantalla de cocina KDS reflejan el cambio en milisegundos sin necesidad de refrescar la pantalla.

---

## 2. Topología de Sala: Gestión de Zonas y Ambientes

El plano no presenta una lista plana de mesas; organiza el establecimiento en **Zonas** o ambientes independientes, adaptándose a la realidad física del local:

### Detección Semántica Inteligente de Iconos:
El sistema analiza el nombre asignado a la zona y mapea de forma reactiva la iconografía adecuada en la barra superior de navegación:
* **Zonas Interiores** (contienen *"interior"*, *"salon"*, *"comedor"*): Asigna el icono de **Sillón** (`Armchair`). Representa el espacio clásico de comedor con servicio formal.
* **Zonas Exteriores** (contienen *"terraza"*, *"patio"*, *"jardin"*): Asigna el icono de **Sol** (`Sun`). Útil para controlar mesas expuestas a la intemperie o sujetas a suplementos por terraza.
* **Zonas Ágiles / Barras** (contienen *"barra"*, *"taberna"*): Asigna el icono de **Jarra** (`Beer`). Indicadas para rotaciones rápidas y comandas directas.
* **Zonas Genéricas** (*"reservado"*, *"planta 1"*, *"piscina"*, etc.): Asigna el icono de **Cuadrícula** (`LayoutGrid`).

### Contadores de Ocupación por Zona:
Cada pestaña de zona incorpora una insignia numérica que calcula en tiempo real cuántas mesas activas pertenecen a dicho sector (`tables.filter(t => t.zone === zone.name).length`).

---

## 3. Ciclo de Vida y Estados Visuales de una Mesa

La pantalla del plano de mesas (`TablePlan.tsx`) utiliza un patrón de diseño de alta legibilidad con microindicadores cromáticos:

| Estado de la Mesa | Identificador Visual | Microindicador LED | Información Mostrada | Comportamiento al Pulsar |
| :--- | :--- | :--- | :--- | :--- |
| **Mesa Libre** | Fondo oscuro neutro (`brand-800`), borde sutil (`brand-700`) | LED Verde Esmeralda (`bg-green-500`) | Etiqueta en verde `LIBRE` | Abre el TPV e inicializa un nuevo pedido. |
| **Mesa Ocupada** | Fondo tenue rojizo (`bg-red-900/20`), borde carmesí (`border-red-500/50`) | LED Rojo Carmesí (`bg-red-500`) | Total acumulado en euros (ej. `48.50 €`) en tipografía monoespaciada | Abre el TPV cargando los productos y el estado de la comanda en curso. |
| **Mesa Vinculada (Hija)** | Fondo atenuado (`bg-gray-800/50`), borde gris discontinuo (`border-dashed`), icono de eslabón | No muestra LED directo (hereda estado matriz) | Nombre de la mesa maestra (ej. `🔗 M1`) | Redirige automáticamente a la comanda de la Mesa Maestra. |
| **Modo Selección (Unión)** | Fondo azulado/acento, escala reducida (`scale-95`), sombra interior | Icono de verificación circular (`Check`) | Checkmark sobre fondo acentuado | Conmuta la selección para la unión en lote. |

---

## 4. Operativa de Sala: Apertura de Pedidos y Visualización en Vivo

1. **Apertura de Mesa:**  
   El personal pulsa sobre cualquier mesa en estado verde (`Libre`). El sistema invoca `onSelectTable(table)` e inicializa una sesión de comanda en el TPV (`POSScreen.tsx`).
2. **Adición de Comensales y Productos:**  
   A través del catálogo de categorías, se seleccionan los platos y bebidas. En caso de requerir modificaciones (ej. *Punto de la carne*, *Sin gluten*, *Extra queso*), se despliega el modal de notas y modificadores.
3. **Envío a Cocina:**  
   Al procesar el pedido, los artículos se enrutan automáticamente según su categoría al **KDS de Cocina** o a la **Impresora/KDS de Barra**. La mesa en el plano pasa de color verde a color rojo y empieza a computar el importe en vivo.
4. **Múltiples Terminales Concurrente:**  
   Si dos camareros intentan pulsar la misma mesa en el mismo instante, la primera transacción confirmada bloquea la mesa; el segundo terminal detecta inmediatamente la orden abierta, evitando duplicidades de mesa.

---

## 5. Agrupación y Unión de Mesas (Banquetes y Grupos)

Cuando un grupo de clientes solicita juntar varias mesas físicas (por ejemplo, unir las mesas `M2`, `M3` y `M4`), el sistema cuenta con un motor de unión con topología **Padre-Hijo (Parent-Child Topology)**:

### Procedimiento de Unión:
1. **Activación Táctil (Long Press):**  
   El usuario mantiene pulsada durante **600 milisegundos** una de las mesas involucradas. El dispositivo proporciona feedback háptico (vibración de 50ms) y la interfaz entra en `Modo Unir Mesas`.
2. **Selección Múltiple:**  
   Aparece una barra superior dorada fija (`JOIN TOOLBAR`, con capa `z-[60]`). El usuario pulsa el resto de mesas a juntar.
3. **Pulsación del Botón "Unir":**  
   El sistema abre un diálogo modal de confirmación:  
   *¿Deseas unir X mesas a la mesa principal M?*
4. **Algoritmo de Prioridad de Mesa Maestra:**  
   Si una de las mesas seleccionadas ya tenía comanda abierta con consumos previos, el algoritmo (`tableService.ts`) la selecciona de forma preferente como **Mesa Principal (Parent Table)**.
5. **Fusión Automática de Cuentas (`mergeOrders`):**  
   Si varias de las mesas tenían consumos previos, sus ítems se fusionan de forma trazable en la orden maestra con el detalle del origen de cada plato.
6. **Resultado en el Plano:**  
   * La mesa matriz (`Parent`) se muestra ocupada con el importe unificado de todo el grupo.
   * Las mesas secundarias (`Children`) adoptan el estilo punteado con el icono de enlace y el nombre de la mesa matriz (`🔗 M1`).

---

## 6. Separación y Desunión de Mesas Agrupadas

Una vez que el grupo concluye o se liberan mesas parciales:

1. **Activación:**  
   El usuario realiza una pulsación prolongada de 600ms sobre la mesa vinculada (hija) que desea independizar.
2. **Modal de Desunión (`unjoinModalOpen`):**  
   Aparece el diálogo: *¿Deseas separar la mesa M de la mesa principal?*
3. **Confirmación:**  
   El sistema ejecuta `unjoinTable(tableId)`, estableciendo su `parent_id` en `null`.
4. **Tratamiento Financiero de los Consumos:**  
   Los artículos consumidos hasta el momento permanecen en la cuenta de la Mesa Maestra para evitar pérdidas de facturación. Si los clientes que se van desean pagar únicamente sus platos, se utiliza la función **"Dividir Cuenta"** desde la pantalla de cobro del TPV antes o después de la separación.

---

## 7. Traspaso y Fusión de Comandas entre Mesas (Cambio de Ubicación)

Es frecuente que un cliente empiece consumiendo en la barra o en la terraza y decida pasar a sentarse a un salón interior, o que dos grupos de amigos decidan juntarse.

### Procedimiento Técnico:
1. En el TPV, con la comanda de la mesa actual en pantalla, pulsar el botón **"Mover Mesa"** (icono de dos flechas contrapuestas `ArrowRightLeft`).
2. Se despliega el selector modal `MoveOrderModal`:
   * Permite filtrar por zonas (Salón, Terraza, Barra...).
   * Lista las mesas disponibles en esa zona.
3. **Resolución de Destino (`orderService.ts -> moveOrderToTable`):**
   * **Escenario A (Mesa de destino libre):** El sistema actualiza el campo `table_id` de la comanda activa. La mesa antigua se libera al instante (vuelve a verde) y la nueva mesa adopta el importe y los platos pendientes.
   * **Escenario B (Mesa de destino con comanda existente):** El sistema detecta la comanda existente e invoca `mergeOrders()`. Los artículos de ambas comandas se fusionan bajo la misma cuenta sin perder el estado de preparación de ningún plato.

---

## 8. Panel Administrativo: Alta, Edición y Mantenimiento Estructural

El administrador del sistema puede reconfigurar la distribución del local desde:  
**Menú Principal > Configuración > Mesas y Zonas (`TableManagement.tsx`)**.

### Operaciones Disponibles:
1. **Creación de Zonas:**  
   Pulsar *Gestionar Zonas* > introducir nombre (ej. *"Reservado VIP"*, *"Terraza Superior"*) > Guardar. Se sincroniza de inmediato con toda la flota de dispositivos.
2. **Alta de Mesas:**  
   Pulsar el botón **`+`** (Añadir Mesa). Introducir el nombre (recomendación técnica: utilizar nomenclaturas alfanuméricas concisas como `M1`, `M2` para salón, `T1`, `T2` para terraza o `B1`, `B2` para barra) y asociarla a su zona.
3. **Edición de Mesas:**  
   Modificar el nombre o trasladar una mesa de una zona a otra sin perder los registros históricos de ventas anteriores.
4. **Activación / Desactivación de Mesas (`active: boolean`):**  
   Permite retirar mesas de la operativa diaria (por ejemplo, terrazas en temporada de invierno o mesas retiradas por evento privado) sin eliminarlas de la base de datos ni alterar los informes de auditoría pasados.
5. **Borrado Seguro:**  
   El sistema comprueba que la mesa no tenga comandas abiertas o dependencias activas antes de permitir su eliminación definitiva.

---

## 9. Protocolos de Seguridad, Auditoría y Conectividad

Para cumplir con la legislación vigente (Ley 11/2021 de medidas de prevención y lucha contra el fraude fiscal y normativa VeriFactu):

* **Registro Inalterable de Auditoría (Audit Trail):**  
  Toda acción sobre una comanda de mesa (creación, cambio de mesa, anulación de ítems, cierre y cobro) genera un registro inmutable en la tabla `audit_logs` con identificador único UUID, marca de tiempo ISO, ID del empleado actuante y firma hash SHA-256 encadenada.
* **Control de Acceso por Roles (RBAC):**  
  * **Rol Camarero:** Apertura de mesas, adición de comandas, unión/desunión y traspasos de mesa.
  * **Rol Cocinero:** Visualización de pedidos en KDS ordenados por antigüedad y mesa.
  * **Rol Encargado / Administrador:** Creación y modificación de la topología de mesas, anulación de platos enviados a cocina, descuentos y cierres de caja (Informe Z).

---

## 10. Preguntas Frecuentes y Guía de Resolución de Incidencias

#### ¿Qué ocurre si un dispositivo pierde la conexión a Internet durante el servicio?
El sistema continúa operando con normalidad gracias a la base de datos local Dexie. Las mesas se pueden abrir, unir, traspasar y cobrar. En cuanto el dispositivo recupere la señal Wi-Fi, la cola de sincronización enviará los datos a la nube sin colisiones.

#### ¿Cómo saber cuánto tiempo lleva una mesa sentada o esperando comida?
Cada comanda almacena el campo `created_at`. Tanto en el plano de mesas como en el KDS de cocina, los pedidos se ordenan cronológicamente y presentan alertas visuales en función de los minutos transcurridos.

#### Si desuno una mesa agrupada, ¿se pierde el dinero o la comanda?
No. El saldo y los platos continúan asociados a la Mesa Maestra. La mesa desunida simplemente queda vacía y disponible para ser ocupada por nuevos clientes.

---
*Documento emitido y validado para la suite GastroPOS. Versión 2.1.*
