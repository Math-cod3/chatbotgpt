const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({
extended: true
}));
app.use(fileUpload({
debug: true
}));

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});
// OPENIA CONFIGURATION
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'pharma-bot' }),
  puppeteer: { headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ] }
});

client.initialize();

io.on('connection', function(socket) {
  socket.emit('message', 'Conectando...');

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'GPTChatbot QRCode recebido, aponte a câmera  seu celular!');
    });
});

client.on('ready', () => {
    socket.emit('ready', 'GPTChatbot Dispositivo pronto!');
    socket.emit('message', 'GPTChatbot Dispositivo pronto!');	
    console.log('GPTChatbot Dispositivo pronto');
});

client.on('authenticated', () => {
    socket.emit('authenticated', 'GPTChatbot Autenticado!');
    socket.emit('message', 'GPTChatbot Autenticado!');
    console.log('GPTChatbot Autenticado');
});

client.on('auth_failure', function() {
    socket.emit('message', 'GPTChatbot Falha na autenticação, reiniciando...');
    console.error('GPTChatbot Falha na autenticação');
});

client.on('change_state', state => {
  console.log('GPTChatbot Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
  socket.emit('message', 'GPTChatbot Cliente desconectado!');
  console.log('GPTChatbot Cliente desconectado', reason);
  client.initialize();
});
});

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = req.body.number + '@c.us';
  const message = req.body.message;


  client.sendMessage(number, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

const getDavinciResponse = async (clientText) => {
  const options = {
      model: "text-davinci-003", // Modelo GPT a ser usado
      prompt: clientText, // Texto enviado pelo usuário
      temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
      max_tokens: 4000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
  }

  try {
      const response = await openai.createCompletion(options)
      let botResponse = ""
      response.data.choices.forEach(({
          text
      }) => {
          botResponse += text
      })
      return `Chat GPT 🤖\n\n ${botResponse.trim()}`
  } catch (e) {
      return `❌ Response Error!: ${e.response.data.error.message}`
  }
}

client.on('message', async msg => {

  const nomeContato = msg._data.notifyName;
  const content = `mensagem de:${nomeContato}\n\r${msg.body}`

  console.log(content)

  if (msg.type.toLowerCase() == "e2e_notification") return null;
  
  if (msg.body == "") return null;

  else if (msg.body !== null && msg.body === "4") {

        const contact = await msg.getContact();
        setTimeout(function() {
            msg.reply(`@${contact.number}` + ' seu contato já foi encaminhado para o Pedrinho');  
            client.sendMessage('5521976869618@c.us' + `${contact.number}`);
          },1000 + Math.floor(Math.random() * 1000));
  
  }

  else if (msg.body !== null && msg.body === "5"){
    const contact = await msg.getContact();
    client.sendMessage('5521976869618@c.us')

    console.log(contact)
  }
});

server.listen(port, function() {
        console.log('App running on * http://localhost:'+ port);
});
