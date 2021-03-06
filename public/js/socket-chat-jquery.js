var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

//referencias JQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// funcion para renderizar usuarios (redireccionar paginas), recibe arreglo de usuarios [{},{},{}]
function renderizarUsuarios(personas) {
    html = '';
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"> <img src="assets/images/users/1.jpg" alt="user-img" style="width: 35px" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">  online</small></span></a>';
        html += '</li>';
    }
    html += '<li class="p-20"></li>';
    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
    // divChatbox
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ' ' + fecha.getMinutes();
    let adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }
    html = '';
    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html = '';
        html += '<li class="animated fadeIn">';
        html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listering
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(evento) {

    evento.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    //Enviar información
    socket.emit('creaMensaje', {
            nombre: nombre,
            mensaje: txtMensaje.val()
        },
        function(mensaje) {
            console.log('respuesta server: ', mensaje);
            txtMensaje.val('').focus();
            renderizarMensajes(mensaje, true);
            scrollBottom();
        });

});