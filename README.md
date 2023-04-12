This is a minimal resource to show how you can make create 3D audio sources using ThreeJS Positional Audio.

## DISCLAIMER: THIS IS NOT A DRAG & DROP PRODUCTION RESOURCE, YOU WILL HAVE TO PLAY A BIT WITH IT AND FINE TUNE IT

At the 2 green markers are placed 2 outputs of 1 AudioEmitter, same audio, at 2 different positions. Useful for example in a nightclub where you might want to have a single audio difused at multiple spots.

You can have theorically as many outputs as you want for 1 AudioEmitter.

![yep](https://cdn.discordapp.com/attachments/760848196250894336/1095747983523467325/image.png)

### Limitations

I created a queue where I pre-allocated 5 AudioEmitters (for performance reasons, there is no need to create/delete them, they can be reused and it avoids memory allocations on the fly).

Why 5 ? Well, I have a hard time imagining more than 5 sounds playing at the same time.

### Improvements

-   I recommend you to use the alt:V V.15 Virtual Entities (successor of EntitySync), to stream the audios, you can then set the Virtual Entity Group to 4-5 to match the hardcoded limit ThreeJS side. This way, you can have let's say 50 AudioEmitters on the map, and you are sure that only 4 or 5 are playing at the same time maximum.

-   You can listen to the worldObject events clientside to emit the events `initAudioEmitter` and `destroyAudioEmitter` passing the virtual entity id.

-   I wanted to keep the resource super simple, so I made it in pure js, but I recommend typescript of course, I didnt use any bundler and imported threejs via a cdn, which I really dont recommend as there is no three shaking, so for the web I recommend using ViteJS, or SWC with turbopack, or any other alternative that fits you.

If you have questions you can reach me on discord `YANN#0001`
