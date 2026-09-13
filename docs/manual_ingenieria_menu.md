# Manual de Administración y Arquitectura: Módulo de Ingeniería de Menú
**GastroPOS Suite v2.1**
*Elaborado por: Dirección de Operaciones F&B e Inteligencia Financiera*
*Destinatario: Gerentes de Restaurante, Chefs Ejecutivos, Controllers y Administradores*

---

## 1. Fundamentos y Objetivos del Módulo
El módulo de **Ingeniería de Menú** de GastroPOS Suite constituye la herramienta estratégica de mayor impacto económico para el negocio hostelero. Su objetivo prioritario es maximizar el beneficio bruto de la carta sin perjudicar el volumen de clientela, combinando:

1. **Datos de Venta Reales:** Lectura directa de las transacciones cerradas y tickets cobrados en el TPV (`orders` y `order_items` en Dexie IndexedDB y Supabase).
2. **Costes de Escandallo Actualizados:** Integración de la ficha técnica de producto con su Precio Medio Ponderado (PMP) y Factor de Rendimiento (`yield_percentage`).
3. **Modelos de Clasificación BCG:** Segmentación automática de platos en 4 cuadrantes (Estrellas, Vacas Lecheras, Interrogantes y Perros).
4. **Inteligencia Artificial Estratégica (Google Gemini 3.8):** Generación de auditorías y diagnósticos ejecutivos accionables sobre la carta.

---

## 2. Los 4 Cuadrantes de la Matriz BCG (Kasavana & Smith)
La metodología de Ingeniería de Menú cruza dos variables cuantitativas clave:
- **Popularidad (Volumen de Unidades Vendidas):** Eje X.
- **Rentabilidad (Margen de Contribución Unitario en Euros):** Eje Y, donde $\text{Margen} = \text{PVP} - \text{Coste}$.

Los umbrales divisorios se fijan matemáticamente mediante la **Media de Unidades Vendidas** y la **Media de Margen de Contribución** del catálogo analizado:

### A. ⭐ Platos Estrella (Alta Popularidad + Alto Margen)
- **Definición:** Platos que los clientes piden con mucha frecuencia y que dejan un elevado margen neto de beneficio en caja.
- **Estrategia Recomendada:** Mantener inalterada la receta y calidad de los ingredientes. Darles protagonismo visual prioritario en la carta y sugerirlos activamente en sala.

### B. 🐄 Vacas Lecheras (Alta Popularidad + Bajo Margen)
- **Definición:** Platos insignia o clásicos de la casa muy demandados por el público pero con coste elevado o precio de venta demasiado contenido.
- **Estrategia Recomendada:** Incrementar ligeramente el PVP (+0,20 € a +0,50 €), reducir gramajes o renegociar el precio de compra con los proveedores para rebajar el coste de materia prima.

### C. ❓ Interrogantes / Puzles (Baja Popularidad + Alto Margen)
- **Definición:** Platos sumamente rentables pero que el cliente pide con poca frecuencia.
- **Estrategia Recomendada:** Incrementar su visibilidad en sala mediante pizarras de sugerencias del día, entrenar al personal de camareros para que los recomienden al tomar comanda, o revisar el naming y descripción del plato.

### D. 🐕 Perros (Baja Popularidad + Bajo Margen)
- **Definición:** Platos que se venden poco y además aportan un margen escaso, inmovilizando stock y generando mermas de almacén.
- **Estrategia Recomendada:** Reformular la receta para abaratar costes o sustituirlos definitivamente en la próxima renovación de carta.

---

## 3. Desglose de las 4 Vistas Especializadas

### Pestaña 1: Matriz BCG & Gráfica de Dispersión
- **Tarjetas KPI por Cuadrante:** Conteo de productos clasificados y suma total del beneficio generado por cada grupo.
- **Gráfica Interactiva Scatter (Recharts):** Dispersión bidimensional de puntos de colores según el cuadrante, con líneas de corte en las medias y tooltips enriquecidos con datos de ventas y food cost.
- **Tabla Detallada con Filtros:** Búsqueda por nombre de producto, selector de familia y ventana temporal (Últimos 7 días, 30 días, 90 días o Histórico completo).

### Pestaña 2: Análisis de Food Cost (Recetas Compuestas)
- **Semáforo Financiero de Escandallo:**
  - **Verde (< 28%):** Coste de materia prima bajo control y margen óptimo.
  - **Naranja (28% - 35%):** Margen ajustado; requiere monitorización ante subidas de precios de materias primas.
  - **Rojo (> 35%):** Alerta financiera; el coste de ingredientes absorbe un porcentaje excesivo del precio final.

### Pestaña 3: Cálculo Automático y Ajuste Masivo de PVP
- **Fórmula de Fijación de Precios:**
  $$\text{PVP Sugerido} = \frac{\text{Coste Materia Prima}}{1 - (\text{Margen Objetivo} / 100)}$$
- **Selector de Margen (%) y Familia:** Permite recalcular instantáneamente cartas enteras o familias específicas (ej. fijar 75% en Vinos o 70% en Carnes).
- **Redondeo Comercial Amigable:** Redondea automáticamente al múltiplo de 0,10 € superior para agilizar los cobros en efectivo en sala.
- **Confirmación Segura:** Modal de confirmación con recuento de productos afectados antes de aplicar cambios a la base de datos.

### Pestaña 4: Simulador What-If (Escenarios de Rentabilidad)
- **Sliders Táctiles Dinámicos:** Permiten experimentar variaciones hipotéticas de PVP (+/- 0,10 €) o coste (+/- 0,05 €).
- **KPIs Predictivos en Tiempo Real:** Variación del margen unitario, nuevo Food Cost resultante y proyección de beneficio total en base a las ventas históricas.
- **Botón de Guardado Selectivo:** Guarda el precio únicamente cuando el encargado aprueba la simulación.

---

## 4. Consultor e Informes Estratégicos con IA (Gemini 3.8)
Al pulsar el botón superior **"Generar Informe Estratégico IA"**, GastroPOS Suite empaqueta los datos agregados de coste, PVP, unidades vendidas y clasificación BCG y realiza una llamada segura a **Google Gemini 3.8**:
- Identifica desequilibrios críticos en la carta.
- Sugiere platos candidatos a subida de precio inmediata.
- Propone técnicas de neuromarketing (orden de lectura, anclaje de precios y platos señuelo).
- Entrega un informe formal estructurado en Markdown con recomendaciones accionables.
