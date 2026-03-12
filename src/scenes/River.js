class River extends Phaser.Scene {
    constructor() {
        super('riverScene')
    }

    create(data) { 
        this.letterbg = this.add.tileSprite(0, 0, 1200, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.river = this.add.tileSprite(100, 105, 1000, 600, 'river').setOrigin(0, 0).setDepth(0)
        this.truck = new Truck(this, data.x, data.y, 'truckwidespritesheet', 0)
        this.scenecheck = this.add.tileSprite(100, 250, 3, 300, 'scenecheck').setOrigin(0, 0).setDepth(1)
        this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        this.truckFSM.step()

        if (this.checkCollision(this.truck, this.scenecheck)) {
            this.scene.start('intersectionScene')
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