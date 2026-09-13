# Manual del Administrador y Operativa: Módulo Gestión de Caja
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Operaciones & Arquitectura de Software*
*Destinatarios: Gerencia, Dirección Financiera, Jefes de Sala y Personal de Caja*

---

## 1. Introducción y Marco Legal

El módulo de **Gestión de Caja** de GastroPOS Suite constituye el pilar operativo y contable responsable de la custodia, trazabilidad y cuadre de todos los flujos monetarios originados en el establecimiento hostelero.

En el sector de la restauración contemporáneo y bajo las directrices de la **Ley Antifraude 11/2021** y los reglamentos de facturación electrónica (**VeriFactu / TicketBAI**), la gestión del efectivo no puede tratarse como un simple registro informal de entradas y salidas. GastroPOS Suite garantiza la inmutabilidad de cada transacción, el control estricto de accesos mediante RBAC (Control de Acceso Basado en Roles) y la emisión auditada de los informes de cierre ciego (**Arqueo Parcial / Informe X**) y cierre definitivo (**Informe Z**).

---

## 2. Arquitectura de Datos y Ciclo de Vida de Caja

El motor de caja opera bajo una máquina de estados finitos estricta gestionada en la base de datos distribuida (IndexedDB local y Supabase PostgreSQL en la nube):

```
       [ CAJA CERRADA ]
              │
              │  openRegister(fondoInicial, employeeId)
              ▼
        [ CAJA ABIERTA ] ◄────────────────────────────────────────┐
          │     │     │                                           │
          │     │     ├─► Venta TPV Efectivo (+Cobro)             │
          │     │     ├─► Movimiento Manual Entrada (+IN)         │
          │     │     └─► Movimiento Manual Salida (-OUT)         │
          │     │                                                 │
          │     └─► Arqueo Parcial / Conteo Físico Ciego          │
          │                                                       │
          │  closeRegister(conteoReal, employeeId, notas)         │
          ▼                                                       │
   [ DESCUADRE? ] ──► (Si Descuadre ≠ 0: Confirmación Forzada)   │
          │                                                       │
          ▼                                                       │
       [ CAJA CERRADA ] (Genera Cierre Z Inmutable) ──────────────┘
```

### Entidades de Datos Principales:

1. **`CashRegister` (Registro de Turno de Caja):**
   - `id`: Identificador universal único (UUIDv4).
   - `opened_at`: Marca de tiempo ISO-8601 del momento exacto de apertura.
   - `closed_at`: Marca de tiempo ISO-8601 del cierre de turno.
   - `opened_by`: Identificador del empleado responsable de la apertura.
   - `closed_by`: Identificador del empleado que realizó el arqueo de cierre.
   - `opening_balance`: Fondo de maniobra o cambio inicial en metálico (€).
   - `closing_balance`: Efectivo real recontado físicamente en el cajón (€).
   - `expected_balance`: Saldo teórico calculado algorítmicamente (€).
   - `status`: Estado del turno (`open` | `closed`).
   - `notes`: Justificación de discrepancias o incidencias del turno.

2. **`CashMovement` (Movimientos Extrordinarios de Efectivo):**
   - `id`: UUIDv4 del movimiento.
   - `register_id`: Vinculación al turno de caja abierto.
   - `type`: Tipo de flujo monetario (`in` = Entrada extraordinaria | `out` = Salida/Gasto).
   - `amount`: Cuantía monetaria (€).
   - `reason`: Motivo o concepto auditado (p. ej. "Pago a repartidor de hielo", "Aportación de cambio de billetes a monedas").
   - `employee_id`: Empleado firmante del movimiento.
   - `created_at`: Marca de tiempo inmutable.

---

## 3. Algoritmo Financiero de Saldo Esperado y Descuadre

Durante el servicio en vivo, GastroPOS calcula en tiempo real el **Total Esperado** en cajón mediante la siguiente fórmula estandarizada:

$$\text{Saldo Esperado} = \text{Fondo Inicial} + \sum (\text{Entradas Manuales}) - \sum (\text{Salidas Manuales}) + \sum (\text{Ventas TPV en Efectivo})$$

Donde:
- Las ventas en efectivo se computan exclusivamente para las órdenes con estado `status = 'paid'` y método `payment_method = 'cash'` cuya fecha de liquidación se encuentre dentro de la ventana de apertura del turno actual ($t \ge \text{opened\_at}$).
- Los cobros con **Tarjeta de Crédito/Débito** o plataformas QR/Datáfono no incrementan el saldo físico del cajón portamonedas, pero son auditados en el desglose final para el cuadre del lote del TPV bancario (Redsys).

### Cálculo de la Desviación (Descuadre):
$$\text{Descuadre} = \text{Efectivo Real Recontado} - \text{Saldo Esperado}$$

- **Descuadre Positivo ($> 0$):** Sobrante de caja (dinero en exceso respecto a los tickets cobrados).
- **Descuadre Cero ($= 0$):** Cuadre exacto (concordancia contable perfecta).
- **Descuadre Negativo ($< 0$):** Faltante de caja (pérdida o error de cambio).

---

## 4. Desglose de Funciones, Pantallas y Controles

### 4.1. Cabecera y Monitor de Estado
- **Botón Atrás (`ChevronLeft`):** Retorno al panel principal de GastroPOS sin interrumpir el estado de la sesión activa.
- **Indicador de Estado:**
  - `CAJA ABIERTA` (Verde esmeralda): Turno activo y operativo. El TPV permite cobrar pedidos en metálico y registrar movimientos.
  - `CAJA CERRADA` (Rojo carmesí): No existe ningún turno activo. El sistema bloquea cobros en metálico hasta realizar la apertura.
