
/**
 * 切换场景扩展方法
 * 会额外显示一个加载进度层
 * @param {sceneName} 切换至场景名
 */
cc.director.loadSceneEx = function (sceneName) {
    var curScene = cc.director.getScene();
    /**
     * 添加一个节点，阻止全部触摸事件 
     * 此节点会随场景切换自动释放
     */
    var node = new cc.Node();
    node.setContentSize(cc.director.getWinSizeInPixels());
    node.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
    node.on(cc.Node.EventType.TOUCH_START, (event) => {
        event.stopPropagation();
    }, this);
    curScene.addChild(node);
    cc.loader.loadRes("Prefab/loading", cc.Prefab, (err, prefab) => {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var loadingLayer = cc.instantiate(prefab);
        loadingLayer.getComponent("loading").sceneName = sceneName;
        curScene.addChild(loadingLayer);
    });

};
