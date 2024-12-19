import spidev
import RPi.GPIO as GPIO
import time

# Configuration des broches SPI et GPIO
VCC_PIN = 1  # Non utilisé dans ce script mais a connecté au 5v du raspberry
GND_PIN = 6  # Non utilisé dans ce script mais connecté au GND
SCLK_PIN = 11 #PIN23
DIN_PIN = 10  #PIN 19
CS_PIN = 8    #PIN 24
DC_PIN = 25   #PIN 22
RST_PIN = 24  #PIN 18

class SSD1305:
    def __init__(self):
        self.width = 128
        self.height = 32
        self.pages = self.height // 8
        self.buffer = [0] * (self.width * self.pages)

        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)

        GPIO.setup(DC_PIN, GPIO.OUT)
        GPIO.setup(RST_PIN, GPIO.OUT)
        GPIO.setup(CS_PIN, GPIO.OUT)

        self.spi = spidev.SpiDev(0, 0)
        self.spi.max_speed_hz = 8000000

        self.reset()
        self.init_display()

    def reset(self):
        GPIO.output(RST_PIN, GPIO.HIGH)
        time.sleep(0.1)
        GPIO.output(RST_PIN, GPIO.LOW)
        time.sleep(0.1)
        GPIO.output(RST_PIN, GPIO.HIGH)
        time.sleep(0.1)

    def send_command(self, cmd):
        GPIO.output(DC_PIN, GPIO.LOW)
        GPIO.output(CS_PIN, GPIO.LOW)
        self.spi.writebytes([cmd])
        GPIO.output(CS_PIN, GPIO.HIGH)

    def send_data(self, data):
        GPIO.output(DC_PIN, GPIO.HIGH)
        GPIO.output(CS_PIN, GPIO.LOW)
        self.spi.writebytes(data)
        GPIO.output(CS_PIN, GPIO.HIGH)

    def init_display(self):
        self.send_command(0xAE)  # Éteindre l'écran
        self.send_command(0x20)  # Mode d'adressage horizontal
        self.send_command(0x00)
        self.send_command(0xA8)  # Multiplex ratio
        self.send_command(0x1F)  # 1/32 duty
        self.send_command(0xDA)  # Configuration COM pins
        self.send_command(0x12)
        self.send_command(0xA1)  # Mappage Segment
        self.send_command(0xC8)  # Output scan direction
        self.send_command(0x81)  # Contraste
        self.send_command(0x7F)  # Valeur moyenne
        self.send_command(0xAF)  # Allumer l'écran

    def clear(self):
        """Vide le tampon et efface l'écran."""
        self.buffer = [0] * (self.width * self.pages)
        self.display()

    def display(self):
        """Affiche le contenu actuel du tampon."""
        for page in range(self.pages):
            self.send_command(0xB0 + page)
            self.send_command(0x00)
            self.send_command(0x10)
            start = page * self.width
            end = start + self.width
            self.send_data(self.buffer[start:end])

    def getbuffer(self, image):
        """Convertit une image PIL en tampon binaire pour l'écran."""
        if image.mode != '1':
            raise ValueError("Image must be in mode 1.")
        imwidth, imheight = image.size
        if imwidth != self.width or imheight != self.height:
            raise ValueError(f"Image must be {self.width}x{self.height} pixels.")
        pixels = image.load()
        for page in range(self.pages):
            for x in range(self.width):
                byte = 0
                for bit in range(8):
                    pixel = pixels[x, page * 8 + bit]
                    if pixel == 255:
                        byte |= (1 << bit)
                self.buffer[page * self.width + x] = byte

    def cleanup(self):
        self.reset()
        self.init_display()
        self.clear()
        self.spi.close()
        GPIO.cleanup()

    def full_reset(self):
        """Effectue une réinitialisation complète et efface tous les pixels."""
        # Désactiver l'écran (éteindre tous les pixels)
        self.send_command(0xAE)  # Turn display off

        # Efface chaque page de l'écran
        for page in range(self.pages):  # Parcourt les pages de l'écran (chaque page = 8 lignes)
            self.send_command(0xB0 + page)  # Définit l'adresse de la page
            self.send_command(0x00)        # Définit la colonne basse
            self.send_command(0x10)        # Définit la colonne haute
            self.send_data([0x00] * self.width)  # Remplit la page avec des zéros (pixels éteints)

        # Réactiver l'écran (écran propre, prêt à être utilisé)
        self.send_command(0xAF)  # Turn display on

        # Réinitialisation matérielle pour garantir un état propre
        self.reset()