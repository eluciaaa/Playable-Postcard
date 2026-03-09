'use strict'

const config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    resolution: window.devicePixelRatio,
    pixelArt: true,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [ Envelope, PostOffice, River, Apartment ],
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
}

let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 45
let borderPadding = borderUISize / 3

let keyLEFT, keyRIGHT, keyDOWN, keyUP