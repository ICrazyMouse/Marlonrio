cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        
    },

    // update (dt) {},

    /**
     * 棍子西游
     * @param {event} event 事件
     * @param {object} cusData 自定义数据
     */
    btnRodMasterClick(event, cusData) {
        cc.director.loadSceneEx("rodMasterMenuScene");
    },

    /**
     * 飞刀手
     * @param {event} event 事件
     * @param {object} cusData 自定义数据
     */
    btnNeedleClick(event, cusData) {
        cc.director.loadSceneEx("needleMenuScene");
    }
});
