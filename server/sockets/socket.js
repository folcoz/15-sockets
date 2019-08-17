const { io } = require('../server');

const { TicketControl } = require('../classes/ticket-control');

let ticketControl = new TicketControl();

io.on('connection', (client) => {

    console.log('Usuario conectado: ' + client.id);

    // client.emit('enviarMensaje', {
    //     usuario: 'Administrador',
    //     mensaje: 'Bienvenido a esta aplicación'
    // });

    client.on('disconnect', () => {
        console.log('Usuario desconectado: ' + client.id);
    });

    // Escuchar el cliente
    // client.on('enviarMensaje', (data, callback) => {
    //     console.log(data);
    //     client.broadcast.emit('enviarMensaje', data);
    // });

    client.on('siguienteTicket', (data, callback) => {
        let respuesta = {
            ultimo: ticketControl.siguiente()
        };
        callback(respuesta);
        client.broadcast.emit('siguienteTicket', respuesta);
    });

    client.on('estadoActual', (data, callback) => {
        let respuesta = {
            ultimo: ticketControl.ultimoTicket(),
            ultimos4: ticketControl.ultimos4Tickets()
        }
        //client.broadcast.emit('estadoActual', respuesta);
        callback(respuesta);
    });

    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        if (atenderTicket !== 'No hay tickets pendientes') {
            client.broadcast.emit('estadoActual', {
                ultimo: ticketControl.ultimoTicket(),
                ultimos4: ticketControl.ultimos4Tickets()
            });
        }

        return callback(atenderTicket);
    });
});