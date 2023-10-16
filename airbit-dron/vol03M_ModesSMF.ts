//vol03M_ModesSMF.ts
/*
El següent programa és el codi que s'ha d'instalar al dron de 
l'air:bit. Programa vol02M_CodiMorse modificat.
*/

//Declaració de variables amb let
let buzzer = 0
let arm = 0
let roll = 0
let pitch = 0
let yaw = 0
let throttle = 0
let failSafeCounter = 0
let batteryEmpty = false
let batteryMilliVolt = 0
let lowBatteryLimit = 0
let batteryFactor = 0
let radioGroup = 7

/* Declaració funció failSafe utilitzat per salvar el dron
en cas de quedar-se sense bateria */
function failSafe () {
    /* Si el temps de funcionament del dron és més gran que
    el comptador de seguretat + 1000 ms, redueix el throttle */
    if (input.runningTime() > failSafeCounter + 1000) {
        throttle = 30
        yaw = 0
        pitch = 0
        roll = 0
    }
    /* Si el temps de funcionament del dron és més gran que
    el comptador de seguretat + 5000 ms, apaga els motors */
    if (input.runningTime() > failSafeCounter + 5000) {
        arm = 0
    }
}

// Funció que es mostra quan la bateria s'esta carregant
function iconBatteryCharging () {
    //Imatges que es mostren sucesivament a la matriu de leds
    basic.showLeds(`
        . . # . .
        . # . # .
        . # . # .
        . # . # .
        . # # # .
        `)
    basic.showLeds(`
        . . # . .
        . # . # .
        . # . # .
        . # # # .
        . # # # .
        `)
    basic.showLeds(`
        . . # . .
        . # . # .
        . # # # .
        . # # # .
        . # # # .
        `)
    basic.showLeds(`
        . . # . .
        . # # # .
        . # # # .
        . # # # .
        . # # # .
        `)
}

//Icon que es mostra quan la bateria és baixa
function iconBatteryLow () {
    basic.showLeds(`
            . . # . .
            . # # # .
            . # . # .
            . # . # .
            . # # # .
            `, 0)
}

//Icon que es mostra quan no hi ha bateria
function iconBatteryDead () {
    basic.showLeds(`
        . # # # .
        # . # . #
        # # # # #
        . # . # .
        . # . # .
        `)
}

/* Declaració funció lowBattery() utilitzada per saber quan
la bateria és baixa */
function lowBattery () {
    if (batteryEmpty) { 
    /* Ens mostra a la matriu de leds l'icon de la funció
    iconBatteryDead si no hi ha bateria */
        iconBatteryDead()
    } 
    /* Si el nivell de bateria en mV és més gran que 
    el límit de bateria fixat - 50, es mostra l'icon
    de la funció iconBatteryLow */
    else if (batteryMilliVolt > lowBatteryLimit - 50) {
        iconBatteryLow()
    
    /* El mateix, però ara amb un nivell de bateria
    encara més baix */
    } else if (batteryMilliVolt > lowBatteryLimit - 60) {
        if (input.runningTime() % 1000 < 500) {
            iconBatteryLow()
        }
    /* Si no es compleix cap de les condicions,
    apaga motors i mostra iconBatteryDead */
    } else {
        arm = 0
        throttle = 0
        batteryEmpty = true
        iconBatteryDead()
    }
}

/* Declaració funció calculateBatteryVoltage() 
que llegeix el pin analògic 0, el qual ens 
dona l'informació del voltatge que té la bateria */
function calculateBatteryVoltage () {
    batteryMilliVolt = Math.round(
        pins.analogReadPin(AnalogPin.P0) * batteryFactor * 0.05 + batteryMilliVolt * 0.95)
}

