export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

  preload () {
    this.load.image('logoo', './assets/logoo.png')
    this.load.spritesheet('coruja', './assets/coruja.png', { frameWidth: 64, frameHeight: 64 })
    this.load.image('fundo-3', './assets/fundo3.png')
    this.load.image('logo', './assets/logo.png')
    this.load.spritesheet('play', './assets/simbolos/botao-play.png', { frameWidth: 120, frameHeight: 65 })
  }

  create () {
    this.add.image(512, 512, 'logoo')
    this.personagem = this.physics.add.sprite(0, 225, 'coruja')
    this.botao = this.add.sprite(400, 350, 'play', 0)
      .setInteractive()
      .on('pointerdown', () => {
        this.botao.setFrame(1)

        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then((stream) => {
            globalThis.game.midias = stream
          })
          .catch((error) => console.error(error))
      })
      .on('pointerup', () => {
        this.scene.stop('abertura')
        this.scene.start('sala')
      })

    this.anims.create({
      key: 'coruja-voando',
      frames: this.anims.generateFrameNumbers('coruja', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    })

    this.personagem.anims.play('coruja-voando')
    this.personagem.setVelocityX(50)
  }

  update () {
    if (this.personagem.x >= 850) { this.personagem.x = 0 }
  }
}
