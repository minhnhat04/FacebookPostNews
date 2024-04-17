import { ObjectId } from 'mongodb';

class User {
    constructor(_id, name, email, pass, identity = 'user') {
        this._id = _id;
        this.name = name,
        this.email = email;
        this.pass = pass;
        this.identity = identity;
    }

    // insert a new post
    async save(db) {
        try {
            const result = await db.collection('users').insertOne(
                { ...this, identity: this.identity }
            )
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // get all user
    static async findAll(db) {
        try {
            const docs = await db.collection('users').find({}).toArray();
            return docs.map(doc => new User(doc._id, doc.name, doc.email, doc.pass, doc.identity));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // get a user based on id
    static async findById(db, id) {
        try {
            const objectId = new ObjectId(id);
            const doc = await db.collection('users').findOne({ _id: objectId });
            return doc ? new User(doc._id, doc.name, doc.email, doc.pass, doc.identity) : null;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // update a user based on id
    async update(db, id) {
        try {
            const result = await db.collection('users').updateOne(
                { _id: id },
                { $set: {name: this.name, email: this.email, pass: this.pass, identity: this.identity }}
            )
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // delete a user based on id
    static async delete(db, id) {
        try {
            const result = await db.collection('users').deleteOne({ _id: id });
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // get user by email
    static async findByEmail(db, email) {
        try {
            const result = await db.collection('users').findOne({email: email});
            return result ? new User(result._id, result.name, result.email, result.pass, result.identity) : null;
        } catch (err) {
            console.error(`Error: ${err}`);
            throw err;
        }
    }
}

export default User;
