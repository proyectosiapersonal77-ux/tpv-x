# Manual de Administración y Arquitectura: Módulo de Inventario y Carta
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Ingeniería de Software y Gestión de Operaciones F&B*
*Destinatario: Administradores de Sistema, Gerentes de Alimentos y Bebidas (F&B), Jefes de Cocina y Responsables de Almacén*

---

## 1. Visión General y Arquitectura de Datos

El módulo **Gestión de Inventario y Carta** constituye el núcleo operativo, logístico y financiero de GastroPOS Suite. Centraliza la definición de la oferta gastronómica (platos, bebidas, menús), el control de existencias físicas, la gestión de compras y albaranes, la ingeniería de escandallos con factor de rendimiento (*Yield Management*) y la trazabilidad de mermas y auditoría contable.

### 1.1 Topología de Almacenamiento Híbrido (Offline-First)
El módulo implementa un modelo de datos dual reactivo:
* **Capa Local Inmediata (Dexie IndexedDB):** Todas las consultas de catálogo, apertura de escandallos, filtrados por categoría y comprobaciones de stock en sala se ejecutan sobre tablas locales (`db.products`, `db.categories`, `db.subcategories`, `db.suppliers`, `db.allergens`, `db.units`, `db.waste_reasons`, `db.promotions`, `db.stock_movements`). Esto garantiza respuesta en menos de 5 ms incluso sin conexión a Internet.
* **Capa de Nube y Sincronización (Supabase PostgreSQL):** Los cambios generados se persisten mediante colas transaccionales asíncronas (`queueChange`) que resuelven mutaciones en segundo plano hacia Supabase.
* **Modo Tour y Seguridad RBAC:** Las operaciones de creación, edición, borrado físico y albaranes están blindadas mediante `applyTourRestriction()`, impidiendo alteraciones en sesiones de demostración o usuarios no autorizados.

---

## 2. Pestañas de Navegación y Referencia de Iconos

La barra superior de pestañas permite alternar entre las 9 dimensiones del catálogo e inventario:

| Icono | Identificador | Nombre de Pestaña | Propósito Funcional |
| :---: | :--- | :--- | :--- |
| **`Package`** | `products` | **Productos y Platos** | Maestro de artículos de venta, materias primas, bebidas y recetas compuestas. |
| **`Tag`** | `categories` | **Categorías** | Familias principales de carta (ej. *Entrantes*, *Carnes*, *Bebidas*, *Postres*), con enrutamiento KDS. |
| **`GitFork`** | `subcategories` | **Subcategorías** | Segmentación de segundo nivel vinculada a una categoría padre (ej. *Vinos Tintos* dentro de *Bebidas*). |
| **`Truck`** | `suppliers` | **Proveedores** | Directorio de distribuidores y empresas de suministros con datos de contacto comercial. |
| **`Scroll`** | `purchase_orders` | **Pedidos de Compra** | Órdenes de reposición manuales y automáticas lanzadas al alcanzar el stock mínimo. |
| **`Wheat`** | `allergens` | **Alérgenos** | Catálogo oficial de los 14 alérgenos de declaración obligatoria según Reglamento UE 1169/2011. |
| **`Scale`** | `units` | **Unidades de Medida** | Magnitudes de pesaje y volumen (kg, g, l, ml, unidad, ración, botella, caja) para escandallos. |
| **`Ban`** | `waste_reasons` | **Tipos de Merma** | Tipificación estandarizada de pérdidas de stock (Caducidad, Rotura, Deterioro, Error Cocina). |
| **`Percent`** | `promotions` | **Promociones** | Motor de descuentos temporales (Happy Hour), días programados, categorías y productos selectos. |

---

## 3. Barra de Herramientas Superior y Acciones Globales

En la cabecera del módulo se encuentran las herramientas globales de gestión y sincronización:

### 3.1 `Download` — Exportar Catálogo a CSV
Genera y descarga en el navegador un archivo delimitado por comas (`.csv`) con todas las referencias del restaurante. El archivo incluye 13 columnas estandarizadas:
`Nombre, Categoria, Subcategoria, Proveedor, Coste, PVP, Stock, Minimo, IVA, Unidad, Codigo de Barras, Compuesto (SI/NO), Activo (SI/NO)`

### 3.2 `Upload` / `Loader2` — Importar Catálogo masivo CSV
Permite dar de alta o actualizar cientos de productos en segundos. Admite tanto el formato ampliado de 13 columnas como el formato heredado de 8 columnas. Durante la importación, el icono transmuta a un spinner animado (`Loader2`) mientras valida existencias, vincula categorías y crea registros en Dexie y Supabase.

