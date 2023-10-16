#vol04E_PreprogramatDecodificador.py
"""
El següent codi agafa el document comandes.txt,
i introdueix en un array de 2 dimensions la comanda
a fer i el temps/angle/valor a realitzar en aquesta 
comanda. Quan s'executa el programa, s'impremeix
aquest array, que has de copiar i introduir al 
document vol04_Preprogramat.ts a la variable de
tipus array 'arrayComandes'
"""

arxiu = open("vol04E_PreprogramatComandes.txt", "r") 
#Obrim vol04E_PreprogramatComandes.txt en read(r)
l = [] #Creem una llista buida l, per introduir el que volem al array

#Fem un for que iterí per totes les línies de comandes.txt
for x in arxiu:
    """
    La funció append, afegeix nous valors al final de la llista
    La funció split separa un string en 2 parts, creant un array
    el qual en aquest cas, es separa quan hi ha un espai.

    Per tant, el següent command, ens afegeix un element al final
    del array l, aquest element, es un array a la vegada, format
    per la linia de comand dividida on hi hagi un espai. Es crearà
    un array de 2 dimensions.
    """
    l.append((x[:-1]).split(" "))


for x in range(len(l)):
    if l[x][0] == "on" or l[x][0] == "off":
        pass #Si el valor a [x][0] és on o off, no fa res.
    else:
        #Com que la major part dels valors son de temps, els pasem a ms
        temps = int(l[x][1])*1000 #També pasem a integer els valors string
        l[x][1] = temps

print("List for the flight:\n", l) #Imprimim a pantalla l'array produït