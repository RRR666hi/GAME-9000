//WindowHenkouZisaku

/*:ja
 * @target MZ
 * @plugindesc ウィンドウ変更
 * @author 干しガラス
 *
 * @help WindowHenkouZisaku.js
 *
 * メッセージ行数を４→３にする用
 * 
 *
 * プラグインコマンドはありません。
 */
 

(() => {
	Window_Message.prototype.numVisibleRows = function() {
		return 3;
	};
	
	//フォロワー削除
	Game_Followers.prototype.setup = function() {
    	this._data = [];
}	;
})();