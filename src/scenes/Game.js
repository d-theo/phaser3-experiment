/* globals __DEV__ */
import Phaser from 'phaser'

import Mushroom from '../sprites/Mushroom'

import {IMAGES} from '../frames';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }
  init () {}
  preload () {
    this.load.image('map', 'assets/map/map.png');
    this.load.tilemapTiledJSON({
      key: 'tileMap',
      url: 'assets/map/map.json'
    });

    this.load.atlas('smb', './assets/smb-atlas/texture.png', './assets/smb-atlas/texture.json')
  }

  create () {
    this.tilemap = this.make.tilemap({key:'tileMap', tileWidth: 18, tileHeight:18});
    const tileset = this.tilemap.addTilesetImage('map');
    this.layer = this.tilemap.createStaticLayer('ground', tileset, 0, 0); // check le json pour le layerName
    this.layer.setCollisionByProperty({ collide: true });

    this.anims.create({
      key: IMAGES.mario.walk.key,
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNames('smb', IMAGES.mario.walk)
    });
    this.mario = this.physics.add.sprite(100,100,'smb', 'bend.png');
    this.mario.body.setMaxVelocity(100, 500);
    this.mario.anims.play(IMAGES.mario.walk.key);
    this.physics.add.collider(this.mario, this.layer, () => {
      console.log('??');
    });
    this.g = this.add.group('coin-object');
    const chances = this.tilemap.createFromTiles(40, 0, {
      key: 'smb', frame: 'bend.png'
    });
    chances.forEach((c) => {
      c.setOrigin(0);
    }); 



    this.keys = this.input.keyboard.createCursorKeys();
    this.canJump = true;
    this.jumping = false;
    this.timer = 0;
  }

  isDown() {
    //console.log(this.mario.body.onFloor(), this.mario.body.blocked.down);
    return this.mario.body.onFloor() ||
      this.mario.body.blocked.down
  }

  update(t,t2) {
    this.timer += t2;
    if ((this.timer <= 103 && this.timer >= 97) && this.jumping) {
      this.jumping = false;
      this.canJump = false;
    }
    
    if (this.isDown() && !this.jumping && !this.canJump) {
      this.canJump = true;
    }
    if (this.keys.left.isDown) {
      this.mario.body.setAccelerationX(-50);
    } 
    if (this.keys.right.isDown) {
      this.mario.body.setAccelerationX(+50);
    } 
    if (this.keys.up.isDown && this.canJump) {
        this.mario.body.setVelocityY(-200);
        if (!this.jumping) {
          this.timer = 0;
          /*this.time.addEvent({
            callback: () => {
              this.canJump = false;
              this.jumping = false;
            },
            delay: 100
          });*/
        }
        this.jumping = true;
    } else {
      this.mario.body.setAccelerationY(0);
    }
    if(!this.keys.left.isDown && !this.keys.right.isDown) {
      this.mario.body.setAccelerationX(0);
      if (this.mario.body.velocity.x > 10) {
        this.mario.body.setVelocityX(this.mario.body.velocity.x - 3);
      } else if (this.mario.body.velocity.x < -10) {
        this.mario.body.setVelocityX(this.mario.body.velocity.x + 3);
      } else {
        this.mario.setVelocityX(0);
      }
    }
  }
}
