const http = require('http');
const fs = require('fs');
const mqtt = require('mqtt');
const url = require('url');

const PORT = 8883;
const brokerUrl = 'SEULINKDEMQTT';
const client = mqtt.connect(brokerUrl);

const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;

    if (path === '/events') {
       
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write('\n');

    
        client.on('message', (topic, message) => {
            res.write(`data: ${JSON.stringify({ topic: topic, message: message.toString() })}\n\n`);
        });
    } else if (path === '/subscribe') {
       
        const topic = url.parse(req.url, true).query.topic;
        client.subscribe(topic, (err) => {
            if (err) {
                console.error('Erro de se inscrever no topico:', topic, err);
                res.writeHead(500);
                res.end();
            } else {
                console.log('Inscrito no topico:', topic);
                res.writeHead(200);
                res.end();
            }
        });
    } else if (path === '/unsubscribe') {
  
        const topic = url.parse(req.url, true).query.topic;
        client.unsubscribe(topic, (err) => {
            if (err) {
                console.error('Erro de se desinscrever no topico', topic, err);
                res.writeHead(500);
                res.end();
            } else {
                console.log('Desinscrito no topico :', topic);
                res.writeHead(200);
                res.end();
            }
        });
    } else {
    
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) {
                console.error('Erro na leitura do html:', err);
                res.writeHead(500);
                res.end();
            } else {
                res.write(data);
                res.end();
            }
        });
    }
});


server.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}/`);
});


client.on('connect', () => {
    console.log('Conectado ao MQTT broker');
});

client.on('error', (error) => {
    console.error('MQTT erro de conexao', error);
});
