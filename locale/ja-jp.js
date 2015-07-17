var locale = {
    "locale": "ja-jp",
    text: {
        "mnuFilehref": "ファイル ",
        "mnuNew": "新規作成 Ctrl+R",
        "mnuSave": "保存 Ctrl+S",
        "mnuEdithref": "編集 ",
        "mnuFullScreen": "フルスクリーン  (Ctrl+F11)",
        "mnuBookmarkshref": "ブックマーク",
        "mnuToggleBookmark": "ブックマーク切替  Ctrl+F2",
        "mnuClearBookmark": "ブックマークをクリア  Ctrl+shift+F2",
        "mnuNextBookmark": "次のブックマーク  F2",
        "mnuPreviousBookmark": "前のブックマーク  shift+F2",
        "mnuBuildhref": "ビルド ",
        "mnuCompile": "コンパイル Ctrl+F7",
        "mnuHelphref": "ヘルプ ",
        "mnuAbout": "m-editorについて",
        "mnuAboutExe": "m-edoについて",
        "openBtn": "開く",
        "newRoutineModalLabel": "新しいルーチン",
        "saveChnagesModalLabel": "名前をつけて保存",
        "selectDirectoryModalLabel": "ディレクトリ選択",
        "selDirRoutineLabel": "ルーチンディレクトリを選択してください",
        "loginModalLabel": "m-edo(editor/do)",
        "loginPanelLegend": "パスワード認証",
        "loginUserLabel" : "m-edo ユーザ名",
        "loginPasswordLabel": "m-edo パスワード",
        "aboutModalLabel": "概要",
        "btnNROK": "OK",
        "btnNRCancel": "キャンセル",
        "btnSCYes": "はい",
        "btnSCNo": "いいえ",
        "btnSCCancel": "キャンセル",
        "btnSDOK": "OK",
        "btnSDCancel": "キャンセル",
        "btnLogin": "ログイン",
        "btnAboutCancel": "キャンセル",
        "logoutConfirmPanelHeading" : "m-edo(editor/do) ログアウト",
        "logoutConfirmPanelQuestion" : "ログアウトしますか?",
        "logoutConfirmPanelOKBtn" : "はい",
        "logoutConfirmPanelCancelBtn" : "いいえ",
        "deleteConfirmPanelHeading" : "Balus!",
        "deleteConfirmPanelQuestion" : "m-edoのセッションはタイムアウトされ切断されました!",
        "deleteConfirmPanelOKBtn" : "OK",
        "zombieValidModalLabel" : "プロセスの表示とゾンビのKILL",
        "zombieValidModal-th-sessionid" : "sessID",
        "zombieValidModal-th-pid" : "pid",
        "zombieValidModal-th-osUser" : "OS",
        "zombieValidModal-th-medoUser" : "M-EDO",
        "zombieValidModal-th-command" : "コマンド",
        "zombieValidModal-th-status" : "ステータス",
        "zombieValidModalRefresh" : "更新" ,
        "zombieValidModalCancel" : "キャンセル"
    },
    placeholder: {
        "selectedRoutine": "ルーチン選択",
        "txtNewRoutine": "ルーチン名を入力",
        "txtUsername" : "ユーザ名を入力",
        "txtPassword": "パスワードを入力"
    },
    tooltip: {
        "btnNew": "新規作成 (Ctrl+R)",
        "btnSave": "ルーチンを保存 (Ctrl+S)",
        "btnBuild": "ルーチンをコンパイル (Ctrl+F7)",
        "btnFullScreen": "フルスクリーン (Ctrl+F11)",
        "btnLogout": " さん ログアウト",
        "btnKeepAliveNowOff": "キープアライブの状態はOFFです。クリックでON",
        "btnKeepAliveNowOn": "キープアライブの状態はONです。クリックでOFF",
        "btnZombieStatus" : "プロセスの表示とゾンビのKILL"
    },
    alert: {
        "buildRoutine": "最初にルーチンを保存してください。",
        "selectdirectory": "リストからディレクトリを選択してください。",
        "saveChangesBody": "名前を変更して保存しますか。<b>",
        "getRoutine": "ルーチン取得時にエラーが発生しました。",
        "saveRoutine": "ルーチン保存でエラーが発生しました。",
        "buildRoutineError": "コンパイルエラーを検出しました。\n",
        "buildRoutineSuccess": " コンパイル成功！",
        "checkRoutineName": "エラー!",
        "Login": "エラー!",
        "labelonlyline": "ラベルのある行にカーソルを置いてください",
        "includesparametors": "ラベルに引数があります",
        "gtmRunSaveBuild" : "最初にルーチンを保存してコンパイルしてください。",
        "RoutineExecuteError" : "ルーチン実行エラー!",
        "gtmRunStdErr" : "エラー!",
        "running": "実行中!",
        "notrunning": "実行していません!",
        "entreftext": "セレクトBoxから ラベル^ルーチンを選択してください!",
        "runningRoutine" : "exist Running Routine!",
        "zombieKillProcess" : "MUPIPコマンドでプロセスをKILLします",
        "zombieDeleteSession" : "M-EDOセッションテーブルからこのセッションを削除します"
    },
    tabContentTooltip: {
        "outRun" : "エディタのラベル行から実行 (Ctrl+F8)",
        "outEntRef" : "セレクトBOXのルーチンから実行(Ctrl + Shift + F8)",
        "outWarn" : "このプログラムは実行中です",
        "outStop" : "強制終了します[MUPIP STOP] (Ctrl+F9)",
        "outSendESC" : "エスケープ(ESC)送信 (Ctrl+[)",
        "intSubmit" : "入力テキストを送信"
    }
};

/**
 * Select2 Japanese translation.
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "該当なし"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return n + "文字以上入力"; },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "検索文字列が" + n + "文字長すぎます"; },
        formatSelectionTooBig: function (limit) { return "最多で" + limit + "項目までしか選択できません"; },
        formatLoadMore: function (pageNumber) { return "読込中･･･"; },
        formatSearching: function () { return "検索中･･･"; }
    });
})(jQuery);
