class Intersection extends Phaser.Scene {
    constructor() {
        super('intersectionScene')
    }

    create() {
        this.bgm = this.sound.add('bgmusic', {
            volume: 0.3,
            loop: true
        })
        this.bgm.play()
        // background
        this.letterbg = this.add.tileSprite(0, 0, 1200, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.intersection = this.add.tileSprite(100, 105, 1000, 600, 'intersection').setOrigin(0, 0).setDepth(1)
        this.stoplight1 = this.add.tileSprite(165, 175, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1)
        this.stoplight2 = this.add.tileSprite(325, 490, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1).setFlipX(true)
        this.stoplight3 = this.add.tileSprite(480, 275, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1).setAngle(90).setFlipY(true)
        this.stoplight4 = this.add.tileSprite(210, 410, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1).setAngle(90).setFlipX(true)
        this.crosswalk1 = this.add.tileSprite(440, 290, 55, 230, 'crosswalk').setOrigin(0, 0).setDepth(1)
        this.crosswalk2 = this.add.tileSprite(125, 270, 55, 250, 'crosswalk').setOrigin(0, 0).setDepth(1)
        this.crosswalk3 = this.add.tileSprite(435, 525, 55, 250, 'crosswalk').setOrigin(0, 0).setDepth(1).setAngle(90)
        this.crosswalk4 = this.add.tileSprite(415, 210, 55, 230, 'crosswalk').setOrigin(0, 0).setDepth(1).setAngle(90)
        this.scenecheck = this.add.tileSprite(160, 730, 300, 3, 'scenecheck').setOrigin(0, 0).setDepth(1)
        //this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)
        this.arrow = this.add.tileSprite(235, 720, 150, 150, 'arrow').setOrigin(0, 0).setDepth(1).setAngle(270)

        this.truck = new Truck(this, 825, 320, 'truckwidespritesheet', 0).setDepth(2)

        // x, y, width, height
        //this.collcheck1 = this.add.rectangle(710, 390, 180, 305, 0xff0000).setOrigin(0, 0).setDepth(1).setAlpha(0)
        //this.collcheck2 = this.add.rectangle(110, 570, 600, 125, 0xff0000).setOrigin(0, 0).setDepth(1).setAlpha(0)
        //this.collcheck3 = this.add.rectangle(110, 115, 447, 305, 0xff0000).setOrigin(0, 0).setDepth(1).setAlpha(0)
        //this.collcheck4 = this.add.rectangle(425, 115, 467, 123, 0xff0000).setOrigin(0, 0).setDepth(1).setAlpha(0)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.collisionStart = null
    }

    update(time) {
        this.truckFSM.step()

        // scene transition
        if (this.checkCollision(this.truck, this.scenecheck)) {
            this.scene.start('apartmentScene')
        }

        // bug workaround
        if (Phaser.Geom.Intersects.RectangleToRectangle(
            this.truck.getBounds(),
            this.arrow.getBounds()
        )) {
            this.arrow.setAlpha(0)
        }

        // check wall collisions
        //if (this.checkTruckCollisions()) {

            //if (!this.collisionStart) {
                //this.collisionStart = time
            //}

            //if (time - this.collisionStart > 1000) {
                //this.bgm.stop()
                //this.scene.restart()
            //}

        //} else {
            //this.collisionStart = null
        //}
    }

    checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        )
    }
}