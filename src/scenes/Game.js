/* globals __DEV__ */
import Phaser from 'phaser'
import {makeAnims} from '../animations/grulita';
import {IdleState} from '../actors/behaviors/fsm_actions';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }
  init () {}
  preload () {
    this.load.image('spark0', 'assets/images/blue.png');
    this.load.image('spark1', 'assets/images/red.png');

    this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

    this.load.image('clouds', 'assets/platformer/clouds.png');
    this.load.image('BG3', 'assets/platformer/BG3.png');
    this.load.image('Decors', 'assets/platformer/Decors.png');
    this.load.image('Tileset', 'assets/platformer/Tileset.png');
    this.load.image('sky', 'assets/platformer/sky.png');
    this.load.atlas('grulita_atlas', './assets/grulita-atlas/grulita-idle.png', './assets/grulita-atlas/grulita-idle.json');
    this.load.atlas('grulita_collectibles', './assets/grulita-atlas/grulita-collectibles/grulita-collectibles.png', './assets/grulita-atlas/grulita-collectibles/grulita-collectibles.json');
    this.load.atlas('grulita_blob', './assets/grulita-atlas/grulita-enemies/grulita-blob.png', './assets/grulita-atlas/grulita-enemies/grulita-blob.json');
    
    this.load.image('blob_idle', './assets/ennemies/blob/blob_idle000.png');
    this.load.image('diam_big', './assets/platformer/Collectible/diamond_big.png');
    this.load.image('diam_small', './assets/platformer/Collectible/diamond_small.png');

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
    this.makeParticle();  
    this.player = this.physics.add.sprite(100, 100, 'grulita_atlas', 'idle01.png');
    this.player.body.setMaxVelocity(150, 500);
    this.player.state = new IdleState(this.player);


    this.blob = this.physics.add.sprite(200, 200, 'blob_idle');
    this.blob.body.setMaxVelocity(150, 500);
    this.blob.anims.play('blob_idle');

    const blob = this.physics.add.sprite(300, 150, 'blob_idle');
    blob.body.setMaxVelocity(150, 500);
    blob.anims.play('blob_idle');

    this.tilemap.setCollision([1,2,3], true, true, 'stage', true);
    this.tilemap.setCollisionByProperty({collide: true});

    this.physics.add.collider(this.player, ground, (player, tile) => {
      //this.hit(tile);
      //console.log('hit');
    }, (player, tile) => {
      /*const d = Math.abs(_chance.x*16 - (_mario.body.x+10));
      if (d <= 3 && _mario.body.y >= _chance.y*16) {
        this.deviateLeft(d);
        return false;
      }
    
      const pd = Math.abs((_chance.x+16)*16 - (_mario.body.x));
      if (pd <= 3 && _mario.body.y >= _chance.y*16) {
          this.deviateRight(pd);
          return false;
      }*/
      return true;
    });

    this.physics.add.collider(this.blob, ground);
    this.physics.add.collider(blob, ground);

    this.hitEffect = this.add.sprite(0,0,'grulita_atlas','hit_effect01.png');
    this.hitEffect.alpha = 0;
    this.hitEffect.visible = 0;
    this.hitEffect.setActive(false);
    this.hitEffect.on('animationcomplete', () => {
      this.hitEffect.alpha = 0;
      this.hitEffect.visible = 0;
      this.hitEffect.setActive(false);
    });

    this.physics.add.overlap(this.player, this.blob, (player, monster) => {
      if (player.state.constructor.name === 'AttackingState') {
        this.hit(monster);
        monster.destroy();
      }
    });

    this.physics.add.overlap(this.player, blob, (player, monster) => {
      if (player.state.constructor.name === 'AttackingState') {
        this.hit(monster);
        monster.destroy();
      }
    });

    this.keys = this.input.keyboard.createCursorKeys();

    this.parseObjectLayers();
    this.makeHUD();

    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.game.scale.setZoom(2);

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
    if (this.keys.up.isDown && this.keys.up.getDuration() < 300) {
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

  parseObjectLayers() {
    const diamonds = this.tilemap.createFromObjects('collectibles', 997, {key:'diam_small'});
    const diamondsBig = this.tilemap.createFromObjects('collectibles', 996, {key:'diam_big'});

    const diamondsGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    diamondsGroup.addMultiple(diamondsBig);
    diamondsGroup.addMultiple(diamonds);

    diamonds.forEach(d => {
      d.setScale(1,1);
      d.state = 'small';
      d.anims.play('diamond_small');
    });
    diamondsBig.forEach(d => {
      d.setScale(1,1);
      d.state = 'big';
      d.anims.play('diamond_big');
    });
    this.physics.add.overlap(this.player, diamondsGroup, (_, diam) => {
      this.updateScore(diam.state === 'big' ? 1000 : 100);
      this.emitter0.setPosition(diam.x, diam.y);
      this.emitter1.setPosition(diam.x, diam.y);
      this.emitter0.active = true;
      this.emitter1.active = true;
      this.emitter0.explode();
      this.emitter1.explode();
      diam.destroy();
    });
  }
  updateScore(modif) {
    this.score.pts += modif;
    this.score.textObject.setText(('' + this.score.pts).padStart(6, '0'));
  }
  makeHUD() {
    this.score = {
      pts: 0,
      textObject: this.add.bitmapText(5 * 8, 16, 'font', '000000', 8)
    };
    this.score.textObject.setScrollFactor(0, 0);
  }
  makeParticle() {
    this.emitter0 = this.add.particles('spark0').createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      active: false,
      lifespan: 200,
      gravityY: 800
    });

    this.emitter1 = this.add.particles('spark1').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.3, end: 0 },
        blendMode: 'SCREEN',
        active: false,
        lifespan: 150,
        gravityY: 800
    });
  }
  hit(monster) {
    this.hitEffect.setPosition(monster.x, monster.y);
    this.hitEffect.alpha = 1;
    this.hitEffect.visible = true;
    this.hitEffect.setActive(true);
    this.hitEffect.anims.play('hit_effect');
  }

  deviateLeft(by) {
    console.log('left')
    this.add.tween({
      targets: this.player.sprite,
      duration: 10,
      ease: "linear",
      x: '-='+50,
  });
  }
  deviateRight(by) {
    console.log('right')
    this.add.tween({
      targets: this.player.sprite,
      duration: 10,
      ease: "linear",
      x: '+='+50,
  });
  }
}