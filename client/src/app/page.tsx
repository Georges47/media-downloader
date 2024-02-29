'use client'

import {FormEvent, useState} from 'react';

export default function Home() {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [processingVideo, setProcessingVideo] = useState<boolean>(false);

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setProcessingVideo(true);
        try {
            const videoId = videoUrl.split('v=')[1];

            const infoResponse = await fetch('http://localhost:3001/info/' + videoId, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', },
            });
            const videoInfo = await infoResponse.json();

            const downloadResponse = await fetch('http://localhost:3001/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    videoId: videoId,
                }),
            });
            const blob = await downloadResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = videoInfo.title + '.mp3';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setProcessingVideo(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <h1>Youtube MP3 Downloader</h1>
            <div className='form-container'>
                <form onSubmit={(event) => handleFormSubmit(event)}>
                    <div className='form-content'>
                        <input
                            className='video-url-input'
                            type="text"
                            placeholder='URL'
                            value={videoUrl}
                            onChange={(event) => setVideoUrl(event.target.value)}
                        />
                        <button type="submit" disabled={processingVideo}>Download</button>
                    </div>
                </form>
            </div>
            {processingVideo && <p>Loading...</p>}
        </main>
    );
}
