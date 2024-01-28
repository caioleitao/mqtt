const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://broker.hivemq.com')


client.on('connect', () => {
    console.log('connected')
    client.subscribe('sensores/voltagem', function(err) {
        if (err) {
            console.error('Erro ao se inscrever no tópico: ' + err);
        } else {
            console.log('Inscrito no tópico sensores/voltagem');
        }
    });
})

client.on('message', (topic, message) => {
    console.log('received message %s %s', topic, message)
})
