class River extends Phaser.Scene {
    constructor() {
        super('riverScene')
    }

    create(data) {
        // music
        if (!this.sound.get('bgmusic')) {
            this.bgm = this.sound.add('bgmusic', { volume: 0.3, loop: true })
            this.bgm.play()
        }

        // background
        this.letterbg = this.add.tileSprite(0, 0, 1200, 800, 'letterbg').setOrigin(0,0).setDepth(0)
        this.river = this.add.tileSprite(100, 105, 1000, 600, 'river').setOrigin(0,0).setDepth(0)

        // ui
        this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0,0).setDepth(3)

        // player
        this.spawnX = data.x
        this.spawnY = data.y
        this.truck = new Truck(this, this.spawnX, this.spawnY, 'truckwidespritesheet', 0)

        // disable collisions at spawn
        this.truck.body.checkCollision.none = true
        // enable collisions after 1 second
        this.time.delayedCall(1000, () => {
            this.truck.body.checkCollision.none = false
        })

        // map barriers
        this.barrier1 = this.add.rectangle(600, 185, 1000, 150, 0x6666ff).setAlpha(0)
        this.physics.add.existing(this.barrier1, true)
        this.barrier2 = this.add.rectangle(600, 615, 1000, 175, 0x6666ff).setAlpha(0)
        this.physics.add.existing(this.barrier2, true)

        // physics groups
        this.carGroup = this.physics.add.group()
        this.pedestrianGroup = this.physics.add.group()

        // cars
        this.cars = []
        this.maxCars = 10
        this.lanes = [
            { x:1200, y:345, dir:'left' },
            { x:1200, y:285, dir:'left' },
            { x:0, y:445, dir:'right' },
            { x:0, y:505, dir:'right' }
        ]
        this.carGroup.addMultiple(this.cars)

        // pedestrians
        this.pedestrians = [
            new Pedestrian(this, 100, 230, 'pedestrian', [{dir:'right', dist:Infinity}]),
            new Pedestrian(this, 400, 525, 'pedestrian', [{dir:'left', dist:Infinity}]),
            new Pedestrian(this, 1100, 525, 'pedestrian', [{dir:'left', dist:Infinity}])
        ]
        this.pedestrianGroup.addMultiple(this.pedestrians)

        // scene transitions
        this.scenecheck1 = this.physics.add.staticSprite(100, 280, 'scenecheck').setAlpha(0)
        this.scenecheck1.body.setSize(3, 20)
        this.scenecheck2 = this.physics.add.staticSprite(100, 340, 'scenecheck').setAlpha(0)
        this.scenecheck2.body.setSize(3, 20)

        // physics collisions
        this.physics.add.overlap(this.truck, this.carGroup, () => {
            this.truck.setPosition(this.spawnX, this.spawnY)
            this.truck.body.checkCollision.none = true
            this.time.delayedCall(3000, () => this.truck.body.checkCollision.none = false)
        })
        this.physics.add.overlap(this.truck, this.pedestrianGroup, () => {
            this.truck.setPosition(this.spawnX, this.spawnY)
            this.truck.body.checkCollision.none = true
            this.time.delayedCall(3000, () => this.truck.body.checkCollision.none = false)
        })
        this.physics.add.overlap(this.truck, this.barrier1, () => {
            this.truck.setPosition(this.spawnX, this.spawnY)
            this.truck.body.checkCollision.none = true
            this.time.delayedCall(3000, () => this.truck.body.checkCollision.none = false)
        })
        this.physics.add.overlap(this.truck, this.barrier2, () => {
            this.truck.setPosition(this.spawnX, this.spawnY)
            this.truck.body.checkCollision.none = true
            this.time.delayedCall(3000, () => this.truck.body.checkCollision.none = false)
        })
        this.physics.add.overlap(this.truck, this.scenecheck1, () => {
            this.scene.start('intersectionScene',{x:1100, y:270})
        })
        this.physics.add.overlap(this.truck, this.scenecheck2, () => {
            this.scene.start('intersectionScene',{x:1100, y:330})
        })

        this.cursors = this.input.keyboard.createCursorKeys()

        // start traffic
        this.spawnCar()
    }

    // traffic spawner function
    spawnCar() {

        if (this.cars.length >= this.maxCars) {
            this.time.delayedCall(500, this.spawnCar, [], this)
            return
        }

        let lanes = Phaser.Utils.Array.Shuffle([0, 1, 2, 3])
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

        if (!lane) {
            this.time.delayedCall(400, this.spawnCar, [], this)
            return
        }

        let carTexture = Phaser.Math.RND.pick(['car3', 'car2', 'car1'])
        let car = new Car(this, lane.x, lane.y, carTexture, 0, lane.dir, 3)

        this.cars.push(car)
        this.carGroup.add(car)

        this.time.delayedCall(
            Phaser.Math.Between(1200, 2500),
            this.spawnCar,
            [],
            this
        )
    }

    update() {
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
    }
}