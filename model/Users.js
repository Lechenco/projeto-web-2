let MongoDocument = require('./MongoDocument');

module.exports = class Users extends MongoDocument {
    constructor (data) {
        super(data);
        this.nome = data.nome;
        this.email = data.email;
        this.senha = data.senha;
        this._id = data._id;
        this.collection = 'users';
    }

    static findOne (_id) {
        return super.findOne(_id, 'users').then((result) => {
            return new User(result);
        });
    }

    static find (query = {}, order = {nome: 1}, limit = 5) {
        return super.find(query, order, limit, 'users').then((result) => {
            return result.map((u) => new User(u))
        });
    }
}
