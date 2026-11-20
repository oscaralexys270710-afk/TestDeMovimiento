namespace SpriteKind {
    export const Zombie = SpriteKind.create()
}
function Pasteador () {
    for (let index = 0; index < 4800; index++) {
        Random_X = randint(0, 199)
        Random_Y = randint(0, 199)
        tileUtil.coverTile(tiles.getTileLocation(Random_X, Random_Y), assets.tile`Pasto1`)
    }
    for (let index = 0; index < 4800; index++) {
        Random_X = randint(0, 199)
        Random_Y = randint(0, 199)
        tileUtil.coverTile(tiles.getTileLocation(Random_X, Random_Y), assets.tile`Pasto2`)
    }
    for (let index = 0; index < 2000; index++) {
        Random_X = randint(0, 199)
        Random_Y = randint(0, 199)
        tileUtil.coverTile(tiles.getTileLocation(Random_X, Random_Y), assets.tile`Flores`)
    }
}
function Arboleador () {
    for (let index = 0; index < 1000; index++) {
        Random_X = randint(0, 199)
        Random_Y = randint(0, 199)
        tiles.setTileAt(tiles.getTileLocation(Random_X, Random_Y), assets.tile`Arbol`)
    }
    tileUtil.setWalls(assets.tile`Arbol`, true)
}
browserEvents.onMouseMove(function (x, y) {
    MauseX = x
    MauseY = y
})
let locationTiles: tiles.Location[] = []
let ZombiePocicion: tiles.Location = null
let MauseY = 0
let MauseX = 0
let Random_Y = 0
let Random_X = 0
let Zombie: Sprite = null
scene.setBackgroundColor(6)
tiles.setCurrentTilemap(tilemap`Bosque`)
Pasteador()
Arboleador()
for (let index = 0; index < 70; index++) {
    Zombie = sprites.create(img`
        . . . . f f f f f f f . . . . . 
        . . . f 7 7 7 7 7 7 7 f . . . . 
        . . . f 7 7 f f f f f . . . . . 
        . . . . f f 7 8 8 8 f . . . . . 
        . . . f 8 7 7 f f f f f . . . . 
        . . f 8 8 8 f 2 7 7 7 7 f . . . 
        . . f 8 8 f 4 7 7 7 7 7 7 f . . 
        . . f 8 8 f 4 7 7 7 7 7 7 f . . 
        . . f 7 7 f 2 7 7 7 7 7 7 f . . 
        . . f 8 7 f 4 7 7 7 7 7 7 f . . 
        . . f 8 8 8 f 4 2 7 7 7 f . . . 
        . . . f 8 8 7 f f f f f . . . . 
        . . . . f f 7 8 7 8 f . . . . . 
        . . . f 7 7 f f f f f . . . . . 
        . . . f 7 7 7 7 7 7 7 f . . . . 
        . . . . f f f f f f f . . . . . 
        `, SpriteKind.Zombie)
    tiles.placeOnRandomTile(Zombie, assets.tile`PastoVacio`)
    sprites.setDataBoolean(Zombie, "Moverse", true)
}
let Jugador = sprites.create(img`
    . . . . f f f f f f f . . . . . 
    . . . f d d d d d d d f . . . . 
    . . . f d d f f f f f . . . . . 
    . . . . f f 8 8 8 8 f . . . . . 
    . . . f 8 8 8 f f f f f . . . . 
    . . f 8 8 8 f e e e e e f . . . 
    . . f 8 8 f e e e e e e e f . . 
    . . f 8 8 f e e e e e e e f . . 
    . . f 8 8 f e e e e e e e f . . 
    . . f 8 8 f e e e e e e e f . . 
    . . f 8 8 8 f e e e e e f . . . 
    . . . f 8 8 8 f f f f f . . . . 
    . . . . f f 8 8 8 8 f . . . . . 
    . . . f d d f f f f f . . . . . 
    . . . f d d d d d d d f . . . . 
    . . . . f f f f f f f . . . . . 
    `, SpriteKind.Player)
tiles.placeOnRandomTile(Jugador, assets.tile`PastoVacio`)
controller.moveSprite(Jugador)
scene.cameraFollowSprite(Jugador)
let Mause = sprites.create(img`
    5 
    `, SpriteKind.Player)
game.onUpdate(function () {
    for (let Zombies of sprites.allOfKind(SpriteKind.Zombie)) {
        if (sprites.readDataBoolean(Zombies, "Moverse") == true) {
            ZombiePocicion = Zombies.tilemapLocation()
            locationTiles = scene.aStar(Zombies.tilemapLocation(), tiles.getTileLocation(ZombiePocicion.column + randint(-40, 40), ZombiePocicion.row + randint(-40, 40)))
            scene.followPath(Zombies, locationTiles, 80)
            sprites.setDataNumber(Zombies, "Esperar", randint(1000, 10000))
            sprites.setDataBoolean(Zombies, "Moverse", false)
            timer.after(sprites.readDataNumber(Zombies, "Esperar"), function () {
                sprites.setDataBoolean(Zombies, "Moverse", true)
            })
        }
    }
})
game.onUpdate(function () {
    Mause.setPosition(MauseX + (scene.cameraProperty(CameraProperty.X) - 80), MauseY + (scene.cameraProperty(CameraProperty.Y) - 60))
    spriteFx.faceToward(Jugador, Mause)
})
game.onUpdate(function () {
    for (let Zombies of sprites.allOfKind(SpriteKind.Zombie)) {
        if (Zombies.vx >= 1) {
            spriteFx.smoothRotate(Zombies, 0, 50)
        } else if (Zombies.vy >= 1) {
            spriteFx.smoothRotate(Zombies, 90, 50)
        } else if (Zombies.vx <= -1) {
            spriteFx.smoothRotate(Zombies, 180, 50)
        } else if (Zombies.vy <= -1) {
            spriteFx.smoothRotate(Zombies, 270, 50)
        }
    }
})
