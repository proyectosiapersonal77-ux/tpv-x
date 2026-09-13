# Manual del Administrador: Módulo Finanzas y Analítica
**GastroPOS Suite v2.1**
*Elaborado por: Dirección Financiera & Arquitectura de Software GastroPOS*
*Destinatarios: Gerencia, Dirección Contable, Controllers Financieros y Administradores de Sistema*

---

## 1. Introducción y Marco Estratégico

El módulo de **Finanzas y Analítica** (`AnalyticsScreen.tsx`) consolida el motor de inteligencia de negocio (BI), control presupuestario y liquidación fiscal de GastroPOS Suite. En el sector de la hostelería, donde los márgenes operativos son estrechos y los costes de materias primas fluctúan constantemente, la toma de decisiones no puede basarse en intuiciones.

Este módulo transforma de manera transparente los miles de eventos transaccionales registrados en sala, barra y cocina en cuatro grandes pilares analíticos y contables:
1. **Dashboard Financiero de Rendimiento Operativo (BI en tiempo real):** Ventas totales, tickets emitidos, ticket medio, split por método de cobro, mapa de ventas por hora, ventas por categoría, ventas por camarero y ventas por zona de sala/terraza.
2. **Control de Rentabilidad & Cuenta de Pérdidas y Ganancias (P&L):** Cruce automático del coste de escandallos (`Inventory`) con los precios netos de venta (`POS`) para auditar en vivo el Coste de Ventas (COGS), el Beneficio Bruto y el Margen Bruto (%).
3. **Cierre Fiscal Diario Obligatorio (Informe Z):** Resumen diario legalmente vinculante, desglose de bases imponibles y cuotas de IVA (4%, 10%, 21%), auditoría de medios de cobro y conciliación automática del arqueo de caja con control de descuadres.
4. **Módulo Fiscal y Tributario (Impuestos & Modelo 347):** Liquidación trimestral (T1, T2, T3, T4) y anual de IVA Repercutido (Ventas) e IVA Soportado (Albaranes/Compras), auditoría de operaciones con terceros superiores a 3.005,06 € (Modelo 347) y exportación limpia a CSV compatible con software contable (A3, Sage, Contasol) y gestorías.
5. **Auditoría de Tickets y Cumplimiento Antifraude (VeriFactu / TicketBAI):** Trazabilidad exhaustiva de tickets del día y mecanismo auditado de anulación de tickets con justificación obligatoria y registro de autor.

---

## 2. Arquitectura de Datos y Flujo de Agregación

El módulo opera sobre un modelo analítico reactivo impulsado por **TanStack React Query** y **IndexedDB (Dexie.js)** con sincronización nube en **Supabase**:

