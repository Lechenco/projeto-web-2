let MongoDocument = require('./MongoDocument');

module.exports = class Posts extends MongoDocument {
    constructor (data) {
        super(data);
        this.imagem = data.imagem;
        this.descricao = data.descricao;
        this.data = data.data;
        this._id = data._id;
        this.collection = 'posts';
    }

    static findOne (_id) {
        return super.findOne(_id, 'posts').then((result) => {
            return new Posts(result);
        });
    }

    static find (query = {}, order = {nome: 1}, limit = 5) {
        return super.find(query, order, limit, 'posts').then((result) => {
            return result.map((u) => new Posts(u))
        });
    }
}
