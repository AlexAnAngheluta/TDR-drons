from tello import Tello
import sys
from datetime import datetime
import time
import argparse

# aquesta funció mostra (en format bonic) informació de qui o quina companyia va fer el programa i quines opcions de configuració hi ha
def parse_args(args):
    """
    Parses arguments.
    :param args: Arguments.
    :return: Parsed arguments.
    """
    parser = argparse.ArgumentParser('Tello Flight Commander', 
        epilog='One-Off Coder https://www.oneoffcoder.com')

    parser.add_argument('-f', '--file', help='command file', required=True)
    return parser.parse_args(args)

# funció que dona l'ordre d'engegar-ho tot
def start(file_name):
    """
    Starts sending commands to Tello.
    :param file_name: File name where commands are located.
    :return: None.
    """
    # capturar el temps amb el qual comença a volar
    start_time = str(datetime.now())
    
    # obre en mode lectura el txt per a treure els comendaments 
    with open(file_name, 'r') as f:
        commands = f.readlines()
    # inicialitzem el dron
    tello = Tello() ## --> tello.send_command()

    # fem un for per a recórrer els comandaments, si al finalitzar cada línia no troba un espai
    # o un salt de línia obliga a esborrar el que hi hagi després del comandament
    for command in commands:
        if command != '' and command != '\n':
            command = command.rstrip()
            
            # si troba un delay l'executa, i fa un pass i acaba el cicle for
            if command.find('delay') != -1:
                sec = float(command.partition('delay')[2])
                print(f'delay {sec}')
                time.sleep(sec)
                pass
            
            # si no troba un delay, li envia el comandament al dron
            else:
                tello.send_command(command)

    # por ultimo al finalizar el recorrido de los comandos.txt guarda la informacion de los stats
    # per últim, al acabar el recorregut de l'arxiu command.txt, desa la info dels stats
    with open(f'log/log.txt', 'w') as out: # desem telemetria al alxiu log.txt , primer l'obrim
        log = tello.get_log()
        print(log) # comprovem què fa o quin tipus de data hi ha a log 

        for stat in log: # crear un objecte per a registre (comandament) --> i el tipus d'objecte és stat s
            stat.print_stats() # accedeixo a stat, i cerco la funció imprimir stats 
            s = stat.return_stats() # accedeixo a stat i cerco la funció retornar i deso la info(str)  a la variable s
            out.write(s) ## escribimos esto en el documento nuevo


if __name__ == '__main__':
#     args = parse_args(sys.argv[1:])
#     file_name = args.file
    file_name = "command.txt"
    start(file_name)
