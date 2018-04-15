
cc.Class({
    extends: cc.Component,

    properties: {
        prbLittleBall: {
            default: null,
            type: cc.Prefab
        },
        mainBall: {
            default: null,
            type: cc.Node
        },
        prepareBall: {
            default: null,
            type: cc.Node
        },
        labScore: {
            default: null,
            type: cc.Label
        },
        gameOverLayer: {
            default: null,
            type: cc.Node
        },
        labCutDown: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._prepareBallDistance = 80;
        this._randomColorIndex = 0;
        this._mainBallRadis = 308;
        this._score = 0;
        this._timeLeft = 30;

        this.gameOverLayer.active = false;

        /**
        * 开启碰撞组件
        */
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // 初始化黑色小球
        this.initPreBlackBall(4);
        // 初始化预备小球
        this.initNextBalls(3);
        // 大球旋转
        this.mainBall.runAction(cc.repeatForever(
            cc.rotateBy(3, 360)
        ));
        // 触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.emitNextLittleBall, this);
        // 倒计时
        this.schedule(this.cutDown, 1);
    },

    /**
     * 倒计时
     * @param {number} dt 时间
     */
    cutDown(dt) {
        this._timeLeft--;
        this.labCutDown.string = this._timeLeft + "s";
        if (this._timeLeft <= 0) {
            this.gameOver();
        }
    },

    /**
     * 屏幕触摸事件，发射小球
     * @param {Touch} touch 触摸对象
     */
    emitNextLittleBall(touch) {
        var nextBall = this._nextBalls.shift();
        nextBall.runAction(cc.moveBy(0.1, cc.v2(0, 600)));
        // 旧的未发射两球上移
        this._nextBalls.forEach(ball => {
            ball.runAction(cc.moveBy(0.1, cc.v2(0, this._prepareBallDistance)));
        });
        // 生成新的
        var newBall = this.createNewLittleBall();
        newBall.y = - this._prepareBallDistance * 3;
        newBall.runAction(cc.moveBy(0.1, cc.v2(0, 160)));
        this.prepareBall.addChild(newBall);
        this._nextBalls.push(newBall);
    },

    /**
     * 初始化预设黑色小球
     * @param {number} count 数量
     */
    initPreBlackBall(count) {
        switch (count) {
            case 4:
                var newBall = this.createNewLittleBall();
                var littleBall = newBall.getComponent("littleBall");
                littleBall.setColor(new cc.color({ r: 0, g: 0, b: 0, a: 255 }));//黑色
                littleBall.needle.active = true;
                newBall.setPosition(cc.v2(-this._mainBallRadis, 0));
                newBall.rotation = 90;
                this.mainBall.addChild(newBall);
            case 3:
                var newBall = this.createNewLittleBall();
                var littleBall = newBall.getComponent("littleBall");
                littleBall.setColor(new cc.color({ r: 0, g: 0, b: 0, a: 255 }));//黑色
                littleBall.needle.active = true;
                newBall.setPosition(cc.v2(this._mainBallRadis, 0));
                newBall.rotation = 270;
                this.mainBall.addChild(newBall);
            case 2:
                var newBall = this.createNewLittleBall();
                var littleBall = newBall.getComponent("littleBall");
                littleBall.setColor(new cc.color({ r: 0, g: 0, b: 0, a: 255 }));//黑色
                littleBall.needle.active = true;
                newBall.setPosition(cc.v2(0, -this._mainBallRadis));
                newBall.rotation = 0;
                this.mainBall.addChild(newBall);
            case 1:
                var newBall = this.createNewLittleBall();
                var littleBall = newBall.getComponent("littleBall");
                littleBall.setColor(new cc.color({ r: 0, g: 0, b: 0, a: 255 }));//黑色
                littleBall.needle.active = true;
                newBall.setPosition(cc.v2(0, this._mainBallRadis));
                newBall.rotation = 180;
                this.mainBall.addChild(newBall);
        }
    },

    /**
     * 初始化预备发射小球
     */
    initNextBalls(count) {
        this._nextBalls = [];
        for (var i = 0; i < count; i++) {
            var newBall = this.createNewLittleBall();
            newBall.y = (1 - i) * this._prepareBallDistance;
            this.prepareBall.addChild(newBall);
            this._nextBalls.push(newBall);
        }
    },
    /**
     * 创建新的小球
     */
    createNewLittleBall() {
        var newBall = cc.instantiate(this.prbLittleBall);
        var littleBall = newBall.getComponent("littleBall");
        littleBall.setColor(this.randomColor());
        littleBall.needle.active = false;
        /**小球碰小球 */
        var littleCollideHandler = new cc.Component.EventHandler();
        littleCollideHandler.target = this;
        littleCollideHandler.component = "needleGameScene";
        littleCollideHandler.handler = "onCollideLittleBall";
        littleBall.onCollideLittleBallEvents.push(littleCollideHandler);
        /**小球进入大球有效范围 */
        var mainCollideHandler = new cc.Component.EventHandler();
        mainCollideHandler.target = this;
        mainCollideHandler.component = "needleGameScene";
        mainCollideHandler.handler = "onCollideMainBall";
        littleBall.onCollideMainBallEvents.push(mainCollideHandler);
        return newBall;
    },

    /**
     * 小球碰小球
     * 游戏结束
     * @param {event} event 事件
     */
    onCollideLittleBall(event) {
        cc.log(event.message);
        //小球停止运动
        var littleBall = event.littleBall;
        littleBall.stopAllActions();
        this.gameOver();
    },

    /**
     * 进入大球有效范围
     * 得分
     * @param {event} event 事件
     */
    onCollideMainBall(event) {
        cc.log(event.message);
        var littleBall = event.littleBall;
        littleBall.removeFromParent();
        littleBall.getComponent("littleBall").needle.active = true;
        this.mainBall.addChild(littleBall);
        // 根据大球rotation，计算小球位置
        var rot = this.mainBall.rotation;
        littleBall.rotation = - rot;
        var newBallX = Math.sin(rot * 0.017453293) * this._mainBallRadis;
        var newBallY = -Math.cos(rot * 0.017453293) * this._mainBallRadis;
        littleBall.x = newBallX;
        littleBall.y = newBallY;
        // 加分
        this._score++;
        this.labScore.string = this._score;
    },
    /**
     * 游戏结束
     */
    gameOver() {
        // 取消倒计时
        this.unschedule(this.cutDown);
        //大球停止运动
        this.mainBall.stopAllActions();
        this.node.off(cc.Node.EventType.TOUCH_START);

        // 显示结束页面
        this.node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function () {
                this.gameOverLayer.active = true;
                this.gameOverLayer.opacity = 0;
                this.gameOverLayer.runAction(cc.fadeIn(0.3));
            }, this)
        ));
    },

    /**
     * 随机颜色
     * 轮询
     */
    randomColor() {
        this._randomColorIndex++;
        this._randomColorIndex = this._randomColorIndex > 4 ? 1 : this._randomColorIndex;
        switch (this._randomColorIndex) {
            case 1: return new cc.color({ r: 255, g: 0, b: 0, a: 255 });
            case 2: return new cc.color({ r: 0, g: 255, b: 0, a: 255 });
            case 3: return new cc.color({ r: 0, g: 0, b: 255, a: 255 });
            case 4: return new cc.color({ r: 255, g: 255, b: 0, a: 255 });
        }
    },



    /**
     * 重新开始
     * @param {Event} event 事件
     * @param {Object} cusData 自定义数据
     */
    btnRestartClick(event, cusData) {
        cc.director.loadSceneEx("needleGameScene");
    }

});
