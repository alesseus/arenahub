export type PlayerYouTube = {
    playVideo(): void;
    pauseVideo(): void;
    mute(): void;
    seekTo(secondi: number, consentiRicerca: boolean): void;
    destroy(): void;
};

type EventoPlayer = {
    target: PlayerYouTube;
    data: number;
};

type OpzioniPlayer = {
    host?: string;
    videoId: string;
    playerVars?: Record<string, string | number>;
    events?: {
        onReady?: (e: EventoPlayer) => void;
        onStateChange?: (e: EventoPlayer) => void;
    };
};

type ApiYouTube = {
    Player: new (elemento: HTMLElement, opzioni: OpzioniPlayer) => PlayerYouTube;
    PlayerState: { ENDED: number; PLAYING: number };
};

declare global {
    interface Window {
        YT?: ApiYouTube;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const SCRIPT = 'https://www.youtube.com/iframe_api';

export function caricaYouTube(): Promise<ApiYouTube> {
    return new Promise((risolvi) => {
        if (window.YT?.Player) {
            risolvi(window.YT);
            return;
        }
        const precedente = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            precedente?.();
            if (window.YT) risolvi(window.YT);
        };
        if (!document.querySelector(`script[src="${SCRIPT}"]`)) {
            const script = document.createElement('script');
            script.src = SCRIPT;
            document.head.append(script);
        }
    });
}
