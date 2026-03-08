class PostOffice extends Phaser.Scene {
    constructor() {
        super('postOfficeScene')
    }

    preload() {
        // load assets
        this.load.path = './assets/'
        this.load.image('postoffice', 'postoffice.png')
        this.load.image('truck', 'truck.png')
        this.load.image('crosswalk', 'crosswalk.png')
        this.load.image('scenecheck1', 'scenecheck1.png')
        this.load.spritesheet('stoplight', 'stoplight.png', {
            frameWidth: 850,
            frameHeight: 640
        })
        this.load.spritesheet('truckspritesheet', 'truckspritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })
    }

    create() {
        // background
        this.postoffice = this.add.tileSprite(0, 0, 850, 640, 'postoffice').setOrigin(0, 0).setDepth(0)
        this.stoplight = this.add.tileSprite(0, 0, 850, 640, 'stoplight').setOrigin(0, 0).setDepth(1).setFrame(1)
        this.crosswalk = this.add.tileSprite(0, 0, 850, 640, 'crosswalk').setOrigin(0, 0).setDepth(0)
        this.scenecheck1 = this.add.tileSprite(118, 630, 100, 0, 'scenecheck1').setOrigin(0, 0).setDepth(1)

        // borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 
        0x00000).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, 
        borderUISize, 0x00000).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 
        0x00000).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, 
        game.config.height, 0x00000).setOrigin(0, 0)

        this.truck = new Truck(this, 780, 125, 'truckspritesheet', 0)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        this.truckFSM.step()

        if (this.checkCollision(this.truck, this.scenecheck1)) {
            this.time.delayedCall(1000, () => {
                this.scenecheck1.setAlpha(0)
            })
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