import Phaser from 'phaser'

export default {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.ENVELOP,
  },
  parent: 'content',
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 475 },
      debug: false
    }
  },
  backgroundColor: "#111",
  render: { pixelArt: true, antialias: false }
}
