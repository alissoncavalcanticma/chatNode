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

//Function de Message

function addMessage(type, user, msg) {
    let ul = document.querySelector('.chatList');

    switch (type) {
        case 'status':
            ul.innerHTML += '<li class="m-status">' + msg + '</li>';
            break;
        case 'msg':
            if (userName == user) {
                ul.innerHTML += '<li class="m-txt"><span class="me">' + user + '</span> ' + msg + '<li>';
            } else {
                ul.innerHTML += '<li class="m-txt"><span>' + user + '</span> ' + msg + '<li>';
            }
            break;
    }

    ul.scrollTop = ul.scrollHeight;
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

//listener para enviar o digitado no chat para a lista e limpar o ampo para novo texto

textInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        let txt = textInput.value.trim();
        textInput.value = '';

        if (txt != '') {
            addMessage('msg', userName, txt)
            socket.emit('send-msg', txt);
        }
    }
});

//escuta para ativar o chat após o login e reposta do server

socket.on('user-ok', (list) => {
    LoginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    //iniciar com foco no component chatTextInput
    textInput.focus();

    addMessage('status', null, 'Conectado!');

    userList = list;
    //função para renderizar a lista de users ativos
    renderList();
});

//escuta para receber lista atualizada de usuarios e informações

socket.on('list-update', (data) => {
    if (data.joined) {
        addMessage('status', null, data.joined + ' entrou no chat.');
    }

    if (data.left) {
        addMessage('status', null, data.left + ' saiu do chat.');
    }

    userList = data.list;
    renderList();
});

// escuta para receber msg no chat

socket.on('show-msg', (data) => {
    addMessage('msg', data.userName, data.message);
});

// socket para informe de desconexão

socket.on('disconnect', () => {
    addMessage('status', null, 'Você foi desconectado!');
    userList = [];
    renderList();
});


// socket para informe de tentativa de reconexão

socket.on('connect_error', () => {
    addMessage('status', null, 'Tentando reconectar....');
});

// socket para informe de tentativa de reconexão

socket.on('connect', () => {
    addMessage('status', null, 'Conectado!');

    if (userName != '') {
        socket.emit('join-request', userName);
    }
});