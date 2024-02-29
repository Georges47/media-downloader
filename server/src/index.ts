import express, {Express, Request, Response} from "express";
import cors from 'cors';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

const app: Express = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/info/:videoId', async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;
        const videoInfo = await ytdl.getInfo(videoId);
        return res.json({ title: videoInfo.videoDetails.title })
    } catch (error) {
        console.log(error);
        // @ts-ignore
        res.json({ success: false, error: error.message });
    }
});

app.post('/download', async (req: Request, res: Response) => {
    try {
        const { videoId } = req.body;

        res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
        res.header('Content-Type', 'audio/mp3');

        const stream = ytdl(videoId, {
            quality: 'highestaudio',
        });

        ffmpeg()
            .input(stream)
            .audioBitrate(128)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .pipe(res, { end: true });
    } catch (error) {
        console.log(error);
        // res.json({ success: false, error: error.message });
    }
});
