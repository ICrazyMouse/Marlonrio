cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() { },

    // update (dt) {},

    /**
     * 开始
     * @param {event} event 事件
     * @param {object} cusData 自定义数据
     */
    btnStartClick(event, cusData) {
        cc.director.loadSceneEx("rodMasterGameScene");
    },

    /**
     * 排行榜
     * @param {event} event 事件
     * @param {object} cusData 自定义数据
     */
    btnRankClick(event, cusData) {
        
    }
});
