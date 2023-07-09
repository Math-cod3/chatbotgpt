//whatsapp-web.js import
const { Client, LocalAuth } = require('whatsapp-web.js');
// express imports
const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const fileUpload = require('express-fileupload');

//qrcode import
const qrcode = require('qrcode');
// node core modules imports
const http = require('http');
const server = http.createServer(app);
const fs = require('fs');
const path = require('path');
//socket.io import
const socketIO = require('socket.io');
const io = socketIO(server);

const port = process.env.PORT || 8000;
const routes = require('./routes')
require('dotenv').config()

const client = require('./config/whatsapp-web')
const handleMessage = require('./controllers/whatsappwebControllers/messageController');
// app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
extended: true
}));
app.use(fileUpload({
debug: true
}));

app.use(routes)


client.initialize();

//SOCKET IO

io.on('connection', function(socket) {
  socket.emit('message', 'Conectando...');

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'GPTChatbot QRCode recebido, aponte a câmera do seu celular!');
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


client.on('message', async function (message) {
  handleMessage(message);
});

process.on('exit', ()=> console.log('processo encerrado'))

process.on('exit', () =>{
const folder = path.join(__dirname, '../.wwebjs_auth')
const folder2 = path.join(__dirname, '../.wwebjs_cache')

fs.rmdir()(folder, folder2, (err)=>{
  if(err) console.log('Ocorreu um erro')

  console.log('removido com sucesso!')

})
})

server.listen(port, function() {
        console.log('App running on * http://localhost:'+ port);
});
