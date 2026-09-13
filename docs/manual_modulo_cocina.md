# Manual de Administración y Arquitectura: Módulo de Cocina (KDS)
**GastroPOS Suite v2.1**  
*Elaborado por: Dirección de Ingeniería de Software*  
*Destinatario: Administradores del Sistema, Gerentes de Alimentos y Bebidas (F&B) y Jefes de Cocina (Executive Chefs)*

---

### Resumen del Ingeniero

El módulo de **Cocina (Kitchen Display System - KDS)** de GastroPOS Suite v2.1 reemplaza por completo la necesidad de impresoras térmicas de tickets físicos en las zonas de elaboración, eliminando pérdidas de comandas, errores de lectura manual y retrasos innecesarios en el pase. 

Este documento detalla la infraestructura reactiva, los algoritmos de enrutamiento por estación de trabajo, el motor de semaforización cromática temporal, la gestión de alérgenos y el control de accesos por roles, garantizando una operación fluida y medible tanto en horas valle como en picos de máximo estrés operativo.

---

## 1. Arquitectura y Reactividad en Tiempo Real

El sistema KDS funciona mediante un esquema **híbrido reactivo** que combina persistencia local transaccional y suscripciones en tiempo real mediante WebSockets:

* **Suscripción WebSocket (`Supabase Realtime`):**  
  La pantalla KDS se suscribe al canal `kitchen-orders`, escuchando en tiempo real mutaciones en las tablas `orders` y `order_items` (`postgres_changes`). Cuando un camarero pulsa *"Enviar Comanda"* en el TPV o en su comander móvil, la comanda aparece en las pantallas de cocina en menos de **200 milisegundos**.
* **Integración Local-First (`orderService.ts: getKitchenOrders`):**  
  El KDS fusiona en memoria las órdenes activas de la base de datos local embebida (`Dexie.js / IndexedDB`) con las del backend remoto. Esto asegura que si se pierde la conexión a Internet o el router del local sufre una microcaída, las comandas creadas en modo local siguen mostrándose y gestionándose en la cocina sin cortes de servicio.
* **Enriquecimiento Dinámico de Mesas (`tableService.ts`):**  
  Cada ticket se vincula automáticamente con el nombre descriptivo de la mesa (`order.tables.name`, ej. *"Mesa 4"*, *"Terraza 2"*, *"Barra 1"*), evitando confusiones con UUIDs numéricos.

---

## 2. Topología de Estaciones y Enrutamiento Inteligente

Para evitar la sobrecarga visual de los operarios, el sistema separa automáticamente las tareas de preparación culinaria de las tareas de servicio de bebidas mediante el selector de estaciones situado en la cabecera del KDS:

| Estación | Icono | Criterio de Enrutamiento (`getItemStation`) | Destinatario Principal |
| :--- | :--- | :--- | :--- |
| **TODO (General)** | `LayoutGrid` / Vista combinada | Muestra todos los artículos de la comanda sin filtrar | Jefe de Pase / Encargado de Sala |
| **COCINA** | `Utensils` / Naranja (`bg-orange-600`) | Excluye artículos clasificados en la familia *"Bebidas"* | Cocina Caliente, Cuarto Frío y Partida de Postres |
| **BARRA** | `Beer` / Azul (`bg-blue-600`) | Filtra exclusivamente artículos pertenecientes a *"Bebidas"* | Barman, Bartender y Personal de Barra |

### Algoritmo de Mapeo Dinámico:
```typescript
const getItemStation = (productId: string): 'kitchen' | 'bar' | 'none' => {
    const product = products.find(p => p.id === productId);
    if (!product) return 'none';
    const category = categories.find(c => c.id === product.category_id);
    
    if (category?.name.toLowerCase() === 'bebidas') {
        return 'bar';
    }
    return 'kitchen';
};
```
*Si un ticket contiene únicamente bebidas y la pantalla está configurada en modo "COCINA", el ticket completo se omite automáticamente del panel para no saturar la vista de los cocineros con cafés, refrescos o cervezas.*

---

## 3. Algoritmo de Priorización FIFO y Tiempos de Espera

El orden de los pedidos en el expositor de cocina sigue estrictamente el principio **FIFO (First-In, First-Out)** de izquierda a derecha, garantizando que los clientes que llevan más tiempo esperando sean atendidos primero:

1. **Cálculo por Plato Activo Más Antiguo (`oldestItemTime`):**  
   En lugar de calcular el tiempo de espera únicamente con la hora de apertura de la mesa (la cual pudo abrirse hace horas para una ronda de aperitivos previa), el algoritmo busca la marca temporal `created_at` del artículo activo más antiguo que todavía esté pendiente o preparándose.
2. **Reordenación Dinámica:**  
   Cada comanda recalcula su posición en tiempo real. Si en una mesa de postres se añade un café urgente, la marcha de ese nuevo artículo computa su propio tiempo de marcha.

---

## 4. Semáforo de Tiempos y Alertas de SLA (Acuerdo de Nivel de Servicio)

