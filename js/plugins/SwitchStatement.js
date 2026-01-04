// SwitchStatement.js Ver.1.0.1
// MIT License (C) 2022 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ MV
* @plugindesc イベントコマンドでswitch文が使えるようになります。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/
* @help 特定の記法でラベルに書き込むことでswitch文を再現できます。
*
* https://awaya3ji.seesaa.net/article/488642774.html
* こちらの記事のサムネイルを参考にすることを推奨します。
*
* (1)プラグインコマンドに式を入力。
* (2)真下にイベントコマンド［ループ］を設置。
* (3)ループの中に、条件に応じた移動先を設定します。
* イベントコマンド［ラベル］に
* case (値):
* または
* case "(値)":
* と入力するとそこがプラグインコマンドで設定した式に当てはまった時の移動先になります。
* ダブルクォーテーションで囲んでも囲まなくても動作に違いはありません。
* 見やすい方にして下さい。
* 制御文字が使用できます。
*
* イベントコマンド［ラベル］に
* default:
* と入力すると何も当てはまらなかった時の移動先になります。
*
* イベントコマンド［ループの中断］でループを脱出できます。
* caseに当てはまらなかったり、defaultが設定されていない場合は
* そのままループを脱出します。
*
* 【プラグインコマンド（MZ用）】
* 制御文字を使用できます。PluginCommonBaseにも対応しています。
* スクリプトも使用可能です。
*
* 【プラグインコマンド（MV用）】
* switch 式　//条件の合うラベルに移動します。
* switchEval 式　//スクリプトとして評価した後に条件の合うラベルに移動します。
* いずれも制御文字が使えます。
* 式を書く際、半角スペースを使用しても構いません。
*
* 【スクリプト】
* this.switch(式);
*
* ［更新履歴］
* 2022/06/04：Ver.1.0.0　公開
* 2022/06/05：Ver.1.0.1　switch文の中にループがあった場合の挙動を修正。
*
* @command switch
* @arg expr
* @text 式
* @desc 条件の合うラベルに移動します。
* @type string
*
* @command switchEval
* @arg expr
* @text 式
* @desc スクリプトとして評価した後に条件の合うラベルに移動します。
* @type string
*
* @param forceEval
* @desc switchでもswitchEvalと同じ挙動になるようにします。
* 使い分けが面倒な場合にお使いください。
* @type boolean
* @default false
*
*/


'use strict';
{
	//プラグイン名取得。
	const script = document.currentScript;
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];

	const useMZ = Utils.RPGMAKER_NAME === "MZ";
	const hasPluginCommonBase = typeof PluginManagerEx === "function";

	const parameter = PluginManager.parameters(pluginName);
	const forceEval = parameter["forceEval"] === "true";
	
	//プラグインコマンド
	if(hasPluginCommonBase && useMZ){
		PluginManagerEx.registerCommand(document.currentScript, "switch", function (args) {
			this.switch(forceEval ? eval(args.expr) : args.expr);
		});
		PluginManagerEx.registerCommand(document.currentScript, "switchEval", function (args) {
			this.switch(eval(args.expr));
		});
	} else if (useMZ) {
		PluginManager.registerCommand(pluginName, "switch", function (args) {
			const expr = Window_Base.prototype.convertEscapeCharacters(args.expr);
			this.switch(forceEval ? eval(expr) : expr);
		});
		PluginManager.registerCommand(pluginName, "switchEval", function (args) {
			const expr = Window_Base.prototype.convertEscapeCharacters(args.expr);
			this.switch(eval(expr));
		});
	}

	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		if (command === "switch" || command === "switchEval") {
			const text = Window_Base.prototype.convertEscapeCharacters(args.join(" "));
			const useEval = forceEval || command === "switchEval";
			const expr = useEval ? eval(text) : text;
			this.switch(expr);
		}
	};

	Game_Interpreter.prototype.switch = function(expr) {
		const findStr1 = `case ${expr}:`;
		const findStr2 = `case "${expr}":`;
		let depth = 0;
		let indent = this._indent + 1;
		for (let i = this._index; i < this._list.length; i++) {
			const command = this._list[i];
			const code = command.code;
			const params = command.parameters;
			if (code === 118 && depth === 1 && command.indent === indent) {
				const text = Window_Base.prototype.convertEscapeCharacters(params[0]);
				if (text === findStr1 || text === findStr2 || text === "default:") {
					this.jumpTo(i);
					break;
				}
			} else if (code === 112) {
				depth++;
			} else if (code === 413) {
				if (depth > 1) {
					depth--;
				} else {
					this.jumpTo(i);
					break;
				}
			}
		}
	};

}