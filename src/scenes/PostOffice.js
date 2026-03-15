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
            padding: { top: 5, bottom: 5 },
            fixedWidth: 0
        }

        // background
        this.letterbg = this.add.tileSprite(0, 0, 1200, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.postoffice = this.add.tileSprite(100, 105, 1000, 600, 'postoffice').setOrigin(0, 0).setDepth(1)

        // ui
        this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)
        this.text1 = this.add.text(610, 430, 'Use arrow keys to move', menuConfig).setOrigin(0.5).setDepth(1)

        // player
        this.truck = new Truck(this, 1000, 360, 'truckwidespritesheet', 1).setDepth(2)

        // disable collisions at spawn
        this.truck.body.checkCollision.none = true
        // enable collisions after 1 second
        this.time.delayedCall(1000, () => {
            this.truck.body.checkCollision.none = false
        })

        // physics groups
        this.carGroup = this.physics.add.group()
        this.pedestrianGroup = this.physics.add.group()
        
        // cars
        this.cars = [
            new Car(this, 700, 350, 'car2', 1),
            new Car(this, 500, 400, 'car2', 0)
        ]
        this.carGroup.addMultiple(this.cars)

        // pedestrians
        this.pedestrians = [
            new Pedestrian(this, 100, 280, 'pedestrian', [{ dir: 'right', dist: Infinity }]),
            new Pedestrian(this, 525, 550, 'pedestrian', [{ dir: 'left', dist: Infinity }])
        ]
        this.pedestrianGroup.addMultiple(this.pedestrians)

        // scene transitions
        this.scenecheck1 = this.physics.add.staticSprite(100, 600, 'scenecheck').setOrigin(0, 0).setDepth(1).setAlpha(0)
        this.scenecheck1.body.setSize(3, 100)

        // physics collisions
        this.physics.add.overlap(this.truck, this.carGroup, () => this.truck.setPosition(1000, 360))
        this.physics.add.overlap(this.truck, this.pedestrianGroup, () => this.truck.setPosition(1000, 360))
        this.physics.add.overlap(this.truck, this.scenecheck1, () => this.scene.start('downtownScene'), null, this)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update(time) {
        this.truckFSM.step()

        // update pedestrians
        this.pedestrianGroup.children.iterate(ped => {
            ped.update()
        })

        // update cars
        this.carGroup.children.iterate(car => {

            car.update()

            // cleanup cars that leave screen
            if (car.x < -200 || car.x > 1400 || car.y < -100 || car.y > 900) {

                car.destroy()
                this.cars.splice(this.cars.indexOf(car), 1)

            }
        })

        if (
            Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.down)
        ) {
            this.text1.setVisible(false)
        }
    }
}