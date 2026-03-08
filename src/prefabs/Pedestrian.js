// pedestrian prefab
class Pedestrian extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Pedestrian to existing scene

        // initialize state machine managing pedestrian (initial state, possible states, state args[])
        scene.pedestrianFSM = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// state classes
class IdleState extends State {
    enter(scene, pedestrian) {
        //pedestrian.anims.play(`idle`)
    }
}

class WalkState extends State {
    enter(scene, pedestrian) {
        //pedestrian.anims.play(`walk`)
    }
}