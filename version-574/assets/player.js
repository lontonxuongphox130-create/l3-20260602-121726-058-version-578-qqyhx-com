import { H as Hls } from './hls.js';

const video = document.getElementById('video-player');

if (video) {
    const source = video.dataset.src;

    if (source) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.insertAdjacentHTML('afterend', '<p class="player-error">当前浏览器不支持 HLS 播放，请使用新版 Chrome、Edge、Safari 或移动端浏览器访问。</p>');
        }
    }
}