```
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │    Órdenes TPV       │   │  Recetas/Escandallos │   │ Recepción Albaranes  │
 │ (db.orders: paid/    │   │ (db.products: cost_  │   │  (purchase_orders:   │
 │        voided)       │   │   price, tax_rate)   │   │  items, suppliers)   │
 └──────────┬───────────┘   └──────────┬───────────┘   └──────────┬───────────┘
            │                          │                          │
            ▼                          ▼                          ▼
 ┌────────────────────────────────────────────────────────────────────────────┐
 │                  Motor de Agregación y Cálculo Analítico                   │
 │                        (AnalyticsScreen / TaxesReport)                     │
 ├────────────────────────────────────────────────────────────────────────────┤
 │ • Ventas Brutas & Netas       • Coste Total (COGS)    • Beneficio Bruto    │
 │ • IVA Repercutido (Ventas)    • IVA Soportado (Compras) • Modelo 347       │
 │ • Segmentación Horaria (0-23h)• Ventas por Camarero   • Ventas por Zona    │
 │ • Conciliación Cierre Z: Saldo Esperado vs. Efectivo Real = Descuadre      │
 └─────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │ Dashboard Ejecutivo  │   │ Cierre Diario (Z)    │   │ Módulo Fiscal/Tribut.│
 │ Recharts Gráficos &  │   │ Impresión Oficial    │   │ IVA Trimestral &     │
 │ KPIs Rentabilidad    │   │ & Arqueo Contable    │   │ Exportación CSV 347  │
 └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

---

## 3. Pestaña 1: Dashboard Financiero y Rentabilidad (P&L en Vivo)

El panel principal ofrece a la dirección una vista panorámica instantánea de la salud económica del restaurante para cualquier fecha seleccionada.

### 3.1. Tarjetas de KPIs Principales
- **Ventas Totales:** Suma acumulada bruta (€ con IVA incluido) de todas las órdenes liquidadas en el día.
- **Tickets Emitidos:** Volumen total de operaciones finalizadas y facturadas.
- **Ticket Medio:** Gasto promedio por comanda cobrada ($\text{Ticket Medio} = \frac{\text{Ventas Totales}}{\text{Nº de Tickets}}$).
- **Desglose de Cobro (Efectivo vs. Tarjeta):** Monitor visual diferenciado para anticipar la conciliación de datáfonos (Redsys) y la recaudación en metálico.

### 3.2. Rentabilidad y Margen Bruto (P&L)
A diferencia de los TPVs convencionales que solo miden ingresos brutos, GastroPOS cruza cada línea de comanda vendida con el coste de ingredientes fijado en el escandallo:
- **Coste Total (Inventario / COGS):**
  $$\text{Coste Total} = \sum (\text{Cantidad Vendida}_i \times \text{Coste Unitario}_i)$$
  *(Soporta variantes de producto como copas, medias raciones o suplementos).*
- **Beneficio Bruto:**
  $$\text{Beneficio Bruto} = \text{Ventas Netas (sin IVA)} - \text{Coste Total}$$
- **Margen Bruto (%):**
  $$\text{Margen Bruto (\%)} = \left(\frac{\text{Beneficio Bruto}}{\text{Ventas Netas}}\right) \times 100$$
  Permite identificar de inmediato si el establecimiento opera dentro de los estándares de la industria (habitualmente entre 65% y 75% de margen bruto).

### 3.3. Gráficas y Segmentación Analítica (Recharts)
- **Ventas por Hora (Mapa de Ritmo del Servicio):** Gráfico de barras interactivo que distribuye las 24 horas del día ($00:00$ a $23:00$). Permite identificar picos de afluencia, dimensionar turnos de camareros y escalonar cocciones previas en cocina.
- **Ventas por Categoría:** Gráfico de donut (*PieChart*) con leyenda porcentual para evaluar el mix de ventas (Bebidas, Entrantes, Carnes, Postres, etc.).
- **Ventas por Camarero:** Gráfico de barras horizontal que cuantifica las ventas netas cerradas por cada miembro del equipo de sala.
- **Ventas por Zona:** Rendimiento comparativo entre Salón Principal, Terraza Exterior, Zona de Barra o Reservados, facilitando decisiones de redistribución de mesas.
- **Matriz BCG Básica:** Clasificación de platos en Estrellas, Vacas, Interrogantes y Perros para supervisión operativa rápida en la jornada.

---

## 4. Pestaña 2: Cierre de Caja Z (Informe Z Oficial)

El **Cierre Z** es el documento fiscal y contable preceptivo exigido por la normativa tributaria para consolidar el final de la jornada.

### 4.1. Estructura del Informe Z
1. **Encabezado Fiscal:** Denominación legal, NIF/CIF, fecha de emisión y numeración de serie.
2. **Resumen de Ventas:** Total facturado, recaudación por efectivo, recaudación por tarjeta de crédito/débito y recuento de tickets.
3. **Desglose Oficial de Impuestos (IVA):**
   Tabla formal que desglosa cada tipo impositivo aplicado:
   - Tipo de IVA (4% Superreducido, 10% Reducido de Hostelería, 21% General para bebidas alcohólicas/merchandising).
   - Base Imponible (€).
   - Cuota de IVA repercutida (€).
   - Total Facturado con IVA (€).
4. **Cuadre de Efectivo y Auditoría de Arqueo:**
   - Fondo Inicial de Apertura.
   - (+) Ventas en Efectivo registradas en el TPV.
   - (+) Entradas Manuales auditadas (cambio inyectado).
   - (-) Salidas Manuales auditadas (pagos autorizados de caja chica).
   - **(=) Total Efectivo Esperado en Gaveta.**
   - Efectivo Real Recontado físicamente en el Arqueo Ciego.
   - **Descuadre:** Diferencia monetaria con indicador cromático de alerta (Verde si es 0,00 €, Rojo en caso de discrepancia positiva o negativa).

### 4.2. Impresión y Formato Físico
Al pulsar el botón **"Imprimir Z"**, el sistema aplica las directivas CSS `@media print` para ocultar botones, barras de navegación y fondos oscuros, formateando el documento en papel estándar A4 o en tiras térmicas ESC/POS de 80mm para su archivo contable y entrega al gestor.

---

## 5. Pestaña 3: Módulo de Impuestos y Modelo 347 (`TaxesReport.tsx`)

Herramienta especializada para la asesoría fiscal y contabilidad trimestral del negocio:

### 5.1. Filtros Temporales Dinámicos
- Selector de Ejercicio Fiscal (Año actual y años precedentes).
- Selector de Periodo de Liquidación:
  - **T1:** 1 de Enero al 31 de Marzo (Modelo 303 trimestral).
  - **T2:** 1 de Abril al 30 de Junio.
  - **T3:** 1 de Julio al 30 de Septiembre.
  - **T4:** 1 de Octubre al 31 de Diciembre.
  - **Anual:** Consolidado de todo el ejercicio económico (Modelo 390).

### 5.2. Conciliación de IVA Repercutido vs. Soportado
- **IVA Repercutido (Ventas a Clientes):** Desglose de bases y cuotas procedentes de las comandas pagadas en el periodo.
- **IVA Soportado (Compras y Albaranes de Proveedores):** Agregación automática de todas las órdenes de compra (`purchase_orders`) recepcionadas en almacén durante el periodo con desglose de bases y cuotas deducibles.
- **Resultado de la Liquidación Estimada:** Permite calcular con antelación si la liquidación resultará a ingresar o a compensar ($\Delta \text{IVA} = \text{IVA Repercutido} - \text{IVA Soportado}$).

### 5.3. Modelo 347 (Declaración Anual de Operaciones con Terceros)
La normativa tributaria exige declarar anualmente a todos aquellos clientes o proveedores con los que el volumen de operaciones acumulado durante el ejercicio supere los **3.005,06 € (IVA incluido)**.
- GastroPOS audita todas las transacciones vinculadas a cada proveedor y genera automáticamente la tabla de proveedores obligados.
- **Exportación a CSV para Gestor:** Con un solo clic, se genera un archivo CSV con codificación UTF-8 BOM listo para ser importado directamente en cualquier software de contabilidad profesional.

---

## 6. Pestaña 4: Auditoría de Tickets y Anulación Conforme a Ley

Para cumplir con los estrictos requerimientos de la **Ley Antifraude 11/2021**:
- **Historial Completo de Tickets:** Visualización de todas las facturas simplificadas expedidas en el día, con hora, importe, método de pago y número correlativo de factura.
- **Anulación Auditada de Tickets:**
  - Solo disponible para usuarios con permiso explícito `can_void_ticket` o administradores.
  - Requiere obligatoriamente introducir el **Motivo / Causa de la anulación** (p. ej. "Cobro duplicado por error del terminal bancario").
  - El ticket no se elimina de la base de datos (prohibido por ley); su estado cambia a `voided`, conservando la traza, la hora, el responsable y el motivo para inspecciones tributarias.

---

## 7. Permisos de Seguridad (RBAC) Asociados

| Permiso | Finalidad Operativa | Nivel de Riesgo |
| :--- | :--- | :--- |
| `can_view_reports` | Acceso a métricas de ventas, dashboard y gráficas horarias. | Medio (Consulta interna) |
| `can_close_register` | Capacidad para emitir el Informe Z oficial y sellar la caja. | Alto (Contabilidad formal) |
| `can_void_ticket` | Autorización para anular tickets emitidos y generar abonos. | Crítico (Protección antifraude) |
| `admin` | Acceso irrestricto a exportaciones de impuestos, Modelo 347 y P&L. | Total (Gerencia / Propietario) |

---

## 8. Preguntas Frecuentes y Protocolo de Incidencias

**P: ¿Por qué no coincide el efectivo esperado con el dinero físico al imprimir el Z?**  
R: Compruebe si se realizaron gastos de caja chica o extracciones de cambio que no fueron introducidos en la pantalla de "Gestión de Caja" mediante el botón "SALIDA". El sistema calcula exactamente lo registrado; cualquier salida no documentada causará un descuadre negativo.

**P: ¿Cómo exportar los datos para enviárselos al asesor fiscal a final de trimestre?**  
R: Acceda a la pestaña **Impuestos**, seleccione el año y trimestre correspondiente (ej. T1) y haga clic en **"Exportar CSV para Gestor"**. El fichero resultante incluye las tablas de IVA Repercutido, IVA Soportado y operaciones del Modelo 347 ordenadas y formateadas.

**P: ¿Se borran las ventas al anular un ticket por error de cobro?**  
R: No. Por imperativo de la Ley Antifraude y el reglamento VeriFactu, ningún registro de facturación puede destruirse ni ocultarse. La anulación genera una contrapartida auditada visible en la pestaña de tickets con tachado e indicación del empleado que la autorizó.
