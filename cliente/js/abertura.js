export default class abertura extends Phaser.Scene {
  constructor () {
    super('abertura')
  }

  preload () {
    this.load.image('fundo12', './assets/fundo1-e-2.png')
    this.load.spritesheet('coruja', './assets/coruja.png', { frameWidth: 64, frameHeight: 64 })
    this.load.image('fundo-3', './assets/fundo3.png')
    this.load.spritesheet('play', './assets/simbolos/botao-play.png', { frameWidth: 120, frameHeight: 65 })
  }

  create () {
    this.add.image(400, 225, 'fundo12')
    this.personagem = this.physics.add.sprite(0, 225, 'coruja')

    this.add.image(400, 225, 'fundo-3')

    this.play = this.add.sprite(400, 350, 'play', 0)
      .setInteractive()
      .on('pointerdown', () => {
        this.play.setFrame(1)
      })
      .on('pointerup', () => {
        this.game.scene.stop('abertura')
        this.game.scene.start('sala')
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
