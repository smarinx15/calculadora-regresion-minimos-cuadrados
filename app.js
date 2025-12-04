// =========================================
// REGRECALC - app.js
// Lógica de interfaz y coordinación
// =========================================

let appState = {
    puntos: [],
    grado: 2,
    coeficientes: null,
    error: null,
    ecuacion: '',
    matricesCalculadas: {
        X: null,
        Xt: null,
        XtX: null,
        XtX_inv: null,
        Xty: null,
        beta: null
    }
};

function init() {
    console.log('🚀 RegreCalc iniciando...');
    inicializarGrafica();
    configurarEventListeners();
    actualizarUI();
    console.log('✅ RegreCalc listo');
}

function configurarEventListeners() {
    console.log('📡 Configurando event listeners...');
    
    const btnCalcular = document.getElementById('btn-calcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcularRegresion);
        console.log('✅ Listener en btn-calcular');
    }

    const btnLimpiar = document.getElementById('btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarTodo);
        console.log('✅ Listener en btn-limpiar');
    }

    const inputGrado = document.getElementById('input-grado');
    if (inputGrado) {
        inputGrado.addEventListener('input', function() {
            appState.grado = parseInt(this.value);
            console.log(`Grado cambiado a: ${appState.grado}`);
        });
        console.log('✅ Listener en input-grado');
    }

    const btnPredecir = document.getElementById('btn-predecir');
    if (btnPredecir) {
        btnPredecir.addEventListener('click', predecir);
        console.log('✅ Listener en btn-predecir');
    }

    // Botón para agregar punto manualmente
    const btnAgregarPunto = document.getElementById('btn-agregar-punto');
    if (btnAgregarPunto) {
        btnAgregarPunto.addEventListener('click', agregarPuntoManual);
        console.log('✅ Listener en btn-agregar-punto');
    } else {
        console.error('❌ No se encontró btn-agregar-punto');
    }

    // Clicks en la gráfica
    const grafica = document.getElementById('grafica');
    if (grafica) {
        grafica.on('plotly_click', function(data) {
            console.log('📊 Click en gráfica detectado:', data);
            const x = data.points[0].x;
            const y = data.points[0].y;
            agregarPunto(x, y);
        });
        console.log('✅ Listener en gráfica');
    }
}

function agregarPuntoManual() {
    console.log('🔵 agregarPuntoManual() ejecutándose...');
    
    const inputX = document.getElementById('input-x-manual');
    const inputY = document.getElementById('input-y-manual');
    
    if (!inputX || !inputY) {
        console.error('❌ No se encontraron los inputs');
        alert('❌ Error: No se encontraron los campos de entrada');
        return;
    }
    
    const x = parseFloat(inputX.value);
    const y = parseFloat(inputY.value);
    
    console.log('Valores capturados - X:', x, 'Y:', y);
    
    if (isNaN(x) || isNaN(y)) {
        console.log('❌ Valores inválidos');
        alert('❌ Por favor ingresa valores numéricos válidos para X e Y');
        return;
    }
    
    agregarPunto(x, y);
    
    inputX.value = '';
    inputY.value = '';
    inputX.focus();
}

function inicializarGrafica() {
    console.log('📊 Inicializando gráfica...');
    
    const data = [{
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: 'Puntos',
        marker: {
            size: 10,
            color: '#00ff41'
        }
    }];

    const layout = {
        title: 'Haz clic para agregar puntos',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        hovermode: 'closest',
        paper_bgcolor: '#1a1a1a',
        plot_bgcolor: '#1a1a1a',
        font: { color: '#ffffff' }
    };

    const config = {
        responsive: true,
        displayModeBar: true
    };

    Plotly.newPlot('grafica', data, layout, config);
    console.log('✅ Gráfica inicializada');
}

function agregarPunto(x, y) {
    console.log(`➕ Intentando agregar punto: (${x}, ${y})`);
    
    if (isNaN(x) || isNaN(y)) {
        alert('❌ Coordenadas inválidas');
        return;
    }

    appState.puntos.push({x: x, y: y});
    console.log(`✅ Punto agregado. Total: ${appState.puntos.length}`);
    console.log('Estado actual de puntos:', appState.puntos);

    actualizarGrafica();
    actualizarListaPuntos();
}

