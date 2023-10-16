//vol03C_ModesSMF.ts
/*
El següent programa és el codi que s'ha d'instalar al controller de 
l'air:bit. Per saber entendre objectiu del programa, consultar
document.
*/

//Declaració variables amb el let:
let arm = 0
let throttle = 0
let roll = 0
let pitch = 0
let nmode = 0 //Angle d'incisió en el sentit negatiu
let mode = 0 //Angle d'incisió en el sentit positiu
let radioGroup = 7

//Declaració funció forwardBackward()
function forwardBackward () {
    //Si la rotació en l'eix de pitch del controlador és > 30º:
    if (input.rotation(Rotation.Pitch) > 30) {
        //Pitch pasa a tenir l'angle del mode
        pitch = mode
    }
    //Si es més petit de -30º:
    else if (input.rotation(Rotation.Pitch) < -30) {
        //Pitch pasa a tenir l'angle oposat del mode
        pitch = nmode
    }
    //Si no es compleix cap, pitch = 0, estable
    else {
        pitch = 0
    }
}

//Declaració funció rightLeft()
function rightLeft () {
    //Si la rotació en l'eix de roll del controlador és > 30º:
    if (input.rotation(Rotation.Roll) > 30) {
        //Roll pasa a tenir l'angle del mode
        roll = mode
    }
    //Si es més petit de -30º:
    else if (input.rotation(Rotation.Roll) < -30) {
        //Roll pasa a tenir l'angle oposat del mode
        roll = nmode
    }
    //Si no es compleix cap, roll = 0, estable
    else {
        roll = 0
    }
}

//Quan premem botó A, disminuim throttle
input.onButtonPressed(Button.A, function () {
    throttle -= 5
    /*if (throttle < 60) {
        throttle += -5
    } else {
        throttle += -1
    }*/
})

//Quan premem botó B, augmentem throttle
input.onButtonPressed(Button.B, function () {
    throttle += 5
    /*if (throttle < 60) {
        throttle += 5
    } else {
        throttle += 1
    }*/
})

//Quan premem A+B, si motors apagats, els encenem, i a l'inrevès
input.onButtonPressed(Button.AB, function () {
    if (arm == 0) {
        arm = 1
    } else {
        arm = 0
    }
    //posem throttle a 0
    throttle = 0
})

//Quan sacsegem el controller, apaguem motors
input.onGesture(Gesture.Shake, function () {
    throttle = 0
    arm = 0
})

//Quan rebem per radio els modes de vol des del dron
radio.onReceivedString(function (receivedString) {
    //Si rebem F(Fast), al mode ràpid li corresponen:
    if (receivedString == "F") {
        //Angle d'incisió de 30º i -30º
        mode = 30
        nmode = -30
    }
    //Si rebem M(Medium), al mode intermedi li corresponen:
    else if (receivedString == "M") {
        //Angle d'incisió de 20º i -20º
        mode = 20
        nmode = -20
    }
    //Si rebem S(Slow), al mode lent li corresponen:
    else if (receivedString == "S") {
        //Angle d'incisió de 10º i -10º
        mode = 10
        nmode = -10
    }
    //Si no rebem cap d'aquests valors, mostrem NaN
    else {
        basic.showString("NaN")
    }
})
//Recomenem utilitzar Medium, intermedi

//Posem el grup de radio i el mostrem a la matriu
radio.setGroup(radioGroup)
basic.showNumber(radioGroup)

//Loop principal:
basic.forever(function () {
    basic.clearScreen() //"Rentem" la matriu
    //Si els motors estan encesos, encenem led (0,0)
    if (arm == 1) {
        led.plot(0, 0)
    }
    //Mostrem a la columna 0, l'increment/disminució de throttle
    led.plot(0, Math.map(throttle, 0, 100, 4, 0))
    //Mostrem a la matriu com està inclinat el roll(x) i el pitch(y)
    led.plot(Math.map(roll, -30, 30, 0, 4), Math.map(pitch, -30, 30, 0, 4))

    //Truquem funcions forwardBackward() i rightLeft()
    forwardBackward()
    rightLeft()

    //Enviem per radio els valor de pitch, arm, roll i throttle
    radio.sendValue("P", pitch)
    radio.sendValue("A", arm)
    radio.sendValue("R", roll)
    radio.sendValue("T", throttle)
})
