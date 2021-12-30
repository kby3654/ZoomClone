import http from 'http';
import SocketIO from 'socket.io';
import express from 'express';

const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'))
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer)

wsServer.on('connection', socket => {
    // 발생하는 모든 이벤트 캐치
    socket.onAny((event, ...arg) => {
        console.log(`Socket Event: ${event}, args: `, arg);
    })
    socket.on('enter_room', (roomName, callback) => {
        socket.join(roomName);
        console.log(socket.rooms)
        // callback 함수는 front에서 실행됨
        callback(); 
        // 나를 제외한 방 사람에게 welcome 이벤트 실행
        socket.to(roomName).emit('welcome')
    })
})

httpServer.listen(port, () => console.log(`Listening on http://localhost:${port}`));
