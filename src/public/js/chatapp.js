const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
let roomName;
room.hidden = true;

function addMessage(message) {
    const ul = room.querySelector('ul');
    let li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
    li = null;
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#msg input')
    const value = input.value
    socket.emit('new_message', input.value, roomName, () => {
        addMessage(`You: ${value}`)
    });
    input.value = '';
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#name input')
    socket.emit('nickname', input.value);
}

function enteredRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector('#roomTitle');
    roomTitle.innerHTML = roomName;

    const msgForm = room.querySelector('#msg');
    const nameForm = room.querySelector('#name');
    msgForm.addEventListener('submit', handleMessageSubmit)
    nameForm.addEventListener('submit', handleNicknameSubmit)
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input')
    // 원하는 커스텀 이벤트 가능
    // callback 함수는 반드시 마지막 argument
    roomName = input.value

    socket.emit('enter_room', roomName, enteredRoom);
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (nickname, newCount) => {
    const roomTitle = room.querySelector('#roomTitle');
    roomTitle.innerHTML = `Room ${roomName} (${newCount})`;
    addMessage(`${nickname} joined`)
})

socket.on('bye', (nickname, newCount) => {
    const roomTitle = room.querySelector('#roomTitle');
    roomTitle.innerHTML = `Room ${roomName} (${newCount})`;
    addMessage(`${nickname} left`)
})

socket.on('new_message', (msg) => {
    addMessage(msg)
})

socket.on('room_change', rooms => {
    const roomList = welcome.querySelector('ul');
    if (!rooms.length) {
        roomList.innerHTML = '';
        return;
    }
    rooms.forEach(room => {
        let li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
        li = null;
    })
})