//vol04C_Preprogramat.ts
/*
El següent programa és el codi que s'ha d'instalar al controller de l'air:bit.
Abans d'utilitzar aquest codi, has de mirar l'archiu comandes.txt,
modificar-ho si cal i procesar-ho al decodificador.py. Amb l'array resultant, 
l'has de copiar i introduir a la varibale de llista llistaComandes.
*/

//Declaració variables amb el let:
let mode = 0 //Mode de vol, indica la insició del angle de vol
let nmode = 0 //Indica l'insició del angle de vol al sentit contrari

//Variables de vol:
let pitch = 0
let arm = 0
let roll = 0
let throttle = 0

//Variables que extreuen la comanda i el temps/angle de l'Array - llistaComandes
let comanda: any;
let temps: string | number;

//Variable que indica el grup de radio
let radioGroup = 7
radio.setGroup(radioGroup) //Posem el grup de radio com a radioGroup
basic.showNumber(radioGroup) //Mostrem el valor

//Array de dues dimensions creada amb el decodificador.py
let arrayComandes = [
    ["mode", 10000],
    ["on"],
    ["up", 4000],
    ["hover", 3000],
    ["fw", 5000],
    ["bw", 5000],
    ["lw", 5000],
    ["rw", 5000],
    ["down", 4000],
    ["off"]
]

//Quan sacsegem el controller, envia:
function on_gesture_shake () {
    /* 
    radio.sendValue(name: string, value: number) 
    envia un string i un valor númeric asociat a aquest a 
    les micro:bits amb la mateixa sintonia de radio. En aquest 
    cas, enviem T(Throttle) i el valor 0, per tant reduirem el 
    seu valor a 0. També enviem A(Arm) i el valor 0, apagant 
    així els motors del dron.
    */
    radio.sendValue("T", 0) 
    radio.sendValue("A", 0)
}

//Quan posem el controller cara avall, envia:
function on_gesture_screen_down () {
    radio.sendValue("T", 0)//Enviem throttle a 0
    radio.sendValue("A", 0)//Enviem apagar motors.
}

//Declarem funció forward:
function forward(temps: any) {
    pitch = mode //L'angle de pitch = mode
    radio.sendValue("P", pitch) //Enviem P(Pitch) amb valor mode
    /* 
    basic.pause(ms: number) 
    pausa el programa durant x milisegons, en el següent cas 
    el pausem  el temps  indicat  a la variable  per  tal de 
    deixar aquest angle de pitch el temps desitjat.
    */
    basic.pause(temps)
    radio.sendValue("P", 0) //Tornem a posar Pitch a 0
}

//Declarem funció backward:
function backward(temps: any) {
    /*
    Fem que el valor de l'angle de Pitch, moguin
    el dron cap enrere durant x ms. Enviem els valors
    indicats. Al finalitzar, retornem pitch al seu estat
    inicial.
    */
    pitch = nmode 
    radio.sendValue("P", pitch)
    basic.pause(temps)
    radio.sendValue("P", 0)
}

//Declarem funció leftward:
function leftward(temps: any) {
    /*
    Fem que el valor de l'angle de Roll, moguin
    el dron cap a l'esquerra durant x ms. Enviem els valors
    indicats. Al finalitzar, retornem Roll al seu estat
    inicial.
    */
    roll = nmode
    radio.sendValue("R", roll)
    basic.pause(temps)
    radio.sendValue("R", 0)
}

//Declarem funció rightward:
function rightward(temps: any) {
    /*
    Enviem l'angle indicat, per tal que el dron es
    moogui cap a la dreta durant x ms.
    */
    roll = mode
    radio.sendValue("R", roll)
    basic.pause(temps)
    radio.sendValue("R", 0)
}

//Declarem funció upward:
function upward(temps: any) {
    /*
    for (variable; condició; increment de variable)
    El for fa una iteració d'una variable fins que 
    la condició és compleixi, a cada iteració, la 
    variable s'ha d'incrementar.

    Al següent for incrementem el T(Throttle) cada
    500 ms, amb un valor de 5, a cada iteració,
    enviem aquest valor incrementat, aquesta funció
    eleva el dron.
    */
    for (let i = 500; i <= temps; i += 500) {
        throttle += 5
        radio.sendValue("T", throttle)
        basic.pause(i)
    }
}

