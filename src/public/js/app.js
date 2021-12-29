const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function enteredRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector('#roomTitle');
    roomTitle.innerHTML = roomName;
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