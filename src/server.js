import express from 'express';
import WebSocket from 'ws';
import http from 'http';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (_, res) => res.render('home'));
// 위 지정하지 않은 다른 url로 접근하려할 때 자동으로 /로 리다이렉트
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log('Listening on http://localhost:3000');
// app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on('connection', (socket) => {
    sockets.push(socket);
    console.log('Connected to Browser');
    socket.on('close', () => {
        console.log('Disconnected from client');
    });
    socket.on('message', (msg) => {
        const message = msg.toString('utf-8');
        sockets.forEach((aSocket) => aSocket.send(message));
    });
});

server.listen(3000, handleListen);