### 3.3 `Search` — Buscador Reactivo en Tiempo Real
Filtro de búsqueda inmediata que analiza simultáneamente:
* Nombre del producto o plato.
* Categoría y subcategoría asignada.
* Nombre del proveedor.
* Código de barras numérico o identificador alfanumérico.

### 3.4 `FolderInput` — Recibir Albarán de Mercancía
Abre el panel modal de recepción de mercancías para registrar compras de proveedores:
* **Referencia / Notas:** Campo alfanumérico para el número de albarán o factura del distribuidor (ej. *Albarán Frutas Gómez #2026-891*).
* **Líneas de Albarán (`Plus` Añadir Línea):** Permite añadir múltiples artículos especificando producto, cantidad recibida y precio de compra total en euros.
* **Cálculo Financiero PMP (Precio Medio Ponderado):** El sistema calcula automáticamente el precio unitario (`precio_total / cantidad`) y aplica la fórmula legal de valoración de existencias:
$$\text{PMP} = \frac{(\text{Stock}_{\text{anterior}} \times \text{Coste}_{\text{anterior}}) + (\text{Cantidad}_{\text{nueva}} \times \text{Precio}_{\text{compra}})}{\text{Stock}_{\text{anterior}} + \text{Cantidad}_{\text{nueva}}}$$
* Actualiza en tiempo real el stock físico y actualiza el coste del producto tanto en Supabase como en IndexedDB.

### 3.5 `Plus` — Alta de Nuevo Registro
Botón de acción rápida en color acento (`bg-brand-accent`) que abre dinámicamente el modal de creación correspondiente a la pestaña activa en ese instante (nuevo producto, categoría, proveedor, orden de compra, alérgeno, unidad, merma o promoción).

---

## 4. Tabla Virtualizada de Productos y Modos de Edición

Para garantizar fluidez con catálogos que superan los 5.000 artículos, la vista de productos está montada sobre una lista virtualizada (`react-window` con `AutoSizer`).

### 4.1 Selección por Lotes (`CheckSquare` / `Square`)
La primera columna permite la selección individual o masiva de artículos para acciones conjuntas o verificación rápida.

### 4.2 Edición Rápida en Celda (In-Place Editing)
El administrador no necesita abrir el modal completo para ajustes rutinarios. Al hacer clic sobre:
* **Coste (`cost_price`):** Habilita input numérico inmediato.
* **PVP Venta (`selling_price`):** Habilita input con color acento.
* **Stock Actual (`stock_current`):** Habilita ajuste directo de inventario.
* **Teclas de Control:** `Enter` confirma y guarda la mutación en Supabase y Dexie; `Escape` descarta el cambio sin alterar los datos.

### 4.3 Semaforización Cromática de Stock
* **Verde:** Nivel óptimo por encima del umbral mínimo de seguridad.
* **Naranja / Amarillo (`AlertTriangle`):** Stock bajo (nivel actual menor o igual a `stock_min`). Dispara aviso de reposición.
* **Rojo:** Agotado (existencias en 0 o valor negativo).

### 4.4 Interruptor de Visibilidad "Activo (TPV)"
Un checkbox directo permite desactivar un producto temporalmente (por falta de existencias puntual o fuera de temporada). El producto permanece en el catálogo administrativo y en los informes de costes, pero desaparece automáticamente de la botonera de los terminales de sala y barra para evitar comandas erróneas.

---

## 5. Menú Contextual de Fila (Acciones por Producto)

Al pulsar el menú de puntos suspensivos (`MoreVertical`) en cualquier producto, se despliega el menú flotante con 5 herramientas especializadas:

```
┌──────────────────────────────────────────────┐
│  [Barcode]      Imprimir Etiqueta            │
│  [TrendingDown] Registrar Merma              │
│  [History]      Historial de Movimientos     │
│  [Edit2]        Editar Ficha Completa        │
│  [Trash2]       Eliminar / Desactivar        │
└──────────────────────────────────────────────┘
```

### 5.1 `Barcode` — Generación e Impresión de Etiquetas Barcode & QR
Abre un visualizador de etiquetas optimizado para impresoras térmicas adhesivas:
* Genera código de barras lineal en estándar **Code128 / EAN** mediante `react-barcode`.
* Muestra denominación del producto y PVP destacado con símbolo monetario.
* Genera ventana emergente con estilos CSS `@media print` para volcado directo a impresoras de etiquetas de 50x30 mm, 40x20 mm o formatos estándar.

### 5.2 `TrendingDown` — Registro de Merma y Deterioro
Permite asentar pérdidas de producto sin generar ventas falsas:
* Selección del motivo tipificado (Caducidad, Rotura de envase, Plato quemado en cocina, Muestra comercial).
* Cantidad a retirar en la unidad de medida del producto.
* Genera automáticamente un movimiento de stock negativo en `stock_movements` con el ID del usuario y la razón auditada.

### 5.3 `History` — Historial de Movimientos de Inventario
Despliega un modal virtualizado con la trazabilidad cronológica completa del producto:
* **Fecha y Hora:** Marca temporal exacta.
* **Usuario:** Empleado o encargado que ejecutó la operación.
* **Motivo:** Venta TPV, Albarán de Proveedor, Merma, Ajuste Manual o Reversión de Comanda.
* **Cambio:** Cantidad agregada (`+`) o deducida (`-`).
* **Stock Resultante:** Saldo contable tras la operación.

### 5.4 `Edit2` — Modificación Integral
Abre el formulario completo para alterar parámetros avanzados, alérgenos, fotos, escandallos o variantes.

### 5.5 `Trash2` — Eliminación con Protección de Integridad Referencial
GastroPOS Suite aplica un triple cortafuegos de seguridad:
1. **Confirmación Simple:** Modal de advertencia con nombre del plato.
2. **Bloqueo por Dependencia (`blockedDelete`):** Si una categoría o proveedor contiene productos asociados, el borrado se bloquea exigiendo su reubicación previa.
3. **Inmutabilidad Fiscal y de Recetas (`foreignKeyViolation`):** Si el producto ha sido vendido en tickets históricos (`orders`) o figura como ingrediente de un plato compuesto (`ingredients`), **el borrado físico se bloquea**. El sistema ofrece automáticamente la alternativa legal: **Desactivar / Archivar**, manteniendo intacto el histórico contable exigido por la Ley Antifraude y la AEAT.

---

## 6. Formulario Maestro de Producto: Campos y Escandallos

El modal de producto (`isModalOpen`) ofrece la máxima granularidad técnica:

### 6.1 Fotografía y Compresión Inteligente en Cliente
* Zona de arrastre (*Drag & Drop*) o selección con explorador de archivos.
* El motor `fileToOptimizedBase64` intercepta la imagen y la procesa en un `<canvas>` HTML5 en memoria: reescala proporcionalmente a un máximo de 600 px y comprime a calidad JPEG 0.85. Esto evita consumir ancho de banda excesivo y asegura carga instantánea en tablets táctiles.

### 6.2 Producto Simple vs. Producto Compuesto (Receta / Escandallo)
* **Producto Simple:** Artículo que se adquiere y se vende sin transformación o con control directo de unidad (ej. *Cerveza Tercio*, *Refresco Lata*). Gestiona stock propio directo.
* **Receta / Compuesto (`Utensils`):** Artículo elaborado en cocina o coctelería (ej. *Hamburguesa Angus*, *Paella de Marisco*, *Gin Tonic Premium*).
  * No tiene stock propio directo; su disponibilidad depende del stock de sus materias primas.
  * **Selector de Materias Primas:** Desplegable que filtra únicamente productos no compuestos.
  * **Cantidad por Ración:** Volumen o peso necesario para 1 unidad de venta.
  * **Factor de Rendimiento (`Rend. %`):** Porcentaje de aprovechamiento real del ingrediente tras limpieza, cocción o despiece. Por ejemplo:
    * Un lomo de salmón que al quitar espinas y piel aprovecha el 80% se configura con `Rend. = 80%`.
  * **Fórmula de Coste de Ingrediente:**
$$\text{Coste Ingrediente} = \frac{\text{Coste Unitario} \times \text{Cantidad}}{\frac{\text{Rendimiento \%}}{100}}$$
  * **Coste Total Automatizado:** Suma ponderada de todos los ingredientes. Este valor bloquea el campo de coste manual y se recalcula instantáneamente cuando el precio de cualquier materia prima varía en albaranes.

### 6.3 Descuento Automático de Materias Primas en Venta TPV
Cuando un camarero cobra un plato compuesto en sala (`deductProductStock`), el motor de GastroPOS Suite desciende recursivamente por todo el árbol del escandallo:
$$\text{Cantidad a Descontar} = \left(\frac{\text{Cantidad Receta}}{\frac{\text{Rendimiento \%}}{100}}\right) \times \text{Unidades Vendidas}$$
Descuenta los gramos, mililitros o unidades exactas de cada materia prima de los almacenes centrales. Si cualquiera de ellas cruza el umbral de `stock_min`, el sistema evalúa inmediatamente la creación de una orden de compra pendiente (`checkAndGeneratePurchaseOrder`).

### 6.4 Variantes y Formatos de Venta (`Layers`)
Para artículos que se comercializan en diferentes presentaciones físicas (ej. *Cerveza: Caña / Jarra / Pinta*; *Vino: Copa / Botella*; *Ración / Media Ración*):
* Permite crear múltiples opciones hijas bajo la misma referencia principal.
* Cada variante cuenta con su propia denominación, coste individual, PVP diferenciado y seguimiento de existencias independiente.

### 6.5 Grupos de Modificadores y Notas de Cocina
Permite parametrizar opciones de personalización durante la toma de comanda:
* **Configuración del Grupo:** Nombre (ej. *Punto de la Carne*, *Guarnición*, *Salsas*).
* **Parámetros de Obligatoriedad:** Checkbox `Obligatorio` (el TPV exige seleccionar antes de añadir) y `Múltiple` (permite elegir varias opciones).
* **Opciones del Grupo:**
  * Nombre de la opción (ej. *Poco Hecha*, *Al Punto*, *Muy Hecha*).
  * **Materia Prima Vinculada (Descuento de Stock):** Descuenta inventario al seleccionarse (ej. *Extra Queso de Cabra* descuenta 40 g del queso en almacén).
  * **Suplemento Económico (`price_adjustment`):** Incremento automático en el precio final de la orden (ej. *+1.50 €*).

### 6.6 Asignación de Estación KDS en Categorías
Al configurar una categoría (`categories`), el administrador define el enrutamiento de comanda hacia pantallas de producción:
* **Cocina (`kitchen`):** Los artículos se envían al KDS principal de cocina caliente/fría.
* **Barra (`bar`):** Los artículos se envían a la pantalla o impresora de barra/bebidas.
* **Ninguna (`none`):** Artículos sin preparación (merchandising, tabaco, packaging).

---

## 7. Módulo de Promociones y Descuentos Programados

La pestaña `promotions` (`Percent`) gestiona ofertas temporales automatizadas sin intervención manual del camarero:
* **Tipo de Descuento:** Porcentual (`%`) o Cantidad Fija (`€`).
* **Ventana Horaria:** Hora de inicio y hora de fin (ej. *18:00 a 20:30* para Happy Hour).
* **Días de la Semana:** Selector de casillas de verificación (Dom, Lun, Mar, Mié, Jue, Vie, Sáb).
* **Ámbito de Aplicación:** Selección selectiva de categorías completas o referencias individuales de producto.
* **Estado:** Interruptor `Promoción Activa` para encender o pausar la vigencia de la oferta.

---

## 8. Gestión Automatizada de Pedidos de Compra

En la pestaña `purchase_orders` (`Scroll`) se administran las órdenes a proveedores:
* **Generación Automática:** Cuando una venta en sala o registro de merma hace que el stock caiga por debajo de `stock_min`, el motor comprueba si existe ya una orden en estado `pending` con ese proveedor:
  * Si existe, añade la línea del producto automáticamente o incrementa la sugerencia de compra.
  * Si no existe, crea una nueva orden de compra borrador vinculada al distribuidor.
* **Aprobación y Recepción:** El gerente puede revisar cantidades, fijar fecha esperada de entrega y registrar la recepción del pedido, actualizando el almacén.

---

## 9. Guía de Solución de Incidencias Frecuentes (FAQ)

* **¿Por qué no puedo borrar un plato del catálogo?**  
  Por imperativo de la Ley Antifraude y trazabilidad contable, si un producto ha sido registrado en tickets cerrados o es ingrediente en una receta, no se permite su eliminación destructiva. Debe desmarcar la casilla **"Activo (TPV)"** para ocultarlo de la sala.
* **¿Cómo actualizo los costes tras una subida de precios del distribuidor?**  
  Utilice la opción **Recibir Albarán** (`FolderInput`). Al ingresar el nuevo precio del lote, el sistema recalcula el PMP automáticamente y propaga el incremento a todos los escandallos asociados.
* **¿Qué sucede si un ingrediente de una receta se agota en almacén?**  
  El sistema permite seguir comandando si el modo de contingencia está habilitado, pero marcará el ingrediente en negativo e iluminará la alerta en el cuadro de control y KDS.
