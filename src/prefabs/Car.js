// car prefab
class Car extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Car to existing scene

        // initialize state machine managing car (initial state, possible states, state args[])
        scene.carFSM = new StateMachine('stop', {
            stop: new CarStopState(),
            drive: new CarDriveState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// state classes
class CarStopState extends State {
    enter(scene, car) {
        //car.anims.play(`stop`)
    }
}

class CarDriveState extends State {
    enter(scene, car) {
        //car.anims.play(`drive`)
    }
}