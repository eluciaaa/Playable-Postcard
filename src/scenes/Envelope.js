class Envelope extends Phaser.Scene {
    constructor() {
        super('envelopeScene')
    }

    preload() {
        // load assets
        this.load.path = './assets/'

        this.load.spritesheet('envelopespritesheet', 'envelopespritesheet.png', {
            frameWidth: 1200,
            frameHeight: 800
        })

        this.load.image('letterbg', 'letterbg.png')
        this.load.image('postoffice', 'postoffice.png')
        this.load.image('truck', 'truckwide.png')
        this.load.image('finish', 'finish.png')
        this.load.image('crosswalk', 'crosswalk.png')
        this.load.image('downtown', 'downtown.png')
        this.load.image('river', 'river.png')
        this.load.image('intersection', 'intersection.png')
        this.load.image('apartment', 'apartment.png')
        this.load.image('scenecheck', 'scenecheck.png')
        this.load.image('arrow', 'arrow.png')
        this.load.image('cover', 'cover.png')

        this.load.audio('bgmusic', 'bgmusic.wav')
        this.load.audio('rip', '804445__geoff-bremner-audio__paper-rip-18.wav')

        this.load.spritesheet('stoplight', 'stoplight.png', {
            frameWidth: 126,
            frameHeight: 129
        })

        this.load.spritesheet('truckwidespritesheet', 'truckwidespritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })
        this.load.spritesheet('car1', 'car1spritesheet.png', {
            frameWidth: 58,
            frameHeight: 55
        })
        this.load.spritesheet('car2', 'car2spritesheet.png', {
            frameWidth: 58,
            frameHeight: 55
        })
        this.load.spritesheet('car3', 'car3spritesheet.png', {
            frameWidth: 58,
            frameHeight: 55
        })
        this.load.spritesheet('pedestrian', 'pedestrianspritesheet.png', {
            frameWidth: 30,
            frameHeight: 46
        })
        this.load.spritesheet('postcardflip', 'postcardanimation.png', {
            frameWidth: 1200,
            frameHeight: 800
        })
    }

    create() {

        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '75px',
            color: '#ffffff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

    // start on frame 0
        this.envelope = this.add.sprite(0, 0, 'envelopespritesheet', 0).setOrigin(0, 0).setDepth(0)
        
        this.text1 = this.add.text(620, 140, "You've got mail!", menuConfig).setOrigin(0.5).setDepth(1)
        this.text2 = this.add.text(620, 220, "Click to open", menuConfig).setOrigin(0.5).setDepth(1)

        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
        this.key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
        this.key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX)

        this.input.on('pointerdown', () => {

            if (this.envelope.frame.name == 0) {
                this.sound.play('rip')
                this.time.delayedCall(100, () => {
                    this.envelope.setFrame(1)
                    this.text1.setVisible(false)
                    this.text2.setVisible(false)
                })
            } else {
                this.scene.start('postOfficeScene')
            }

        })

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.key1)) {
            this.scene.start('postOfficeScene')
        }
        if (Phaser.Input.Keyboard.JustDown(this.key2)) {
            this.scene.start('downtownScene')
        }
        if (Phaser.Input.Keyboard.JustDown(this.key3)) {
            this.scene.start('riverScene')
        }
        if (Phaser.Input.Keyboard.JustDown(this.key4)) {
            this.scene.start('intersectionScene')
        }
        if (Phaser.Input.Keyboard.JustDown(this.key5)) {
            this.scene.start('apartmentScene')
        }
        if (Phaser.Input.Keyboard.JustDown(this.key6)) {
            this.scene.start('postcardScene')
        }
    }
}