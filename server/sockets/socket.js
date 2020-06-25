const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

var usuarios = new Usuarios();

io.on('connection', (client) => {
    // Escuchar el cliente
    client.on('entrarChat', (data, callback) => {
        console.log(data);
        if (!data.nombre || !data.sala) {
            return callback({
                ok: false,
                message: 'Debe Ingresar Nombre y Sala'
            });
        }
        // asocia al usuario a una sala
        client.join(data.sala);
        let personas = usuarios.agergarPersona(client.id, data.nombre, data.sala);
        // notifica solo a los usuarios de la misma sala
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasXsalas(data.sala));
        callback(usuarios.getPersonasXsalas(data.sala));
    });

    client.on('crearMensajeTodos', (data) => {
        console.log('creaMensajeTodos');
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('creaMensaje', mensaje);
    });

    client.on('disconnect', () => {
        let persona = usuarios.borrarPersona(client.id);
        client.broadcast.to(persona.sala).emit('creaMensaje', crearMensaje('Administrador', `${persona.nombre} abandono el chat.`));
        client.broadcast.to(persona.sala).emit('listaPersonas', usuarios.getPersonasXsalas(persona.sala));
    });

    //mensaje Privado
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        // en el broadcast el .to()  indica el id del usuario al cual quiero que le llegyue el mensaje privado
        client.broadcast.to(data.id_destino).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });
});