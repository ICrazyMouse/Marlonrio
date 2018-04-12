
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
    },

    //游戏循环

    /**
     * 创建新的地面
     * @param {number} width 宽度
     * @param {number} distance 距离
     */
    CREATE_NEW_GROUND(width, distance) {
        var newGround = cc.instantiate(this.prbGround);
        newGround.setPosition();
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
        this.player.runAction(cc.moveBy(3, cc.v2(500, 0)));
    },

    /**
     * 得分
     */
    SCORE() {
        this.CAMERA_FORWARD();
    },
    /**
     * 镜头移动
     */
    CAMERA_FORWARD() {
        /////
        //移动镜头...
        /////
        this.CREATE_NEW_GROUND();
    },
    /**
     * 游戏结束
     */
    GAME_OVER() {

    }



});
