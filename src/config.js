import Phaser from 'phaser'

export default {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 475 },
      debug: true
    }
  },
  backgroundColor: "#f8f8f8",
  render: { pixelArt: true, antialias: false }
}
