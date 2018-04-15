cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() { },

    // start() { },

    // update (dt) {},

    /**
     * 开始
     * @param {Event} event 事件
     * @param {Object} cusData 自定义数据
     */
    btnStartClick(event, cusData) {
        cc.director.loadSceneEx("needleGameScene");
    }
});
