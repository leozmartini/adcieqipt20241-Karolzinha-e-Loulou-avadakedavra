import Phaser from 'phaser'
import axios from 'axios'

export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () {
    this.load.image('finalFeliz', './assets/finalFeliz.png')
  }

  create () {
    this.add.image(400, 225, 'finalFeliz')
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })

    // Inicializa o Google Sign-In
    globalThis.google.accounts.id.initialize({
      client_id: '331191695151-ku8mdhd76pc2k36itas8lm722krn0u64.apps.googleusercontent.com',
      callback: async (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 16, // id do jogo cadastrado no banco de dados da Feira de Jogos
            value: 100, // crédito em tijolinhos
            CSRF: await this.generateCSRFToken()
          }, {
            headers: {
              Authorization: `Bearer ${res.credential}`
            }
          })
            .then(function (response) {
              console.log(response)
            })
            .catch(function (error) {
              console.error(error)
            })
        }
      }
    })

    // Exibe o prompt de login
    globalThis.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        globalThis.google.accounts.id.prompt()
      }
    })
  }

  update () { }

  async generateCSRFToken() {
    const encoder = new TextEncoder();
  
    const nonceArray = new Uint8Array(16);
    crypto.getRandomValues(nonceArray);
    const nonce = Array.from(nonceArray, byte => byte.toString(16).padStart(2, '0')).join('');
    
    const ts = Date.now().toString();
    
    const ivArray = new Uint8Array(16);
    crypto.getRandomValues(ivArray);
    const iv = Array.from(ivArray, byte => byte.toString(16).padStart(2, '0')).join('');
    
    const keyMaterialBuffer = await crypto.subtle.digest("SHA-256", encoder.encode('feira-de-jogos'));
    const keyMaterial = new Uint8Array(keyMaterialBuffer);
    const key = await crypto.subtle.importKey(
      "raw", keyMaterial, { name: "AES-CTR" }, false, ["encrypt"]
    );
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CTR", counter: ivArray, length: 64 },
      key,
      encoder.encode(ts)
    );
    
    const encTs = Array.from(new Uint8Array(encrypted), byte => byte.toString(16).padStart(2, '0')).join('');
    const payload = `${nonce}:${iv}:${encTs}`;
    
    const hmacKey = await crypto.subtle.importKey(
      "raw", keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", hmacKey, encoder.encode(payload));
    const sig = Array.from(new Uint8Array(signatureBuffer), byte => byte.toString(16).padStart(2, '0')).join('');
    
    return `${nonce}:${iv}:${encTs}:${sig}`;
  }
  
}
