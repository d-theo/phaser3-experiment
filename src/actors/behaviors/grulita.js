import { IdleState } from "./fsm_actions";

export class Grulita {
    constructor(scene) {
        this.scene = scene;
        this._grulita = scene.physics.add.sprite(0,0, 'grulita_atlas', 'idle01.png') ;
        this._grulita.body.setMaxVelocity(120, 500);
        this._grulita.setBodySize(19, 35);
        this._grulita.setOffset(10,24);

        this._sword = scene.physics.add.sprite(0,0);
        this._sword.alpha = 0;
        this._sword.setImmovable(true);
        this._sword.setGravity(0,0);
        this._sword.setPosition(-999, -999);
        this._sword.body.allowGravity = false;
        this._sword.setBodySize(20, 30);
        this._sword.setOffset(32, 10);
        this.list = [this.grulita, this.sword];

        this.state = new IdleState(this);

        this.lifes = 3;
        this.invincible = false;
    }
    get body() {
        return this.grulita.body;
    }
    get sword() {
        return this._sword;
    }
    set sword(s) {
        this._sword = s;
    }
    set grulita(g) {
        this._grulita = g;
    }
    get grulita() {
        return this._grulita;
    }
    onAttack() {
        setTimeout(() => {
            this.sword.setActive(false);
        },350);
    
        this.sword.setActive(true);
    }
    update() {
        if (this.state.constructor.name === 'AttackingState'){
            if (this.grulita.flipX === false) {
              this.sword.setPosition(this.grulita.x, this.grulita.y);
            } else {  
              this.sword.setPosition(this.grulita.x-47, this.grulita.y);
            }
        }
        if (this.grulita.y > 330) {
            this.scene.die();
        }
    }
    isDown() {
        return this.grulita.body.onFloor()
            || this.grulita.body.blocked.down
            || this.grulita.body.touching.down
    }
    takeHit() {
        this.lifes --;
        this.scene.updateLife();
        this.invincible = true;
        setTimeout(() => this.invincible = false, 500);
    }
    takeHealth() {
        if (this.lifes < 3) this.lifes ++;
        this.scene.updateLife();
    }
}