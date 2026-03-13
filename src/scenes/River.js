class River extends Phaser.Scene {
    constructor() {
        super('riverScene')
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
        this.river = this.add.tileSprite(100, 105, 1000, 600, 'river').setOrigin(0, 0).setDepth(0)

        // ui
        this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0, 0).setDepth(3)

        // player and collision objects
        this.truck = new Truck(this, this.spawnX, this.spawnY, 'truckwidespritesheet', 0)
        this.scenecheck1 = this.add.tileSprite(100, 260, 3, 20, 'scenecheck').setOrigin(0, 0).setDepth(1)
        this.scenecheck2 = this.add.tileSprite(100, 340, 3, 20, 'scenecheck').setOrigin(0, 0).setDepth(1)
        this.cars = []
        this.maxCars = 10
        this.lanes = [
            { x: 1200, y: 345, dir: 'left' },
            { x: 1200, y: 285, dir: 'left' },
            { x: 0, y: 445, dir: 'right' },
            { x: 0, y: 505, dir: 'right' }
        ]
        this.spawnCar()

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    // traffic spawn function
    spawnCar() {

        if (this.cars.length >= this.maxCars) {
            this.time.delayedCall(500, this.spawnCar, [], this)
            return
        }

        let lanes = Phaser.Utils.Array.Shuffle([0,1,2,3])
        let lane = null

        for (let laneIndex of lanes) {

            let testLane = this.lanes[laneIndex]
            let blocked = false

            for (let car of this.cars) {

                if (car.y === testLane.y) {

                    if (testLane.dir === 'left' && car.x > 1000) blocked = true
                    if (testLane.dir === 'right' && car.x < 200) blocked = true
                }
            }

            if (!blocked) {
                lane = testLane
                break
            }
        }

        // if all lanes blocked, try again later
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

    update() {
        this.truckFSM.step()

        // multiple cars check and reset
        for (let i = this.cars.length - 1; i >= 0; i--) {

            let car = this.cars[i]
            car.update()

            if (car.x < -200 || car.x > 1400) {
                car.destroy()
                this.cars.splice(i, 1)
            }
        }

        this.resetTruckOnCarCollision()

            // conditional scene transition with coords
        if (this.checkCollision(this.truck, this.scenecheck1)) {
            this.scene.start('intersectionScene', { x: 1100, y: 270 })
        }
        if (this.checkCollision(this.truck, this.scenecheck2)) {
            this.scene.start('intersectionScene', { x: 1100, y: 330 })
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