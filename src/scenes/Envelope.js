class Envelope extends Phaser.Scene {
    constructor() {
        super('envelopeScene')
    }

    preload() {
        // load assets
        this.load.path = './assets/'

        this.load.spritesheet('envelopespritesheet', 'envelopespritesheet.png', {
            frameWidth: 1000,
            frameHeight: 800
        })

        this.load.image('letterbg', 'letterbg.png')
        this.load.image('postoffice', 'postoffice.png')
        this.load.image('truck', 'truckwide.png')
        this.load.image('finish', 'finish.png')
        this.load.image('crosswalk', 'crosswalk.png')
        this.load.image('crosswalkside', 'crosswalkside.png')
        this.load.image('river', 'river.png')
        this.load.image('apartment', 'apartment.png')
        this.load.image('scenecheck', 'scenecheck.png')

        this.load.audio('bgmusic', 'bgmusic.wav')
        this.load.audio('rip', '804445__geoff-bremner-audio__paper-rip-18.wav')

        this.load.spritesheet('stoplight', 'stoplight.png', {
            frameWidth: 850,
            frameHeight: 640
        })

        this.load.spritesheet('truckwidespritesheet', 'truckwidespritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })
    }

    create() {

        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '100px',
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
        
        this.text1 = this.add.text(500, 260, "You've got mail!", menuConfig).setOrigin(0.5).setDepth(1)
        this.text2 = this.add.text(500, 400, "Click to open", menuConfig).setOrigin(0.5).setDepth(1)

        this.input.on('pointerdown', () => {

            if (this.envelope.frame.name == 0) {
                this.sound.play('rip')
                this.time.delayedCall(100, () => {
                    this.envelope.setFrame(1)
                    this.text1.setText('Click again to play')
                    this.text2.setVisible(false)
                })
            } else {
                this.scene.start('postOfficeScene')
            }

        })

    }

    update() {

    }
}