// truck prefab
class Truck extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Truck to existing scene

        // initialize state machine managing truck (initial state, possible states, state args[])
        scene.truckFSM = new StateMachine('stop', {
            stop: new StopState(),
            drive: new DriveState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// state classes
class StopState extends State {
    enter(scene, truck) {
    }
    execute(scene, truck) {
        if (
            scene.cursors.left.isDown ||
            scene.cursors.right.isDown ||
            scene.cursors.up.isDown ||
            scene.cursors.down.isDown
        ) {
            this.stateMachine.transition('drive')
        }
    }
}

class DriveState extends State {
    execute(scene, truck) {
        const speed = 2.5
        let moving = false

        if (scene.cursors.left.isDown) {
            truck.setFrame(0)
            truck.setFlipX(false)
            truck.setFlipY(false)
            truck.x -= speed
            moving = true
        }
        else if (scene.cursors.right.isDown) {
            truck.setFrame(0)
            truck.setFlipX(true)
            truck.setFlipY(false)
            truck.x += speed
            moving = true
        }
        else if (scene.cursors.down.isDown) {
            truck.setFrame(1)
            truck.setFlipX(false)
            truck.setFlipY(false)
            truck.y += speed
            moving = true
        }
        else if (scene.cursors.up.isDown) {
            truck.setFrame(1)
            truck.setFlipX(false)
            truck.setFlipY(true)
            truck.y -= speed
            moving = true
        }
        if (!moving) {
            this.stateMachine.transition('stop')
        }
    }
}