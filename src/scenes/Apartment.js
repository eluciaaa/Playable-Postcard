class Apartment extends Phaser.Scene {
    constructor() {
        super('apartmentScene')
    }

    create(data) { 
        // music
        if (!this.sound.get('bgmusic')) {
            this.bgm = this.sound.add('bgmusic', { volume: 0.3, loop: true })
            this.bgm.play()
        }

        // background
        this.letterbg = this.add.tileSprite(0, 0, 2000, 800, 'letterbg').setOrigin(0,0).setDepth(0)
        this.apartment = this.add.tileSprite(100, 105, 1000, 600, 'apartment').setOrigin(0,0).setDepth(0)

        // ui
        this.cover = this.add.tileSprite(0, 0, 1200, 800, 'cover').setOrigin(0,0).setDepth(3)
        this.arrow = this.physics.add.staticSprite(350, 480, 'arrow').setDepth(1)
        this.arrow.body.setSize(150, 150)

        // player
        this.spawnX = data.x
        this.spawnY = data.y
        this.truck = new Truck(this, this.spawnX, this.spawnY, 'truckwidespritesheet', 1).setDepth(2)

        // disable collisions at spawn
        this.truck.body.checkCollision.none = true
        // enable collisions after 1 second
        this.time.delayedCall(1000, () => {
            this.truck.body.checkCollision.none = false
        })

        // map barriers
        this.barrier1 = this.add.rectangle(385, 220, 550, 200, 0x6666ff).setAlpha(0)
        this.physics.add.existing(this.barrier1, true)
        this.barrier2 = this.add.rectangle(600, 630, 1000, 175, 0x6666ff).setAlpha(0)
        this.physics.add.existing(this.barrier2, true)
        this.barrier3 = this.add.rectangle(1030, 400, 150, 1000, 0x6666ff).setAlpha(0)
        this.physics.add.existing(this.barrier3, true)

        // physics groups
        this.carGroup = this.physics.add.group()
        this.pedestrianGroup = this.physics.add.group()

        // cars
        this.cars = [
            new Car(this, 400, 270, 'car3', 1),
            new Car(this, 580, 270, 'car1', 1),
            new Car(this, 460, 270, 'car2', 1),
            new Car(this, 540, 150, 'car3', 1),
        ]
        this.maxCars = 8
        this.lanes = [
            { x:860, y:800, dir:'up'},
            { x:920, y:800, dir:'up'},
            { x:700, y:0, dir:'down'},
            { x:760, y:0, dir:'down'},
        ]
        this.carGroup.addMultiple(this.cars)

        // pedestrians
        this.pedestrians = []
        let ped1 = new Pedestrian(this, 100, 300, 'pedestrian', [
            {dir:'right', dist:860},
            {dir:'up', dist:200},
            {dir:'down', dist:200},
            {dir:'left', dist:860},
        ])
        let ped2 = new Pedestrian(this, 975, 800, 'pedestrian', [{dir:'up', dist:Infinity}])
        let ped3 = new Pedestrian(this, 500, 300, 'pedestrian',[
            {dir:'right', dist:450},
            {dir:'down', dist:Infinity},
        ])
        let ped4 = new Pedestrian(this, 650, 200, 'pedestrian', [{dir:'down', dist:Infinity}])
        let ped5 = new Pedestrian(this, 650, 300, 'pedestrian',[
            {dir:'down', dist:250},
            {dir:'right', dist:330},
            {dir:'up', dist:250},
            {dir:'left', dist:330},
        ])
        this.pedestrians.push(ped1, ped2, ped3, ped4, ped5)
        this.pedestrianGroup.addMultiple(this.pedestrians)

        // stoplights
        this.stoplight1 = this.add.tileSprite(670, 260, 126, 75, 'stoplight').setOrigin(0,0).setDepth(3).setFrame(1)
        this.stoplight2 = this.add.tileSprite(825, 490, 126, 75,'stoplight').setOrigin(0,0).setDepth(3).setFrame(1).setFlipX(true)
        this.stoplights = [this.stoplight1, this.stoplight2]

        // crosswalks
        this.crosswalk1 = this.physics.add.staticImage(625, 345, 'crosswalk').setOrigin(0,0).setDepth(1).setDisplaySize(55, 180)
        this.crosswalk1.refreshBody()
        this.crosswalk2 = this.physics.add.staticImage(938, 523, 'crosswalk').setOrigin(0,0).setDepth(1).setAngle(90).setDisplaySize(55, 255)
        this.crosswalk2.refreshBody()
        this.crosswalk2.body.setSize(260, 55).setOffset(-260, 0)
        this.crosswalk3 = this.physics.add.staticImage(938, 289, 'crosswalk').setOrigin(0,0).setDepth(1).setAngle(90).setDisplaySize(55, 255)
        this.crosswalk3.refreshBody()
        this.crosswalk3.body.setSize(260, 55).setOffset(-260, 0)

        // scene transitions
        this.finish = this.physics.add.staticSprite(220, 485, 'finish').setDepth(1)
        this.finish.body.setSize(80, 64)

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
        this.physics.add.overlap(this.truck, this.barrier3, () => {
            this.truck.setPosition(this.spawnX, this.spawnY)
            this.truck.body.checkCollision.none = true
            this.time.delayedCall(3000, () => this.truck.body.checkCollision.none = false)
        })
        this.physics.add.overlap(this.truck, this.finish, () => {
            this.scene.start('postcardScene')
        })
        this.physics.add.overlap(this.truck, this.arrow, () => {
            this.arrow.setAlpha(0)
        })

        this.cursors = this.input.keyboard.createCursorKeys()

        // start traffic
        this.spawnCar()
    }

    // traffic spawn function
    spawnCar() {

        if (this.cars.length >= this.maxCars) {
            this.time.delayedCall(500, this.spawnCar, [], this)
            return
        }

        let lanes = Phaser.Utils.Array.Shuffle([0, 1, 2, 3])
        let lane = null

        for (let laneIndex of lanes) {
            let testLane = this.lanes[laneIndex]

            let blocked = this.cars.some(car =>
                car.y === testLane.y &&
                (
                    (testLane.dir === 'left' && car.x > 1000) ||
                    (testLane.dir === 'right' && car.x < 1000)
                )
            )

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

    // change stoplight color function
    updateStopLight(crosswalk, stoplight) {
        let pedestrianOnCrosswalk = false
        this.pedestrianGroup.children.iterate(ped => {
            if (this.physics.overlap(ped, crosswalk)) {
                pedestrianOnCrosswalk = true
            }
        })
        if (pedestrianOnCrosswalk) {
            stoplight.setFrame(0)
        } else {
            stoplight.setFrame(1)
        }
    }

    update() {
        this.truckFSM.step()

        this.updateStopLight(this.crosswalk3, this.stoplight1)
        this.updateStopLight(this.crosswalk2, this.stoplight2)

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