/* Declaració funció mainScreen(),
mostra a la pantalla del dron informació d'aquest*/
//Aquesta funció no és necesaria
function mainScreen () {
    basic.clearScreen() //"Reinicia" la matriu de leds
    //Si el motor està encès, s'encenen el led (0,0)
    if (arm == 1) {
        /* Només s'encen el led quan el residu de la divisió
        és major a 250 */
        if (input.runningTime() % 500 > 250) {
            led.plot(0, 0)
        }
    }

    /* El led de color vermell de la primera fila
    es va movent cap a la dreta, quan incrementa 
    el throttle */
    led.plot(0, (100 - throttle) / 25)

    //Mostra l'angle del dron a la pantalla
    //Per tant, també mostra cap on apunta el dron
    led.plot((45 + roll) / 18, (45 + pitch) / 18)

    //Mapeja el yaw
    led.plot(Math.map(yaw, -30, 30, 1, 3), 0)

    /* El següent if/else, ens mostra una barra de leds
    que indica quan de carregat està el dron, aquesta
    barra és a la 4a columna de leds, depen del valor de la
    bateria en mV */
    if (batteryMilliVolt > 100) {
        if (arm == 1) {
            AirBit.plotYLine(4, Math.round(Math.map(batteryMilliVolt, 3400, 3900, 4, 0)), 4)
        } else {
            AirBit.plotYLine(4, Math.round(Math.map(batteryMilliVolt, 3700, 4200, 4, 0)), 4)
        }
    } else {
        if (input.runningTime() % 500 > 250) {
            led.plot(4, 4)
        }
    }
}

// Quan girem el dron cap per avall, s'apaguen els motors
input.onGesture(Gesture.ScreenDown, function () {
    arm = 0
})

/* Al iniciar el programa, canviem varibles
per valors com el mínim de bateria
i fixem pins i radio */

basic.showNumber(radioGroup)
radio.setGroup(radioGroup)
batteryFactor = 4.42
lowBatteryLimit = 3400
batteryMilliVolt = 3700
batteryEmpty = false
serial.redirect(
SerialPin.P1,
SerialPin.P2,
BaudRate.BaudRate115200
)
//Funció que calibra la bruixola de la micro:bit (calibra el dron)
input.calibrateCompass() //Diferència entre vol01M i vol02M

//Diferència entre vol02M i vol03M:
input.onButtonPressed(Button.A, function () {
    //Quan presionem A, s'envia S(Slow) al controller
    radio.sendString("S")
})
input.onButtonPressed(Button.B, function () {
    //Quan presionem M, s'envia M(Medium) al controller
    radio.sendString("M")
})
input.onButtonPressed(Button.AB, function () {
    //Quan presionem F, s'envia F(Fast) al controller
    radio.sendString("F")
})
/*Ens permet seleccionar el mode de vol entre slow (lent),
medium (intermedi) i fast (ràpid).*/

/* Quan la radio rep un nom i un valor, canvia el valor de
pitch, arm, roll, throttle i yaw pel valor rebut a la radio
aquests valors els rebem constantment del controller */
radio.onReceivedValueDeprecated(function (name, value) {
    let autoPilot = false
    if (autoPilot == false) {
        if (name == "P") {
            pitch = value
        }
        if (name == "A") {
            arm = value
        }
        if (name == "R") {
            roll = value
        }
        if (name == "T") {
            throttle = value
        }
        if (name == "Y") {
            yaw = value
        }
    }
    failSafeCounter = input.runningTime()
})

//Funció loop, es repeteix indefinidament
basic.forever(function () {
    calculateBatteryVoltage() //calcula el voltatge de bateria
    led.toggle(4, 0)
    // basic.clearScreen()
    //Si la bateria s'està carregant (els pins llegeixen valor), mostra a pantalla carregant
    if (pins.analogReadPin(AnalogPin.P0) < 600 && pins.analogReadPin(AnalogPin.P0) >= 400) {
        iconBatteryCharging()
    //Si no hi ha bateria o té bateria més baixa que el mínim, i els pins llegeixen valors, mostra lowBattery()
    } else if (batteryEmpty || batteryMilliVolt < lowBatteryLimit && pins.analogReadPin(AnalogPin.P0) > 300) {
        lowBattery()
    //Sino, mostra mainScreen() normal
    } else {
        mainScreen()
        buzzer = 0
    }
    // failSafe()
    //Quan no hi hagi bateria s'apaguen els motors
    if (batteryEmpty) {
        arm = 0
    }

    //Funció per evitar la pèrdua del dron(si hi ha qualsevol error)
    failSafe()

    /* Funció que funciona a un baix nivell, al wonder:kit,
    envia comandes amb els valors de throttle, yaw, pitch,
    roll i arm al controlador dels motors */
    AirBit.FlightControl(throttle, yaw, pitch, roll, arm, 0, 0)

    //S'envia amb el nom "B" el valor de la bateria per radio
    radio.sendValue("B", batteryMilliVolt)
    //S'envia amb el nom "G" el valor de la acceleració al controller
    radio.sendValue("G", input.acceleration(Dimension.Z))
})