function actualizarGrafica() {
    console.log('🔄 Actualizando gráfica...');
    
    const puntosX = appState.puntos.map(p => p.x);
    const puntosY = appState.puntos.map(p => p.y);

    console.log('Puntos X:', puntosX);
    console.log('Puntos Y:', puntosY);

    const data = [{
        x: puntosX,
        y: puntosY,
        mode: 'markers',
        type: 'scatter',
        name: 'Puntos',
        marker: {
            size: 10,
            color: '#00ff41'
        }
    }];

    if (appState.coeficientes !== null && appState.puntos.length > 0) {
        const curva = generarPuntosCurva(appState.puntos, appState.coeficientes, 100);
        
        data.push({
            x: curva.x,
            y: curva.y,
            mode: 'lines',
            type: 'scatter',
            name: `Polinomio grado ${appState.grado}`,
            line: {
                color: '#ff00ff',
                width: 3
            }
        });
    }

    const layout = {
        title: appState.puntos.length === 0 
            ? 'Haz clic para agregar puntos' 
            : `${appState.puntos.length} puntos`,
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        hovermode: 'closest',
        paper_bgcolor: '#1a1a1a',
        plot_bgcolor: '#1a1a1a',
        font: { color: '#ffffff' }
    };
    
    Plotly.react('grafica', data, layout);
    console.log('✅ Gráfica actualizada');
}

function actualizarListaPuntos() {
    console.log('🔄 Actualizando lista de puntos...');
    
    const lista = document.getElementById('lista-puntos');

    if (appState.puntos.length === 0) {
        lista.innerHTML = '<p class="empty-message">No hay puntos aún. Agrégalos arriba o haz clic en la gráfica.</p>';
        return;
    }

    let html = '<ul style="list-style: none; padding: 0;">';

    appState.puntos.forEach((punto, index) => {
        html += `
            <li style="display: flex; justify-content: space-between; margin: 5px 0; padding: 8px; background: #2a2a2a; border-radius: 4px;">
                <span>Punto ${index + 1}: (${punto.x.toFixed(2)}, ${punto.y.toFixed(2)})</span>
                <button onclick="eliminarPunto(${index})" style="background: #ff4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                    🗑️ Eliminar
                </button>
            </li>
        `;
    });
    
    html += '</ul>';
    lista.innerHTML = html;
}

function eliminarPunto(index) {
    appState.puntos.splice(index, 1);
    console.log(`🗑️ Punto ${index + 1} eliminado`);
    
    appState.coeficientes = null;
    appState.error = null;
    appState.ecuacion = '';
    
    actualizarGrafica();
    actualizarListaPuntos();
    actualizarResultados();
}

function calcularRegresion() {
    console.log('📊 Calculando regresión...');
    
    const minPuntos = appState.grado + 1;
    if (appState.puntos.length < minPuntos) {
        alert(`❌ Necesitas al menos ${minPuntos} puntos para grado ${appState.grado}`);
        return;
    }
    
    if (appState.grado < 1 || appState.grado > 10) {
        alert('❌ El grado debe estar entre 1 y 10');
        return;
    }
    
    try {
        const resultado = calcularCoeficientes(appState.puntos, appState.grado);
        
        appState.coeficientes = resultado.coeficientes;
        appState.matricesCalculadas = resultado.matrices;
        appState.error = calcularError(appState.puntos, appState.coeficientes);
        appState.ecuacion = formatearEcuacion(appState.coeficientes);
        
        console.log('✅ Regresión calculada exitosamente');
        console.log('Coeficientes:', appState.coeficientes);
        console.log('Error (MSE):', appState.error);
        
        actualizarGrafica();
        actualizarResultados();
        actualizarDetallesMatematicos();
        
    } catch (error) {
        console.error('❌ Error al calcular:', error);
        alert(`❌ Error: ${error.message}\n\nIntenta con puntos más variados.`);
    }
}

// Agregar esta función mejorada para mostrar resultados
function actualizarResultados() {
    const divResultados = document.getElementById('resultados');
    
    if (appState.coeficientes === null) {
        divResultados.innerHTML = '<p class="empty-message">Haz clic en "Calcular Regresión"</p>';
        return;
    }
    
    let html = `
        <div class="resultado-box">
            <h4>📐 Ecuación del Polinomio</h4>
            <p style="font-size: 1.1rem; color: #00ff41;">${appState.ecuacion}</p>
        </div>
        
        <div class="resultado-box">
            <h4>📊 Coeficientes Calculados</h4>
            <ul>
    `;
    
    appState.coeficientes.forEach((coef, i) => {
        const termino = i === 0 ? '(término independiente)' : 
                       i === 1 ? '(coef. lineal)' :
                       `(coef. de x^${i})`;
        html += `<li>β${i} = ${coef.toFixed(6)} ${termino}</li>`;
    });
    
    html += `
            </ul>
        </div>
        
        <div class="resultado-box">
            <h4>📉 Error Cuadrático Medio (MSE)</h4>
            <p style="font-size: 1.3rem;">${appState.error.toFixed(6)}</p>
            <small style="color: #999;">
                ${appState.error < 0.1 ? '✅ Excelente ajuste' : 
                  appState.error < 1 ? '✓ Buen ajuste' : 
                  '⚠️ Considera ajustar el grado'}
            </small>
        </div>
    `;
    
    divResultados.innerHTML = html;
}

