export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    // Carregar os sons

    // Carregar o mapa
    this.load.tilemapTiledJSON('mapa', './assets/mapa/umapinha.json')

    // Carregar as imagens do mapa
    this.load.image('geral', './assets/mapa/tilesetnovo.png')
    this.load.image('masmorra', './assets/mapa/tilesetnovodungeon.png')

    // Carregar spritesheets
    this.load.spritesheet('personagem', './assets/personagens/personagem.png', { frameWidth: 32, frameHeight: 32 })

    // Carrega o plugin do joystick virtual
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)

  }

  create () {
    // Adiciona ponteiro
    this.input.addPointer(3)

    // Adiciona o som de fundo e de objetos


    // Cria objeto do mapa
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    // Cria os tilesets do mapa
    this.tilesetFloresta = this.tilemapMapa.addTilesetImage('geral')
    this.tilesetMasmorra = this.tilemapMapa.addTilesetImage('masmorra')

    // Camadas do mapa
    this.layerchaofaltando = this.tilemapMapa.createLayer('chaofaltando', [this.tilesetFloresta])
    this.layerchao = this.tilemapMapa.createLayer('chao', [this.tilesetFloresta])
    this.layerflores = this.tilemapMapa.createLayer('flores', [this.tilesetFloresta])
    this.layerarvores = this.tilemapMapa.createLayer('arvores', [this.tilesetFloresta])
    this.layercerca = this.tilemapMapa.createLayer('cerca', [this.tilesetFloresta])
    this.layerlampada = this.tilemapMapa.createLayer('lampada', [this.tilesetFloresta])


    // Criação do personagem e suas animações
    this.personagem = this.physics.add.sprite(1000, 400, 'personagem')

    // Movimentos do personagem
    this.anims.create({
      key: 'personagem-parado-frente',
      frames: this.anims.generateFrameNumbers('personagem', { start: 7, end: 12 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers('personagem', { start: 49, end: 54 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers('personagem', { start: 28, end: 33 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-parado-tras',
      frames: this.anims.generateFrameNumbers('personagem', { start: 70, end: 75 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-frente',
      frames: this.anims.generateFrameNumbers('personagem', { start: 1, end: 6 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers('personagem', { start: 22, end: 27 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers('personagem', { start: 43, end: 48 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-andando-tras',
      frames: this.anims.generateFrameNumbers('personagem', { start: 64, end: 69 }),
      frameRate: 8,
      repeat: -1
    })



    this.personagem.anims.play('personagem-parado-frente')

    // Configuração do plugin do joystick virtual
    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 120,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })


    // camera
    this.cameras.main.startFollow(this.personagemLocal)

    handleJoystickMove() 
      //const speed = 100 // Velocidade constante do personagem
     // const threshold = 0.1 // Limite mínimo de força para considerar o movimento
    
    // Movimenta o personagem com base na direção do joystick
    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > threshold) {
      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed

      this.personagem.setVelocity(velocityX, velocityY)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.personagem.anims.play('personagem-andando-direita', true)
        } else {
          this.personagem.anims.play('personagem-andando-esquerda', true)
        }
      } else {
        if (velocityY > 0) {
          this.personagem.anims.play('personagem-andando-frente', true) // Mude isso se houver uma animação de movimento para baixo
        } else {
          this.personagem.anims.play('personagem-andando-tras', true) // Mude isso se houver uma animação de movimento para cima
        }
      }
    } else {
      salsicha - caramelo
      // Se a força do joystick for baixa, o personagem para
      this.personagem.setVelocity(0)
      this.personagem.anims.play('personagem-parado-frente', true)
    }
  }

  update () {
    this.handleJoystickMove()
  }
}
