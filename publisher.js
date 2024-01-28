const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

var interval = setInterval( function() {
    sendData()
}, 2000)

client.on('message', () => {
    console.log('message')
})

function sendData(){
    console.log('publishing')
    
    // Gerar um número aleatório de 0 a 100 (apenas para fins de exemplo)
    const randomData = randomInt(0, 100)
    
    // Publicar o dado aleatório utilizando o tópico 'sensores/boltagem'
    client.publish('sensores/boltagem', randomData.toString(), () => {
        console.log('published:', randomData)
    })
}

function randomInt(low, high){
    return Math.floor(Math.random() * (high - low) + low);
}
