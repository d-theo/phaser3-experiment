import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.cameras.main.setBackgroundColor('#000000');
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingTxt = 'Loading... ';
    var loadingValue = ' 0%';
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: loadingTxt+loadingValue,
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    
    loadingText.setOrigin(0.5, 0.5);
    var progressBar = this.add.image(width / 2, height / 2, 'loaderBar').setOrigin(0.5, 0.5).setScale(0, 1);

    this.load.on('progress', (value) => {
      loadingValue = Math.floor(value*100)+'%';
      progressBar.setScale(value, 1);
      loadingText.text = loadingTxt+' '+loadingValue;
    });       
    this.load.on('complete', () => {
        console.log('complete');
    });

    this.load.image('spark0', 'assets/images/blue.png');
    this.load.image('spark1', 'assets/images/red.png');
    this.load.image('hud_heart', 'assets/platformer/Collectible/heart02.png')

    this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

    this.load.image('clouds', 'assets/platformer/clouds.png');
    this.load.image('BG3', 'assets/platformer/BG3.png');
    this.load.image('Decors', 'assets/platformer/Decors.png');
    this.load.image('Tileset', 'assets/platformer/Tileset2.png');
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
    this.scene.start('GameScene')
  }

  update () {}
}
