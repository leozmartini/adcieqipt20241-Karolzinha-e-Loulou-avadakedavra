export default class cena1 extends Phaser.Scene {
  constructor () {
    super('cena1')
  }

  preload () {
    this.load.image('cena1', './assets/cena1.png')
    this.load.spritesheet('gui', './assets/gui.png', { frameWidth: 128, frameHeight: 128 })
  }

  create () {
    this.add.image(400, 225, 'cena1')
    this.personagem = this.physics.add.sprite(500, 550, 'gui')

    this.anims.create({
      key: 'gui-parado',
      frames: this.anims.generateFrameNumbers('gui', { start: 30, end: 34 }),
      frameRate: 8,
      repeat: -1
    })

    this.personagem.anims.play('gui-parado')
    this.cameras.main.startFollow(this.personagem)
  }
}
