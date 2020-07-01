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
    socket.emit('entrarChat', usuario, function(resp) {
        // se actualiza lista de personas que ingresa a la sala
        renderizarUsuarios(resp);
    });
});

socket.on('listaPersonas', function(personas) {
    // se actualiza lista de personas que ingresa o sale de la sala
    renderizarUsuarios(personas);
});


// escuchar
socket.on('disconnect', function() {
    // enviando mensaje al server usuario desconectado
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('creaMensaje', function(mensaje) {
    //console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();
});


// escucha Mensaje privado
socket.on('mensajePrivado', function(mensaje) {
    //console.log('mensaje privado:', mensaje);
});