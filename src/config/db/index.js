import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb://localhost:27017/";

class Connection {  

  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    this.db = null; // Khởi tạo đối tượng cơ sở dữ liệu
  }

  async connect() {
    try {
      console.log("Connecting to MongoDB...");
      await this.client.connect();
      
      console.log("Connected to MongoDB successfully!");

      // Lưu đối tượng cơ sở dữ liệu đã kết nối vào thuộc tính db
      this.db = this.client.db("asmdb");

      return this.db;
    } catch (e) {
      console.error(e);
    }
  }

  async close() {
    await this.client.close();
    console.log("Closed MongoDB connection successfully");
  }

  // Hàm để trả về đối tượng cơ sở dữ liệu đã kết nối
  getDb() {
    if (!this.db) {
      throw new Error('Database is not connected');
    }
    return this.db;
  }
}

// Xuất đối tượng Connection
export default new Connection();
