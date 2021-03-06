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
      scene.anims.create({
        key: 'attackA',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'AttackA0',
          start:1,
          end: 7,
          suffix: '.png',
        }),
        // time
        delay: 0,
        duration: 350,
        repeat: 0,
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
      scene.anims.create({
        key: 'attackB',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'AttackB0',
          start:1,
          end: 5,
          suffix: '.png',
        }),
        // time
        delay: 0,
        duration: 350,
        repeat: 0,
      });
      scene.anims.create({
        key: 'attackC',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'AttackC0',
          start:1,
          end: 7,
          suffix: '.png',
        }),
        // time
        delay: 0,
        duration: 350,
        repeat: 0,
      });
      scene.anims.create({
        key: 'attackD',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'AttackD0',
          start:1,
          end: 8,
          suffix: '.png',
        }),
        // time
        delay: 0,
        duration: 350,
        repeat: 0,
      });

      scene.anims.create({
        key: 'hit_effect',
        frames: scene.anims.generateFrameNames('grulita_atlas',{
          prefix: 'hit_effect0',
          start:1,
          end: 5,
          suffix: '.png',
        }),
        // time
        delay: 0,
        frameRate: 10,
        repeat: 0,
      });


      //// collectibles

      scene.anims.create({
        key: 'diamond_big',
        frames: scene.anims.generateFrameNames('grulita_collectibles',{
          prefix: 'diamond_big_0',
          start:1,
          end: 6,
          suffix: '.png',
        }),
        // time
        delay: 0,
        duration: 1500,
        // repeat
        repeat: -1,
      });
      scene.anims.create({
        key: 'diamond_small',
        frames: scene.anims.generateFrameNames('grulita_collectibles',{
          prefix: 'diamond_small0',
          start:1,
          end: 5,
          suffix: '.png',
        }),
        duration: 1000,
        // repeat
        repeat: -1,
      });

      /// ENEMIES
      scene.anims.create({
        key: 'blob_idle',
        frames: scene.anims.generateFrameNames('grulita_blob',{
          prefix: 'blob_idle0',
          start:1,
          end: 16,
          suffix: '.png',
        }),
        duration: 5000,
        // repeat
        repeat: -1,
      });
}