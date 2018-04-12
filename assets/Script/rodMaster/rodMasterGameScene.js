
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
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
        cc.director.getPhysicsManager().gravity = cc.v2(0, -640);

        /**
         * 触摸监听
         */
        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            cc.log("TOUCH START !!!!");
            this.rod.getComponent("rod").startGrow();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            cc.log("TOUCH END !!!!");
            var rod = this.rod.getComponent("rod");
            rod.stopGrow();
            rod.fallDown();
            // this.node.runAction(cc.sequence(
            //     cc.callFunc(() => {
            //         this.player.runAction(cc.moveBy(1, cc.v2(100, 0)));
            //     }, this),
            //     cc.delayTime(1.3),
            //     cc.callFunc(() => {
            //         this.player.runAction(cc.moveTo(1, cc.v2(-280, 33)));
            //         this.ground.runAction(cc.moveTo(1, cc.v2(-323, -318)));
            //     }, this)
            // ));
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
