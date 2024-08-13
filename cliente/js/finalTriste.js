export default class finalTriste extends Phaser.Scene {
  constructor () {
    super('finalTriste')
  }

  preload () {
    this.load.image('fundo', './assets/fundo.png')
  }

  create () {
    this.add.image(400, 225, 'fundo')
    // Adiciona o texto de fim sem crédito e a possibilidade de reiniciar o jogo
    this.add.text(100, 50, 'Você não conseguiu!', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })
      .setInteractive()
      .on('pointerdown', () => {
        location.reload()
      })
  }

  update () { }
}
