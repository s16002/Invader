"use strict";
/**
 * インベーダーみたいなやつ作ります
 */

class Player {

    /**
     * @return {number}
     */
    static get HALF_WIDTH() {
        return 20;
    }
    static get HALF_HEIGHT(){
        return 10;
    }

    constructor(input, x, y, speed, canvas_width) {
        this.input = input;
        this.pos = {'x': x, 'y': y};
        this.bullet = null;
        this.speed = speed;
        this.canvas_width = canvas_width;
    }
    getBullet() {
        return this.bullet;
    }
    
    getPlayerPos(){
        return this.pos;
    }

    move() {
        if (this.input.isLeft && this.input.isRight) {
            // なにもしない
        } else if (this.input.isLeft) {
            this.pos.x -= this.speed;
        } else if (this.input.isRight) {
            this.pos.x += this.speed;
        }
        // 左側へ行き過ぎたら戻す
        if (this.pos.x < Player.HALF_WIDTH) {
            this.pos.x = Player.HALF_WIDTH;
        }
        // 右側へ行きすぎたら戻す
        if (this.pos.x > this.canvas_width - Player.HALF_WIDTH) {
            this.pos.x = this.canvas_width - Player.HALF_WIDTH;
        }

    }

    draw(ctx, bulletspeed) {
        this.move();

        if (this.input.isSpace && this.bullet == null) {
            this.bullet = new Bullet(this.pos.x, this.pos.y,bulletspeed);
        }
        if (this.bullet != null) {
            this.bullet.draw(ctx);
            if (!this.bullet.isValid()) {
                this.bullet = null;
            }
        }

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.strokeStyle = "#FFF";
        /*ctx.fillStyle = "#FFF";*/
        ctx.fillStyle = "rgba(" + [0, 0, 255, 0.5] + ")";
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-20, 10);
        ctx.lineTo(-20, -7);
        ctx.lineTo(-3, -7);
        ctx.lineTo(0, -10);
        ctx.lineTo(3, -7);
        ctx.lineTo(20, -7);
        ctx.lineTo(20, 10);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.restore();
    }
}

class Input {
    constructor() {
        this.isLeft = false;
        this.isRight = false;
        this.isSpace = false;
    }

