// Abigail Chase
// You've Got Mail!
// It took around 45 hours
// No specfic code was taken from anywhere, but the traffic system for cars was inspired by
// the code found in this article: https://learn.yorkcs.com/2019/02/08/build-a-space-shooter-with-phaser-3-4/
// and the tween code in Postcard.js was adapted from Phaser tween documentation:
// https://docs.phaser.io/phaser/concepts/tweens
// Phaser major components found in this game:
// physics systems: the player truck, every car, every pedestrian, every crosswalk, and every
// map barrier has a custom physics collision mask and it is used for almost every collision check
// text objects: Envelope.js, PostOffice.js and Postcard.js contain text objects
// animation manager: pedestrians use a 4 frame walking animation and the beginning of
// Postcard.js plays a 5 frame animation to transition into the last postcard
// tween manager: tween is used briefly in Postcard.js to slowly fade text in
// timers: timers are used often to apply infinity frames to the player upon getting reset,
// as well as setting a cooldown before cars spawn
// tilemaps: most of my assets are loaded through tilemaps
// creative tilt: I thought my idea of the player delivering their postcard to themselves was
// clever. My recipient works at the UPS store, so the player using a UPS truck to deliver it
// works twice as well. The final postcard at the end was my recreation of a beautiful photo
// of the sea he took himself.
// I've included a debug menu in Envelope.js (the intro scene) that allows graders to quickly
// view scenes using the number keys, however, the truck spawn will glitch because it
// takes info from the previous scene as its spawn point (to be lane specific)

'use strict'

const config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    resolution: window.devicePixelRatio,
    pixelArt: true,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [ Envelope, PostOffice, Downtown, River, Intersection, Apartment, Postcard ],
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