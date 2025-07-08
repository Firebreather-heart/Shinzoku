export type AssetType = "image" | "audio" ;

export interface Asset {
    type: AssetType;
    src: string;
}


export const assets: Asset[] = [
    {
        type: "image",
        src: "/images/slide1.jpg"
    },
    {
        type: "image",
        src: "/images/slide2.jpg"
    },
    {
        type: "image",
        src: "/images/slide3.jpg"
    },
    {
        type: "image",
        src: "/images/slide4.jpg"
    },
    {
        type: "image",
        src: "/images/slide5.jpg"
    },
    {
        type: "audio",
        src: "/audio/battleinprogress.mp3"
    },
    {
        type: "audio",
        src: "/audio/explevinc.wav"
    },
    {
        type: "audio",
        src: "/audio/lvcomplete.wav"
    },
    {
        type: "audio",
        src: "/audio/swordcut.mp3"
    },
    {
        type: "audio",
        src: "/audio/swordraw.wav"
    },
    {
        type: "audio",
        src: "/audio/wincoin.wav"
    }
];
