const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

function enteredRoom() {
    welcome.hidden = true;
    room.hidden = false;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input')
    const roomTitle = room.querySelector('#roomTitle')
    // 원하는 커스텀 이벤트 가능
    // callback 함수는 반드시 마지막 argument
    const roomName = input.value

    roomTitle.innerHTML = roomName;
    socket.emit('enter_room', roomName, enteredRoom);
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);