// pedestrian prefab
class Pedestrian extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, path, speed = 0.75) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setDepth(2)

        this.path = path
        this.speed = speed

        this.stepIndex = 0
        this.startX = x
        this.startY = y

        this.distanceTravelled = 0

        this.direction = path[0].dir
        this.distance = path[0].dist

        this.body.setCircle(20)
        this.body.setOffset(0, 5)

        this.setCollideWorldBounds(false)

        // create animation once
        if (!scene.anims.exists('pedWalk')) {
            scene.anims.create({
                key: 'pedWalk',
                frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            })
        }

        // start walking animation
        this.anims.play('pedWalk', true)

        // set initial facing direction
        this.setDirectionVisual()
    }

    setDirectionVisual() {

        // reset rotation and flip
        this.setRotation(0)
        this.setFlipX(false)

        if (this.direction === 'left') {
            // default sprite orientation
        }

        if (this.direction === 'right') {
            this.setFlipX(true)
        }

        if (this.direction === 'up') {
            this.setRotation(90)
        }

        if (this.direction === 'down') {
            this.setRotation(-90)
        }
    }

    update() {

        let moved = 0

        if (this.direction === 'left') {
            this.x -= this.speed
            moved = this.speed
        }

        if (this.direction === 'right') {
            this.x += this.speed
            moved = this.speed
        }

        if (this.direction === 'up') {
            this.y -= this.speed
            moved = this.speed
        }

        if (this.direction === 'down') {
            this.y += this.speed
            moved = this.speed
        }

        this.distanceTravelled += moved

        if (this.x < -100) {
            this.x = 1100
            this.startX = this.x
        }

        if (this.x > 1100) {
            this.x = -100
            this.startX = this.x
        }

        if (this.y < -100) {
            this.y = 900
            this.startY = this.y
        }

        if (this.y > 900) {
            this.y = -100
            this.startY = this.y
        }

        // check if current step finished
        if (this.distanceTravelled >= this.distance) {

            // snap position to exact endpoint
            if (this.direction === 'left') this.x = this.startX - this.distance
            if (this.direction === 'right') this.x = this.startX + this.distance
            if (this.direction === 'up') this.y = this.startY - this.distance
            if (this.direction === 'down') this.y = this.startY + this.distance

            this.stepIndex++

            if (this.stepIndex >= this.path.length) {
                this.stepIndex = 0
            }

            let nextStep = this.path[this.stepIndex]

            this.direction = nextStep.dir
            this.distance = nextStep.dist

            this.distanceTravelled = 0

            this.startX = this.x
            this.startY = this.y

            this.setDirectionVisual()
        }
    }
}