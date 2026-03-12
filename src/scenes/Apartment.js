class Apartment extends Phaser.Scene {
    constructor() {
        super('apartmentScene')
    }

    create() { 
        this.letterbg = this.add.tileSprite(0, 0, 2000, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.apartment = this.add.tileSprite(100, 105, 1000, 600, 'apartment').setOrigin(0, 0).setDepth(0)
        this.stoplight1 = this.add.tileSprite(670, 260, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1)
        this.stoplight2 = this.add.tileSprite(825, 490, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1).setFlipX(true)
        this.stoplight3 = this.add.tileSprite(710, 410, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1).setAngle(90).setFlipX(true)
        this.crosswalk1 = this.add.tileSprite(625, 345, 55, 180, 'crosswalk').setOrigin(0, 0).setDepth(1)
        this.crosswalk2 = this.add.tileSprite(938, 523, 55, 255, 'crosswalk').setOrigin(0, 0).setDepth(1).setAngle(90)
        this.crosswalk3 = this.add.tileSprite(938, 289, 55, 255, 'crosswalk').setOrigin(0, 0).setDepth(1).setAngle(90)
        this.finish = this.add.tileSprite(185, 455, 80, 64, 'finish').setOrigin(0, 0).setDepth(1)
        this.truck = new Truck(this, 810, 130, 'truckwidespritesheet', 1).setDepth(2)
        this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)
        this.arrow = this.add.tileSprite(250, 410, 150, 150, 'arrow').setOrigin(0, 0).setDepth(1)
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        this.truckFSM.step()

        // bug workaround
        if (Phaser.Geom.Intersects.RectangleToRectangle(
            this.truck.getBounds(),
            this.arrow.getBounds()
        )) {
            this.arrow.setAlpha(0)
        }
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