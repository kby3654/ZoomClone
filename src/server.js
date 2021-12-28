import http from 'http';
import WebSocket from "ws";
import express from 'express';

const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'))
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${port}`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function onSocketClose() {
    console.log('Disconnected from Browser')
}

const sockets = [];

wss.on('connection', socket => {
    console.log('Connected to Browser')
    sockets.push(socket);
    socket.nickname = 'JohnDoe';
    socket.on('close', onSocketClose)
    socket.on('message', (message, isBinary) => {
        const msg = JSON.parse(isBinary ? message : message.toString('utf8'));
        switch(msg.type) {
            case 'new_message':
                sockets.forEach(sock => sock.send(msg));
                break
            case 'nickname':
                socket.nickname = msg.payload;
                break
        }
    })
})

server.listen(port, handleListen)
