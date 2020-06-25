class Usuarios {

    constructor() {
        this.personas = [];
    }
    agergarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(per => {
            return per.id === id;
        })[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasXsalas(sala) {
        let personasSala = this.personas.filter(pers => {
            return pers.sala === sala;
        });
        return personasSala;
    }

    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(pers => {
            return pers.id != id;
        });

        return personaBorrada;
    }

}

module.exports = {
    Usuarios: Usuarios
};