//Declarem la funció downward:
function downward(temps: any) {
    /*
    Fa el mateix procès que a la funció upward, però
    fa baixar el dron, ja que redueix el T(Throttle)
    */
    for (let j = 500; j <= temps; j += 500) {
        throttle -= 5
        radio.sendValue("T", throttle)
        basic.pause(j)
    }
}

//Declarem la funció changemode:
function changemode(temps: any) {
    /*
    Aquesta funció canviia el mode de vol a l'angle
    d'incicisió preferit en ambdós sentits, al command.txt 
    s'ha d'indicar en graus(º), el dividim per mil, ja que 
    el decodificador.py multiplica x1000 els valors indicats 
    per pasar-ho a ms. 
    */
    mode = temps / 1000
    nmode = (-temps) / 1000
}

//Declarem la funció hover:
function hover(temps: any) {
    //Fem que el dron "floti", posem T(Throttle) a 50
    throttle = 50
    radio.sendValue("T", throttle)
    basic.pause(temps)
}
//Quan prenem botons A+B, activem el programa
input.onButtonPressed(Button.AB, function () {
    basic.clearScreen() //"Rentem" la matriu de leds de micro:bit
    for (let x = 0; x <= arrayComandes.length; x++) {
        /*
        Aquest serà el for principal, on seleccionarem del Array
        arrayComandes cada item, segons un index x, que anirà
        incementant a cada iteració, funciona com si repassesim
        cada item d'una llista un per un, en ordre.

        Per agafar un item d'un array hem de indicar-ho:
            · Si té 1 dimensió --> v = ["i", "j", "k"]; si volem agafar el 
            valor per exemple a la posició 0, haurem de marcar v[0], 
            aquesta posició al array dona el valor "i".

            · Si té 2 dimensions --> v = [["i", 2], ["j", 5], ["k", 9]];
            si volem agafar un item de dimensio 1, podem seleccionar el
            valor a la posició 1, v[1] --> ["j", 5].
            Per altra part, si volem seleccionar un item concret com "k",
            haurem de indicar la posició a la primera dimensió, i desprès
            la posició a la segona dimensió. Per agafar "k":
            v[2][0] --> "k" o v[2][1] --> 9.

            · Com es veu, el primer index indica el valor de la primera
            dimensió, i el segón index indica el valor de la segona 
            dimensió.

        Primer, agafarem les comandes que nomès tenen 1 command,
        sense valor asignat. 
        */
        if (arrayComandes[x][0] == "on") {
            radio.sendValue("A", 1) //Encenem els motors
        } else if (arrayComandes[x][0] == "off") {
            radio.sendValue("A", 0) /*Apaguem els motors*/
        } else {
        /*
        Ara agafem les comandes que tenen, comand i valor asignat,
        com que la major part, els valors indiquen temps en ms,
        hem decidit anomenar la variable que agafa el valor a cada
        iteració "temps".

        Aquesta cadena de if, else if's, ens ajuda a seleccionar
        quina funció hem de executar en cada moment, segons l'array
        arrayComandes. P.e: si comanda == "bw", executarem la funció
        backward(temps: any), amb el valor temps asignat a la posició
        de l'array "arrayComandes".
        */
            let comanda = arrayComandes[x][0];
            let temps = arrayComandes[x][1];
            //Cadena d'if i else if.
            if (comanda == "fw") {
                forward(temps)
                /*
                Quan cridem una funció amb un valor, estem executant
                un procès, aquesta sistemització en funcions, fa que
                els programes siguin més agils i dinamics, a més a més
                donen un millor "aspecte" i comprensió del programa.

                Aquesta característica basica al món de la programació,
                fa que no hagim d'escriure tantes linies de codi, ja que
                nomès indicarem 1 vegada el procès, no haurem de pasar per
                la linia més vegades que quan sigui cridada.
                */
            } else if (comanda == "bw") {
                backward(temps)
            } else if (comanda == "lw") {
                leftward(temps)
            } else if (comanda == "rw") {
                rightward(temps)
            } else if (comanda == "up") {
                upward(temps)
            } else if (comanda == "down") {
                downward(temps)
            } else if (comanda == "mode") {
                changemode(temps)
            } else if (comanda == "hover") {
                hover(temps)
            }
        }
    }
})
