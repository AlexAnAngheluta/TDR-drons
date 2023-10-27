import cv2
import pygame
import numpy as np
import time


S = 60

FPS = 120


class FrontEnd(object):
    """ Controls
            - T: Takeoff
            - L: Land
            - Flechas: Davant, Enrere, Dreta, Esquerra .
            - A  D: yaw
            - W  S: Amunt Avall.

    """

    def __init__(self):

        pygame.init()


        pygame.display.set_caption("Tello cam")
        self.screen = pygame.display.set_mode([960, 720])

        # Inicia camara Tello que interactua amb el drone Tello

        self.tello = Tello()


        self.for_back_velocity = 0
        self.left_right_velocity = 0
        self.up_down_velocity = 0
        self.yaw_velocity = 0
        self.speed = 10

        self.send_rc_control = False

        pygame.time.set_timer(pygame.USEREVENT + 1, 1000 // FPS)

    def run(self):

        self.tello.connect()
        self.tello.set_speed(self.speed)


        self.tello.streamoff()
        self.tello.streamon()

        frame_read = self.tello.get_frame_read()

        should_stop = False
        while not should_stop:

            for event in pygame.event.get():
                if event.type == pygame.USEREVENT + 1:
                    self.update()
                elif event.type == pygame.QUIT:
                    should_stop = True
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        should_stop = True
                    else:
                        self.keydown(event.key)
                elif event.type == pygame.KEYUP:
                    self.keyup(event.key)

            if frame_read.stopped:
                break

            self.screen.fill([0, 0, 0])

            frame = frame_read.frame

            text = "Battery: {}%".format(self.tello.get_battery())
            cv2.putText(frame, text, (5, 720 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = np.rot90(frame)
            frame = np.flipud(frame)

            frame = pygame.surfarray.make_surface(frame)
            self.screen.blit(frame, (0, 0))
            pygame.display.update()

            time.sleep(1 / FPS)

        self.tello.end()

    def keydown(self, key):
        """ Actualitza les velocitats en funció de la tecla premuda """
        if key == pygame.K_UP:  # estableix la velocitat d'avanç
           self.for_back_velocity = S
        elif key == pygame.K_DOWN:  # estableix la velocitat cap enrere
            self.for_back_velocity = -S
        elif key == pygame.K_LEFT:  # estableix la velocitat a l'esquerra
            self.left_right_velocity = -S
        elif key == pygame.K_RIGHT:  # estableix la velocitat cap a la dreta
            self.left_right_velocity = S
        elif key == pygame.K_w:  # estableix veolcitat cap amunt
            self.up_down_velocity = S
        elif key == pygame.K_s:  # estableix velocitat cap abaix
            self.up_down_velocity = -S
        elif key == pygame.K_a:  # estableix la velocitat de girada en sentit contrari a les agulles del rellotge
            self.yaw_velocity = -S
        elif key == pygame.K_d:  # estableix la velocitat de girada sentit de les agulles del rellotge
            self.yaw_velocity = S

    def keyup(self, key):
        """ Actualitza les velocitats en funció de la tecla alliberada """
        if key == pygame.K_UP or key == pygame.K_DOWN:  # establiu zero velocitat cap endavant/enrere
            self.for_back_velocity = 0
        elif key == pygame.K_LEFT or key == pygame.K_RIGHT: # establiu velocitat esquerra/dreta zero
            self.left_right_velocity = 0
        elif key == pygame.K_w or key == pygame.K_s:  # establiu zero velocitat cap amunt/baixada
            self.up_down_velocity = 0
        elif key == pygame.K_a or key == pygame.K_d: # establiu la velocitat de girada zero
            self.yaw_velocity = 0
        elif key == pygame.K_t:  # takeoff
            self.tello.takeoff()
            self.send_rc_control = True
        elif key == pygame.K_l:  # land
            not self.tello.land()
            self.send_rc_control = False

    def update(self):
        """ Envia velocitats a Tello. """
        if self.send_rc_control:
            self.tello.send_rc_control(self.left_right_velocity, self.for_back_velocity,
                self.up_down_velocity, self.yaw_velocity)


def main():
    frontend = FrontEnd()



    frontend.run()


if __name__ == '__main__':
    main()
