import {GrulitaFrames} from './_grulita';
export function makeAnims(scene) {
    scene.anims.create({
        key: GrulitaFrames.run.name,
        frameRate: 10,
        repeat: -1,
        frames: scene.anims.generateFrameNames('grulita_atlas', {
            prefix: GrulitaFrames.run.name+'0',
            suffix: '.png',
            start: 1,
            end: GrulitaFrames.run.frames,
        })
    });

    scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'idle0',
          start:1,
          end: 8,
          suffix: '.png',
        }),
        // time
        delay: 0,
        frameRate: 10,
        // repeat
        repeat: -1,
        repeatDelay: 100,
      });

      scene.anims.create({
        key: 'jump_start',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'jump_start0',
          start:1,
          end: 2,
          suffix: '.png',
        }),
        // time
        delay: 0,
        frameRate: 10,
      });
      scene.anims.create({
        key: 'jump_mid',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'jump_mid0',
          start:1,
          end: 4,
          suffix: '.png',
        }),
        // time
        delay: 0,
        frameRate: 20,
        // repeat
        repeat: -1,
      });
}