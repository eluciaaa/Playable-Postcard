class Postcard extends Phaser.Scene {
    constructor() {
        super('postcardScene')
    }

    create() {
        this.postcardflip = this.add.tileSprite(0, 0, 1200, 800, 'postcardflip').setOrigin(0, 0).setFrame(0)

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

        this.text1 = this.add.text(200, 150, "To: Drake", menuConfig).setOrigin(0.5).setDepth(1).setAlpha(0)
        this.text2 = this.add.text(840, 500, "The time we've spent together\nhere means everything to me.\nI hope you enjoyed this \nplayable postcard.", menuConfig).setOrigin(0.5).setDepth(1).setAlpha(0)

        this.playAnimation(this.postcardflip)

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

    }

    update() {
    }
}