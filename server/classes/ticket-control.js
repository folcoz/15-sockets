const fs = require('fs');
const path = require('path');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
    
    constructor() {
        this.resetState();

        let data = require('../../data/data.json');
        
        if (this.hoy === data.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.saveData();
        }
    }

    resetState() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
    }

    saveData() {
        let data = {
            ultimo: this.ultimo, 
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };
        let filepath = path.join(process.cwd(), 'data', 'data.json');
        console.log("Updating TicketControl data file:", filepath);
        fs.writeFileSync(filepath, JSON.stringify(data), {});
        // fs.writeFile(filepath, JSON.stringify(data), {}, err => {
        //     if (err) {
        //         console.error("Error writing data.json", err);
        //     }
        // });
    }

    siguiente() {
        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo);
        this.tickets.push(ticket);

        this.saveData();

        return this.ultimoTicket();
    }

    ultimoTicket() {
        return `Ticket ${this.ultimo}`;
    }

    ultimos4Tickets() {
        return this.ultimos4;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return 'No hay tickets pendientes';
        }

        let numeroTicket = this.tickets[0].numero;
        this.tickets.shift();

        let ticketAsignado = new Ticket(numeroTicket, escritorio);
        this._updateUltimos4(ticketAsignado);

        this.saveData();
        
        return ticketAsignado;
    }

    _updateUltimos4(ticketAsignado) {
        this.ultimos4.unshift(ticketAsignado)
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }
    }
}

module.exports = {
    TicketControl
}