- **Botón "Abrir Cajón" (`Printer`):** Envía por impulsos eléctricos la secuencia de escape ESC/POS (`ESC p 0 25 250`) a través de Web Bluetooth / USB a la gaveta de cobro conectada a la impresora de tickets. Disponible para administradores o usuarios con permiso `can_open_drawer`.
- **Botón "Historial de Cierres" (`History`):** Abre la vista retrospectiva de auditoría con el registro de todos los turnos anteriores, fechas, responsables y descuadres.

---

### 4.2. Flujo de Apertura de Caja (Inicio de Jornada)
1. El empleado autorizado accede a la pantalla de caja.
2. Si la caja está cerrada, se presenta el formulario de apertura solicitando el **Fondo de caja inicial (€)**.
3. **Desglose Rápido por Billetes:** Se dispone de una botonera de denominaciones estándar (5€, 10€, 20€, 50€, 100€) y calculadora de monedas para facilitar el conteo rápido de la gaveta de cambio.
4. Al pulsar **"ABRIR CAJA"**, el sistema registra la apertura inmutable y activa el punto de venta para cobros en sala y barra.

---

### 4.3. Movimientos Manuales (Entradas y Salidas de Cambio)
Durante la jornada, es habitual realizar operaciones ajenas a las ventas de comida y bebida:
- **Entradas (`in`):** Inyección de efectivo para cambio cuando escasean monedas o billetes pequeños.
- **Salidas (`out`):** Pagos directos de caja chica (repartidores de proveedores al contado, compras de urgencia en supermercado, anticipos o propinas liquidadas).

**Requisitos Obligatorios:**
- El operario debe introducir obligatoriamente el **Importe (€)** y el **Motivo / Concepto** justificativo.
- No se permiten movimientos de importe nulo o negativo.
- Cada movimiento queda grabado con la firma digital del empleado que lo efectuó.

---

### 4.4. Proceso de Arqueo y Cierre de Caja (Cierre Z)
Al finalizar el turno o jornada:
1. El encargado realiza el **conteo físico ciego** del efectivo en el cajón (billetes y monedas).
2. Introduce la cifra recontada en el campo **"Efectivo real en cajón (€)"**.
3. Puede registrar observaciones o incidencias en las **"Notas de cierre"** (p. ej. "Billete deteriorado no aceptado por banco").
4. Al pulsar **"CERRAR CAJA"**:
   - Si el efectivo coincide exactamente con el `Saldo Esperado`, la caja se cierra de forma inmediata.
   - Si existe una diferencia (descuadre positivo o negativo), el sistema detiene la operación y levanta el **Modal de Confirmación de Descuadre**, mostrando la desviación en color de alerta y requiriendo una confirmación deliberada.
5. El sistema consolida el informe de cierre, emite el ticket de resumen por impresora y bloquea nuevas ventas en metálico hasta el siguiente turno.

---

## 5. Diferenciación Legal y Operativa: Informe X vs. Informe Z

| Atributo | Arqueo Parcial / Informe X | Cierre Diario / Informe Z |
| :--- | :--- | :--- |
| **Naturaleza** | Informativo / Consulta en vivo | Fiscal / Contable definitivo |
| **Momento de Emisión** | Cualquier momento durante el turno | Exclusivamente al finalizar la jornada/turno |
| **Efecto sobre el Turno** | No cierra la caja ni altera contadores | Cierra el turno, bloquea la sesión y reinicia acumuladores |
| **Inmutabilidad** | Datos provisionales dinámicos | Registro histórico definitivo sellado |
| **Desglose Impositivo** | Estimación de ventas acumuladas | Desglose por bases imponibles y cuotas de IVA (4%, 10%, 21%) |
| **Obligatoriedad Fiscal** | Opcional (Control interno del encargado) | Obligatorio por normativa tributaria y auditoría |

---

## 6. Seguridad, Permisos Granulares y Auditoría (RBAC)

El acceso a la operativa de caja está protegido por el sistema de roles y privilegios de GastroPOS Suite:

- **`can_open_drawer`:** Permite accionar la apertura eléctrica del cajón portamonedas sin necesidad de efectuar un cobro.
- **`can_manage_cash`:** Permite registrar entradas y salidas manuales de efectivo.
- **`can_close_register`:** Autorización para realizar arqueos y cierres Z oficiales.
- **`can_view_reports`:** Faculta al usuario para consultar el saldo esperado, ventas desglosadas e historial de descuadres.

Todas las acciones (aperturas, cierres, cobros anulados y movimientos manuales) generan un evento en la tabla `audit_logs` con la estampa de tiempo, el usuario autenticado y la información técnica del dispositivo.

---

## 7. Preguntas Frecuentes y Resolución de Incidencias

**P: ¿Qué hacer si hay un descuadre al cerrar la caja?**  
R: Vuelva a recontar el dinero físico en la gaveta asegurándose de verificar compartimentos ocultos o billetes solapados. Si el descuadre persiste, registre el motivo en el campo "Notas de cierre" (p. ej. "Ticket de proveedor no registrado de 15.00€") y confirme el cierre con descuadre forzado para su posterior conciliación contable.

**P: ¿Por qué la impresora no abre el cajón portamonedas?**  
R: Compruebe que la impresora de tickets esté encendida, conectada vía Bluetooth/USB y que el cable RJ-11 / RJ-12 de la gaveta esté firmemente insertado en el puerto `DK` (Drawer Kick) de la impresora.

**P: ¿Se pueden cobrar comandas si la caja está cerrada?**  
R: No. El sistema exige abrir la caja con su fondo inicial antes de registrar pagos en efectivo para asegurar la correlación fiscal de todos los tickets.
