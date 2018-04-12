
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        prbGround: {
            default: null,
            type: cc.Prefab
        },
        ground: {
            default: null,
            type: cc.Node
        },
        rod: {
            default: null,
            type: cc.Node
        },
        scoreLabel: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        /**
         * 开启物理引擎
         */
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
            ;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -3000);
        /**
         * 开启碰撞组件
         */
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        /**
         * 触摸监听
         */
        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            this.PLAYER_TOUCH_START();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            this.PLAYER_TOUCH_END();
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.PLAYER_FORWARD();
                }, this)
            ));
        }, this);
    },

    start() {
        this._oldGround = this.ground;
        this._curGround = this.CREATE_NEW_GROUND();
        this._score = 0;
    },

    /**
     * 安全登陆事件
     * @param {event} event 安全登陆地面事件
     */
    onLoadGround(event) {
        this.player.stopAllActions();
        this._score += 1;
        this.SCORE();
        cc.log(event.message);
    },
    /**
     * 完美着陆事件
     * @param {event} event 完美着陆事件
     */
    onPerfect(event) {
        this._score += 5;
        cc.log(event.message);
    },

    //游戏循环

    /**
     * 创建新的地面
     */
    CREATE_NEW_GROUND() {
        var width = 200;
        var distance = 300;

        var newGround = cc.instantiate(this.prbGround);
        newGround.getComponent("ground").setWidth(width);
        newGround.setPosition(cc.v2(500, 0));
        this.node.addChild(newGround);
        newGround.runAction(cc.moveTo(0.5, cc.v2(-350 + distance + width / 2, 0)));

        /**监听着陆事件 */
        var loadhandler = new cc.Component.EventHandler();
        loadhandler.target = this;
        loadhandler.component = "rodMasterGameScene";
        loadhandler.handler = "onLoadGround";
        newGround.getComponent("ground").onLoadGroundEvents.push(loadhandler);
        /**监听完美事件 */
        var perfecthandler = new cc.Component.EventHandler();
        perfecthandler.target = this;
        perfecthandler.component = "rodMasterGameScene";
        perfecthandler.handler = "onPerfect";
        newGround.getComponent("ground").onPerfectEvents.push(perfecthandler);

        return newGround;
    },
    /**
     * 玩家开始触摸
     */
    PLAYER_TOUCH_START() {
        this.rod.getComponent("rod").startGrow();
    },
    /**
     * 玩家停止触摸
     */
    PLAYER_TOUCH_END() {
        var rod = this.rod.getComponent("rod");
        rod.stopGrow();
        rod.fallDown();
    },
    /**
     * 玩家前进
     */
    PLAYER_FORWARD() {
        this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500);
        this.player.runAction(cc.sequence(
            cc.moveBy(0.5, cc.v2(200, 0)),
            cc.moveBy(1, cc.v2(720, 0))
        ));
    },

    /**
     * 得分
     */
    SCORE() {
        this.scoreLabel.getComponent(cc.Label).string = this._score;
        //棍子飞回孙悟空手中
        var pos = this.player.getPosition();
        var dur = this.rod.getComponent("rod").resume(cc.v2(pos.x + 80, this.rod.getPosition().y));
        this.node.runAction(cc.sequence(
            cc.delayTime(dur),
            cc.callFunc(() => {
                this.CAMERA_FORWARD();
            }, this)
        ));
    },
    /**
     * 镜头移动
     */
    CAMERA_FORWARD() {
        var moveDur = 0.5;
        var moveDis = this._curGround.x + 350;

        this._oldGround.runAction(cc.sequence(
            cc.moveBy(moveDur, cc.v2(-moveDis, 0)),
            cc.callFunc(() => {
                this._oldGround.destroy();
                this._oldGround = this._curGround;
            }, this)
        ));

        this._curGround.runAction(cc.sequence(
            cc.moveBy(moveDur, cc.v2(-moveDis, 0)),
            cc.delayTime(1),
            cc.callFunc(() => {
                this._curGround = this.CREATE_NEW_GROUND();
            }, this)
        ));

        this.player.runAction(cc.moveTo(moveDur, cc.v2(-300, 56)));
        this.rod.runAction(cc.moveTo(moveDur, cc.v2(-220, 10)));
    },
    /**
     * 游戏结束
     */
    GAME_OVER() {

    }
});
