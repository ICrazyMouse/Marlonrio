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
     * @param {事件对象} event 
     * @param {自定义数据} cusData 
     */
    btnStartClick(event, cusData) {
        cc.director.loadSceneEx("rodMasterGameScene");
    },

    /**
     * 排行榜
     * @param {事件对象} event 
     * @param {自定义数据} cusData 
     */
    btnRankClick(event, cusData) {
        
    }
});
