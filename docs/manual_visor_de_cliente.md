# Manual de Administración y Arquitectura: Visor de Cliente (CFD)
**GastroPOS Suite v2.1**  
*Elaborado por: Dirección de Ingeniería de Software*  
*Destinatario: Administradores del Sistema, Gerentes de Operaciones y Responsables de Infraestructura TPV*

---

### Resumen del Ingeniero

El módulo **Visor de Cliente (Customer Facing Display - CFD)** de GastroPOS Suite v2.1 proporciona una interfaz secundaria de cara al público que proyecta en tiempo real el desglose de la cuenta, el importe total y un código QR dinámico para pagos digitales y propinas. 

Diseñado bajo una arquitectura de **canal broadcast distribuido**, el CFD permite convertir cualquier tablet, monitor secundario o pantalla en mostrador en un visor interactivo de cliente sin cables dedicados ni controladores propietarios.

---

## 1. Topología de Red y Arquitectura de Sincronización

El Visor de Cliente opera mediante una doble capa de sincronización que combina **eventos broadcast de ultrabaja latencia** con **suscripciones de persistencia**:

```
 [ Terminal TPV Sala/Barra ]
             |
   (Broadcast: SYNC_ORDER) <--- Latencia < 50ms (Memoria / WebSocket)
             |
             v
 [ Pantalla Visor de Cliente (CFD) ]
             |
   (Postgres Changes Fallback) <--- Sincronización de Respaldo
             v
      [ Supabase Cloud ]
```

### 1.1 Canal Broadcast en Tiempo Real (`cfd-sync-${tableId}`)
A diferencia de sistemas que requieren guardar el pedido en base de datos para mostrarlo en el visor, GastroPOS Suite transmite el estado del carrito en memoria a través de canales WebSocket broadcast:
* Cada vez que el camarero añade un producto, altera cantidades, aplica notas o añade un descuento en el TPV, el evento `SYNC_ORDER` envía inmediatamente la foto combinada (`currentOrder.items + cart`) al visor.
* El cliente observa cómo los productos aparecen en la pantalla en tiempo real mientras el camarero los introduce, aumentando la transparencia y confianza en el punto de cobro.

### 1.2 Protocolo de Handshake (Apretón de Manos) y Detección de Estado
El sistema monitoriza bidireccionalmente la conexión entre el TPV y el visor:
1. **Lanzamiento:** El TPV envía un evento `PING`.
2. **Respuesta del CFD:** Al abrirse o recibir un ping, el CFD emite `CFD_STATUS: 'OPENED'` o `'PONG'`.
3. **Indicador Visual en TPV:** En el TPV, el icono de pantalla (`Monitor`) cambia a color de acento activo (`bg-brand-accent text-white`), confirmando al camarero que el cliente está viendo la pantalla.
4. **Cierre Controlado:** Al cerrarse la pestaña o apagarse el monitor secundario, el evento `beforeunload` emite `CFD_STATUS: 'CLOSED'`, apagando el indicador del TPV.

---

## 2. Despliegue Físico y Modos de Ejecución

El Visor de Cliente es una aplicación web desacoplada que puede desplegarse en tres configuraciones de hardware distintas:

| Configuración | Hardware Recomendado | Método de Conexión | Ventaja Operativa |
| :--- | :--- | :--- | :--- |
| **Doble Monitor TPV (Extended Desktop)** | Monitor secundario HDMI/USB-C hacia el cliente | Ventana emergente (`width=800,height=600`) lanzada desde el TPV | Cero latencia de red, control directo desde el sistema operativo del TPV. |
| **Tablet Independiente de Mostrador** | iPad / Tablet Android de 10" sobre soporte giratorio | URL directa: `/?view=cfd&tableId=<UUID>` | Inalámbrico, estético, sin cables por el mostrador. |
| **Modo Terminal / Autoservicio** | Pantalla táctil industrial o tótem | Acceso desde el menú principal > "Pantalla CFD" | Selección interactiva de la mesa o barra a reflejar. |

---

