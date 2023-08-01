# version_1.0 - Official
"""
Aquest programa es el programa del controlador del dron air:bit
Prové de la documentació official
"""

def on_gesture_screen_down():
    global Throttle, Arm
    Throttle = 0
    Arm = 0
input.on_gesture(Gesture.SCREEN_DOWN, on_gesture_screen_down)

def on_button_pressed_a():
    global Throttle
    if Throttle < 60:
        Throttle += -5
    else:
        Throttle += -1
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_gesture_shake():
    global Throttle, Arm
    Throttle = 0
    Arm = 0
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

def on_button_pressed_ab():
    global Arm, Throttle
    if Arm == 0:
        Arm = 1
    else:
        Arm = 0
    Throttle = 0
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global Throttle
    if Throttle < 60:
        Throttle += 5
    else:
        Throttle += 1
input.on_button_pressed(Button.B, on_button_pressed_b)

Roll = 0
Pitch = 0
Arm = 0
Throttle = 0
radioGroup = 7
radio.set_group(radioGroup)
basic.show_number(radioGroup)

def on_forever():
    global Pitch, Roll
    Pitch = input.rotation(Rotation.PITCH)
    Roll = input.rotation(Rotation.ROLL)
    basic.clear_screen()
    if Arm == 1:
        led.plot(0, 0)
    led.plot(0, Math.map(Throttle, 0, 100, 4, 0))
    led.plot(Math.map(Roll, -45, 45, 0, 4),
        Math.map(Pitch, -45, 45, 0, 4))
    radio.send_value("P", Pitch)
    radio.send_value("A", Arm)
    radio.send_value("R", Roll)
    radio.send_value("T", Throttle)
basic.forever(on_forever)