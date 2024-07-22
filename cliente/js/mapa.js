export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
    this.direcaoAtual = 'frente' // Variável para armazenar a direção atual do personagem
    this.teleportCooldown = false // Variável para gerenciar o cooldown do teleporte
  }

  preload () {
    // Carregar o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/umapinha.json')

    // Carregar as imagens do mapa
    this.load.image('geral', './assets/mapa/tilesetnovo.png')
    this.load.image('masmorra', './assets/mapa/tilesetnovodungeon.png')
    this.load.image('moveisbruxa', './assets/mapa/moveisbruxa.png')
    this.load.image('torre', './assets/mapa/torrebruxa.png')

    // Carregar spritesheets
    this.load.spritesheet('roxo', './assets/personagens/roxo.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('menino', './assets/personagens/menino.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('menina', './assets/personagens/menina.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('roxoataque', './assets/personagens/roxoataque.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('vermelho', './assets/personagens/vermelho.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocoquebra', './assets/animaçoes/blocoquebra.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('aranha', './assets/inimigos/aranha.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)

    // Carrega botao de ataque
    this.load.spritesheet('botao', './assets/simbolos/botao.png', { frameWidth: 32, frameHeight: 32 })
  }

  create () {
    // Adiciona ponteiro
    this.input.addPointer(3)

    // Cria objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa
    this.tilesetFloresta = this.tilemapMapa.addTilesetImage('geral')
    this.tilesetMasmorra = this.tilemapMapa.addTilesetImage('masmorra')
    this.tilesetMoveisbruxa = this.tilemapMapa.addTilesetImage('moveisbruxa')
    this.tilesetTorre = this.tilemapMapa.addTilesetImage('torre')

    // Camadas do mapa e personagem
    this.layerchaofaltando = this.tilemapMapa.createLayer('chaofaltando', [this.tilesetFloresta])
    this.layerchao = this.tilemapMapa.createLayer('chao', [this.tilesetFloresta, this.tilesetMasmorra])
    this.layerparedemsm = this.tilemapMapa.createLayer('paredemsm', [this.tilesetMasmorra])
    this.layerarbustos = this.tilemapMapa.createLayer('arbustos', [this.tilesetFloresta, this.tilesetMasmorra, this.tilesetMoveisbruxa, this.tilesetTorre])
    this.layerflores = this.tilemapMapa.createLayer('flores', [this.tilesetFloresta])

    if (globalThis.game.jogadores.primeiro === globalThis.game.socket.id) {
      globalThis.game.remoteConnection = new RTCPeerConnection(globalThis.game.iceServers)
      globalThis.game.dadosJogo = globalThis.game.remoteConnection.createDataChannel('dadosJogo', { negotiated: true, id: 0 })

      globalThis.game.remoteConnection.onicecandidate = function ({ candidate }) {
        candidate && globalThis.game.socket.emit('candidate', globalThis.game.sala, candidate)
      }

      globalThis.game.remoteConnection.ontrack = function ({ streams: [midia] }) {
        globalThis.game.audio.srcObject = midia
      }

      if (globalThis.game.midias) {
        globalThis.game.midias.getTracks()
          .forEach((track) => globalThis.game.remoteConnection.addTrack(track, globalThis.game.midias))
      }

      globalThis.game.socket.on('offer', (description) => {
        globalThis.game.remoteConnection.setRemoteDescription(description)
          .then(() => globalThis.game.remoteConnection.createAnswer())
          .then((answer) => globalThis.game.remoteConnection.setLocalDescription(answer))
          .then(() => globalThis.game.socket.emit('answer', globalThis.game.sala, globalThis.game.remoteConnection.localDescription))
      })

      globalThis.game.socket.on('candidate', (candidate) => {
        globalThis.game.remoteConnection.addIceCandidate(candidate)
      })

      this.blocoquebra = this.physics.add.sprite(590, 1442, 'blocoquebra')
      this.personagemLocal = this.physics.add.sprite(2285, 410, 'menino')
      this.personagemRemoto = this.add.sprite(2285, 600, 'menina')
    } else if (globalThis.game.jogadores.segundo === globalThis.game.socket.id) {
      globalThis.game.localConnection = new RTCPeerConnection(globalThis.game.iceServers)
      globalThis.game.dadosJogo = globalThis.game.localConnection.createDataChannel('dadosJogo', { negotiated: true, id: 0 })

      globalThis.game.localConnection.onicecandidate = function ({ candidate }) {
        candidate && globalThis.game.socket.emit('candidate', globalThis.game.sala, candidate)
      }

      globalThis.game.localConnection.ontrack = function ({ streams: [stream] }) {
        globalThis.game.audio.srcObject = stream
      }

      if (globalThis.game.midias) {
        globalThis.game.midias.getTracks()
          .forEach((track) => globalThis.game.localConnection.addTrack(track, globalThis.game.midias))
      }

      globalThis.game.localConnection.createOffer()
        .then((offer) => globalThis.game.localConnection.setLocalDescription(offer))
        .then(() => globalThis.game.socket.emit('offer', globalThis.game.sala, globalThis.game.localConnection.localDescription))

      globalThis.game.socket.on('answer', (description) => {
        globalThis.game.localConnection.setRemoteDescription(description)
      })

      globalThis.game.socket.on('candidate', (candidate) => {
        globalThis.game.localConnection.addIceCandidate(candidate)
      })

      // Cria os sprites dos personagens local e remoto
      this.personagemLocal = this.physics.add.sprite(2285, 410, 'menina')
      this.personagemRemoto = this.add.sprite(2285, 600, 'menino')
    } else {
      // Gera mensagem de log para informar que o usuário está fora da partida
      console.log('Usuário não é o primeiro ou o segundo jogador. Não é possível iniciar a partida. ')

      // Encerra a cena atual e inicia a cena de sala
      this.scene.stop('mapa')
      this.scene.start('sala')
    }

    // Define colisão entre o personagem e a aranha
    // this.physics.add.collider(this.personagemLocal, this.aranha)

    // Define o movimento da aranha para seguir o personagem
    // this.physics.add.collider(this.aranha, this.layerparedemsm)
    // this.physics.add.collider(this.aranha, this.layerarbustos)

    this.layerpersonagempassa = this.tilemapMapa.createLayer('personagempassa', [this.tilesetFloresta, this.tilesetMasmorra])
    this.layertorre = this.tilemapMapa.createLayer('torre', [this.tilesetTorre])

    // Define o atributo do tileset para gerar colisão
    this.layerparedemsm.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerparedemsm)

    // Define o atributo do tileset para gerar colisão
    this.layerarbustos.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerarbustos)

    // Torna a cena acessível globalmente
    window.scene = this

    // Movimentos do personagem
    this.anims.create({
      key: 'personagem-parado-frente',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 6, end: 11 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 48, end: 53 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 27, end: 32 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-tras',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 69, end: 74 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-frente',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 21, end: 26 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 42, end: 47 }),
      frameRate: 12,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-tras',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 63, end: 68 }),
      frameRate: 12,
      repeat: -1
    })

    // Inicia a animação padrão do personagem
    this.personagemLocal.anims.play('personagem-parado-frente')

    // Movimentos da aranha
    this.anims.create({
      key: 'aranha-andando',
      frames: this.anims.generateFrameNumbers('aranha', { start: 7, end: 10 }),
      frameRate: 9,
      repeat: -1
    })

    this.anims.create({
      key: 'aranha-parada',
      frames: this.anims.generateFrameNumbers('aranha', { start: 11, end: 14 }),
      frameRate: 9,
      repeat: -1
    })

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 200,
      y: 310,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })
    // Câmera
    this.cameras.main.startFollow(this.personagemLocal)
    this.cameras.main.setZoom(1.5)

    // Variáveis de velocidade e threshold
    this.speed = 150 // Velocidade constante do personagem
    this.threshold = 0.1 // Limite mínimo de força para considerar o movimento
    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
      }
    }
  }

  update () {
    try {
      // Envia os dados do jogo somente se houver conexão aberta
      if (globalThis.game.dadosJogo.readyState === 'open') {
        // Verifica que o personagem local existe
        if (this.personagemLocal) {
          // Envia os dados do personagem local via DataChannel
          globalThis.game.dadosJogo.send(JSON.stringify({
            personagem: {
              x: this.personagemLocal.x,
              y: this.personagemLocal.y,
              frame: this.personagemLocal.frame.name
            }
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do jogo: ', error)
    }
    this.handleJoystickMove()
    this.checkTeleport()
  }

  handleJoystickMove () {
    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > this.threshold) {
      const velocityX = Math.cos(angle) * this.speed
      const velocityY = Math.sin(angle) * this.speed

      this.personagemLocal.setVelocity(velocityX, velocityY)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.personagemLocal.anims.play('personagem-andando-direita', true)
          this.direcaoAtual = 'direita'
        } else {
          this.personagemLocal.anims.play('personagem-andando-esquerda', true)
          this.direcaoAtual = 'esquerda'
        }
      } else {
        if (velocityY > 0) {
          this.personagemLocal.anims.play('personagem-andando-frente', true)
          this.direcaoAtual = 'frente'
        } else {
          this.personagemLocal.anims.play('personagem-andando-tras', true)
          this.direcaoAtual = 'tras'
        }
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagemLocal.setVelocity(0)
      switch (this.direcaoAtual) {
        case 'frente':
          this.personagemLocal.anims.play('personagem-parado-frente', true)
          break
        case 'direita':
          this.personagemLocal.anims.play('personagem-parado-direita', true)
          break
        case 'esquerda':
          this.personagemLocal.anims.play('personagem-parado-esquerda', true)
          break
        case 'tras':
          this.personagemLocal.anims.play('personagem-parado-tras', true)
          break
      }
    }
  }

  checkTeleport () {
    // Verifica se o cooldown está ativo
    if (this.teleportCooldown) {
      return
    }

    // Verifica se o personagem está nas proximidades das coordenadas especificadas para ida
    if (this.personagemLocal.x >= 3093 && this.personagemLocal.x <= 3095 && this.personagemLocal.y === 816) {
      this.personagemLocal.setPosition(1840, 1935)
      this.activateTeleportCooldown()
    }
    // Verifica se o personagem está nas proximidades das coordenadas especificadas para volta
    else if (this.personagemLocal.x >= 1800 && this.personagemLocal.x <= 1830 && this.personagemLocal.y === 1936) {
      this.personagemLocal.setPosition(3089, 816)
      this.activateTeleportCooldown()
    }
    // entra masmorra
    if (this.personagemLocal.x === 2544 && this.personagemLocal.y <= 1778) {
      // Define a nova posição do personagem
      this.personagemLocal.setPosition(578, 1200)
    }
    // volta masmorra
    if (this.personagemLocal.x >= 560 && this.personagemLocal.x <= 592 && this.personagemLocal.y === 1264) {
      // Define a nova posição do personagem
      this.personagemLocal.setPosition(2544, 1780)
    }
    // sai masmorra
    if (this.personagemLocal.x === 560 && this.personagemLocal.y === 272) {
      // Define a nova posição do personagem
      this.personagemLocal.setPosition(2285, 410)
    }
  }

  activateTeleportCooldown () {
    this.teleportCooldown = true
    this.time.addEvent({
      delay: 500, // Tempo de cooldown em milissegundos
      callback: () => {
        this.teleportCooldown = false
      }
    })
  }

  // finalTriste () {
  // Encerra a cena atual e inicia a cena de final triste
  // this.scene.stop('mapa')
  // this.scene.start('finalTriste')
  // }

  // finalFeliz () {
  // Encerra a cena atual e inicia a cena de final triste
  // this.scene.stop('mapa')
  // this.scene.start('finalFeliz')
  // }
}