## 3. Composición Visual de la Pantalla CFD

La interfaz está dividida en dos paneles de alto contraste optimizados para lectura a media distancia (1 a 3 metros):

### 3.1 Panel Izquierdo: Desglose del Pedido ("Tu Pedido")
* **Cabecera de Marca Blanca (White-Label):** Integra automáticamente el logotipo corporativo configurado en el sistema (`localStorage.getItem('brandLogo')`) o el identificador del local.
* **Indicador de Mesa/Ubicación:** Muestra el nombre asignado (ej. *"Barra Principal"*, *"Mesa 1"*).
* **Listado Dinámico de Artículos:**
  * Badge de cantidad destacado (`1x`, `2x`) en color de contraste.
  * Nombre del plato con tipografía de alta legibilidad.
  * Variantes (ej. *Tapa*, *Ración*, *Copa*).
  * Notas de elaboración especiales visibles para el cliente (ej. *"Sin gluten"*, *"Poco hecho"*).
  * Importe desglosado con formato monetario europeo (`0.00 €`).
* **Estado de Espera:** Cuando no hay comanda activa, muestra una animación elegante con icono de ticket y el mensaje *"Esperando artículos..."*.

### 3.2 Panel Derecho: Total a Pagar y Código QR Dinámico
* **Importe Total:** Cifra en tamaño gigante (`text-6xl font-bold`) para visualización instantánea por parte del cliente antes de sacar su medio de pago.
* **Código QR Dinámico (`QRCodeSVG`):**
  * Nivel de corrección de errores de alta precisión (Nivel H) para escaneo rápido incluso con cámaras de baja resolución o reflejos de luz.
  * URL parametrizada: `https://gastropos.app/pay/<order_id>`.
  * Permite al comensal abonar la cuenta directamente desde su smartphone (Apple Pay / Google Pay / Bizum / Redsys) o añadir propinas digitales sin tocar el datáfono físico.
* **Pie de Pantalla:** Mensaje de cortesía y despedida (*"¡Gracias por tu visita!"*).

---

## 4. Guía de Puesta en Marcha Paso a Paso para Administradores

### Procedimiento A: Enlace Rápido desde la Pantalla TPV
1. En el TPV, abra la mesa deseada en la comanda.
2. En la barra superior derecha de la orden, pulse sobre el botón con icono de pantalla **Monitor**.
3. El sistema abrirá automáticamente una ventana pop-up configurada a `800x600 px` apuntando a `/?view=cfd&tableId=<UUID_MESA>`.
4. Arrastre esa ventana al monitor secundario encarado al cliente y presione **F11** para activar la vista a pantalla completa.

### Procedimiento B: Enlace Permanente en Tablet Autónoma
1. Encienda la tablet secundaria conectada a la red Wi-Fi del restaurante.
2. Abra Google Chrome o Safari y navegue a la URL de la aplicación.
3. En el menú principal o Dashboard, seleccione **"Visor de Cliente (CFD)"**.
4. Aparecerá la cuadrícula con todas las mesas del local. Seleccione la mesa o barra correspondiente (ej. *"Barra 1"*).
5. Añada la página a la pantalla de inicio como PWA o active el "Modo Kiosco" de la tablet.

---

## 5. Mantenimiento y Resolución de Incidencias

* **El visor muestra "Esperando artículos..." pero hay platos en el TPV:**  
  *Causa:* El canal WebSocket no ha sincronizado el apretón de manos inicial.  
  *Solución:* Pulse sobre el icono de monitor en la cabecera del CFD para volver al selector de mesa y reasociar la barra, o pulse F5 para refrescar la suscripción.
* **El código QR no aparece:**  
  *Causa:* El total acumulado de la comanda es 0.00 €. El componente oculta automáticamente el código QR hasta que existan consumiciones registradas para evitar cobros nulos.
* **¿Se guardan datos confidenciales en el visor?**  
  No. El visor es estrictamente de solo lectura y no almacena credenciales de usuario, números de tarjeta ni datos fiscales. Cumple con la normativa de privacidad y RGPD.
