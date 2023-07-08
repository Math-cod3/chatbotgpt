const client = require('../../config/whatsapp-web')
const commands = require('../../controllers/openAIControllers/commandControllers')

client.on('message', async msg => {

    const nomeContato = msg._data.notifyName;
    const content = `mensagem de:${nomeContato}\n\r${msg.body}`
    const firstWord = msg.body.substring(0, msg.body.indexOf(" "))
  
    const commands = {
      davinci: '/bot',
      dalle: '/img'
    }
  
    console.log(content)
  
    const antonioContato = "numero do antonio"
  
    if(msg.body !== null && msg.getContact == antonioContato){
      msg.reply('Erro: Desculpe mais ocorreu um erro devido as configuração no WhatsApp.\n\rPor favor, certifique-se de ter a versão mais recente do WhatsApp instalada.\n\rClick no link abaixo e seja direcionado ao um video rápido.Agradecemos sua compreensão.\n\r https://www.youtube.com/watch?v')
    }
  
    if (msg.type.toLowerCase() == "e2e_notification") return null;
    
    if (msg.body == "") return null;
  
  
    else if (msg.body !== null && msg.body === "4") {
  
          const contact = await msg.getContact();
          setTimeout(function() {
              msg.reply(`@${contact.number}` + ' seu contato já fo');  
              client.sendMessage('8@c.us' + `${contact.number}`);
            },1000 + Math.floor(Math.random() * 1000));
    
    }
  
    else if (msg.body !== null && msg.body === "5"){
      const contact = await msg.getContact();
      client.sendMessage('5521976869618c.us')
  
      console.log(contact)
    }
  });

module.exports = client