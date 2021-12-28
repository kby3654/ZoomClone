const socket = new WebSocket(`ws://${window.location.host}`)
const messageForm = document.querySelector('#message')
const nicknameForm = document.querySelector('#nickname')
const messageList = document.querySelector('ul')

socket.addEventListener('open', () => {
    console.log('Connected to Server')
})

socket.addEventListener('message', message => {
    let li = document.createElement('li');
    li.innerText = message.data;
    messageList.appendChild(li)
    li = null;
})

socket.addEventListener('close', () => {
    console.log('Disconnected Server')
})

const createMessage = (type, payload) => JSON.stringify({ type, payload });

const handleMessage = (event) => {
    event.preventDefault();
    const input = messageForm.querySelector('input')
    socket.send(createMessage('new_message', input.value))
    input.value = '';
}

const handleNickname = (event) => {
    event.preventDefault();
    const input = nicknameForm.querySelector('input')
    socket.send(createMessage('nickname', input.value))
    input.value = '';
}

messageForm.addEventListener('submit', handleMessage);
nicknameForm.addEventListener('submit', handleNickname);