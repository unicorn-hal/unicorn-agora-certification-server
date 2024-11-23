import express from 'express';
import { AgoraTokenGenerator } from './module/agora/ceretificate';
import { AuthenticationService } from './module/firebase/authentication_service';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORSとヘッダーの設定
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    if (req.method === 'OPTIONS') {
        res.sendStatus(204).end();
        return;
    }
    next();
});

// 認証ミドルウェア
app.use(async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) {
            res.status(403).send({ error: 'Forbidden' });
            return;
        }
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const authService = new AuthenticationService();

        await authService.verifyIdToken(bearerToken);
        next();
    } catch (error) {
        res.status(403).send({ error: 'Forbidden' });
    }
});

// リクエストボディのバリデーション
app.use((req, res, next) => {
    if (req.body.channelName === undefined || req.body.uid === undefined) {
        res.status(400).json({ error: 'Bad Request' });
        return;
    }
    next();
});

// トークンを取得するエンドポイント
app.post('/api/token', (req, res) => {
    const channelName: string = req.body.channelName;
    const uid: number = parseInt(req.body.uid);

    try {
        const agoraTokenGenerator = new AgoraTokenGenerator(channelName, uid);
        //  const token = agoraTokenGenerator.generateRtmTokenWithUid();
        const token = agoraTokenGenerator.generateRtcTokenWithUid();
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});