    onKeyDown(event) {
        switch (event.code) {
            case "ArrowLeft":
                this.isLeft = true;
                break;
            case "ArrowRight":
                this.isRight = true;
                break;
            case "Space":
                this.isSpace = true;
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    onKeyUp(event) {
        switch (event.code) {
            case "ArrowLeft":
                this.isLeft = false;
                break;
            case "ArrowRight":
                this.isRight = false;
                break;
            case "Space":
                this.isSpace = false;
                break;
            default:
                return;
        }
        event.preventDefault();
    }
}

class Bullet {
    /**
     * @return {number}
     */

    /**
     * @return {number}
     */
    static get HALF_HEIGHT() {
        return 5;
    }

    /**
     * @return {number}
     */
    static get HALF_WIDTH() {
        return 1.5;
    }

    constructor(x, y, bulletspeed) {
        this.pos = {'x': x, 'y': y};
        this.isCollied = false;
        this.bulletspeed = bulletspeed;
    }

    move() {
        this.pos.y -= this.bulletspeed;
    }

    isValid() {
        if (this.isCollied){
            return false;
        }
        return this.pos.y >= -Bullet.HALF_HEIGHT;
    }

    setInvalidate() {
        this.isCollied = true;
    }

    draw(ctx) {
        this.move();

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.stroke();

        ctx.restore();
    }
}

class Enemy {
    /**
     * @return {number}
     */
    static get HALF_SIZE() {
        return Enemy.SIZE / 2;
    }

    /**
     * @return {number}
     */
    static get SIZE() {
        return 64;
    }

    constructor(image, x, y) {
        this.image = image;
        this.pos = {'x': x, 'y': y};
        this.bullet = null;
    }

    moveWidth(dx) {
        this.pos.x += dx;
    }
    moveHeight(dy){
        this.pos.y += dy;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        // 画像サイズの半分を左と上にずらして基準点の真ん中に来るように調整して描画
        ctx.drawImage(this.image, -Enemy.HALF_SIZE, -Enemy.HALF_SIZE,
            Enemy.SIZE, Enemy.SIZE);

        ctx.restore();
    }
    bulletjudge(ctx,HEIGHT,enemyBulletSpeed,reload){
        let random = Math.floor(Math.random() * reload);
        if(this.bullet == null && random == 5){
            this.bullet = new EnemyBullet(this.pos.x, this.pos.y, enemyBulletSpeed);
        }
        if(this.bullet){
            this.bullet.draw(ctx);
            if(this.bullet.pos.y > HEIGHT){
                this.bullet = null;
            }
        }

    }


    isCollision(bullet) {
        // まず横の判定の準備?
        let dx = Math.abs(this.pos.x - bullet.pos.x);
        let dw = Enemy.HALF_SIZE + Bullet.HALF_WIDTH;
        // 縦の判定準備
        let dy = Math.abs(this.pos.y - bullet.pos.y);
        let dh = Enemy.HALF_SIZE + Bullet.HALF_HEIGHT;

        // 判定
        if (dx < dw && dy < dh){
            return true;
        }
        //return (dx < dw && dy < dh);

    }
}

class EnemyBullet{
    static get HEIGHT() {
        return 2;
    }

    constructor(x,y,bulletspeed){
        this.pos = {'x' : x, 'y': y};
        this.bulletspeed = bulletspeed;
    }
    move(){
        this.pos.y += this.bulletspeed;
    }
    draw(ctx){
        this.move();
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.stroke();

        ctx.restore();

    }


}

class EnemyManager {
    constructor(dx,dy) {
        this.enemyList = [];
        this.dx = dx;
        this.dy= dy;
        this.line = false;
    }
    getline(){
        return this.line;
    }

    generateEnemies(enemycolumn,enemyrow,WIDTH) {
        let selectimage;
        let image = new Image();
        let image2 = new Image();
        let image3 = new Image();
        image.src = "enemy.png";
        image2.src = "enemy2.png";
        image3.src = "enemy3.png";
        for (let h = 0; h < enemycolumn; h++) {
            if (h == 0){
                selectimage = image3;
            }
            else if(h == 1){
                selectimage = image2;
            }
            else{
                selectimage = image;
            }
            for (let w = 0; w < enemyrow; w++) {
                this.enemyList.push(
                    new Enemy(selectimage,
                        75 + ((WIDTH - 150)/(enemyrow))* w,
                        50 + Enemy.SIZE * h));
            }
        }
    }
    draw(ctx) {
        this.enemyList.forEach(
            (enemy) => enemy.draw(ctx)
        );
    }
    bulletdraw(ctx,HEIGHT, playerPos,enemyBulletSpeed,reload){
        this.enemyList.forEach(
            (enemy) => enemy.bulletjudge(ctx,HEIGHT,enemyBulletSpeed,reload)
        );
        for(let i = 0; i < this.enemyList.length; i++) {
            if (this.enemyList[i].bullet != null) {
                if (playerPos.x - Player.HALF_WIDTH <= this.enemyList[i].bullet.pos.x && this.enemyList[i].bullet.pos.x <= playerPos.x + Player.HALF_WIDTH) {
                    if (playerPos.y - Player.HALF_HEIGHT - EnemyBullet.HEIGHT <= this.enemyList[i].bullet.pos.y &&  this.enemyList[i].bullet.pos.y  <= playerPos.y + Player.HALF_HEIGHT) {
                        this.line = true;
                    }
                }
            }
        }

    }
    move(WIDTH,HEIGHT){
        let judge = true;
        for (let h = 0; h < this.enemyList.length; h++) {
            if (this.enemyList[h].pos.x >= WIDTH - Enemy.SIZE && this.dx > 0) {
                this.dx = Math.abs(this.dx) * -1;
                this.enemyList.forEach(
                    (enemy) => enemy.moveHeight(this.dy)
                );
                judge = false;
            }
            else if (this.enemyList[h].pos.x <= Enemy.SIZE && this.dx < 0) {
                this.dx = Math.abs(this.dx);
                this.enemyList.forEach(
                    (enemy) => enemy.moveHeight(this.dy)
                );
                judge = false;
            }
            if (this.enemyList[h].pos.y >= HEIGHT - Enemy.HALF_SIZE - (HEIGHT * 1/15)){
                this.line = true;
            }
        }
        if(judge) {
            this.enemyList.forEach(
                (enemy) => enemy.moveWidth(this.dx)
            );
        }
    }

    collision(bullet) {
        if (bullet == null) {
            return;
        }
        const length = this.enemyList.length;
        for (let i = 0; i < length; i++) {
            if (this.enemyList[i].isCollision(bullet)) {
                this.enemyList.splice(i, 1);
                bullet.setInvalidate();
                return;
            }
        }
    }
}

class PrintScreen{
    printBackScreen(ctx, WIDTH, HEIGHT){
        ctx.save();
        ctx.fillStyle = "rgba(" + [255, 255, 255, 0.05] + ")";
        ctx.strile = "#000";
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(WIDTH, 0);
        ctx.lineTo(WIDTH, HEIGHT);
        ctx.lineTo(0, HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    printText_Clear(ctx,text){
        ctx.save();
        ctx.fillStyle = "rgba(" + [0, 0, 0, 0.8] + ")";
        ctx.font = "80px 'Arial'";
        ctx.stroke = "#000";
        ctx.fillText(text, 150, 300);
    }
}

window.addEventListener("DOMContentLoaded", function () {
    // 必要な定数、変数を設定しておく
    const canvas = document.getElementById("main");
    const score = document.getElementById("score");
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const SPF = 1000 / 30;
    //プレイヤーのコンフィグ
    const PLAYER_SPEED = 5;         // プレイヤーの移動速度
    const bulletspeed = 10;         // 弾の速度


    //敵のコンフィグ
    const enemywidth = 20;          // 敵の横への移動幅
    const enemyheight = 20;         // 敵の縦への移動幅
    const enemycolumn = 4;          // 縦の敵の数
    const enemyrow = 10;            // 横の敵の数
    const enemyBulletSpeed = 4;     // 敵の弾のスピード
    const reload = 1000;            // 敵が弾を撃ってくる頻度

    const specialwidth = 5;         // 特別な敵の横への速さ
    const specialcount = 20;        // 特別な敵が出てくる残りの敵の数
    const specialpoint = 300;       // 特別な敵の得点



    let count = 0;

    let image = new Image();
    image.src = "enemy6.png";

    let input = new Input();
    let player = new Player(input, WIDTH / 2, HEIGHT * 14 / 15, PLAYER_SPEED, WIDTH);
    let printer = new PrintScreen;
    let specialenemy = new Enemy(image,- Enemy.SIZE,Enemy.SIZE);

    // キーボード入力イベントをInputクラスとバインド
    document.addEventListener("keydown", (evt) => input.onKeyDown(evt));
    document.addEventListener("keyup", (evt) => input.onKeyUp(evt));

    // EnemyManagerの準備
    let manager = new EnemyManager(enemywidth, enemyheight);

    manager.generateEnemies(enemycolumn, enemyrow, WIDTH);

    // メインループ
    let mainLoop = function () {
        // 画面消去
        if (manager.enemyList.length == 0 ){
            printer.printBackScreen(ctx,WIDTH,HEIGHT);
            printer.printText_Clear(ctx,"Game Clear");

        }
        else if (manager.getline()){
            printer.printBackScreen(ctx,WIDTH,HEIGHT);
            printer.printText_Clear(ctx,"Game Over");
        }
        else {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            // プレイヤーの描画
            player.draw(ctx,bulletspeed);

            // 敵の衝突判定
            manager.collision(player.getBullet());
            manager.draw(ctx);
            manager.bulletdraw(ctx,HEIGHT,player.getPlayerPos(),enemyBulletSpeed,reload);

            if(manager.enemyList.length < specialcount && specialenemy != null){
                specialenemy.moveWidth(specialwidth);
                specialenemy.draw(ctx);
                if(player.bullet != null && specialenemy.isCollision(player.bullet)){
                    player.bullet = null;
                    specialenemy = null;
                }
            }

            // 敵の描画
            if (manager.enemyList.length > 30) {
                if (count > 20) {
                    manager.move(WIDTH, HEIGHT);
                    count = 0;
                }
            }
            else if (10 < manager.enemyList.length && manager.enemyList.length <= 30){
                if (count > 10) {
                    manager.move(WIDTH, HEIGHT);
                    count = 0;
                }
            }
            else if (10 >= manager.enemyList.length){
                if (count > 5) {
                    manager.move(WIDTH, HEIGHT);
                    count = 0;
                }
            }
            count += 1;

            if(specialenemy != null) {
                score.innerHTML = (enemyrow * enemycolumn - manager.enemyList.length) * 100;
            }
            else{
                score.innerHTML = (enemyrow * enemycolumn - manager.enemyList.length) * 100 + specialpoint ;
            }
        }


        // 再度この関数を呼び出す予約をする
        setTimeout(mainLoop, SPF);
    };
    // ゲーム起動開始
    setTimeout(mainLoop, SPF);
});