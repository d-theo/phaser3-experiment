import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameOverScene' });
  }

  preload () {
    this.cameras.main.setBackgroundColor('#000000');
  }

  create () {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 150,
      text: 'GAME OVER',
      style: {
          font: '15px monospace',
          fill: '#ffffff'
      }
    }).setOrigin(0.5, 0.5);

    var replay = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: '< press enter to restart the game >',
      style: {
          font: '20px monospace',
          fill: '#ffffff'
      }
    }).setOrigin(0.5, 0.5);;
    this.input.keyboard.on('keydown-' + 'ENTER', (event) => {
      console.log('yeah');
      var scene = this.scene.get('GameScene');
      scene.scene.restart();
      this.scene.stop();
    });
  }

  update () {
    
  }
}
