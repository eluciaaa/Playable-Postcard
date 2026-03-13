// car prefab
class Car extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, direction, speed) {
        super(scene, x, y, texture, frame)

        scene.add.existing(this)

        this.direction = direction
        this.speed = speed
        this.setDepth(2)

        this.isStopped = false
        this.stopTimer = null
        this.moveTimer = null

        // set correct frame + orientation
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
    }

    update() {

        let truck = this.scene.truck
        let shouldStop = false

        // truck collision check
        let xDistTruck = Math.abs(this.x - truck.x)
        let yDistTruck = Math.abs(this.y - truck.y)

        if (this.direction === 'left' && truck.x < this.x && yDistTruck < 30 && xDistTruck < 130) shouldStop = true
        if (this.direction === 'right' && truck.x > this.x && yDistTruck < 30 && xDistTruck < 130) shouldStop = true
        if (this.direction === 'up' && truck.y < this.y && xDistTruck < 30 && yDistTruck < 130) shouldStop = true
        if (this.direction === 'down' && truck.y > this.y && xDistTruck < 30 && yDistTruck < 130) shouldStop = true

        // other car collision check
        for (let other of this.scene.cars) {
            if (other === this) continue

            let xDist = Math.abs(this.x - other.x)
            let yDist = Math.abs(this.y - other.y)

            if (this.direction === 'left' && other.x < this.x && yDist < 30 && xDist < 130) shouldStop = true
            if (this.direction === 'right' && other.x > this.x && yDist < 30 && xDist < 130) shouldStop = true
            if (this.direction === 'up' && other.y < this.y && xDist < 30 && yDist < 130) shouldStop = true
            if (this.direction === 'down' && other.y > this.y && xDist < 30 && yDist < 130) shouldStop = true
        }

        // stoplight collision check
        let stoplights = [this.scene.stoplight1, this.scene.stoplight2, this.scene.stoplight3, this.scene.stoplight4] 
        for (let light of stoplights) { 
            if (!light) continue 

            let xDist = Math.abs(this.x - light.x) 
            let yDist = Math.abs(this.y - light.y) 

            if ((this.direction === 'left' && xDist < 130 && yDist < 100) || 
            (this.direction === 'right' && xDist < 195 && yDist < 100) || 
            (this.direction === 'up' && yDist < 205 && xDist < 100) || 
            (this.direction === 'down' && yDist < 80 && xDist < 100)) { 
                shouldStop = true 
                break 
            } 
        }
        
        // delayed stop / move so it looks more natural
                if (shouldStop) {
                    if (!this.isStopped && !this.stopTimer) {
                        this.stopTimer = this.scene.time.delayedCall(300, () => {
                    this.isStopped = true
                    this.stopTimer = null
                })
            }
        } else {
            if (this.isStopped && !this.moveTimer) {
                this.moveTimer = this.scene.time.delayedCall(100, () => {
                    this.isStopped = false
                    this.moveTimer = null
                })
            }
        }

        // movement
        if (!this.isStopped) {
            if (this.direction === 'left') this.x -= this.speed
            else if (this.direction === 'right') this.x += this.speed
            else if (this.direction === 'up') this.y -= this.speed
            else if (this.direction === 'down') this.y += this.speed
        }

        // screen wrap
        if (this.x < -100) this.x = 1100
        if (this.x > 1100) this.x = -100
        if (this.y < -100) this.y = 900
        if (this.y > 900) this.y = -100
    }
}