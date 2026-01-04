//=============================================================================
// Plugin for RPG Maker MZ
// HideStatusOnBattle.js
//=============================================================================
// [Update History]
// 2022.May.14 Ver1.0.0 First Release

/*:
 * @target MZ
 * @plugindesc Hide Status And Mover Actor Command To Center
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * This plugin changes battle display.
 * - Hide Status Window
 * - Move Actor Command To Center
 *
 * [Summary]
 * This plugin assumes the use of special battle sequence.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc バトル時、ステータスを消去し、コマンドを中央に移動します。
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、バトル画面でのレイアウトを変更します。
 * - ステータスウィンドウを表示しません
 * - コマンドウィンドウを画面中央に表示します。
 *
 * ■概要
 * このプラグインは、特殊なタイプの戦闘作成での使用を想定しています。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'HideStatusOnBattle';
  
  
  // !!!overwrite!!
  Scene_Battle.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    const statusWindow = new Window_BattleStatus(rect);
    // this.addWindow(statusWindow);
    this._statusWindow = statusWindow;
  };

  const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    // In order to make sure to dispose status window
    //this.addWindow(this._statusWindow);
    _Scene_Battle_terminate.call(this);
  };
  
  //
  // Move actor command window to center of the screen's X-axis
  //
  const _Scene_Battle_actorCommandWindowRect =
   Scene_Battle.prototype.actorCommandWindowRect;
  Scene_Battle.prototype.actorCommandWindowRect = function() {
    const rect = _Scene_Battle_actorCommandWindowRect.call(this);
    rect.x = (Graphics.boxWidth - 970);
    return rect;
  };
  
  //ここでアクターコマンドウィンドウ消去
  Scene_Battle.prototype.createActorCommandWindow = function() {
    const rect = this.actorCommandWindowRect();
    const commandWindow = new Window_ActorCommand(rect);
    commandWindow.y = Graphics.boxHeight - commandWindow.height;
    commandWindow.setHandler("attack", this.commandAttack.bind(this));
    commandWindow.setHandler("skill", this.commandSkill.bind(this));
    commandWindow.setHandler("guard", this.commandGuard.bind(this));
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("cancel", this.commandCancel.bind(this));
    //this.addWindow(commandWindow);
    this._actorCommandWindow = commandWindow;
};


})();
