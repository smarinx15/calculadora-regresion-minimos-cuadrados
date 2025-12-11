import numpy as np
import matplotlib.pyplot as plt


def ingresar_datos(x_data,y_data,grados):
    x_data = []
    y_data = []
    print("Ingresa los puntos de coordenada (x,y)")
    print("\nPara ajustar el grado de un polinomio parabolico deben haber 3 puntos, es decir, ingresar 3 valores x y 3 para y\ny para un polinomio de grado parabolico requiere 2 puntos\n")
    while True:
        try:
            grados = int(input("¿Qué grado de polinomio deseas ajustar? (1=lineal, 2=parabólico): "))
            if grados == 1:
                print("Ingresa dos puntos de coordenadas (x,y)")
                for i in range(1,3):
                    print("puntos ",i)
                    x = int(input("Digite el valor x : "))
                    y = int(input("Digite el valor y: "))
                    x_data.append(x)
                    y_data.append(y)
                break
            elif grados == 2:
                print("Ingresa 3 puntos de coordenadas (x,y)")
                for i in range(1,4):
                    print("puntos ",i)
                    x = int(input("Digite el valor x : "))
                    y = int(input("Digite el valor y: "))
                    x_data.append(x)
                    y_data.append(y)
                break
            else:
                print("Grado no valido")
                continue
        except ValueError:
            print("Digite una opcion valida")
            continue
    return np.array(x_data), np.array(y_data), grados

def evaluar_polinomios(x, coeficientes):
    y = 0
    
    for i in range (len(coeficientes)):
        y += coeficientes[i,0] * (x ** i)

    return y

def calcular_error(x_data, y_data, coeficientes):
    suma_errores = 0

    for i in range (len(x_data)):
        x_actual = x_data[i]
        y_real = y_data[i]
        y_predicho = evaluar_polinomios(x_actual, coeficientes)
        error_individual = (y_real - y_predicho) ** 2
        suma_errores += error_individual
    error_medio = suma_errores / len(x_data)

    return error_medio

def graficar_resultados(x_data, y_data, coeficientes, grados):
    plt.plot(x_data, y_data, 'o', color='blue',
            markersize=8, label='Datos originales')
    
    x_min = np.min(x_data)
    x_max = np.max(x_data)
    x_curva = np.linspace(x_min, x_max, 200)

    y_curva = evaluar_polinomios(x_curva, coeficientes)

    plt.plot(x_curva, y_curva, '-', color='red',
            linewidth=2, label=f'Ajuste polinomico (grados: {grados})' )
    
    plt.xlabel('x', fontsize=12)
    plt.ylabel('y', fontsize=12)
    plt.title(f'Regresion polinomica de Grado {grados}', fontsize=14)
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.show()



def calcular_regresion(x_data, y_data, grados):
    n = len(x_data)
    columnas = [np.ones(n)]

    print("\n=== Datos ingresados ===")
    print("x_data =", x_data)
    print("y_data =", y_data)

    for i in range (1,grados + 1):
        print(f"\nCreando columna para x^{i}:")
        print(x_data ** i)
        columnas.append(x_data ** i)

    x = np.column_stack(columnas)
    print("\n=== Matriz X (Diseño) ===")
    print(x)
    y = y_data.reshape(-1,1)
    print("\n=== Vector y ===")
    print(y)
    x_t = x.T
    print("\n=== Matriz X transpuesta ===")
    print(x_t)
    xt_t = x_t @ x
    print("\n=== Matriz Xᵀ * X ===")
    print(xt_t)
    inversa_x = np.linalg.inv(xt_t)
    print("\n=== Inversa de XᵀX ===")
    print(inversa_x) 
    yt_t = x_t @ y
    print("\n=== Matriz Xᵀ * y ===")
    print(yt_t)
    coeficientes = inversa_x @ yt_t
    print("\n=== Coeficientes resultantes ===")
    print(coeficientes)

    print('\n===== Resultado de la regresion ===== ')
    print(f"Grados del polinomio: {grados} ")
    print("\nCoeficientes:")

    for i in range (len(columnas)):
        print(f" b{i}: {coeficientes[i, 0]} ")

    ecuacion = f"y = {coeficientes[0, 0]} "

    for i in range (1, len(coeficientes)):
        if coeficientes[i, 0] < 0:
            ecuacion += f" - {abs(coeficientes[i, 0])} * x^{i}"
        else:
            ecuacion += f" + {abs(coeficientes[i, 0])} * x^{i}  "

    print(f"\nEcuacion: {ecuacion}")

    error = calcular_error(x_data, y_data, coeficientes)
    print(f"\nError cuadratico medio: {error}")

    print("\nGenerando grafica....")
    graficar_resultados(x_data, y_data, coeficientes, grados)


    return 


def menu ():
    x_data = []
    y_data = []
    grados = None

    while True:
        print("\n====== Calculadora de regresion por minimos cuadrados ======")
        print("1. Ingresar datos")
        print("2. Calcular regresion")
        print("3. Salir")
        opc = input("Digite una opcion: ")

        if opc == "1":
            x_data, y_data, grados = ingresar_datos(x_data, y_data,grados)
        elif opc == "2":    
            if len(x_data) == 0:
                print("Primero debe ingresar datos")
                continue
            else:
                calcular_regresion(x_data, y_data,grados)
        elif opc == "3":
            break
        else:
            print("Opcion invalida")

menu()