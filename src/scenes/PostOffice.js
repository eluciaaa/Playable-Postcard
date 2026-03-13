class PostOffice extends Phaser.Scene {
    constructor() {
        super('postOfficeScene')
    }

    create() {
        // music
        this.bgm = this.sound.add('bgmusic', {
            volume: 0.3,
            loop: true
        })
        this.bgm.play()

        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '35px',
            color: '#ffffff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // background
        this.letterbg = this.add.tileSprite(0, 0, 1200, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.postoffice = this.add.tileSprite(100, 105, 1000, 600, 'postoffice').setOrigin(0, 0).setDepth(1)

        // ui
        this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)
        this.text1 = this.add.text(610, 430, 'Use arrow keys to move', menuConfig).setOrigin(0.5).setDepth(1)

        // player and collision objects
        this.truck = new Truck(this, 1000, 360, 'truckwidespritesheet', 1).setDepth(2)
        this.car = new Car(this, 1000, 360, 'car1', 1).setDepth(2)
        this.scenecheck = this.add.tileSprite(100, 590, 3, 100, 'scenecheck').setOrigin(0, 0).setDepth(1)

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
            this.scene.start('downtownScene')
        }

        if (
            Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.down)
        ) {
            this.text1.setVisible(false)
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

    // collision check function
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