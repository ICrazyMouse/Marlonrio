cc.Class({
    extends: cc.Component,

    properties: {
        onLoadGroundEvents: {
            default: [],
            visible: false,
            type: cc.Component.EventHandler
        },
        onPerfectEvents: {
            default: [],
            visible: false,
            type: cc.Component.EventHandler
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    /**
     * 设置地面宽度
     * @param {number} width 地面宽度
     */
    setWidth(width) {
        var phyCollider = this.node.getComponent(cc.PhysicsBoxCollider);
        phyCollider.size = cc.size(width, phyCollider.size.height);
        var boxColliders = this.node.getComponents(cc.BoxCollider);
        boxColliders.forEach(collider => {
            if (collider.tag == 1) {
                collider.size = cc.size(width - 10, collider.size.height);
            }
        });
    },


    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        if (self.tag == 1 && other.tag == 1) {
            //登陆碰撞
            this.emitOnLoadEvents();
            self.enabled = false;
        } else if (self.tag == 2 && other.tag == 2) {
            //完美碰撞
            this.emitPerfectEvents();
            self.enabled = false;
        }
    },

    /**
     * 着陆事件
     */
    emitOnLoadEvents() {
        var event = {};
        event.message = "着陆";
        cc.Component.EventHandler.emitEvents(this.onLoadGroundEvents, event);
    },
    /**
     * 完美事件
     */
    emitPerfectEvents() {
        var event = {};
        event.message = "完美";
        cc.Component.EventHandler.emitEvents(this.onPerfectEvents, event);
    }
});