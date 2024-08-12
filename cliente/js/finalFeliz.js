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
    globalThis.google.accounts.id.initialize({
      client_id: '331191695151-ku8mdhd76pc2k36itas8lm722krn0u64.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 8, // id do jogo cadastrado no banco de dados da Feira de Jogos
            value: 100 // crédito em tijolinhos
          }, {
            headers: {
              Authorization: `Bearer ${res.credential}`
            }
          })
            .then(function (response) {
              globalThis.game.scene.getScene('finalFeliz').mensagem.setText('Parabéns! Você conseguiu! Seus tijolinhos foram creditados!')
            })
            .catch(function (error) {
              globalThis.game.scene.getScene('finalFeliz').mensagem.setText('Erro ao creditar tijolinhos:', error)
            })
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
