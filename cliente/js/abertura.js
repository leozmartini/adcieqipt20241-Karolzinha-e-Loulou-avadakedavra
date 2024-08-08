export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

  preload () {
    this.load.image('abertura', './assets/abertura.png')
    this.load.spritesheet('coruja', './assets/coruja.png', { frameWidth: 64, frameHeight: 64 })
    this.load.image('fundo-3', './assets/fundo3.png')
    this.load.image('logo', './assets/logo.png')
    this.load.spritesheet('play', './assets/simbolos/botao-play.png', { frameWidth: 120, frameHeight: 65 })
  }

  create () {
    this.add.image(400, 225, 'abertura')
      .setInteractive()
      .on('pointerdown', () => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))

        this.scene.stop('abertura')
        this.scene.start('sala')
      })
  }
}
