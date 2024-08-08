export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
    this.direcaoAtual = 'frente' // Variável para armazenar a direção atual do personagem
    this.teleportCooldown = false // Variável para gerenciar o cooldown do teleporte
    this.aranhasAndam = false
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
    this.load.spritesheet('menino', './assets/personagens/menino.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('menina', './assets/personagens/menina.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('meninoataque', './assets/personagens/meninoataque.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('meninaataque', './assets/personagens/meninaataque.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('blocoquebra', './assets/animacoes/blocoquebra.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('portao', './assets/animacoes/portao.png', { frameWidth: 96, frameHeight: 64 })
    this.load.spritesheet('aranha', './assets/inimigos/aranha.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('cristal', './assets/animacoes/cristal.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('agua', './assets/animacoes/agua.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('aguaborda', './assets/animacoes/aguaborda.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('vida', './assets/vida.png', { frameWidth: 146, frameHeight: 36 })
    this.load.spritesheet('blocovazio', './assets/blocovazio.png', { frameWidth: 32, frameHeight: 32 })

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
    // Animações agua
    this.anims.create({
      key: 'agua-anim',
      frames: this.anims.generateFrameNumbers('agua', {
        start: 0,
        end: 7
      }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'aguaborda-anim',
      frames: this.anims.generateFrameNumbers('aguaborda', {
        start: 0,
        end: 7
      }),
      frameRate: 8,
      repeat: -1
    })

    // riozinho
    this.rio = [
      {
        indice: 1,
        x: 2352,
        y: 976
      },
      {
        indice: 2,
        x: 2320,
        y: 976
      },
      {
        indice: 3,
        x: 2288,
        y: 976
      },
      {
        indice: 4,
        x: 2256,
        y: 976
      },
      {
        indice: 5,
        x: 2224,
        y: 976
      },
      {
        indice: 6,
        x: 2192,
        y: 976
      },
      {
        indice: 7,
        x: 2160,
        y: 976
      },
      {
        indice: 8,
        x: 2128,
        y: 976
      },
      {
        indice: 9,
        x: 2096,
        y: 976
      },
      {
        indice: 10,
        x: 2064,
        y: 976
      },
      {
        indice: 11,
        x: 2032,
        y: 976
      },
      {
        indice: 12,
        x: 2000,
        y: 976
      },
      {
        indice: 13,
        x: 1968,
        y: 976
      },
      {
        indice: 14,
        x: 1936,
        y: 976
      },
      {
        indice: 15,
        x: 1904,
        y: 976
      },
      {
        indice: 16,
        x: 1872,
        y: 976
      },
      {
        indice: 17,
        x: 1840,
        y: 976
      },
      {
        indice: 18,
        x: 1808,
        y: 976
      },
      {
        indice: 19,
        x: 1776,
        y: 976
      },
      {
        indice: 20,
        x: 2384,
        y: 976
      },
      {
        indice: 21,
        x: 2416,
        y: 976
      },
      {
        indice: 22,
        x: 2448,
        y: 976
      },
      {
        indice: 23,
        x: 2480,
        y: 976
      },
      {
        indice: 24,
        x: 2512,
        y: 976
      },
      {
        indice: 25,
        x: 2544,
        y: 976
      },
      {
        indice: 26,
        x: 2576,
        y: 976
      },
      {
        indice: 27,
        x: 2608,
        y: 976
      },
      {
        indice: 28,
        x: 2640,
        y: 976
      },
      {
        indice: 29,
        x: 2672,
        y: 976
      },
      {
        indice: 30,
        x: 2704,
        y: 976
      },
      {
        indice: 31,
        x: 2352,
        y: 1008
      },
      {
        indice: 32,
        x: 2320,
        y: 1008
      },
      {
        indice: 33,
        x: 2288,
        y: 1008
      },
      {
        indice: 34,
        x: 2256,
        y: 1008
      },
      {
        indice: 35,
        x: 2224,
        y: 1008
      },
      {
        indice: 36,
        x: 2192,
        y: 1008
      },
      {
        indice: 37,
        x: 2160,
        y: 1008
      },
      {
        indice: 38,
        x: 2128,
        y: 1008
      },
      {
        indice: 39,
        x: 2096,
        y: 1008
      },
      {
        indice: 40,
        x: 2064,
        y: 1008
      },
      {
        indice: 41,
        x: 2032,
        y: 1008
      },
      {
        indice: 42,
        x: 2000,
        y: 1008
      },
      {
        indice: 43,
        x: 1968,
        y: 1008
      },
      {
        indice: 44,
        x: 1936,
        y: 1008
      },
      {
        indice: 45,
        x: 1904,
        y: 1008
      },
      {
        indice: 46,
        x: 1872,
        y: 1008
      },
      {
        indice: 47,
        x: 1840,
        y: 1008
      },
      {
        indice: 48,
        x: 1808,
        y: 1008
      },
      {
        indice: 49,
        x: 1776,
        y: 1008
      },
      {
        indice: 50,
        x: 2384,
        y: 1008
      },
      {
        indice: 51,
        x: 2416,
        y: 1008
      },
      {
        indice: 52,
        x: 2448,
        y: 1008
      },
      {
        indice: 53,
        x: 2480,
        y: 1008
      },
      {
        indice: 54,
        x: 2512,
        y: 1008
      },
      {
        indice: 55,
        x: 2544,
        y: 1008
      },
      {
        indice: 56,
        x: 2576,
        y: 1008
      },
      {
        indice: 57,
        x: 2608,
        y: 1008
      },
      {
        indice: 58,
        x: 2640,
        y: 1008
      },
      {
        indice: 59,
        x: 2672,
        y: 1008
      },
      {
        indice: 60,
        x: 2704,
        y: 1008
      },
      {
        indice: 61,
        x: 3536,
        y: 400
      },
      {
        indice: 62,
        x: 3504,
        y: 400
      },
      {
        indice: 63,
        x: 3472,
        y: 400
      },
      {
        indice: 64,
        x: 3440,
        y: 400
      },
      {
        indice: 65,
        x: 3408,
        y: 400
      },
      {
        indice: 66,
        x: 3376,
        y: 400
      },
      {
        indice: 67,
        x: 3344,
        y: 400
      },
      {
        indice: 68,
        x: 3536,
        y: 368
      },
      {
        indice: 69,
        x: 3504,
        y: 368
      },
      {
        indice: 70,
        x: 3472,
        y: 368
      },
      {
        indice: 71,
        x: 3440,
        y: 368
      },
      {
        indice: 72,
        x: 3408,
        y: 368
      },
      {
        indice: 73,
        x: 3376,
        y: 368
      },
      {
        indice: 74,
        x: 3344,
        y: 368
      },
      {
        indice: 75,
        x: 3312,
        y: 368
      },
      {
        indice: 76,
        x: 3280,
        y: 368
      },
      {
        indice: 77,
        x: 3536,
        y: 336
      },
      {
        indice: 78,
        x: 3504,
        y: 336
      },
      {
        indice: 79,
        x: 3472,
        y: 336
      },
      {
        indice: 81,
        x: 3408,
        y: 336
      },
      {
        indice: 82,
        x: 3376,
        y: 336
      },
      {
        indice: 83,
        x: 3344,
        y: 336
      },
      {
        indice: 84,
        x: 3312,
        y: 336
      },
      {
        indice: 85,
        x: 3280,
        y: 336
      },
      {
        indice: 86,
        x: 3536,
        y: 304
      },
      {
        indice: 87,
        x: 3504,
        y: 304
      },
      {
        indice: 88,
        x: 3472,
        y: 304
      },
      {
        indice: 90,
        x: 3408,
        y: 304
      },
      {
        indice: 91,
        x: 3376,
        y: 304
      },
      {
        indice: 92,
        x: 3344,
        y: 304
      },
      {
        indice: 93,
        x: 3312,
        y: 304
      },
      {
        indice: 94,
        x: 3280,
        y: 304
      },
      {
        indice: 95,
        x: 3536,
        y: 272
      },
      {
        indice: 96,
        x: 3504,
        y: 272
      },
      {
        indice: 97,
        x: 3472,
        y: 272
      },
      {
        indice: 98,
        x: 3440,
        y: 272
      },
      {
        indice: 99,
        x: 3408,
        y: 272
      },
      {
        indice: 100,
        x: 3376,
        y: 272
      },
      {
        indice: 101,
        x: 3344,
        y: 272
      },
      {
        indice: 102,
        x: 3312,
        y: 272
      },
      {
        indice: 103,
        x: 3280,
        y: 272
      },
      {
        indice: 80,
        x: 3408,
        y: 240
      },
      {
        indice: 89,
        x: 3376,
        y: 240
      },
      {
        indice: 104,
        x: 3344,
        y: 240
      },
      {
        indice: 105,
        x: 3312,
        y: 240
      },
      {
        indice: 106,
        x: 3280,
        y: 240
      },
      {
        indice: 107,
        x: 3408,
        y: 208
      },
      {
        indice: 108,
        x: 3376,
        y: 208
      },
      {
        indice: 109,
        x: 3344,
        y: 208
      },
      {
        indice: 110,
        x: 3312,
        y: 208
      }
    ]
    this.rio.forEach((agua) => {
      agua.objeto = this.physics.add.sprite(agua.x, agua.y, 'aguaborda')
      agua.objeto.anims.play('agua-anim')
    })
    this.rioborda = [
      {
        indice: 1,
        x: 2352,
        y: 944
      },
      {
        indice: 2,
        x: 2320,
        y: 944
      },
      {
        indice: 3,
        x: 2288,
        y: 944
      },
      {
        indice: 4,
        x: 2256,
        y: 944
      },
      {
        indice: 5,
        x: 2224,
        y: 944
      },
      {
        indice: 6,
        x: 2192,
        y: 944
      },
      {
        indice: 7,
        x: 2160,
        y: 944
      },
      {
        indice: 8,
        x: 2128,
        y: 944
      },
      {
        indice: 9,
        x: 2096,
        y: 944
      },
      {
        indice: 10,
        x: 2064,
        y: 944
      },
      {
        indice: 11,
        x: 2032,
        y: 944
      },
      {
        indice: 12,
        x: 2000,
        y: 944
      },
      {
        indice: 13,
        x: 1968,
        y: 944
      },
      {
        indice: 14,
        x: 1936,
        y: 944
      },
      {
        indice: 15,
        x: 1904,
        y: 944
      },
      {
        indice: 16,
        x: 1872,
        y: 944
      },
      {
        indice: 17,
        x: 1840,
        y: 944
      },
      {
        indice: 18,
        x: 1808,
        y: 944
      },
      {
        indice: 19,
        x: 1776,
        y: 944
      },
      {
        indice: 20,
        x: 2384,
        y: 944
      },
      {
        indice: 21,
        x: 2416,
        y: 944
      },
      {
        indice: 22,
        x: 2448,
        y: 944
      },
      {
        indice: 23,
        x: 2480,
        y: 944
      },
      {
        indice: 24,
        x: 2512,
        y: 944
      },
      {
        indice: 25,
        x: 2544,
        y: 944
      },
      {
        indice: 26,
        x: 2576,
        y: 944
      },
      {
        indice: 27,
        x: 2608,
        y: 944
      },
      {
        indice: 28,
        x: 2640,
        y: 944
      },
      {
        indice: 29,
        x: 2672,
        y: 944
      },
      {
        indice: 30,
        x: 2704,
        y: 944
      },
      {
        indice: 31,
        x: 3536,
        y: 240
      },
      {
        indice: 32,
        x: 3504,
        y: 240
      },
      {
        indice: 33,
        x: 3472,
        y: 240
      },
      {
        indice: 34,
        x: 3440,
        y: 240
      },
      {
        indice: 35,
        x: 3408,
        y: 176
      },
      {
        indice: 36,
        x: 3376,
        y: 176
      },
      {
        indice: 37,
        x: 3344,
        y: 176
      },
      {
        indice: 38,
        x: 3312,
        y: 176
      },
      {
        indice: 38,
        x: 3280,
        y: 208
      }
    ]
    this.rioborda.forEach((aguaborda) => {
      aguaborda.objeto = this.physics.add.sprite(aguaborda.x, aguaborda.y, 'aguaborda')
      aguaborda.objeto.anims.play('aguaborda-anim')
    })

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

      // this.blocoquebra = this.physics.add.sprite(590, 1442, 'blocoquebra')
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
    }
    this.portao = this.physics.add.sprite(560, 304, 'portao')
    this.blocovazio = this.physics.add.sprite(2320, 747, 'blocovazio')
    this.physics.add.overlap(this.personagemLocal, this.blocovazio, () => {
      this.aranhasAndam = true
    }, null, this)

    // Movimentos da aranha
    this.anims.create({
      key: 'aranha-andando',
      frames: this.anims.generateFrameNumbers('aranha', { start: 7, end: 10 }),
      frameRate: 9,
      repeat: -1
    })

    this.anims.create({
      key: 'aranha-some',
      frames: this.anims.generateFrameNumbers('aranha', { start: 0, end: 6 }),
      frameRate: 9
    })

    // Define o movimento da aranha para seguir o personagem
    this.aranhas = [
      {
        x: 2039,
        y: 784
      },
      {
        x: 1978,
        y: 880
      },
      {
        x: 2619,
        y: 784
      },
      {
        x: 2640,
        y: 880
      }
    ]
    this.aranhas.forEach((aranha) => {
      aranha.sprite = this.physics.add.sprite(aranha.x, aranha.y, 'aranha')
      aranha.sprite.anims.play('aranha-andando')
      this.physics.add.collider(aranha.sprite, this.layerparedemsm)
      this.physics.add.collider(aranha.sprite, this.layerarbustos)

      aranha.colisao = this.physics.add.overlap(aranha.sprite, this.personagemLocal, () => {
        this.physics.world.removeCollider(aranha.colisao)

        if (this.personagemLocal.texture.key.match(/ataque/)) {
          aranha.sprite.anims.play('aranha-some')
          aranha.sprite.once('animationcomplete', () => {
            aranha.sprite.disableBody(true, true)
          })
        } else {
          this.personagemLocal.setTint(0xff0000)
          setTimeout(() => {
            this.physics.world.colliders.add(aranha.colisao)
            this.personagemLocal.setTint(0xffffff)
          }, 1000)

          this.vida.setFrame(this.vida.frame.name + 1)
        }
      }, null, this)
    })

    this.layerpersonagempassa = this.tilemapMapa.createLayer('personagempassa', [this.tilesetFloresta, this.tilesetMasmorra])
    this.layertorre = this.tilemapMapa.createLayer('torre', [this.tilesetTorre])

    this.vida = this.add.sprite(220, 100, 'vida', 0)
      .setScrollFactor(0)

    // Define o atributo do tileset para gerar colisão
    this.layerparedemsm.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerparedemsm)

    // Define o atributo do tileset para gerar colisão
    this.layerarbustos.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagemLocal, this.layerarbustos)

    // Animação cristal
    this.anims.create({
      key: 'cristal-girando',
      frames: this.anims.generateFrameNumbers('cristal', {
        start: 0,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'cristal-coletado',
      frames: this.anims.generateFrameNumbers('cristal', {
        start: 6,
        end: 10
      }),
      frameRate: 10,
      repeat: 0
    })

    this.cristais = [
      {
        indice: 1,
        x: 2320,
        y: 602
      },
      {
        indice: 2,
        x: 2320,
        y: 660
      },
      {
        indice: 3,
        x: 2320,
        y: 789
      },
      {
        indice: 4,
        x: 2320,
        y: 848
      },
      {
        indice: 5,
        x: 2201,
        y: 848
      },
      {
        indice: 6,
        x: 2062,
        y: 848
      },
      {
        indice: 7,
        x: 1858,
        y: 848
      },
      {
        indice: 8,
        x: 2418,
        y: 850
      },
      {
        indice: 9,
        x: 2531,
        y: 848
      },
      {
        indice: 10,
        x: 2640,
        y: 848
      },
      {
        indice: 11,
        x: 2418,
        y: 1035
      },
      {
        indice: 12,
        x: 2204,
        y: 1104
      },
      {
        indice: 17,
        x: 2318,
        y: 1104
      },
      {
        indice: 13,
        x: 1840,
        y: 1104
      },
      {
        indice: 14,
        x: 2045,
        y: 1104
      },
      {
        indice: 15,
        x: 2535,
        y: 1104
      },
      {
        indice: 16,
        x: 2535,
        y: 1104
      },
      {
        indice: 18,
        x: 2702,
        y: 1136
      },
      {
        indice: 19,
        x: 2859,
        y: 1136
      },
      {
        indice: 20,
        x: 3218,
        y: 848
      },
      {
        indice: 21,
        x: 3413,
        y: 848
      },
      {
        indice: 22,
        x: 3403,
        y: 718
      },
      {
        indice: 23,
        x: 3403,
        y: 594
      },
      {
        indice: 24,
        x: 3570,
        y: 848
      },
      {
        indice: 25,
        x: 3820,
        y: 746
      },
      {
        indice: 26,
        x: 3511,
        y: 957
      }
    ]
    this.cristais.forEach((cristal) => {
      cristal.objeto = this.physics.add.sprite(cristal.x, cristal.y, 'cristal')
      cristal.objeto.anims.play('cristal-girando')
      cristal.overlap = this.physics.add.overlap(this.personagemLocal, cristal.objeto, () => {
        // Desativa o overlap entre personagem e nuvem
        cristal.overlap.destroy()

        // Anima a nuvem
        cristal.objeto.anims.play('cristal-coletado')

        // Assim que a animação terminar...
        cristal.objeto.once('animationcomplete', () => {
          // Desativa a nuvem (imagem e colisão)
          cristal.objeto.disableBody(true, true)
        })
      }, null, this)
    })

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
      key: 'personagem-ataque-frente',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 0, end: 5 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 21, end: 26 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-ataque-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 6, end: 11 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 42, end: 47 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-ataque-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 12, end: 17 }),
      frameRate: 12
    })

    this.anims.create({
      key: 'personagem-andando-tras',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 63, end: 68 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-ataque-tras',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key + 'ataque', { start: 18, end: 23 }),
      frameRate: 12,
      repeat: 1
    })

    // Inicia a animação padrão do personagem
    this.personagemLocal.anims.play('personagem-parado-frente')

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 200,
      y: 310,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })
    this.botao = this.add.sprite(600, 310, 'botao', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        this.botao.setFrame(1)
        this.personagemAtacando = true
        this.personagemLocal.anims.play('personagem-ataque-' + this.direcaoAtual)
          .on('animationcomplete', () => {
            this.personagemAtacando = false
          })
      })
      .on('pointerup', () => {
        this.botao.setFrame(0)
      })
    // Câmera
    this.cameras.main.startFollow(this.personagemLocal)
    this.cameras.main.setZoom(1.5)

    // Variáveis de velocidade e threshold
    this.speed = 150 // Velocidade constante do personagem
    this.threshold = 0.1 // Limite mínimo de força para considerar o movimento

    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      if (dados.gameover) {
        this.scene.stop('mapa')
        this.scene.start('finalTriste')
      }

      // Verifica se os dados recebidos contêm informações sobre o personagem
      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
      }

      if (dados.cristais) {
        this.cristais.forEach((cristal, i) => {
          // Desativa as nuvens que não estão visíveis
          if (!dados.cristais[i].visible) {
            cristal.objeto.disableBody(true, true)
          }
        })
      }

      if (dados.aranhas) {
        // Atualiza a visibilidade dos cartões
        this.aranhas.forEach((aranha, i) => {
          // Atualiza a visibilidade do cartão
          if (!dados.aranhas[i].visible) {
            aranha.sprite.disableBody(true, true)
          }
        })
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

          if (this.cristais) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              cristais: this.cristais.map(cristal => (cristal => ({
                visible: cristal.objeto.visible
              }))(cristal))
            }))
          }

          if (this.aranhas) {
            globalThis.game.dadosJogo.send(JSON.stringify({
              aranhas: this.aranhas.map(aranha => (aranha => ({
                visible: aranha.sprite.visible
              }))(aranha))
            }))
          }
        }
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do jogo: ', error)
    }

    if (this.aranhas && this.aranhasAndam) {
      this.aranhas.forEach((aranha) => {
        // aranha segue personagem mais próximo
        const hipotenusaPersonagemLocal = Phaser.Math.Distance.Between(
          this.personagemLocal.x,
          aranha.sprite.x,
          this.personagemLocal.y,
          aranha.sprite.y
        )

        const hipotenusaPersonagemRemoto = Phaser.Math.Distance.Between(
          this.personagemRemoto.x,
          aranha.sprite.x,
          this.personagemRemoto.y,
          aranha.sprite.y
        )

        // Por padrão, o primeiro jogador é o alvo
        let alvo = this.personagemLocal
        if (hipotenusaPersonagemLocal > hipotenusaPersonagemRemoto) {
          // Jogador 2 é perseguido pelo aranha
          alvo = this.personagemRemoto
        }

        // Sentido no eixo X
        const diffX = alvo.x - aranha.sprite.x
        if (diffX >= 10) {
          aranha.sprite.setVelocityX(40)
        } else if (diffX <= 10) {
          aranha.sprite.setVelocityX(-40)
        }

        // Sentido no eixo Y
        const diffY = alvo.y - aranha.sprite.y
        if (diffY >= 10) {
          aranha.sprite.setVelocityY(40)
        } else if (diffY <= 10) {
          aranha.sprite.setVelocityY(-40)
        }
      })
    }

    if (this.vida.frame.name === 3) {
      globalThis.game.dadosJogo.send(JSON.stringify({ gameover: true }))
      this.scene.stop('mapa')
      this.scene.start('finalTriste')
    }

    const cristaisColetados = this.cristais.filter(cristal => !cristal.objeto.active).length
    if (cristaisColetados === this.cristais.length) {
      this.scene.stop('mapa')
      this.scene.start('finalFeliz')
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

      console.log('x: ', this.personagemLocal.x)
      console.log('y: ', this.personagemLocal.y)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-direita', true)
          }
          this.direcaoAtual = 'direita'
        } else {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-esquerda', true)
          }
          this.direcaoAtual = 'esquerda'
        }
      } else {
        if (velocityY > 0) {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-frente', true)
          }
          this.direcaoAtual = 'frente'
        } else {
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-andando-tras', true)
          }
          this.direcaoAtual = 'tras'
        }
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagemLocal.setVelocity(0)
      switch (this.direcaoAtual) {
        case 'frente':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-frente', true)
          }
          break
        case 'direita':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-direita', true)
          }
          break
        case 'esquerda':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-esquerda', true)
          }
          break
        case 'tras':
          if (!this.personagemAtacando) {
            this.personagemLocal.anims.play('personagem-parado-tras', true)
          }
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
    if (this.personagemLocal.x === 3824 && this.personagemLocal.y === 656) {
      this.personagemLocal.setPosition(574, 1300)
      this.activateTeleportCooldown()
    }

    // Verifica se o personagem está nas proximidades das coordenadas especificadas para volta
    else if (this.personagemLocal.x >= 1800 && this.personagemLocal.x <= 1830 && this.personagemLocal.y === 1936) {
      this.personagemLocal.setPosition(3089, 816)
      this.activateTeleportCooldown()
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
}
