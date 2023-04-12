import { rotationToDirection, Vector3, drawMarker } from "./utils.js";

import * as alt from "alt-client";
import * as game from "natives";

const positions = [
    new Vector3({ x: 10, y: 10, z: 69 }),
    new Vector3({ x: -59.73, y: 25.31, z: 71 }),
];

const zero = alt.Vector3.zero;
const scale = new alt.Vector3(2, 2, 10);
const color = new alt.RGBA(142, 240, 89, 255);

alt.everyTick(() => {
    // flicker fix, just in case
    game.drawRect(0, 0, 0, 0, 0, 0, 0, 0, 0);

    for (const position of positions) {
        drawMarker(1, position, zero, zero, scale, color);
    }
});

alt.on("connectionComplete", () => {
    const webview = new alt.WebView("http://resource/client/browser/index.html");
    webview.focus();

    const id = 0;
    const volume = 1;

    webview.emit(
        "initAudioEmitter",
        id,
        volume,
        positions.map((pos) => pos.toThreeJS())
    );

    webview.on("sendCameraPos", () => {
        webview.emit("setCameraFov", Math.round(game.getGameplayCamFov()));

        const ref = setInterval(() => {
            const camPos = alt.getCamPos();
            const camRot = game.getGameplayCamRot(2);
            const lookAt = camPos.add(rotationToDirection(camRot).mul(100));

            webview.emit(
                "setCameraPos",
                new Vector3(alt.Player.local.pos).toThreeJS(),
                new Vector3(lookAt).toThreeJS()
            );
        }, 25);

        webview.once("stopCameraPos", () => {
            console.log("CLEARED INTERVAL");
            clearInterval(ref);
        });
    });

    setTimeout(() => {
        console.log("AUDIO CLEANUP");
        webview.emit("destroyAudioEmitter", 0);
    }, 60_000);
});
