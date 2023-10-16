//vol01C_Oficial.ts
/*
El següent programa és el codi que s'ha d'instalar al controller de l'air:bit.
Codi proveït per l'empresa noruega MakeKit.
*/

//Declaració de variables amb el let:
let Roll = 0
let Pitch = 0
let Arm = 0
let Throttle = 0
let radioGroup = 7

//Quan el botó A es prem:
input.onButtonPressed(Button.A, function () {
    //Si el Throttle es menor a 60, disminueix de 5 en 5
    if (Throttle < 60) {
        Throttle += -5
    }
    //Si no, disminueix d'un en un
    else {
        Throttle += -1
    }
})

//Quan el botó B es prem:
input.onButtonPressed(Button.B, function () {
    //Si el Throttle es menor a 60, augmenta de 5 en 5
    if (Throttle < 60) {
        Throttle += 5
    }
    //Si no, augmenta d'un en un
    else {
        Throttle += 1
    }
})

//Quan el botó A+B es prem:
input.onButtonPressed(Button.AB, function () {
    //Si els motors estàn apagats, els encén
    if (Arm == 0) {
        Arm = 1
    } 
    //Si no, els apaga
    else {
        Arm = 0
    }
    Throttle = 0
})

//Quan girem cap per avall la micro:bit, apaguem motors
input.onGesture(Gesture.ScreenDown, function () {
    Throttle = 0
    Arm = 0
})

//Quan sacsejem la micro:bit, apaguem motors
input.onGesture(Gesture.Shake, function () {
    Throttle = 0
    Arm = 0
})

//Posem la sintonia de radio i ho mostrem a la matriu de leds
radio.setGroup(radioGroup)
basic.showNumber(radioGroup)

//Loop principal, aquesta funció es repeteix constantment
basic.forever(function () {
    /* Els valors del pitch i el roll depenen de l'angle de rotació
    de la micro:bit */
    Pitch = input.rotation(Rotation.Pitch)
    Roll = input.rotation(Rotation.Roll)

    //Rentem la pantalla de la matriu
    basic.clearScreen()

    //Si els motors estan encesos, encenem els leds de la posició (0,0)
    if (Arm == 1) {
        led.plot(0, 0)
    }

    //Mapejem en una columna l'augment o disminució del throttle
    led.plot(0, Math.map(Throttle, 0, 100, 4, 0))
    //Marquem a la matriu cap on apunta la micro:bit
    led.plot(Math.map(Roll, -45, 45, 0, 4), Math.map(Pitch, -45, 45, 0, 4))

    //Enviem al dron principal els valors de Pitch, Arm, Roll i Throttle
    radio.sendValue("P", Pitch)
    radio.sendValue("A", Arm)
    radio.sendValue("R", Roll)
    radio.sendValue("T", Throttle)
})
