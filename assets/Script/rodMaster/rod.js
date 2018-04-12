cc.Class({
    extends: cc.Component,

    properties: {
        head: { default: null, type: cc.Node },
        mid: { default: null, type: cc.Node },
        tail: { default: null, type: cc.Node }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    /**
     * 变长
     * @param {时间} dt 
     */
    grow(dt) {
        var midSize = this.mid.getContentSize();
        this.mid.setContentSize(midSize.width, midSize.height + 2);
        this.head.y = this.mid.getContentSize().height + 30;
    },

    /**
     * 开始变长
     */
    startGrow() {
        this.schedule(this.grow, 0.01);
    },
    /**
     * 停止变长
     */
    stopGrow() {
        this.unschedule(this.grow);
        var colliders = this.node.getComponents(cc.PhysicsBoxCollider);
        colliders.forEach(collider => {
            var midSize = this.mid.getContentSize();
            //用于检测PerFact,头部Collider
            if (collider.tag == 1) {
                collider.offset = cc.v2(0, midSize.height + 30);
                cc.log("COLLIDER TAG ============= " + collider.tag);
            }
            //杆体Collider
            else if (collider.tag == 0) {
                collider.size = cc.size(midSize.width, midSize.height + 20);
                collider.offset = cc.v2(0, collider.size.height / 2);
                cc.log("COLLIDER TAG ============= " + collider.tag);
            }
        });
        //刷新物理Collider组件
        this.node.active = !this.node.active;
        this.node.active = !this.node.active;
    },

    /**
     * 向前方倒下
     */
    fallDown() {
        this.node.runAction(cc.rotateBy(0.3, 60));
    }
});
