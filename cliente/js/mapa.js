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
    this.load.spritesheet('personagem', './assets/personagens/personagem.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('blocoquebra', './assets/animaçoes/blocoquebra.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('aranha', './assets/inimigos/aranha.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
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

    this.blocoquebra = this.physics.add.sprite(400, 848, 'blocoquebra')
    this.personagem = this.physics.add.sprite(2285, 410, 'personagem')
    this.aranha = this.physics.add.sprite(2285, 600, 'aranha')

    // Define colisão entre o personagem e a aranha
    this.physics.add.collider(this.personagem, this.aranha)

    // Define o movimento da aranha para seguir o personagem
    this.physics.add.collider(this.aranha, this.layerparedemsm)
    this.physics.add.collider(this.aranha, this.layerarbustos)

    this.layerpersonagempassa = this.tilemapMapa.createLayer('personagempassa', [this.tilesetFloresta, this.tilesetMasmorra])
    this.layertorre = this.tilemapMapa.createLayer('torre', [this.tilesetTorre])

    // Define o atributo do tileset para gerar colisão
    this.layerparedemsm.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagem, this.layerparedemsm)

    // Define o atributo do tileset para gerar colisão
    this.layerarbustos.setCollisionByProperty({ collides: true })
    // Adiciona colisão entre o personagem e as paredes
    this.physics.add.collider(this.personagem, this.layerarbustos)

    // Torna a cena acessível globalmente
    window.scene = this

    // Movimentos do personagem
    this.anims.create({
      key: 'personagem-parado-frente',
      frames: this.anims.generateFrameNumbers('personagem', { start: 6, end: 11 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers('personagem', { start: 48, end: 53 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers('personagem', { start: 27, end: 32 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-tras',
      frames: this.anims.generateFrameNumbers('personagem', { start: 69, end: 74 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-frente',
      frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers('personagem', { start: 23, end: 26 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers('personagem', { start: 42, end: 47 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-tras',
      frames: this.anims.generateFrameNumbers('personagem', { start: 65, end: 68 }),
      frameRate: 8,
      repeat: -1
    })

    this.personagem.anims.play('personagem-parado-frente')

    // Movimentos inimigos

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

    this.aranha.anims.play('aranha-parada')

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 120,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })

    // Câmera
    this.cameras.main.startFollow(this.personagem)

    // Variáveis de velocidade e threshold
    this.speed = 150 // Velocidade constante do personagem
    this.threshold = 0.1 // Limite mínimo de força para considerar o movimento
  }

  update () {
    this.handleJoystickMove()
    this.checkTeleport()
    this.moveAranha()
  }

  handleJoystickMove () {
    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > this.threshold) {
      const velocityX = Math.cos(angle) * this.speed
      const velocityY = Math.sin(angle) * this.speed

      this.personagem.setVelocity(velocityX, velocityY)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.personagem.anims.play('personagem-andando-direita', true)
          this.direcaoAtual = 'direita'
        } else {
          this.personagem.anims.play('personagem-andando-esquerda', true)
          this.direcaoAtual = 'esquerda'
        }
      } else {
        if (velocityY > 0) {
          this.personagem.anims.play('personagem-andando-frente', true)
          this.direcaoAtual = 'frente'
        } else {
          this.personagem.anims.play('personagem-andando-tras', true)
          this.direcaoAtual = 'tras'
        }
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagem.setVelocity(0)
      switch (this.direcaoAtual) {
        case 'frente':
          this.personagem.anims.play('personagem-parado-frente', true)
          break
        case 'direita':
          this.personagem.anims.play('personagem-parado-direita', true)
          break
        case 'esquerda':
          this.personagem.anims.play('personagem-parado-esquerda', true)
          break
        case 'tras':
          this.personagem.anims.play('personagem-parado-tras', true)
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
    if (this.personagem.x >= 3093 && this.personagem.x <= 3095 && this.personagem.y === 816) {
      this.personagem.setPosition(1840, 1935)
      this.activateTeleportCooldown()
    }

    // Verifica se o personagem está nas proximidades das coordenadas especificadas para volta
    else if (this.personagem.x >= 1800 && this.personagem.x <= 1830 && this.personagem.y === 1936) {
      this.personagem.setPosition(3089, 816)
      this.activateTeleportCooldown()
    }
    // entra masmorra
    if (this.personagem.x === 2544 && this.personagem.y <= 1778) {
      // Define a nova posição do personagem
      this.personagem.setPosition(578, 1200)
    }
    // volta masmorra
    if (this.personagem.x >= 560 && this.personagem.x <= 592 && this.personagem.y === 1264) {
      // Define a nova posição do personagem
      this.personagem.setPosition(2544, 1780)
    }
    // sai masmorra
    if (this.personagem.x === 560 && this.personagem.y === 272) {
      // Define a nova posição do personagem
      this.personagem.setPosition(2285, 410)
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

  moveAranha () {
    // Define a velocidade de movimento da aranha
    const aranhaSpeed = 50

    // Calcula a direção para mover a aranha em direção ao personagem
    const dx = this.personagem.x - this.aranha.x
    const dy = this.personagem.y - this.aranha.y
    const angle = Math.atan2(dy, dx)

    // Define a velocidade da aranha em direção ao personagem
    this.aranha.setVelocity(Math.cos(angle) * aranhaSpeed, Math.sin(angle) * aranhaSpeed)

    // Animação da aranha
    if (this.aranha.body.velocity.x !== 0 || this.aranha.body.velocity.y !== 0) {
      this.aranha.anims.play('aranha-andando', true)
    } else {
      this.aranha.anims.play('aranha-parada', true)
    }
  }
}
