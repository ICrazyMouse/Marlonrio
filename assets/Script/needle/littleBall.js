cc.Class({
    extends: cc.Component,

    properties: {
        needle: {
            default: null,
            type: cc.Node
        },
        ballTexture: {
            default: null,
            type: cc.Node
        },
        onCollideLittleBallEvents: {
            default: [],
            visible: false,
            type: cc.Component.EventHandler
        },
        onCollideMainBallEvents: {
            default: [],
            visible: false,
            type: cc.Component.EventHandler
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    // start() {},

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        if (self.tag == other.tag) {
            //与小球碰撞
            this.emitCollideLittleBall();
        } else {
            //进入大球范围内
            this.emitCollideMainBall();
        }
    },

    /**
     * 与小球碰撞
     */
    emitCollideLittleBall() {
        var event = {};
        event.message = "与小球碰撞";
        event.littleBall = this.node;
        cc.Component.EventHandler.emitEvents(this.onCollideLittleBallEvents, event);
    },
    /**
     * 进入大球范围内
     */
    emitCollideMainBall() {
        var event = {};
        event.message = "进入大球范围内";
        event.littleBall = this.node;
        cc.Component.EventHandler.emitEvents(this.onCollideMainBallEvents, event);
    },

    /**
     * 设置颜色
     */
    setColor(color) {
        this.ballTexture.color = color;
    }
});
