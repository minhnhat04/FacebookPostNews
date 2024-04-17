    class Post {
        constructor(_id, content,img) {
            this._id = _id;
            this.content = content;
            this.img = img;
        }

        // insert a new post
        async save(db) {
            try {
                const result = await db.collection('posts').insertOne(
                    this
                )
                return result;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }

        // get all posts
        static async findAll(db) {
            try {
                const docs = await db.collection('posts').find({}).toArray();
                return docs.map(doc => new Post(doc._id, doc.content, doc.img));
            } catch (err) {
                console.error(err);
                throw err;
            }
        }

        // get a post based on id
        static async findById(db, id) {
            try {
                const doc = await db.collection('posts').findOne({ _id: id });
                return doc;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }

        // update a post based on id
        async update(db, id) {
            try {
                const result = await db.collection('posts').updateOne(
                    { _id: id },
                    { $set: { img: this.img, content: this.content} }
                )
                return result;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }

        // delete a post based on id
        static async delete(db, id) {
            try {
                const result = await db.collection('posts').deleteOne({ _id: id });
                return result;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    }

    export default Post;