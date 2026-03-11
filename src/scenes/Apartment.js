class Apartment extends Phaser.Scene {
    constructor() {
        super('apartmentScene')
    }

    create() { 
        this.letterbg = this.add.tileSprite(0, 0, 2000, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.apartment = this.add.tileSprite(100, 105, 1000, 600, 'apartment').setOrigin(0, 0).setDepth(0)
        this.stoplight1 = this.add.tileSprite(420, -135, 850, 640, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1)
        this.crosswalk1 = this.add.tileSprite(710, 137, 64, 100, 'crosswalk').setOrigin(0, 0).setDepth(1)
        this.stoplight2 = this.add.tileSprite(265, 730, 850, 640, 'stoplight').setOrigin(0, 0).setDepth(3).setAngle(-90).setFrame(1)
        this.crosswalk2 = this.add.tileSprite(542, 380, 100, 64, 'crosswalkside').setOrigin(0, 0).setDepth(1)
        this.finish = this.add.tileSprite(240, 550, 100, 64, 'finish').setOrigin(0, 0).setDepth(1)
        this.truck = new Truck(this, 900, 180, 'truckwidespritesheet', 0).setDepth(2)
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        this.truckFSM.step()
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