/**
 * 远程资源地址:https://dev.zovew.com/game/rodmaster/
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {
        this.node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                cc.director.loadSceneEx("menuScene");
            }, this)
        ));
    },

    // update (dt) {},
});
