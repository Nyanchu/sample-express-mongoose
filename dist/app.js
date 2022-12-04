import express from "express";
import mongoose from "mongoose";
// Express のアプリケーションを作成
const app = express();
// 「GET /」のルーティングと処理を記述
app.get("/", (req, res) => {
    res.send("Hello World!!");
});
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.disable("x-powered-by");
// Express を立ち上げるポート番号
const EXPRESS_PORT = 3000;
// Mongoose のコネクションストリング
const MONGOOSE_URI = "mongodb://root:password@localhost:27017/test?authSource=admin";
(async function main() {
    // MongoDB への接続
    await mongoose.connect(MONGOOSE_URI);
    try {
        // 指定したポートでリッスンするサーバを立ち上げる
        app.listen(EXPRESS_PORT, () => {
            console.log("server running");
        });
    }
    catch (e) {
        console.error(e.message);
    }
})();
