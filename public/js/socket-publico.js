var socket = io();

var ticketLabels = [];
var escritorioLabels = [];
for (var i = 0; i < 4; i++) {
    var ticketId = '#lblTicket' + (i+1);
    var escritorioId = '#lblEscritorio' + (i+1);
    ticketLabels.push($(ticketId));
    escritorioLabels.push($(escritorioId));
}

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

function actualizaHTML(ultimos4) {
    for (var i = 0; i < ultimos4.length; i++) {
        ticketLabels[i].text('Ticket ' + ultimos4[i].numero);
        escritorioLabels[i].text('Escritorio ' + ultimos4[i].escritorio);
    }
}

function onEstadoActual(data) {
    console.log(data);
    actualizaHTML(data.ultimos4);
    var audio = new Audio('audio/new-ticket.mp3');
    audio.play().catch(console.error);
}

socket.on('estadoActual', onEstadoActual);

requestReply('estadoActual').then(onEstadoActual).catch(console.error);
