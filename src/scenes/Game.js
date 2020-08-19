/* globals __DEV__ */
import Phaser from 'phaser'
import {makeAnims} from '../animations/grulita';
import { Grulita } from '../actors/behaviors/grulita';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }
  
  preload () {}

  create () {
    this.tilemap = this.make.tilemap({key:'tileMap', tileWidth: 18, tileHeight:18});
    const clouds = this.tilemap.addTilesetImage('clouds');
    const fields = this.tilemap.addTilesetImage('BG3');
    const skys = this.tilemap.addTilesetImage('sky');
    const tileset = this.tilemap.addTilesetImage('Tileset', 'Tileset', 16, 16, 1, 2);
    const decors = this.tilemap.addTilesetImage('Decors');

    this.tilemap.createStaticLayer('sky', skys, 0, 0);
    this.tilemap.createStaticLayer('clouds', clouds, 0, 0);
    this.tilemap.createStaticLayer('fields', fields, 0, 0);
    this.tilemap.createStaticLayer('stuff', decors, 0, 0);
    const ground = this.tilemap.createStaticLayer('stage', tileset, 0, 0);
    makeAnims(this);
    this.makeParticle();
    this.hero = new Grulita(this);
    this.diamondsGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.fillCollectible(this.diamondsGroup);

    this.enemiesGroup = this.physics.add.group();
    this.fillEnemies(this.enemiesGroup);

    this.tilemap.setCollision([1,2,3], true, true, 'stage', true);
    this.tilemap.setCollisionByProperty({collide: true});

    this.physics.add.collider(this.hero.grulita, ground, null, (grulita, ground) => {
      const posX = this.hero.grulita.x;
      const posTile = this.tilemap.tileToWorldXY(ground.x, ground.y);
        if (grulita.body.x > ground.x && (posTile.x + 16) - (posX-10) < 5) {
          return false;
        }
        else if (grulita.body.x < posTile.x) {
          const xx = (posX+10) - (posTile.x);
          if ((posX+10) - (posTile.x) < 5) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    );

    this.physics.add.collider(this.enemiesGroup, ground);
    this.physics.add.overlap(this.hero.grulita, this.enemiesGroup, (grulita, _) => {
      if (this.hero.invincible) return;
      this.hero.takeHit();
      this.tweens.add({
        targets: grulita,
        ease: 'Back',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 500,
        repeat: 0,
        yoyo: false,
        x: '-=20',
        y: '-=5',
      });
      this.tweens.add({
        targets: grulita,
        alpha: { start: 0, to: 1 },
        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 500,
        repeat: 0,
        yoyo: false,
      });
    })

    // todo pool with groups / container
    this.hitEffect = this.add.sprite(0,0,'grulita_atlas','hit_effect01.png');
    this.hitEffect.alpha = 0;
    this.hitEffect.visible = 0;
    this.hitEffect.setActive(false);
    this.hitEffect.on('animationcomplete', () => {
      this.hitEffect.alpha = 0;
      this.hitEffect.visible = 0;
      this.hitEffect.setActive(false);
    });

    this.physics.add.overlap(this.hero.sword, this.enemiesGroup, (_, monster) => {
      if (this.hero.state.constructor.name === 'AttackingState') {
        this.hit(monster);
        monster.destroy();
      }
    });
    this.physics.add.overlap(this.hero.grulita, this.diamondsGroup, (_, diam) => {
      this.updateScore(diam.state === 'big' ? 1000 : 100);
      this.emitter0.setPosition(diam.x, diam.y);
      this.emitter1.setPosition(diam.x, diam.y);
      this.emitter0.active = true;
      this.emitter1.active = true;
      this.emitter0.explode();
      this.emitter1.explode();
      diam.destroy();
    });


    this.keys = this.input.keyboard.createCursorKeys();
    this.makeHUD();

    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.startFollow(this.hero.grulita);
    //this.game.scale.setZoom(2);
    /*setTimeout(() => {
      this.scene.restart()
    }, 5000);*/

  }

  update(t,t2) {
    if (this.keys.left.isDown) {
      this.hero.state.runLeft();
    }
    if (this.keys.right.isDown) {
      this.hero.state.runRight();
    }
    if(!this.keys.left.isDown && !this.keys.right.isDown) {
      this.hero.state.rest();
    }
    if (this.keys.up.isDown && this.keys.up.getDuration() < 300) {
      this.hero.state.jump(this.keys.up.getDuration());
    }
    if (this.keys.up.isUp) {
      this.hero.state.interuptJump();
    }
    if (this.hero.isDown()) {
      this.hero.state.land();
    }
    if (this.keys.space.isDown) {
      this.hero.state.attack('attackA');
      this.hero.onAttack();
    }
    this.hero.update();
  }

  fillCollectible(diamondsGroup) {
    const diamonds = this.tilemap.createFromObjects('collectibles', 997, {key:'diam_small'});
    const diamondsBig = this.tilemap.createFromObjects('collectibles', 996, {key:'diam_big'});

    
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
  }
  fillEnemies(enemiesGroup) {
    const blobs = this.tilemap.createFromObjects('ennemies', 999, {key: 'blob_idle'});
    enemiesGroup.addMultiple(blobs);
    blobs.forEach(blob => {
      blob.anims.play('blob_idle');
    });

  }
  updateScore(modif) {
    this.score.pts += modif;
    this.score.textObject.setText(('' + this.score.pts).padStart(6, '0'));
  }
  updateLife() {
    if (this.hero.lifes == 0) {
      this.die();
    }
    for (let i = 0; i < 3; i++) {
      if (this.hero.lifes > i)
        this.lifes.container.list[i].setVisible(true);
      else
        this.lifes.container.list[i].setVisible(false);
    }
  }
  makeHUD() {
    this.score = {
      pts: 0,
      textObject: this.add.bitmapText(23, 10, 'font', '000000', 8).setScrollFactor(0, 0)
    };

    this.lifes = {
      container: this.add.container(30, 30, [
        this.add.sprite(0, 0, 'hud_heart'),
        this.add.sprite(15, 0, 'hud_heart'),
        this.add.sprite(30, 0, 'hud_heart'),
      ]).setScrollFactor(0,0)
    };
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
  die() {
    this.scene.stop();
    this.scene.start('GameOverScene')
  }
}