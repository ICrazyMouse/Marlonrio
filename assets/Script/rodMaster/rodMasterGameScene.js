
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
        cc.director.getPhysicsManager().gravity = cc.v2(0, -3000);

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
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.player.runAction(cc.moveBy(3, cc.v2(500, 0)));
                    // rod.resume(cc.v2(rod.node.x + 100, rod.node.y));
                }, this)
            ));
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
