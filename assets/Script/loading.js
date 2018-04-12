cc.Class({
    extends: cc.Component,
    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        text: 'Loading',
        sceneName: "menuScene",
        _loadingPercent: 0,
        _loadingNextStep: 0
    },

    /**
     * onLoad
     */
    onLoad() {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.3));
    },

    /**
     * Start
     */
    start() {
        this.label.string = this.text;
        var info = cc.director._getSceneUuid(this.sceneName);
        var self = this;
        if (info) {
            cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, this.sceneName);
            cc.loader.load({ uuid: info.uuid, type: 'uuid' }, (completedCount, totalCount, item) => {
                cc.log("已完成Items:" + completedCount);
                cc.log("全部Items:" + totalCount);
                cc.log("当前Item:" + item.url);
                self._loadingNextStep = parseInt(completedCount / totalCount * 100);
                cc.log("加载进度:" + self._loadingNextStep);
            }, (error, asset) => {
                if (error) {
                    cc.errorID(1210, this.sceneName, error.message);
                } else {
                    cc.log("加载完成:" + (asset instanceof cc.SceneAsset));
                }
            });
        }
    },

    /**
     * 每帧调用
     * @param {number} dt 帧间隔时间
     */
    update(dt) {
        if (!this._completed) {
            this._loadingPercent += 5;
            this._loadingPercent > this._loadingNextStep ? this._loadingNextStep : this._loadingPercent;
            this.label.string = this.text + this._loadingPercent + "%";
            if (this._loadingPercent >= 100) {
                this._completed = true;
                this.label.string = this.text + "100%";
                this.label.node.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.fadeOut(0.3),
                    cc.delayTime(0.3),
                    cc.callFunc(() => {
                        cc.director.loadScene(this.sceneName);
                    }, this)
                ));
            }
        }

    },
});
