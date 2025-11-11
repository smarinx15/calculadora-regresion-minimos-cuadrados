# 📊 Calculadora de Regresión por Mínimos Cuadrados

## Descripción
Herramienta que calcula la regresión polinómica de un conjunto de puntos 2D utilizando el método de mínimos cuadrados. Permite ajustar polinomios de cualquier grado y visualizar gráficamente los resultados.

## 🎯 Características
- ✅ Entrada interactiva de puntos (x,y)
- ✅ Ajuste polinómico de grado n (lineal, cuadrático, cúbico, etc.)
- ✅ Cálculo automático de coeficientes
- ✅ Visualización gráfica de datos originales y curva de ajuste
- ✅ Cálculo del error cuadrático medio
- ✅ Validación de datos suficientes para el grado seleccionado

## 🛠️ Tecnologías Utilizadas
- **Python 3.x**
- **NumPy**: Para cálculos matriciales
- **Matplotlib**: Para visualización de datos

## 📦 Instalación

### Requisitos previos
Asegúrate de tener Python 3.x instalado en tu sistema.

### Instalar dependencias
```bash
pip install numpy matplotlib
```

## 🚀 Uso

### Ejecutar el programa
```bash
python app.py
```

### Flujo de trabajo
1. **Selecciona opción 1**: Ingresar datos
2. **Ingresa coordenadas**: Escribe pares de valores (x,y)
3. **Finaliza entrada**: Escribe "fin" cuando termines
4. **Especifica el grado**: Elige el grado del polinomio (1=lineal, 2=cuadrático, etc.)
5. **Selecciona opción 2**: Calcular regresión y ver resultados

### Ejemplo de uso
```
Digite el valor x (o 'fin' para salir): 1
Digite el valor y: 2
Digite el valor x (o 'fin' para salir): 2
Digite el valor y: 4
Digite el valor x (o 'fin' para salir): 3
Digite el valor y: 6
Digite el valor x (o 'fin' para salir): fin
¿Qué grado de polinomio deseas ajustar?: 1

Resultado: y = 0.0 + 2.0 * x^1
Error Cuadrático Medio: 0.0
```

## 📐 Fundamento Matemático

### Método de Mínimos Cuadrados
El programa resuelve el sistema sobredeterminado mediante la ecuación normal:
```
A^T · A · β = A^T · y
```

Donde:
- **A**: Matriz de diseño con columnas [1, x, x², x³, ..., x^n]
- **y**: Vector de valores observados
- **β**: Vector de coeficientes [b₀, b₁, b₂, ..., b_n]

### Error Cuadrático Medio
```
ECM = (1/n) Σ(y_i - ŷ_i)²
```

Donde:
- **y_i**: Valor real
- **ŷ_i**: Valor predicho por el modelo
- **n**: Número de puntos

## 📊 Ejemplos

### Ajuste Lineal
**Entrada:**
```
Puntos: (1,2), (2,4), (3,6), (4,8)
Grado: 1
```
**Salida:**
```
y = 0.0 + 2.0 * x^1
Error: ≈ 0.0
```

### Ajuste Parabólico
**Entrada:**
```
Puntos: (0,0), (1,1), (2,4), (3,9), (4,16)
Grado: 2
```
**Salida:**
```
y = 0.0 + 0.0 * x^1 + 1.0 * x^2
Error: ≈ 0.0
```

## 🎓 Aplicaciones
- **Estadística**: Análisis de tendencias
- **Ciencia de Datos**: Predicción de valores
- **Finanzas**: Modelado de series temporales
- **Ingeniería**: Ajuste de datos experimentales

## 📁 Estructura del Proyecto
```
calculadora-regresion/
│
├── app.py          # Código principal
└── README.md       # Este archivo
```

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Si encuentras algún bug o tienes sugerencias:
1. Abre un issue
2. Crea un pull request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor
Desarrollado como proyecto educativo para el aprendizaje del método de mínimos cuadrados.
```

### Paso 3: Crea el archivo .gitignore

Crea otro archivo llamado `.gitignore` (nota el punto al inicio):
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
ENV/
env/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*.swn

# Sistema Operativo
.DS_Store
Thumbs.db

# Otros
*.log
.pytest_cache/
```

### Paso 4: Crea el archivo requirements.txt

Crea un archivo `requirements.txt`:
```
numpy>=1.21.0
matplotlib>=3.4.0