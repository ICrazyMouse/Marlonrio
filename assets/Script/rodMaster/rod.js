cc.Class({
    extends: cc.Component,

    properties: {
        head: { default: null, type: cc.Node },
        mid: { default: null, type: cc.Node },
        tail: { default: null, type: cc.Node }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var colliders = this.node.getComponents(cc.PhysicsBoxCollider);
        colliders.forEach(collider => {
            //关闭物理碰撞
            collider.enabled = false;
        });

        this._headOriginSize = this.head.getContentSize();
        this._midOriginSize = this.mid.getContentSize();
        this._tailOriginSize = this.tail.getContentSize();
    },

    start() {

    },

    // update (dt) {},

    /**
     * 变长
     * @param {number} dt 帧间隔时间
     */
    grow(dt) {
        var midSize = this.mid.getContentSize();
        var tailSize = this.tail.getContentSize();
        var headSize = this.head.getContentSize();
        this.mid.setContentSize(midSize.width, midSize.height + 3);
        this.head.y = this.mid.getContentSize().height + tailSize.height + headSize.height / 2;
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
        this.refreshCollider();
    },

    /**
     * 根据rod大小更新collider尺寸
     */
    refreshCollider() {
        var colliders = this.node.getComponents(cc.PhysicsBoxCollider);
        colliders.forEach(collider => {
            var midSize = this.mid.getContentSize();
            var tailSize = this.tail.getContentSize();
            var headSize = this.head.getContentSize();
            //用于检测PerFact,头部Collider
            if (collider.tag == 1) {
                collider.size = cc.size(headSize.width, headSize.height);
                collider.offset = cc.v2(0, midSize.height + headSize.height * 1.5);
            }
            //杆体Collider
            else if (collider.tag == 0) {
                collider.size = cc.size(midSize.width, midSize.height + tailSize.height);
                collider.offset = cc.v2(0, collider.size.height / 2);
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
        this.node.anchorY = 1;
        this.node.runAction(cc.sequence(
            cc.rotateBy(0.3, 90),
            cc.callFunc(() => {
                var colliders = this.node.getComponents(cc.PhysicsBoxCollider);
                colliders.forEach(collider => {
                    //开启物理碰撞
                    collider.enabled = true;
                });
            }, this)
        ));
    },

    /**
     * 恢复到初始状态
     * 因添加了物理碰撞组件的节点不支持修改Anchor
     * 此处手动修改主节点，子节点坐标
     * @param {目标位置} pos cc.v2
     */
    resume(pos) {
        var dur = 0.5;

        this.head.setContentSize(this._headOriginSize);
        this.mid.setContentSize(this._midOriginSize);
        this.tail.setContentSize(this._tailOriginSize);
        this.head.y = this.mid.getContentSize().height + this._tailOriginSize.height + this._headOriginSize.height / 2;
        this.refreshCollider();

        var colliders = this.node.getComponents(cc.PhysicsBoxCollider);
        colliders.forEach(collider => {
            //关闭物理碰撞
            collider.enabled = false;
        });
        /**
         * 手动调节Anchor
         */
        var rodTotalSizeHeight = this.mid.getContentSize().height + this.tail.getContentSize().height + this.head.getContentSize().height;
        var rodChildren = this.node.children;
        //主节点位置移动
        this.node.x += rodTotalSizeHeight / 2;
        //子节点位置移动
        rodChildren.forEach((child) => {
            child.y -= rodTotalSizeHeight / 2;
        });
        //贝塞尔曲线
        var durX = pos.x - this.node.x;
        pos.y += rodTotalSizeHeight / 2;
        var bezier = [
            cc.v2(this.node.x + durX * 0.25, this.node.y + 200),
            cc.v2(this.node.x + durX * 0.75, this.node.y + 200),
            pos
        ];
        this.node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.bezierTo(dur, bezier),
                    cc.rotateBy(dur, 1800 - 90)
                ),
                cc.callFunc(() => {
                    var rodTotalSizeHeight = this.mid.getContentSize().height + this.tail.getContentSize().height + this.head.getContentSize().height;
                    var rodChildren = this.node.children;
                    //主节点位置移动
                    this.node.y -= rodTotalSizeHeight / 2;
                    //子节点位置移动
                    rodChildren.forEach((child) => {
                        child.y += rodTotalSizeHeight / 2;
                    });
                }, this)
            )
        );
        return dur;
    }
});
