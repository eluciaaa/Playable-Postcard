class PostOffice extends Phaser.Scene {
    constructor() {
        super('postOfficeScene')
    }

    preload() {
        // load assets
        this.load.path = './assets/'
        this.load.image('letterbg', 'letterbg.png')
        this.load.image('postoffice', 'postoffice.png')
        this.load.image('truck', 'truckwide.png')
        this.load.image('finish', 'finish.png')
        this.load.image('crosswalk', 'crosswalk.png')
        this.load.image('crosswalkside', 'crosswalkside.png')
        this.load.image('river', 'river.png')
        this.load.image('apartment', 'apartment.png')
        this.load.image('scenecheck', 'scenecheck.png')
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
        // background
        this.letterbg = this.add.tileSprite(0, 0, 1000, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.postoffice = this.add.tileSprite(100, 105, 800, 600, 'postoffice').setOrigin(0, 0).setDepth(1)
        this.stoplight = this.add.tileSprite(50, 165, 850, 640, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(1)
        this.crosswalk = this.add.tileSprite(350, 442, 64, 100, 'crosswalk').setOrigin(0, 0).setDepth(1)
        this.scenecheck1 = this.add.tileSprite(100, 445, 3, 100, 'scenecheck').setOrigin(0, 0).setDepth(1)

        this.truck = new Truck(this, 825, 300, 'truckwidespritesheet', 0).setDepth(2)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        this.truckFSM.step()

        if (this.checkCollision(this.truck, this.scenecheck1)) {
            this.scene.start('riverScene')
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