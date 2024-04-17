import Post from "../models/Post.js";
import connection from "../../config/db/index.js";
import { ObjectId } from "mongodb";

class PostController {
  // GET /posts
  index(req, res) {
    connection.connect().then(async (db) => {
      try {
        const result = await Post.findAll(db);
        res.render("post/post", { posts: result });
      } catch (err) {
        console.error(err);
      }
    });
  }

  // GET /posts/:idz
  detail(req, res) {
    connection.connect().then(async (db) => {
      try {
        const result = await Post.findById(db, new ObjectId(req.params.id));
        res.render("post/detail", { post: result });
      } catch (err) {
        console.error(err);
      }
    });
  }

  // GET /posts/create
  create(req, res) {
    res.render("post/create");
  }

  // POST /posts/store
  store(req, res) {
    console.log(req.body);
    connection.connect().then(async (db) => {
      try {
        const post = new Post(
          undefined,
          req.body.content,
          req.body.img
        );
        const result = await post.save(db);
        console.log(result);
        res.redirect("/");
      } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
      }
    });
  }

  // POST /posts/delete
  delete(req, res) {
    const postId = req.body.postId; // Lấy id của bài viết cần xóa từ req.body
    if (!postId) {
        return res.status(400).send("ID của bài viết không được cung cấp");
    }

    connection.connect().then(async (db) => {
        try {
            const result = await Post.delete(db, new ObjectId(postId)); // Sử dụng ObjectId để tạo ObjectId từ string postId
            console.log(result);
            // Trả về một mã JavaScript để hiển thị thông báo thành công và tải lại trang
            res.send('<script>alert("Bài viết đã được xóa thành công."); window.location.href = "/user/myAcc";</script>');
        } catch (err) {
            console.error(err);
            res.status(500).send("An error occurred");
        }
    });
}


}

export default new PostController();
