/* globals __DEV__ */
import Phaser from 'phaser'
import {IMAGES} from '../frames';
import {makeAnims} from '../animations/grulita';
import {GrulitaFrames} from '../animations/_grulita';
import {IdleState} from '../actors/behaviors/fsm_actions';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }
  init () {}
  preload () {
    this.load.image('clouds', 'assets/platformer/clouds.png');
    this.load.image('BG3', 'assets/platformer/BG3.png');
    this.load.image('Decors', 'assets/platformer/Decors.png');
    this.load.image('Tileset', 'assets/platformer/Tileset.png');
    this.load.image('sky', 'assets/platformer/sky.png');
    this.load.atlas('grulita_atlas', './assets/grulita-atlas/grulita-idle.png', './assets/grulita-atlas/grulita-idle.json');
    this.load.tilemapTiledJSON({
      key: 'tileMap',
      url: 'assets/platformer/map_grulita.json'
    });
  }

  create () {
    this.tilemap = this.make.tilemap({key:'tileMap', tileWidth: 18, tileHeight:18});
    const clouds = this.tilemap.addTilesetImage('clouds');
    const fields = this.tilemap.addTilesetImage('BG3');
    const skys = this.tilemap.addTilesetImage('sky');
    const tileset = this.tilemap.addTilesetImage('Tileset');
    const decors = this.tilemap.addTilesetImage('Decors');

    this.tilemap.createStaticLayer('sky', skys, 0, 0);
    this.tilemap.createStaticLayer('clouds', clouds, 0, 0);
    this.tilemap.createStaticLayer('fields', fields, 0, 0);
    this.tilemap.createStaticLayer('stuff', decors, 0, 0);
    const ground = this.tilemap.createStaticLayer('stage', tileset, 0, 0);
    makeAnims(this);

    this.player = this.physics.add.sprite(100, 100, 'grulita_atlas', 'idle01.png');
    this.player.body.setMaxVelocity(150, 500);
    this.player.state = new IdleState(this.player);

    this.tilemap.setCollision([1,2,3], true, true, 'stage', true);

    this.physics.add.collider(this.player, ground);

    this.keys = this.input.keyboard.createCursorKeys();
    this.canJump = true;

    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.startFollow(this.player);
  }
  isDown() {
    return this.player.body.onFloor() ||
      this.player.body.blocked.down || this.player.body.touching.down
  }

  update(t,t2) {
    if (this.keys.left.isDown) {
      this.player.state.runLeft();
    }
    if (this.keys.right.isDown) {
      this.player.state.runRight();
    }
    if(!this.keys.left.isDown && !this.keys.right.isDown) {
      this.player.state.rest();
    }
    if (this.keys.up.isDown) {
      this.player.state.jump(this.keys.up.getDuration());
    }
    if (this.keys.up.isUp) {
      this.player.state.interuptJump();
    }
    if (this.isDown()) {
      this.player.state.land();
    }
    if (this.keys.space.isDown) {
      this.player.state.attack('attackA');
    }
  }

  tryupdate() {
    if (this.keys.left.isDown) {
      if (this.player.state != 4) {
        this.player.flipX = true;
        this.player.anims.play(GrulitaFrames.run.name);
        this.player.state = 4;
      }
      this.player.body.setAccelerationX(-130);
      if (this.player.body.velocity.x > 10) {
        this.player.body.setVelocityX(+12);
      }
    } 
    if (this.keys.right.isDown) {
      if (this.player.state != 2) {
        this.player.flipX = false;
        this.player.anims.play(GrulitaFrames.run.name);
        this.player.state = 2;
      }
      if (this.player.body.velocity.x < -10) {
        this.player.body.setVelocityX(-12);
      }
      this.player.body.setAccelerationX(+130);
    }

    if (this.keys.up.isDown) {
      if (this.keys.up.getDuration() < 250 && this.canJump) {
        if (this.player.state !== 1) {
          console.log('play anim')
          this.player.anims.play('jump_start');
        }
        this.player.state = 1;
        this.player.body.setVelocityY(-250);
      } else {
        this.canJump = false;
      }
    }
    if (this.keys.up.isUp) {
      this.player.body.setAccelerationY(600);
    }
    if (this.isDown()) {
      //this.player.state = 0;
      console.log()
      this.canJump = true;
      //this.player.anims.play(GrulitaFrames.idle.name);
    }

    if(!this.keys.left.isDown && !this.keys.right.isDown) {
      if (this.player.state != 0 && this.player.state != 1) {
         this.player.anims.play(GrulitaFrames.idle.name);
         this.player.state = 0;
      }
      this.player.body.setAccelerationX(0);
      if (this.player.body.velocity.x > 10) {
        this.player.body.setVelocityX(this.player.body.velocity.x - 4);
      } else if (this.player.body.velocity.x < -10) {
        this.player.body.setVelocityX(this.player.body.velocity.x + 4);
      } else {
        this.player.setVelocityX(0);
      }
    }
  }

  loadMarioMap() {
    this.load.image('map', 'assets/map/map.png'); // pour la tilemap
    
    this.load.spritesheet('sprite_map',  // pour les sprites
        'assets/map/map.png',
        { frameWidth: 18, frameHeight: 18 }
    );

    this.load.tilemapTiledJSON({
      key: 'tileMap',
      url: 'assets/map/map.json'
    });

    this.load.atlas('smb', './assets/smb-atlas/texture.png', './assets/smb-atlas/texture.json')
  }
  initMarioTilemap() {
    this.tilemap = this.make.tilemap({key:'tileMap', tileWidth: 18, tileHeight:18});
    const tileset = this.tilemap.addTilesetImage('map');
    this.layer = this.tilemap.createDynamicLayer('ground', tileset, 0, 0); // check le json pour le layerName
    this.layer.setCollisionByProperty({ collide: true });
    
    this.anims.create({
      key: IMAGES.mario.walk.key,
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNames('smb', IMAGES.mario.walk)
    });
    this.mario = this.physics.add.sprite(100,100,'smb', 'bend.png');
    this.mario.body.setMaxVelocity(150, 500);
    this.mario.anims.play(IMAGES.mario.walk.key);
    
   const chances = this.tilemap.createFromTiles(40, -1, {
      key: 'smb', frame: 'bend.png'
    });
    const group = this.physics.add.group({immovable: true});
    chances.forEach((c) => {
      group.add(c);
      c.setOrigin(0, 0);
      c.body.moves = false;
      c.body.immovable = true;
    });
    this.physics.add.collider(this.mario, group);
    const tiles = this.layer.filterTiles((t) => {
      if (t.index === 40) return true;
    });
    this.layer.forEachTile((t) => {
      if (t.index === 40) //this.layer.removeTileAt(t.x, t.y, true, true);
        this.tilemap.replaceByIndex(40, -1);
    });
    this.tilemap.removeTile(tiles, -1, true).forEach(t => t.destroy());
    this.physics.add.collider(this.mario, this.layer);
  }
}