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
     * @param {事件} event 
     * @param {自定义数据} cusData 
     */
    btnRodMasterClick(event, cusData) {
        cc.director.loadSceneEx("rodMasterMenuScene");
    },

    /**
     * 飞刀手
     * @param {事件} event 
     * @param {自定义数据} cusData 
     */
    btnFlyCutterClick(event, cusData) {
        cc.director.loadSceneEx("flyCutterMenuScene");
    }
});
