//vol02C_CodiMorse.ts
/*
El següent programa és el codi que s'ha d'instalar al controller de 
l'air:bit. Per saber comandes consultar taula al document de TDR.
*/

//Declaració variables amb el let:
let roll = 0
let pitch = 0
let throttle = 0
let arm = 0

//Declarem la cadena que utilitzarem pel "morse"
let cadena_morse = ""

/*Declaració funció fer_punts(), que mostra a 
la matriu de leds un punt i introdueix a la 
variable cadena_morse un punt. */
function fer_punts () {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    //Introduïm el punt a cadena_morse
    cadena_morse = "" + cadena_morse + "."
}

//Declaració funció fer_linies()
function fer_linies () {
    //Mostrem a la matriu de leds una guió
    basic.showString("-")
    //Afegim a cadena_morse un guió
    cadena_morse = "" + cadena_morse + "-"
}

//Declaració funció fer_enter(), decodifica el codi morse:
function fer_enter () {
    /*El que fem al fer enter (A+B),
    enviem una comanda al controller */

    //Si cadena_morse = -.- apaguem o encenem motors
    if (cadena_morse == "-.-") {
        basic.showString("A")
        //Quan el motor és encès, l'apaguem i a l'inrevès
        if (arm == 1) {
            arm = 0
        } else if (arm == 0){
            arm = 1
        }
    }
    //Si cadena_morse = - disminuim throttle i mostrem a la matriu
    else if (cadena_morse == "-") {
        throttle -= 25
        basic.showString("T.") //T. = disminuir throttle
    } 
    //Si cadena_morse = . augmentem throttle i mostrem a la matriu
    else if (cadena_morse == ".") {
        throttle += 25
        basic.showString("T")
    }
    //Si cadena_morse = .. augmentem º de pitch i mostrem a la matriu
    else if (cadena_morse == "..") {
        pitch += 10
        basic.showString("P")
    }
    //Si cadena_morse = -- disminuim º de pitch i mostrem a la matriu
    else if (cadena_morse == "--") {
        pitch += -10
        basic.showString("P.")
    }
    //Si cadena_morse = -- disminuim º de roll i mostrem a la matriu
    else if (cadena_morse == "-.") {
        roll += -10
        basic.showString("R.")
    } 
    //Si cadena_morse = -- augmentem º de roll i mostrem a la matriu
    else if (cadena_morse == ".-") {
        roll += 10
        basic.showString("R")
    }
    /* Si no és cap de les condicions, per tant no és cap de 
    les comandes, mostra cadena NaN a la matriu de leds */
    else {
        basic.showString("NaN")
    }
    //Desprès del enter "reiniciem"/buidem la variable cadena_morse
    cadena_morse = ""
}

//Quan polsem el botó A, truquem la funció fer_punts()
input.onButtonPressed(Button.A, function () {
    fer_punts()
})

//Quan polsem el botó B, truquem la funció fer_linies()
input.onButtonPressed(Button.B, function () {
    fer_linies()
})

//Quan polsem els botons A+B, truquem la funció fer_enter()
input.onButtonPressed(Button.AB, function () {
    /*La funció ens modifica les variables arm, throttle,
    pitch i roll, decodificant la variable cadena_morse, 
    a la qual hem anat introduïnt punts i linies */
    fer_enter()
})

//Quan sacsegem el controller, apagem els motors
input.onGesture(Gesture.Shake, function () {
    arm = 0
})

//A l'inici del programa buidem cadena_morse i posem radio a 7
cadena_morse = ""
radio.setGroup(7)

//Funció de loop:
basic.forever(function () {
    /*Constantment enviem els valors que anem introduïnt o canviant
    de les diferents variables */
    radio.sendValue("A", arm)
    radio.sendValue("T", throttle)
    radio.sendValue("P", pitch)
    radio.sendValue("R", roll)
})
