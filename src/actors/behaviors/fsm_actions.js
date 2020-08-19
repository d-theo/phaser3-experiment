export class AttackingState {
    constructor(char, type) {
        this.isFinished = false;
        this.char = char;
        this.type = type;
        const len = {
            attackA : 350,
            attackB : 350,
            attackC : 350,
            attackD : 350,
        }[type]
        this.attackLenght = len;
        console.log(this.constructor.name);

        this.init();
    }
    init() {
        this.char.body.setAccelerationX(0);
        this.char.list[0].anims.play(this.type);
        setTimeout(() => this.isFinished = true, this.attackLenght);
    }
    rest() {
        if (this.isFinished) {
            this.char.state = new IdleState(this.char);
        }
    }
    jump() {
        if (this.isFinished) {
            this.char.state = new AscendingState(this.char);
        }
    }
    runRight() {
        if (this.isFinished) {
            this.char.state = new RunningRightState(this.char);
        }
    }
    runLeft() {
        if (this.isFinished) {
            this.char.state = new RunningLeftState(this.char);
        }
    }
    attack() {
        
    }
    interuptJump() {}
    land(){}
}
export class RunningLeftState {
    constructor(char) {
        this.char = char;
        this.init();
        console.log(this.constructor.name)
    }
    init() {
        this.char.list[0].flipX = true;
        this.char.list[0].anims.play('run');
    }
    rest() {
        this.char.state = new IdleState(this.char);
    }
    jump() {
        this.char.state = new AscendingState(this.char);
    }
    runRight() {
        this.char.state = new RunningRightState(this.char);
    }
    runLeft() {
        this.char.body.setAccelerationX(-200);
        if (this.char.body.velocity.x > 10) {
            this.char.body.setVelocityX(+12);
        }
    }
    attack(type) {
        this.char.state = new AttackingState(this.char, type);
    }
    interuptJump() {}
    land(){}
}
export class RunningRightState {
    constructor(char) {
        this.char = char;
        this.init();
        console.log(this.constructor.name)
    }
    init() {
        this.char.list[0].flipX = false;
        this.char.list[0].anims.play("run");
    }
    rest() {
        this.char.state = new IdleState(this.char);
    }
    jump() {
        this.char.state = new AscendingState(this.char);
    }
    runRight() {
        if (this.char.body.velocity.x < -10) {
            this.char.body.setVelocityX(-12);
        }
        this.char.body.setAccelerationX(+200);
    }
    runLeft() {
        this.char.state = new RunningLeftState(this.char);
    }
    attack(type) {
        this.char.state = new AttackingState(this.char,type);
    }
    interuptJump() {}
    land(){}
}
export class LandingState {
    constructor(char) {
        this.char = char;
        this.call = 1;
        this.init();
        console.log(this.constructor.name)
    }
    init() {
        this.char.list[0].setTexture('grulita_atlas', 'jump_landing.png')

        // TODO c moche
        this.char.body.setAccelerationX(0);
        this._rest();
    }
    _rest() {
        this.char.body.setAccelerationX(0);
        if (this.char.body.velocity.x > 10) {
            this.char.body.setVelocityX(this.char.body.velocity.x - 30);
        } else if (this.char.body.velocity.x < -10) {
            this.char.body.setVelocityX(this.char.body.velocity.x + 30);
        } else {
            this.char.body.setVelocityX(0);
        }
    }
    rest() {
        this._rest();
        this.call --;
        if (this.call <= 0) {
            this.char.state = new IdleState(this.char);
        }
    }
    land(){
        this._rest();
    }
    jump() {
        this._rest();
        this.call --;
        if (this.call <= 0) {
            this.char.state = new AscendingState(this.char);
        }
    }
    runRight() {
        this._rest();
        this.call --;
        if (this.call <= 0) {
            this.char.state = new RunningRightState(this.char);
        }
    }
    runLeft() {
        this._rest();
        this.call --;
        if (this.call <= 0) {
            this.char.state = new RunningLeftState(this.char);
        }
    }
    attack(type) {
        this._rest();
        this.call --;
        if (this.call <= 0) {
            this.char.state = new AttackingState(this.char, type);
        }
    }
    interuptJump() {}
}
export class AscendingState {
    constructor(char) {
        this.char = char;
        this.init();
        console.log(this.constructor.name)
    }
    land(){
    }
    init() {
        this.char.list[0].anims.play('jump_start');
    }
    rest() {}
    jump(time) {
        if (time < 220) {
            this.char.body.setVelocityY(-300);
        } else {
            this.char.state = new DescendingState(this.char);
        }
    }
    interuptJump() {
        this.char.state = new DescendingState(this.char);
    }
    runRight() {
        this.char.body.setAccelerationX(150);
    }
    runLeft() {
        this.char.body.setAccelerationX(-150);
    }
    attack(type) {
        this.char.state = new AttackingState(this.char, 'attackC');
    }
}
export class DescendingState {
    constructor(char) {
        this.char = char;
        this.init();
        console.log(this.constructor.name)
    }
    init() {
        this.interuptJump();
        this.char.list[0].anims.play('jump_mid');
    }
    land(){
        this.char.state = new LandingState(this.char);
    }
    rest() {}
    jump() {}
    runRight() {
        this.char.body.setAccelerationX(+150);
    }
    runLeft() {
        this.char.body.setAccelerationX(-150);
    }
    attack(type) {
        this.char.state = new AttackingState(this.char, 'attackC');
    }
    interuptJump() {
        this.char.body.setAccelerationY(700);
    }
}
export class IdleState {
    constructor(char) {
        this.char = char;
        this.init();
        console.log(this.constructor.name)
    }
    init() {
        this.char.list[0].anims.play('idle');
    }
    land(){}
    rest() {
        this.char.body.setAccelerationX(0);
        if (this.char.body.velocity.x > 10) {
            this.char.body.setVelocityX(this.char.body.velocity.x - 9);
        } else if (this.char.body.velocity.x < -10) {
            this.char.body.setVelocityX(this.char.body.velocity.x + 9);
        } else {
            this.char.body.setVelocityX(0);
        }
    }
    jump() {
        this.char.state = new AscendingState(this.char);
    }
    runRight() {
        this.char.state = new RunningRightState(this.char);
    }
    runLeft() {
        this.char.state = new RunningLeftState(this.char);
    }
    attack(type) {
        this.char.state = new AttackingState(this.char, type);
    }
    interuptJump() {}
}