class Downtown extends Phaser.Scene {
    constructor() {
        super('downtownScene')
    }

    create() {
        this.bgm = this.sound.add('bgmusic', {
            volume: 0.3,
            loop: true
        })
        this.bgm.play()
        // background
        this.letterbg = this.add.tileSprite(0, 0, 1200, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.downtown = this.add.tileSprite(100, 105, 1000, 600, 'downtown').setOrigin(0, 0).setDepth(1)
        this.scenecheck1 = this.add.tileSprite(100, 260, 3, 20, 'scenecheck').setOrigin(0, 0).setDepth(1)
        this.scenecheck2 = this.add.tileSprite(100, 340, 3, 20, 'scenecheck').setOrigin(0, 0).setDepth(1)
        //this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)

        this.truck = new Truck(this, 1060, 320, 'truckwidespritesheet', 0).setDepth(2)

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

        // conditional scene transition with coords
        if (this.checkCollision(this.truck, this.scenecheck1)) {
            this.scene.start('riverScene', { x: 1100, y: 260 })
        }
        if (this.checkCollision(this.truck, this.scenecheck2)) {
            this.scene.start('riverScene', { x: 1100, y: 325 })
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

    //checkTruckCollisions() {
        //return (
            //this.checkCollision(this.truck, this.collcheck1) ||
            //this.checkCollision(this.truck, this.collcheck2) ||
            //this.checkCollision(this.truck, this.collcheck3) ||
            //this.checkCollision(this.truck, this.collcheck4)
        //)
    //}
}