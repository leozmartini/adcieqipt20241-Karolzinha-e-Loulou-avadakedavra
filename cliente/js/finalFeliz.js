export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () {
    this.load.image('finalFeliz', './assets/finalFeliz.png')
  }

  create () {
    this.add.image(400, 225, 'finalFeliz')
    // Adiciona o texto de parabéns e a possibilidade de reiniciar o jogo
    this.mensagem = this.add.text(100, 225, 'Parabéns! Você conseguiu!', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })
      .setInteractive()
      .on('pointerdown', () => {
        location.reload()
      })

    // Inicializa o Google Sign-In
    google.accounts.id.initialize({
      client_id: '49956661564-rh0a4q80ultffo25kp8vaignc28s2c56.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          globalThis.game.jwt = jwtDecode(res.credential)
          this.mensagem.setText(`Parabéns, ${globalThis.game.jwt.given_name}!`)
        }
      }
    })

    // Exibe o prompt de login
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        google.accounts.id.prompt()
      }
    })
  }

  update () { }
}
