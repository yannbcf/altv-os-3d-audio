export const ENV = typeof window === "undefined" ? "ssr" : "alt" in window ? "alt:V" : "browser";

export function onAltEvent(eventName, callback) {
    if (ENV === "alt:V") alt.on(eventName, callback);
}

export function emitAltEvent(eventName, ...args) {
    if (ENV === "alt:V") alt.emit(eventName, ...args);
}
