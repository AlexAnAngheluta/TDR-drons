from datetime import datetime

class Stats(object):
    # Constructor --> quan es crida a l'objecte i es porta informació sense indicar-la
    def __init__(self, command, id):
        """
        Constructor.
        :param command: The command sent.
        :param id: The identifier.
        """
        self.command = command # entrar en mode sdk
        self.response = None # no s'espera resposta por parte del drone 
        self.id = id # li posa la id del drone

        self.start_time = datetime.now() # es captura l'hora en què es dispara el contructor
        self.end_time = None # garantim que no es fa l'acció amb el None
        self.duration = None

        # aquesta es una funció per a capturar una resposta amb valors
    def add_response(self, response):
        """
        Adds the response.
        :param response: Response.
        :return: None.
        """
        self.response = response # codi, valors
        self.end_time = datetime.now() # captures el tempsque que acaba
        self.duration = self.get_duration() # durada del vol, o de la missió
        
        # una funció que fa una resta per a retornar la quantitat de segons del vol o durada de la missió
    def get_duration(self):
        """
        Gets the duration.
        :return: Duration.
        """
        diff = self.end_time - self.start_time
        return diff.total_seconds()
    
        # aquesta funció imprimeix a nivell de consola les diferents dates del drone, per exemple: comandament, resposta i temps
    def print_stats(self):
        """
        Prints the statistics.
        :return: None.
        """
        print(f'\nid {self.id}')
        print(f'command: {self.command}')
        print(f'response: {self.response}')
        print(f'start_time: {self.start_time}')
        print(f'end_time: {self.end_time}')
        print(f'duration: {self.duration}')
        
        # funció per a obtenir resposta de tipus OK error -> la funció lliura un True o un False
    def got_response(self):
        """
        Returns a boolean if a response was received.
        :return: Boolean.
        """
        
        if self.response is None:
            return False # indica que hi ha un error
        else:
            return True # si retorna ok és perquè executo el comandament
        
        # aquesta funció em lliura les dades del dron però per a poder utilitzar-les
    def return_stats(self):
        """
        Returns the statistics.
        :return: Statistics.
        """
        str = ''
        str +=  f'\nid: {self.id}\n'
        str += f'command: {self.command}\n'
        str += f'response: {self.response}\n'
        str += f'start_time: {self.start_time}\n'
        str += f'end_time: {self.end_time}\n'
        str += f'duration: {self.duration}\n'
        return str

    