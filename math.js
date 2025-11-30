function construirMatrizX (puntos, grado) {
    const n = puntos.length;
    const X = [];

    for (let i = 0; i < n; i++ ) {
        const filas = [];
        const x = puntos[i].x; 

        for (let j = 0; j <= grado; j++) {
        filas.push(Math.pow(X, j));
        }

        X.push(filas);
    }

    return X;
}

function construirVectorY (puntos) {
    const vectorY = [];

    for (let i = 0; i < puntos.length; i++) {
        vectorY.push([puntos[i].y]);
    }

    return vectorY;
}

function calcularCoeficiente (puntos, grado) {
    if (puntos.length < grado + 1) {
        throw new Error('Necesitas al menos ${grado + 1} puntos para un polinomio de grado ${grado}');
    }

    const X = construirMatrizX(puntos, grado);
    const y = construirVectorY(puntos);

    const X_math = math.matrix(X);
    const y_math = math.matrix(y);

    try {

        const Xt = math.transpose(X_math);
        const XtX = math.multiply(Xt, X_math);
        const XtX_inv = math.inv(XtX);
        const Xty = math.multiply(Xt, y_math);
        const beta = math.multiply(XtX_inv, Xty);

        const XtX_array = XtX.toArray();
        const XtX_inv_array = XtX_inv.toArray();
        const Xty_array = Xty.toArray();
        const beta_array = beta.toArray();

        const coeficientes = beta_array.map(fila => fila[0]);

        return {
            coeficientes: coeficientes,
            matrices: {
                X: X,
                Xt: Xt.toArray(),              
                XtX: XtX_array,                
                XtX_inv: XtX_inv_array,        
                Xty: Xty_array,                
                beta: beta_array     
            }
        };

        } catch (error) {
            throw new Error('No se puede calcular la regresión. Intenta con puntos más variados. Error: ' + error.message);
        };
}

function evaluarPolinomio (x, coeficientes) {
    let y = 0;

    for (let i = 0; i < coeficientes.length; i++) {
        y += coeficientes[i] * Math.pow(x, i);
    }

    return y;
}

function calcularError (puntos, coeficientes) {
    let sumaCuadrados = 0;

    for (let i = 0; i < puntos.length; i++) {
        const x = puntos[i].x;
        const yReal = puntos[i].y;

        const yPredicho = evaluarPolinomio(x, coeficientes);
        const error = yReal - yPredicho;

        sumaCuadrados += error * error;
    }

    const mse = sumaCuadrados / puntos.length;
    return mse;
}

function generarPuntosCurva (puntos, coeficientes, numPuntos = 100) {
    const valoresX = puntos.map(p => p.x);
    const minX = Math.min(...valoresX);
    const maxX = Math.max(...valoresX);
    const rango = maxX - minX;
    const margen = rango * 0.1;
    const inicio = minX - margen;
    const fin = maxX + margen;
    const paso = (fin - inicio) / (numPuntos - 1);
    const curvaX = [];
    const curvaY = [];

    for (let i = 0; i < numPuntos; i++) {
        const x = inicio + i * paso;
        const y = evaluarPolinomio(x, coeficientes);

        curvaX.push(x);
        curvaY.push(y);
    }

    return {
        x: curvaX,
        y: curvaY
    };
}

function formatearEcuacion (coeficientes) {
    let ecuacion = 'y = ';

    for (let i = 0; i < coeficientes.length; i++) {
        const coef = coeficientes[i];
        const coefRedondeado = coef.toFidex(4);

        if (i === 0) {
        ecuacion += coefRedondeado;
        }

        else if (i === 1) {
            if (coef >= 0) {
                ecuacion += ' + ' + coefRedondeado + 'X';
            } else {
                ecuacion += ' - ' + Math.abs(coef).toFixed(4) + 'X';
            }
        }

        else {
            const exponente = i;
            if (coef >= 0) {
                ecuacion += ' + ' + coefRedondeado + 'x^' + exponente;
            } else {
                ecuacion += ' - ' + Math.abs(coef).toFixed(4) + 'x^' + exponente;
            }
        }
    }

    return ecuacion;
}