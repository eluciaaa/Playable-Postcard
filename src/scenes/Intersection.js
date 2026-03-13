class Intersection extends Phaser.Scene {
    constructor() {
        super('intersectionScene')
    }

    create(data) {
        // music
        this.bgm = this.sound.add('bgmusic', { 
            volume: 0.3, 
            loop: true 
        })
        this.bgm.play()

        this.spawnX = data.x
        this.spawnY = data.y

        // background
        this.letterbg = this.add.tileSprite(0, 0, 1200, 800, 'letterbg').setOrigin(0, 0).setDepth(0)
        this.intersection = this.add.tileSprite(100, 105, 1000, 600, 'intersection').setOrigin(0, 0).setDepth(1)

        // ui
        //this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)
        this.arrow = this.add.tileSprite(235, 720, 150, 150, 'arrow').setOrigin(0, 0).setDepth(1).setAngle(270)

        // vehicles
        this.truck = new Truck(this, this.spawnX, this.spawnY, 'truckwidespritesheet', 0).setDepth(2)
        this.cars = []
        this.maxCars = 12
        this.lanes = [
            { x: 1200, y: 345, dir: 'left'},
            { x: 1200, y: 285, dir: 'left'},
            { x: 0, y: 445, dir: 'right'},
            { x: 0, y: 505, dir: 'right'},
            { x: 360, y: 800, dir: 'up'},
            { x: 420, y: 800, dir: 'up'},
            { x: 200, y: 0, dir: 'down'},
            { x: 260, y: 0, dir: 'down'},
        ]
        this.spawnCar()

        // collision objects
        this.stoplight1 = this.add.tileSprite(165, 175, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(0)
        this.stoplight2 = this.add.tileSprite(325, 490, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(0).setFlipX(true)
        this.stoplight3 = this.add.tileSprite(480, 275, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(0).setAngle(90).setFlipY(true)
        this.stoplight4 = this.add.tileSprite(210, 410, 126, 75, 'stoplight').setOrigin(0, 0).setDepth(3).setFrame(0).setAngle(90).setFlipX(true)
        this.stoplights = [this.stoplight1, this.stoplight2, this.stoplight3, this.stoplight4]

        this.crosswalk1 = this.add.tileSprite(440, 290, 55, 230, 'crosswalk').setOrigin(0, 0).setDepth(1)
        this.crosswalk2 = this.add.tileSprite(125, 270, 55, 250, 'crosswalk').setOrigin(0, 0).setDepth(1)
        this.crosswalk3 = this.add.tileSprite(435, 525, 55, 250, 'crosswalk').setOrigin(0, 0).setDepth(1).setAngle(90)
        this.crosswalk4 = this.add.tileSprite(415, 210, 55, 230, 'crosswalk').setOrigin(0, 0).setDepth(1).setAngle(90)

        this.scenecheck1 = this.add.tileSprite(180, 700, 20, 3, 'scenecheck').setOrigin(0, 0).setDepth(1)
        this.scenecheck2 = this.add.tileSprite(265, 700, 20, 3, 'scenecheck').setOrigin(0, 0).setDepth(1)

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    // traffic spawn function
    spawnCar() {
        if (this.cars.length >= this.maxCars) {
            this.time.delayedCall(500, this.spawnCar, [], this)
            return
        }

        let lanes = Phaser.Utils.Array.Shuffle([0,1,2,3,4,5,6,7])
        let lane = null

        for (let laneIndex of lanes) {
            let testLane = this.lanes[laneIndex]
            let blocked = false
            for (let car of this.cars) {
                if (car.y === testLane.y) {
                    if (testLane.dir === 'left' && car.x > 1000) blocked = true
                    if (testLane.dir === 'right' && car.x < 1000) blocked = true
                }
            }
            if (!blocked) {
                lane = testLane
                break
            }
        }

        if (!lane) {
            this.time.delayedCall(400, this.spawnCar, [], this)
            return
        }

        let carTexture = Phaser.Math.RND.pick(['car3','car2','car1'])
        let car = new Car(this, lane.x, lane.y, carTexture, 0, lane.dir, 3)
        this.cars.push(car)

        this.time.delayedCall(
            Phaser.Math.Between(1200, 2500),
            this.spawnCar,
            [],
            this
        )
    }

    // speaks for itself
    resetTruckOnCarCollision() {
        let truck = this.truck

        for (let car of this.cars) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(truck.getBounds(), car.getBounds())) {
                truck.x = this.spawnX
                truck.y = this.spawnY
                return true
            }
        }
        return false
    }

    update(time) {
        this.truckFSM.step()

        // multiple cars check and reset
        for (let i = this.cars.length - 1; i >= 0; i--) {
            let car = this.cars[i]
            car.update()

            if (car.x < -200 || car.x > 1400 || car.y < -100 || car.y > 900) {
                car.destroy()
                this.cars.splice(i, 1)
            }
        }

      this.resetTruckOnCarCollision()

        // conditional scene transition with coords
        if (this.checkCollision(this.truck, this.scenecheck1)) {
            this.scene.start('apartmentScene', { x: 700, y: 200 })
        }
        if (this.checkCollision(this.truck, this.scenecheck2)) {
            this.scene.start('apartmentScene', { x: 760, y: 200 })
        }

        // bug workaround
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.truck.getBounds(), this.arrow.getBounds())) {
            this.arrow.setAlpha(0)
        }
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
}