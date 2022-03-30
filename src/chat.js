import http from 'http';
import { Server } from 'socket.io';
import { instrument } from "@socket.io/admin-ui";
import express from 'express';

const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'))
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
// SocketIo 관리자 도구
const wsServer = new Server(httpServer, {
    cors: {
        origin: ['https://admin.socket.io'],
        credentials: true,
    }
})
// SocketIo 관리자 도구
instrument(wsServer, {
    auth: false
})

function publicRooms() {
    const {
        sockets: {
            adapter: {
                sids, rooms
            }
        }
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key)
        }
    })
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size
}

wsServer.on('connection', socket => {
    socket.nickname = 'Anonymous';
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
        socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
        wsServer.sockets.emit('room_change', publicRooms());
    })

    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => {
            // 아직 room을 떠나지 않았기 때문에 나도 계산됨 그래서 -1
            socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1);
        })
    })

    socket.on('disconnect', () => {
        wsServer.sockets.emit('room_change', publicRooms());
    })

    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
        done();
    })

    socket.on('nickname', (nickname) => {
        socket.nickname = nickname;
    })
})

httpServer.listen(port, () => console.log(`Listening on http://localhost:${port}`));
