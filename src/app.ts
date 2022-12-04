import express, { Application } from "express";
import mongoose from "mongoose";

// Express のアプリケーションを作成
const app: Application = express();

// Mongoose のスキーマを作成
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, // 型を指定する
            required: true, // 必須カラムかどうか
        },
    },
);
const usersResource = mongoose.model("users", userSchema);

// リクエストボディを JSON で取得するための設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 「GET /users」のルーティングと処理を記述
app.get("/users", async (req, res) => {
    // users から全件取得する
    const users = await usersResource.find();
    res.status(200).json(users);
});
// 「POST /users」のルーティングと処理を記述
app.post("/users", async (req, res) => {
    const body = req.body;
    try {
        // users に書き込む
        await usersResource.create(body);
        res.status(200).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
});
// 「PUT /users/{:id}」のルーティングと処理を記述
app.put("/users/:id", async (req, res) => {
    const id = req.params.id
    const body = req.body;
    try {
        // 指定した id に対し更新をかける。 id が見つからなかったら失敗扱いにする。
        await usersResource.findByIdAndUpdate({ _id: id }, body).orFail();
        res.status(200).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
});
// 「DELETE /users/{:id}」のルーティングと処理を記述
app.delete("/users/:id", async (req, res) => {
    const id = req.params.id
    try {
        // 指定した id を削除する。 id が見つからなかったら失敗扱いにする。
        await usersResource.findByIdAndDelete({ _id: id }).orFail();
        res.status(200).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
});

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
    } catch (e: any) {
        console.error(e.message);
    }
})();
