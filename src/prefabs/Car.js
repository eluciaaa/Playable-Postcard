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
        if (direction === 'left') {
            this.setFrame(0)
            this.setFlipX(false)
            this.setFlipY(false)
        } else if (direction === 'right') {
            this.setFrame(0)
            this.setFlipX(true)
            this.setFlipY(false)
        } else if (direction === 'up') {
            this.setFrame(1)
            this.setFlipX(false)
            this.setFlipY(true)
        } else if (direction === 'down') {
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
        if (this.frame.name === 0) {
            this.body.setSize(45, 20)
            this.body.setOffset(7, 13)
        }
        else if (this.frame.name === 1) {
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

    // function to detect and stop for hazards
    detectHazard() {
        const truck = this.scene.truck
        const xDistTruck = Math.abs(this.x - truck.x)
        const yDistTruck = Math.abs(this.y - truck.y)

        // truck collision check
        if (this.direction === 'left' && truck.x < this.x && yDistTruck < 30 && xDistTruck < 130) return true
        if (this.direction === 'right' && truck.x > this.x && yDistTruck < 30 && xDistTruck < 130) return true
        if (this.direction === 'up' && truck.y < this.y && xDistTruck < 30 && yDistTruck < 130) return true
        if (this.direction === 'down' && truck.y > this.y && xDistTruck < 30 && yDistTruck < 130) return true

        // other cars
        for (let other of this.scene.cars) {
            if (other === this) continue
            const xDist = Math.abs(this.x - other.x)
            const yDist = Math.abs(this.y - other.y)
            if (this.direction === 'left' && other.x < this.x && yDist < 30 && xDist < 80) return true
            if (this.direction === 'right' && other.x > this.x && yDist < 30 && xDist < 80) return true
            if (this.direction === 'up' && other.y < this.y && xDist < 30 && yDist < 80) return true
            if (this.direction === 'down' && other.y > this.y && xDist < 30 && yDist < 80) return true
        }

        // pedestrian check
        for (let ped of this.scene.pedestrians) {
            const xDist = Math.abs(this.x - ped.x)
            const yDist = Math.abs(this.y - ped.y)
            if (this.direction === 'left' && ped.x < this.x && yDist < 30 && xDist < 75) return true
            if (this.direction === 'right' && ped.x > this.x && yDist < 30 && xDist < 75) return true
            if (this.direction === 'up' && ped.y < this.y && xDist < 30 && yDist < 75) return true
            if (this.direction === 'down' && ped.y > this.y && xDist < 30 && yDist < 75) return true
        }
    }
}``

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