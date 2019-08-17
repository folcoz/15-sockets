var socket = io();

socket.on('connect', function() {
    console.log("Conectado al servidor");
});

socket.on('disconnect', function() {
    console.log("Desconectado del servidor");
});

var searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}

var escritorio = searchParams.get('escritorio');
var label = $('small');

$('#escritorio').text(escritorio);

$('button').on('click', function () {
    socket.emit('atenderTicket', {escritorio: escritorio}, function (resp) {
        if (resp && resp.numero) {
            label.text(resp.numero);
        } else {
            label.text('(No hay tickets)');
        }
    });
});
