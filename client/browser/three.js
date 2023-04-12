import { ENV, onAltEvent, emitAltEvent } from "./utils.js";
import * as THREE from "three";

const DEFAULT_CAMERA_FOV = 50;

class AudioEmitter {
    static #_audioLoader = new THREE.AudioLoader();
    static #_all = new Map();

    static get all() {
        return [...this.#_all.values()];
    }

    static getByID(id) {
        return this.#_all.get(id);
    }

    #_outputs = [];
    get outputs() {
        return [...this.#_outputs];
    }

    #_virtualId = -1;
    get virtualId() {
        return this.#_virtualId;
    }

    #_volume = 0;
    get volume() {
        return this.#_volume;
    }

    scene;
    listener;

    constructor(scene, listener) {
        this.scene = scene;
        this.listener = listener;
    }

    #_setOuputs(outputsPos) {
        this.#_outputs.length = 0;

        for (const outputPos of outputsPos) {
            const audio = new THREE.PositionalAudio(this.listener);
            audio.position.set(outputPos.x, outputPos.y, outputPos.z);

            this.#_outputs.push(audio);
            this.scene.add(audio);
        }
    }

    init(virtualId, source, volume, outputsPos) {
        AudioEmitter.#_all.set(virtualId, this);
        this.#_virtualId = virtualId;
        this.#_volume = volume;

        this.#_setOuputs(outputsPos);

        AudioEmitter.#_audioLoader.load(source, (buffer) => {
            for (const audio of this.#_outputs) {
                audio.setBuffer(buffer);

                audio.setDistanceModel("inverse");
                audio.setRefDistance(volume * 40);
                audio.setVolume(volume / 4);
                audio.setRolloffFactor(4);
                audio.setLoop(true);

                audio.play();
            }
        });
    }

    destroy() {
        for (const audio of this.#_outputs) {
            audio.stop();
            this.scene.remove(audio);
        }

        AudioEmitter.#_all.delete(this.virtualId);
        this.#_outputs.length = 0;
        this.#_virtualId = -1;
    }
}

class World {
    #_renderer = new THREE.WebGLRenderer({ antialias: true });
    #_scene = new THREE.Scene();
    #_listener = new THREE.AudioListener();
    #_camera = new THREE.PerspectiveCamera(
        DEFAULT_CAMERA_FOV,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );

    #_freeAudioEmitters = [];

    #_audioEmitter_1 = this.#_createAudioEmitter();
    #_audioEmitter_2 = this.#_createAudioEmitter();
    #_audioEmitter_3 = this.#_createAudioEmitter();
    #_audioEmitter_4 = this.#_createAudioEmitter();
    #_audioEmitter_5 = this.#_createAudioEmitter();

    #_createAudioEmitter() {
        return new AudioEmitter(this.#_scene, this.#_listener);
    }

    constructor() {
        this.#_camera.add(this.#_listener);
        this.#_camera.position.set(0, 0, 0);

        this.#_freeAudioEmitters.push(
            this.#_audioEmitter_1,
            this.#_audioEmitter_2,
            this.#_audioEmitter_3,
            this.#_audioEmitter_4,
            this.#_audioEmitter_5
        );

        onAltEvent("setCameraFov", (fov) => {
            this.#_scene.fov = fov;
        });

        onAltEvent("setCameraPos", (pos, lookAt) => {
            this.#_camera.position.set(pos.x, pos.y, pos.z);
            this.#_camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
            this.#_renderer.render(this.#_scene, this.#_camera);
        });

        onAltEvent("initAudioEmitter", (id, volume, positions) => {
            const freeAudioEmitter = this.#_freeAudioEmitters.pop();
            if (!freeAudioEmitter) {
                console.log("ERROR: No free audio emitters remaining");
                return;
            }

            if (this.#_freeAudioEmitters.length === 4) {
                emitAltEvent("sendCameraPos");
            }

            freeAudioEmitter.init(id, "stay_schemin.ogg", volume, positions);
        });

        onAltEvent("destroyAudioEmitter", (id) => {
            const audioEmitter = AudioEmitter.getByID(id);
            if (!audioEmitter) {
                console.log(`ERROR: No audio emitter running with the id (${id})`);
                return;
            }

            audioEmitter.destroy();
            this.#_freeAudioEmitters.push(audioEmitter);

            if (this.#_freeAudioEmitters.length === 5) {
                emitAltEvent("stopCameraPos");
            }
        });
    }
}

if (ENV === "alt:V") {
    new World();
}
