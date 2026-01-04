/*:
 * @target MZ
 * @plugindesc sweet.
 * @author hoshi
 *
 * @help Sweet.js
 *
 */

(() => {
    Scene_Battle.prototype.createAllWindows = function() {
        this.createLogWindow();
        //this.createStatusWindow();
        this.createPartyCommandWindow();
        this.createActorCommandWindow();
        this.createHelpWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createEnemyWindow();
        Scene_Message.prototype.createAllWindows.call(this);
    };
})();