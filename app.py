import numpy as np
import matplotlib.pyplot as plt


def ingresar_datos(x_data,y_data,grados):
    x_data = []
    y_data = []
    print("Ingresa los puntos de cordenada (x,y)")
    while True:
        try:
            x = input("Digite el valor x (o 'fin' para salir): ")
            if x == "fin":
                grados = int(input("¿Qué grado de polinomio deseas ajustar? (1=lineal, 2=parabólico, etc.): "))
                break
            else:
                x = int(x)
                x_data.append(x)
                y = input("Digite el valor y: ")
                y = int(y)
                y_data.append(y)
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

    for i in range (1,grados + 1):
        columnas.append(x_data ** i)

    x = np.column_stack(columnas)
    y = y_data.reshape(-1,1)
    x_t = x.T
    xt_t = x_t @ x
    inversa_x = np.linalg.inv(xt_t) 
    yt_t = x_t @ y
    coeficientes = inversa_x @ yt_t

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
            elif len(x_data) <= grados:
                print(f"Error: Necesita al menos {grados + 1} puntos para un polinomio de grado {grados}")
                print(f"Actualmente tiene {len(x_data)} puntos")
                continue
            else:
                calcular_regresion(x_data, y_data,grados)
        elif opc == "3":
            break
        else:
            print("Opcion invalida")

menu()