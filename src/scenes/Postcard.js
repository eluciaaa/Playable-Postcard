class Postcard extends Phaser.Scene {
    constructor() {
        super('postcardScene')
    }

    create() {
        // music
        if (!this.sound.get('bgmusic')) {
            this.bgm = this.sound.add('bgmusic', { volume: 0.3, loop: true })
            this.bgm.play()
        }

        this.postcardflip = this.add.tileSprite(0, 0, 1200, 800, 'postcardflip').setOrigin(0,0).setFrame(0)
        this.credits = this.add.tileSprite(0, 0, 1200, 800, 'credits').setOrigin(0,0).setDepth(1).setAlpha(0)

        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '30px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10,
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let creditsConfig = {
            fontFamily: 'Verdana',
            fontSize: '50px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10,
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        this.text1 = this.add.text(200, 150, "To: Drake", menuConfig).setOrigin(0.5).setDepth(1).setAlpha(0)
        this.text2 = this.add.text(840, 500, "The time we've spent together\nhere means everything to me.\nI hope you enjoyed this \nplayable postcard.", menuConfig).setOrigin(0.5).setDepth(1).setAlpha(0)
        this.text3 = this.add.text(780, 685, "Click to show credits, press R to restart.", menuConfig).setOrigin(0.5).setDepth(1).setAlpha(0)
        this.text4 = this.add.text(600, 70, "Credits:", creditsConfig).setOrigin(0.5).setDepth(2).setAlpha(0)
        this.text5 = this.add.text(615, 500, "Art: all made by me\nSound: Paper Rip 1 by Geoff-Bremner-Audio \n https://freesound.org/s/792939/ \nLicense: Creative Commons 0\nVideo Game Music... by Seth_Makes_Sounds\nhttps://freesound.org/s/683835/ \nLicense: Creative Commons 0", creditsConfig).setOrigin(0.5).setDepth(2).setAlpha(0)

        this.playAnimation(this.postcardflip)

        this.input.on('pointerdown', () => {
            this.credits.setAlpha(1)
            this.text1.setVisible(false)
            this.text2.setVisible(false)
            this.text3.setVisible(false)
            this.text4.setAlpha(1)
            this.text5.setAlpha(1)
        })
    }

    playAnimation() {
        let frame = 0

        this.time.addEvent({
            delay: 700,
            repeat: 4,
            callback: () => {

                this.postcardflip.setFrame(frame)

                if (frame === 4) {
                    this.revealText()
                }

                frame++
            }
        })
    }

    revealText() {

        this.tweens.add({
            targets: this.text1,
            alpha: 1,
            duration: 1500,
            ease: 'Power2'
        })

        this.tweens.add({
            targets: this.text2,
            alpha: 1,
            duration: 1500,
            delay: 400,
            ease: 'Power2'
        })

        this.tweens.add({
            targets: this.text3,
            alpha: 1,
            duration: 1500,
            delay: 400,
            ease: 'Power2'
        })

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start('envelopeScene')
        }
    }
}