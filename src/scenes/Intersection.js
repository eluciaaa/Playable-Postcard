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

        // background
        this.letterbg = this.add.tileSprite(0,0,1200,800,'letterbg').setOrigin(0,0).setDepth(0)
        this.intersection = this.add.tileSprite(100,105,1000,600,'intersection').setOrigin(0,0).setDepth(1)

        // ui
        this.cover = this.add.tileSprite(0,0,1200,800,'cover').setOrigin(0,0).setDepth(3)
        this.arrow = this.physics.add.staticSprite(230,620,'arrow').setDepth(1).setAngle(270)
        this.arrow.body.setSize(150,150)

        // player
        this.spawnX = data.x
        this.spawnY = data.y
        this.truck = new Truck(this,this.spawnX,this.spawnY,'truckwidespritesheet',0).setDepth(2)

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
        this.cars = []
        this.maxCars = 12
        this.lanes = [
            { x:1200, y:345, dir:'left'},
            { x:1200, y:285, dir:'left'},
            { x:0, y:445, dir:'right'},
            { x:0, y:505, dir:'right'},
            { x:360, y:800, dir:'up'},
            { x:420, y:800, dir:'up'},
            { x:200, y:0, dir:'down'},
            { x:260, y:0, dir:'down'}
        ]
        this.carGroup.addMultiple(this.cars)

        // pedestrians
        this.pedestrians = []
        let ped1 = new Pedestrian(this,100,217,'pedestrian',[{dir:'right',dist:Infinity}])
        let ped2 = new Pedestrian(this,700,225,'pedestrian',[
            {dir:'left',dist:240},
            {dir:'down',dist:300},
            {dir:'left',dist:Infinity}
        ])
        let ped3 = new Pedestrian(this,1100,525,'pedestrian',[{dir:'left',dist:Infinity}])
        let ped4 = new Pedestrian(this,150,400,'pedestrian',[{dir:'down',dist:Infinity}])
        let ped5 = new Pedestrian(this,480,550,'pedestrian',[
            {dir:'up',dist:340},
            {dir:'left',dist:340},
            {dir:'down',dist:340},
            {dir:'right',dist:340},
        ])
        this.pedestrians.push(ped1,ped2,ped3,ped4,ped5)
        this.pedestrianGroup.addMultiple(this.pedestrians)

        // stoplights
        this.stoplight1 = this.add.tileSprite(165,175,126,75,'stoplight').setOrigin(0,0).setDepth(3).setFrame(0)
        this.stoplight2 = this.add.tileSprite(325,490,126,75,'stoplight').setOrigin(0,0).setDepth(3).setFrame(0).setFlipX(true)
        this.stoplight3 = this.add.tileSprite(480,275,126,75,'stoplight').setOrigin(0,0).setDepth(3).setFrame(0).setAngle(90).setFlipY(true)
        this.stoplight4 = this.add.tileSprite(210,410,126,75,'stoplight').setOrigin(0,0).setDepth(3).setFrame(0).setAngle(90).setFlipX(true)
        this.stoplights = [this.stoplight1,this.stoplight2,this.stoplight3,this.stoplight4]

        // crosswalks
        this.crosswalk1 = this.add.tileSprite(440,290,55,230,'crosswalk').setOrigin(0,0).setDepth(1)
        this.crosswalk2 = this.add.tileSprite(125,270,55,250,'crosswalk').setOrigin(0,0).setDepth(1)
        this.crosswalk3 = this.add.tileSprite(435,525,55,250,'crosswalk').setOrigin(0,0).setDepth(1).setAngle(90)
        this.crosswalk4 = this.add.tileSprite(415,210,55,230,'crosswalk').setOrigin(0,0).setDepth(1).setAngle(90)

        // scene transitions
        this.scenecheck1 = this.physics.add.staticSprite(200,700,'scenecheck').setOrigin(0,0).setDepth(1)
        this.scenecheck1.body.setSize(20,3)
        this.scenecheck2 = this.physics.add.staticSprite(260,700,'scenecheck').setOrigin(0,0).setDepth(1)
        this.scenecheck2.body.setSize(20,3)

        // physics collisions
        this.physics.add.overlap(this.truck,this.scenecheck1, () => {
            this.scene.start('apartmentScene',{x:700,y:200}),null,this
        })
        this.physics.add.overlap(this.truck,this.scenecheck2, () => {
            this.scene.start('apartmentScene',{x:760,y:200}),null,this
        })
        this.physics.add.overlap(this.truck,this.carGroup, () => {
            this.truck.setPosition(this.spawnX,this.spawnY)
        })
        this.physics.add.overlap(this.truck,this.pedestrianGroup,  () => {
            this.truck.setPosition(this.spawnX,this.spawnY)
        })
        this.physics.add.overlap(this.truck, this.arrow, () => {
            this.arrow.setAlpha(0)
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

        let lanes = Phaser.Utils.Array.Shuffle([0,1,2,3,4,5,6,7])
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

        let carTexture = Phaser.Math.RND.pick(['car3','car2','car1'])
        let car = new Car(this, lane.x, lane.y, carTexture, 0, lane.dir, 3)

        this.cars.push(car)
        this.carGroup.add(car)

        this.time.delayedCall(
            Phaser.Math.Between(1200,2500),
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