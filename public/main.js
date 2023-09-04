//Estabelecendo conexão com socket, simulando um client
//se fosse fazer a conexão com um server específico, deveria especificar ele na função: 
//const socket = io(localhost.......);
const socket = io();

let userName = '';
let userList = [];

let LoginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderList() {
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(i => {
        ul.innerHTML += '<li>' + i + '</li>'
    });
}

//socket para login no chat
loginInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        let name = loginInput.value.trim();
        if (name != '') {
            userName = name;
            document.title = 'Chat (' + userName + ')';

            socket.emit('join-request', userName);
        }
    }
});

//escuta para ativar o chat após o login e reposta do server

socket.on('user-ok', (list) => {
    LoginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    //iniciar com foco no component chatTextInput
    textInput.focus();

    userList = list;
    //função para renderizar a lista de users ativos
    renderList();
});