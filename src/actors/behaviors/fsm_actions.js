/*
Ascending
Descending
Landing
Idle
Running
Attacking
*/
import {GrulitaFrames} from '../../animations/grulita';

export class RunningLeftState {
    constructor(char) {
        this.char = char;
        this.init();
    }
    init() {
        // animate ect..
    }
    rest() {
        this.char.state = new IdleState(this.char);
    }
    jump() {
        this.char.state = new AscendingState(this.char);
    }
    runRight() {
        this.char.state = new RunRightState(this.char);
    }
    runleft() {
        this.char.state = new RunLeftState(this.char);
    }
    attacking() {
        this.char.state = new AttackingState(this.char);
    }
}
export class RunningRightState {
    constructor(char) {
        this.char = char;
        this.init();
    }
    init() {
        // animate ect..
    }
    rest() {
        // animn then idle ? rest timer
    }
    jump() {}
    runRight() {}
    runleft() {}
    attacking() {}
}
export class LandingState {
    constructor(char) {
        this.char = char;
        this.init();
    }
    init() {
        // animate ect..
    }
    rest() {
        // animn then idle ? rest timer
    }
    jump() {}
    runRight() {}
    runleft() {}
    attacking() {}
}
export class DescendingState {
    constructor(char) {
        this.char = char;
        this.init();
    }
    init() {
        // animate ect..
    }
    rest() {}
    jump() {}
    runRight() {}
    runleft() {}
    attacking() {}
}
export class DescendingState {
    constructor(char) {
        this.char = char;
        this.init();
    }
    init() {
        // animate ect..
    }
    rest() {}
    jump() {}
    runRight() {}
    runleft() {}
    attacking() {}
}
export class IdleState {
    constructor(char) {
        this.char = char;
        this.init();
    }
    init() {
        this.char.anims.play(GrulitaFrames.idle.name);
    }
    rest() {
        this.char.body.setAccelerationX(0);
        if (this.char.body.velocity.x > 10) {
            this.char.body.setVelocityX(this.char.body.velocity.x - 4);
        } else if (this.char.body.velocity.x < -10) {
            this.char.body.setVelocityX(this.char.body.velocity.x + 4);
        } else {
            this.char.setVelocityX(0);
        }
    }
    jump() {
        this.char.state = new AscendingState(this.char);
    }
    runRight() {
        this.char.state = new RunRightState(this.char);
    }
    runleft() {
        this.char.state = new RunLeftState(this.char);
    }
    attacking() {
        this.char.state = new AttackingState(this.char);
    }
}