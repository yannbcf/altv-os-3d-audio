import * as alt from "alt-client";
import * as game from "natives";

export class Vector3 {
    x;
    y;
    z;

    constructor(vec3) {
        this.x = vec3.x;
        this.y = vec3.y;
        this.z = vec3.z;
    }

    toThreeJS() {
        return {
            x: this.x,
            y: this.z,
            z: -this.y,
        };
    }
}

function degToRad(deg) {
    return (deg * Math.PI) / 180.0;
}

export function rotationToDirection(rot) {
    const zDeg = degToRad(rot.z);
    const xDeg = degToRad(rot.x);
    const n = Math.abs(Math.cos(xDeg));

    return new alt.Vector3(-Math.sin(zDeg) * n, Math.cos(zDeg) * n, Math.sin(xDeg));
}

export function drawMarker(type, pos, dir, rot, scale, color) {
    game.drawMarker(
        type,
        pos.x,
        pos.y,
        pos.z,
        dir.x,
        dir.y,
        dir.z,
        rot.x,
        rot.y,
        rot.z,
        scale.x,
        scale.y,
        scale.z,
        color.r,
        color.g,
        color.b,
        color.a,
        false,
        false,
        2,
        false,
        undefined,
        undefined,
        false
    );
}
