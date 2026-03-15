// car prefab
class Car extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction, speed) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setDepth(2)

        this.direction = direction
        this.speed = speed

        this.body.setSize(60, 30)
        this.body.setOffset(20, 15)

        this.updateHitbox()
        this.setCollideWorldBounds(false)

        // orientation
        if (direction == 'left') {
            this.setFrame(0)
            this.setFlipX(false)
            this.setFlipY(false)
        }

        if (direction == 'right') {
            this.setFrame(0)
            this.setFlipX(true)
            this.setFlipY(false)
        }

        if (direction == 'up') {
            this.setFrame(1)
            this.setFlipX(false)
            this.setFlipY(true)
        }

        if (direction == 'down') {
            this.setFrame(1)
            this.setFlipX(false)
            this.setFlipY(false)
        }

        this.updateHitbox()

        this.carFSM = new StateMachine('drive', {
            drive: new CarDriveState(),
            stop: new CarStopState(),
        }, [scene, this])
    }

    updateHitbox() {
        // sideways
        if (this.frame.name === 0) {
            this.body.setSize(45, 20)
            this.body.setOffset(7, 13)
        }

        // vertical
        if (this.frame.name === 1) {
            this.body.setSize(20, 45)
            this.body.setOffset(19, 7)
        }
    }

    update() {
        this.carFSM.step()

        // screen wrap
        if (this.x < -100) this.x = 1100
        if (this.x > 1100) this.x = -100
        if (this.y < -100) this.y = 900
        if (this.y > 900) this.y = -100
    }

    detectHazard() {

        let truck = this.scene.truck

        let xDistTruck = Math.abs(this.x - truck.x)
        let yDistTruck = Math.abs(this.y - truck.y)

        // truck check
        if (this.direction === 'left' && truck.x < this.x && yDistTruck < 30 && xDistTruck < 130) return true
        if (this.direction === 'right' && truck.x > this.x && yDistTruck < 30 && xDistTruck < 130) return true
        if (this.direction === 'up' && truck.y < this.y && xDistTruck < 30 && yDistTruck < 130) return true
        if (this.direction === 'down' && truck.y > this.y && xDistTruck < 30 && yDistTruck < 130) return true

        // other car check
        for (let other of this.scene.cars) {

            if (other === this) continue

            let xDist = Math.abs(this.x - other.x)
            let yDist = Math.abs(this.y - other.y)

            if (this.direction === 'left' && other.x < this.x && yDist < 30 && xDist < 130) return true
            if (this.direction === 'right' && other.x > this.x && yDist < 30 && xDist < 130) return true
            if (this.direction === 'up' && other.y < this.y && xDist < 30 && yDist < 130) return true
            if (this.direction === 'down' && other.y > this.y && xDist < 30 && yDist < 130) return true
        }

        // stoplight check
        let stoplights = [
            this.scene.stoplight1,
            this.scene.stoplight2,
            this.scene.stoplight3,
            this.scene.stoplight4
        ]

        for (let light of stoplights) {

            if (!light) continue

            let xDist = Math.abs(this.x - light.x)
            let yDist = Math.abs(this.y - light.y)

            if (
                (this.direction === 'left' && xDist < 130 && yDist < 100) ||
                (this.direction === 'right' && xDist < 195 && yDist < 100) ||
                (this.direction === 'up' && yDist < 205 && xDist < 100) ||
                (this.direction === 'down' && yDist < 80 && xDist < 100)
            ) {
                return true
            }
        }

        return false
    }
}


// state classes
class CarDriveState extends State {

    execute(scene, car) {

        if (car.detectHazard()) {
            this.stateMachine.transition('stop')
            return
        }

        if (car.direction === 'left') car.x -= car.speed
        else if (car.direction === 'right') car.x += car.speed
        else if (car.direction === 'up') car.y -= car.speed
        else if (car.direction === 'down') car.y += car.speed
    }
}

class CarStopState extends State {

    execute(scene, car) {

        if (!car.detectHazard()) {
            this.stateMachine.transition('drive')
        }
    }
}