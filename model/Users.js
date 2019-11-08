let MongoDocument = require('./MongoDocument');

module.exports = class Users extends MongoDocument {
    constructor (data) {
        super(data);
        this.nome = data.nome;
        this.admin = data.admin;
        this.email = data.email;
        this.senha = data.senha;
        this.endereco = data.endereco;
        this._id = data._id;
        this.uploads = data.uploads;
        this.collection = 'users';
    }

    static findOne (_id) {
        return super.findOne(_id, 'users').then((result) => {
            return new Users(result);
        });
    }

    static find (query = {}, order = {nome: 1}, limit = 5) {
        return super.find(query, order, limit, 'users').then((result) => {
            return result.map((u) => new Users(u))
        });
    }
}
