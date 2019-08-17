var socket = io();

var lblNuevoTicket = $('#lblNuevoTicket');

socket.on('connect', function() {
    console.log("Conectado al servidor");
});

socket.on('disconnect', function() {
    console.log("Desconectado del servidor");
});

function requestReply(command, data) {
    return new Promise(function (resolve, reject) {
        socket.emit(command, data, function replyFunc(resp) {
            resolve(resp);
        });
    });
}

function mostrarSiguienteTicket(data) {
    console.log(data.ultimo);
    lblNuevoTicket.text(data.ultimo);
}

socket.on('siguienteTicket', function(data) {
    mostrarSiguienteTicket(data);
});

$('button').on('click', function() {
    requestReply('siguienteTicket', null).then(mostrarSiguienteTicket).catch(console.error);
});

requestReply('estadoActual').then(function (data) {
    console.log(data);
    mostrarSiguienteTicket(data);
}).catch(console.error);
