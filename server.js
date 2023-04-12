import * as alt from "alt-server";

alt.on("playerConnect", (player) => {
    player.model = "mp_m_freemode_01";
    player.spawn(0, 0, 70);
});
