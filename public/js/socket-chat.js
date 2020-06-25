var socket = io();

// recepción del usuario que se esta conectando
var params = new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('Debe Ingresar Usuario/Sala');
}
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};
//// fin recepcion del usuario

// escuchar y emitir
socket.on('connect', function() {
    //console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('usuarios conectados: ', resp);
    });
});

// escuchar
socket.on('disconnect', function() {
    // enviando mensaje al server usuario desconectado
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('creaMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

socket.on('listaPersonas', function(personas) {
    console.log('Servidor:', personas);
});

// Mensaje privado
socket.on('mensajePrivado', function(mensaje) {
    console.log('mensaje privado:', mensaje);
});

// Enviar información
//socket.emit('enviarMensaje', { usuario: 'Fernando' }, function(resp) {
//    console.log('respuesta server: ', resp);
//});