import { assets } from "./assets";

export function preloadAssetsWithProgress(
    onProgress: (loaded: number, total: number) => void
): Promise<void> {
    let loaded = 0;
    const total = assets.length;

    const handleProgress = () => {
        loaded++;
        onProgress(loaded, total);
    };

    const loaders = assets.map(({ type, src }) => {
        return new Promise<void>((resolve) => {
            switch (type) {
                case "image": {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        handleProgress();
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Image failed: ${src}`);
                        handleProgress();
                        resolve();
                    };
                    break;
                }

                case "audio": {
                    const audio = new Audio();
                    audio.src = src;
                    audio.oncanplaythrough = () => {
                        handleProgress();
                        resolve();
                    };
                    audio.onerror = () => {
                        console.warn(`Audio failed: ${src}`);
                        handleProgress();
                        resolve();
                    };
                    break;
                }
                    
                default: {
                    console.warn(`Unknown asset type for ${src}`);
                    handleProgress();
                    resolve();
                }
            }
        });
    });

    return Promise.all(loaders).then(() => undefined);
}
