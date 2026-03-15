class Downtown extends Phaser.Scene {
    constructor() {
        super('downtownScene')
    }

    create() {
        // music
        this.bgm = this.sound.add('bgmusic', { 
            volume: 0.3, 
            loop: true 
        })
        this.bgm.play()


        // background
        this.letterbg = this.add.tileSprite(0,0,1200,800,'letterbg').setOrigin(0,0).setDepth(0)
        this.downtown = this.add.tileSprite(100,105,1000,600,'downtown').setOrigin(0,0).setDepth(1)

        // ui
        this.cover = this.add.tileSprite(0,0,1200,800,'cover').setOrigin(0,0).setDepth(3)

        // player
        this.spawnX = 1060
        this.spawnY = 270
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
            new Pedestrian(this,100,230,'pedestrian',[{dir:'right',dist:Infinity}]),
            new Pedestrian(this,525,525,'pedestrian',[{dir:'left',dist:Infinity}]),
            new Pedestrian(this,1000,525,'pedestrian',[{dir:'left',dist:Infinity}])
        ]
        this.pedestrianGroup.addMultiple(this.pedestrians)

        // scene transitions
        this.scenecheck1 = this.physics.add.staticSprite(100,280,'scenecheck').setAlpha(0)
        this.scenecheck1.body.setSize(3,20)
        this.scenecheck2 = this.physics.add.staticSprite(100,340,'scenecheck').setAlpha(0)
        this.scenecheck2.body.setSize(3,20)

        // physics collisions
        this.physics.add.overlap(this.truck,this.carGroup, () => {
            this.truck.setPosition(this.spawnX,this.spawnY)
        })
        this.physics.add.overlap(this.truck,this.pedestrianGroup, () => {
            this.truck.setPosition(this.spawnX,this.spawnY)
        })
        this.physics.add.overlap(this.truck,this.scenecheck1, () => {
            this.scene.start('riverScene',{x:1100,y:270})
        })
        this.physics.add.overlap(this.truck,this.scenecheck2, () => {
            this.scene.start('riverScene',{x:1100,y:330})
        })

        this.cursors = this.input.keyboard.createCursorKeys()

        // start traffic
        this.spawnCar()
    }

    // traffic spawner function
    spawnCar() {

        if(this.cars.length >= this.maxCars){
            this.time.delayedCall(500,this.spawnCar,[],this)
            return
        }

        let lane = Phaser.Utils.Array.GetRandom(this.lanes)

        let carTexture = Phaser.Math.RND.pick(['car1','car2','car3'])
        let car = new Car(this,lane.x,lane.y,carTexture,0,lane.dir,3)

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