// Actualizar función de detalles matemáticos
function actualizarDetallesMatematicos() {
    const divDetalles = document.getElementById('detalles-matrices');
    
    if (appState.matricesCalculadas.X === null) {
        divDetalles.innerHTML = '<p class="empty-message">Calcula una regresión primero</p>';
        return;
    }
    
    const m = appState.matricesCalculadas;
    
    let html = `
        <h4>1️⃣ Matriz de Diseño X (${m.X.length}×${m.X[0].length})</h4>
        <pre>${formatearMatriz(m.X)}</pre>
        
        <h4>2️⃣ Transpuesta Xᵀ (${m.Xt.length}×${m.Xt[0].length})</h4>
        <pre>${formatearMatriz(m.Xt)}</pre>
        
        <h4>3️⃣ Producto XᵀX (${m.XtX.length}×${m.XtX[0].length})</h4>
        <pre>${formatearMatriz(m.XtX)}</pre>
        
        <h4>4️⃣ Inversa (XᵀX)⁻¹ (${m.XtX_inv.length}×${m.XtX_inv[0].length})</h4>
        <pre>${formatearMatriz(m.XtX_inv)}</pre>
        
        <h4>5️⃣ Producto Xᵀy (${m.Xty.length}×1)</h4>
        <pre>${formatearMatriz(m.Xty)}</pre>
        
        <h4>6️⃣ Coeficientes β = (XᵀX)⁻¹Xᵀy</h4>
        <pre>${formatearMatriz(m.beta)}</pre>
    `;
    
    divDetalles.innerHTML = html;
}

function formatearMatriz(matriz) {
    if (!matriz || matriz.length === 0) {
        return '[ vacía ]';
    }
    
    let texto = '';
    const es2D = Array.isArray(matriz[0]);
    
    if (es2D) {
        matriz.forEach(fila => {
            texto += '[ ';
            fila.forEach(valor => {
                texto += valor.toFixed(4).padStart(10) + ' ';
            });
            texto += ']\n';
        });
    } else {
        texto = '[ ';
        matriz.forEach(valor => {
            texto += valor.toFixed(4) + ' ';
        });
        texto += ']';
    }
    
    return texto;
}

function predecir() {
    if (appState.coeficientes === null) {
        alert('❌ Primero calcula una regresión');
        return;
    }
    
    const inputX = document.getElementById('input-prediccion');
    const x = parseFloat(inputX.value);
    
    if (isNaN(x)) {
        alert('❌ Ingresa un número válido para X');
        return;
    }
    
    const y = evaluarPolinomio(x, appState.coeficientes);
    
    const divResultado = document.getElementById('resultado-prediccion');
    divResultado.innerHTML = `
        <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p style="font-size: 18px; color: #00ff41; margin: 0;">
                Para <strong>X = ${x.toFixed(2)}</strong>
            </p>
            <p style="font-size: 24px; color: #fff; margin: 10px 0 0 0;">
                <strong>Y ≈ ${y.toFixed(6)}</strong>
            </p>
        </div>
    `;
    
    console.log(`🔮 Predicción: X=${x} → Y=${y}`);
}

function limpiarTodo() {
    const confirmar = confirm('⚠️ ¿Estás seguro? Se perderán todos los datos.');
    
    if (!confirmar) {
        return;
    }
    
    appState.puntos = [];
    appState.coeficientes = null;
    appState.error = null;
    appState.ecuacion = '';
    appState.matricesCalculadas = {
        X: null, Xt: null, XtX: null,
        XtX_inv: null, Xty: null, beta: null
    };
    
    document.getElementById('input-grado').value = 2;
    document.getElementById('input-prediccion').value = '';
    document.getElementById('resultado-prediccion').innerHTML = '';
    
    inicializarGrafica();
    actualizarListaPuntos();
    actualizarResultados();
    actualizarDetallesMatematicos();
    
    console.log('🧹 Todo limpiado');
}

function actualizarUI() {
    actualizarListaPuntos();
    actualizarResultados();
    actualizarDetallesMatematicos();
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggle-detalles');
    const contenido = document.getElementById('detalles-contenido');
    
    if (toggleBtn && contenido) {
        toggleBtn.addEventListener('click', function() {
            contenido.classList.toggle('oculto');
            
            if (contenido.classList.contains('oculto')) {
                toggleBtn.textContent = '🧮 Detalles Matemáticos ▼';
            } else {
                toggleBtn.textContent = '🧮 Detalles Matemáticos ▲';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', init);