Cada tarjeta de comanda en el KDS incluye un encabezado cromático auto-escalable que permite al jefe de cocina evaluar el estado del servicio desde varios metros de distancia:

| Rango de Espera | Color de Cabecera | Indicador | Estado Operativo |
| :--- | :--- | :--- | :--- |
| **0 a 14 minutos** | **Verde Esmeralda** (`bg-green-600`) | `Clock XXm` | **En tiempo:** Ritmo de servicio normal dentro de los estándares de calidad. |
| **15 a 30 minutos** | **Amarillo Ámbar** (`bg-yellow-600`) | `Clock XXm` | **Atención requerida:** Comanda demorada; debe priorizarse frente a tickets verdes. |
| **Más de 30 minutos** | **Rojo Carmesí Pulsante** (`bg-red-600 animate-pulse`) | `Clock XXm` | **Crítico:** Alerta roja intermitente. Requiere intervención inmediata del jefe de cocina. |

---

## 5. Ciclo de Vida del Plato y Operativa Táctil

Dentro de cada ticket, los platos se agrupan automáticamente por su categoría culinaria (Entrantes, Carnes, Pescados, Guarniciones, etc.).

### Flujo de Estados del Plato (`OrderItemStatus`):
1. **Pendiente (`pending`):**  
   Fondo oscuro neutro (`bg-brand-900`), borde gris. Indica que la comanda ha sido recibida pero ningún cocinero la ha marcado aún como terminada.
2. **Listo para Servir (`ready`):**  
   Al tocar sobre el plato, su estado avanza inmediatamente a `ready`. El plato se resalta en **verde esmeralda suave** (`bg-green-500/20`), con borde verde sólido (`border-green-500`) y un icono de verificación (`CheckCircle`). Indica al pase y a los camareros que el plato está emplatado y listo para salir a mesa.
3. **Servido (`served`):**  
   Un segundo toque sobre el plato lo marca como `served` (despachado de la cocina).
4. **Desaparición Automática del Ticket:**  
   Cuando todos los platos de una comanda alcanzan el estado `served`, el ticket completo se retira automáticamente de la pantalla KDS para liberar espacio visual a las nuevas comandas entrantes.

---

## 6. Seguridad Alimentaria: Modificadores, Puntos de Carne y Alérgenos

Para evitar errores graves en intolerancias y alergias alimentarias, el KDS cuenta con un renderizado con alto contraste:

* **Variantes y Formatos:** Si el cliente solicitó *"Formato: Tapa"*, *"Ración"* o *"Media Ración"*, el KDS lo destaca en tipografía ámbar (`text-orange-400 font-medium`).
* **Notas de Cocina y Alérgenos:** Si el camarero añadió notas (ej. *"SIN GLUTEN - CELÍACO"*, *"Poco hecho"*, *"Salsa aparte"*), el sistema las envuelve en una caja roja de alerta (`bg-red-900/30 border-red-900/50 text-red-200`) con un icono de advertencia (`AlertTriangle`).

---

## 7. Control de Acceso Basado en Roles (RBAC)

Para evitar que el personal de sala altere accidentalmente el estado de las partidas de cocina al consultar la pantalla:

* **Rol Camarero (`waiter`):**  
  Dispone de acceso de **Solo Lectura**. Puede ver el KDS para comprobar si los platos de sus mesas están listos, pero los clics sobre los platos están deshabilitados (`cursor-default`), impidiendo que marquen o sirvan platos por error.
* **Roles Cocinero (`cook`), Encargado (`manager`) y Administrador (`admin`):**  
  Tienen control táctil completo para marcar platos como listos, servirlos, alternar estaciones o forzar refrescos de red.

---

## 8. Resiliencia y Mantenimiento Técnico

* **Botón de Refresco Forzado (`RefreshCw`):**  
  Ubicado en la cabecera para ejecutar un refresco instantáneo del cache de React Query en caso de reconexión tras una bajada de tensión.
* **Modo Horizontal Optimizado:**  
  La interfaz está diseñada para monitores táctiles panorámicos de 15" a 24" o tablets industriales en horizontal con desplazamiento suave horizontal (`overflow-x-auto`).
* **Identificador de Ticket (#Hash):**  
  En el pie de cada comanda se incluye el hash de 8 caracteres del pedido (ej. `#a1b2c3d4`) para una identificación unívoca entre cocina y sala.

---

## 9. Preguntas Frecuentes del Administrador (FAQ)

* **¿Cómo configuro una pantalla solo para bebidas en la barra?**  
  Simplemente pulse el botón **"BARRA"** en el selector superior de esa pantalla. La selección se mantiene en la sesión del navegador.
* **¿Qué sucede si un plato se marca como "Listo" por error?**  
  Un segundo toque lo marca como servido; no obstante, en el TPV central el encargado puede reabrir o consultar el estado de cualquier comanda en cualquier instante.
* **¿Requiere el KDS conexión permanente a Internet?**  
  Gracias a la sincronización en IndexedDB, el KDS continúa operando dentro de la red local. Al regresar la conexión a la nube, las marcas de tiempo y estados se sincronizan con la base de datos central de Supabase.
