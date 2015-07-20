var locale = {
    "locale": "en-us",
    text: {
        "mnuFilehref": "File ",
        "mnuNew": "New Ctrl+R",
        "mnuSave": "Save Ctrl+S",
        "mnuEdithref": "Edit ",
        "mnuFullScreen": "Full Screen  (Ctrl+F11)",
        "mnuBookmarkshref": "Bookmarks",
        "mnuToggleBookmark": "Toggle Bookmark  Ctrl+F2",
        "mnuClearBookmark": "Clear Bookmarks  Ctrl+shift+F2",
        "mnuNextBookmark": "Next  F2",
        "mnuPreviousBookmark": "Previous  shift+F2",
        "mnuBuildhref": "Build ",
        "mnuCompile": "Compile Ctrl+F7",
        "mnuHelphref": "Help ",
        "mnuAbout": "About m-editor",
        "mnuAboutExe": "About m-edo",
        "openBtn": "Open",
        "newRoutineModalLabel": "New Routine",
        "saveChnagesModalLabel": "Save Changes",
        "selectDirectoryModalLabel": "Select Directory",
        "selDirRoutineLabel": "Select Directory for the routine",
        "loginModalLabel": "m-edo(editor/do)",
        "loginPanelLegend": "Authentication",
        "loginUserLabel" : "m-edo User Name",
        "loginPasswordLabel": "m-edo Password",
        "aboutModalLabel": "About",
        "btnNROK": "OK",
        "btnNRCancel": "Cancel",
        "btnSCYes": "Yes",
        "btnSCNo": "No",
        "btnSCCancel": "Cancel",
        "btnSDOK": "OK",
        "btnSDCancel": "Cancel",
        "btnLogin": "Login",
        "btnAboutCancel": "Cancel",
        "logoutConfirmPanelHeading" : "m-edo(editor/do) Logout",
        "logoutConfirmPanelQuestion" : "Do you logout?",
        "logoutConfirmPanelOKBtn" : "Yes",
        "logoutConfirmPanelCancelBtn" : "Cancel",
        "deleteConfirmPanelHeading" : "Balus!",
        "deleteConfirmPanelQuestion" : "m-edo(editor/do) session was Time Out, and Disconnected!",
        "deleteConfirmPanelOKBtn" : "OK",
        "zombieValidModalLabel" : "View process and KILL Zombie",
        "zombieValidModal-th-sessionid" : "sessID",
        "zombieValidModal-th-pid" : "pid",
        "zombieValidModal-th-osUser" : "OS",
        "zombieValidModal-th-medoUser" : "M-EDO",
        "zombieValidModal-th-command" : "command",
        "zombieValidModal-th-status" : "status",
        "zombieValidModalRefresh" : "Refresh" ,
        "zombieValidModalCancel" : "Cancel"
    },
    placeholder: {
        "selectedRoutine": "Select Routine",
        "txtNewRoutine": "Enter Routine Name",
        "txtUsername" : "Enter your Username",
        "txtPassword": "Enter your Password"
    },
    tooltip: {
        "btnNew": "New Routine (Ctrl+R)",
        "btnSave": "Save Routine (Ctrl+S)",
        "btnBuild": "Compile Routine (Ctrl+F7)",
        "btnFullScreen": "Full Screen (Ctrl+F11)",
        "btnLogout": " user Logout",
        "btnKeepAliveNowOff": "KeepAlive status currently OFF. Click if turned ON",
        "btnKeepAliveNowOn": "KeepAlive status currently ON. Click if turned OFF",
        "btnZombieStatus" : "View process and KILL Zombie"
    },
    alert: {
        "buildRoutine": "Please save the routine first.",
        "selectdirectory": "select directory from the list.",
        "saveChangesBody": "Save changes to <b>",
        "getRoutine": "Some error occurred while fething routine.",
        "saveRoutine": "Some error occurred in saving routine.",
        "buildRoutineError": "Detected errors during compilation\n",
        "buildRoutineSuccess": " compiled successfully.",
        "checkRoutineName": "error!",
        "Login": "error!",
        "labelonlyline": "Place cursor on label only line!",
        "parametorsexists": "Parametors exists in Label!",
        "gtmRunSaveBuild" : "Please save and build the routine first.",
        "RoutineExecuteError" : "Routine Execute Error!",
        "gtmRunStdErr" : "error!",
        "running": "Now Running!",
        "notrunning": "not Running!",
        "entreftext": "Select label^routine in Box!",
        "runningRoutine" : "exist Running Routine!",
        "zombieKillProcess" : "KILL process by MUPIP STOP",
        "zombieDeleteSession" : "Delete session from M-EDO session Table"
    },
    tabContentTooltip: {
        "outRun" : "Run from label-line on Editor (Ctrl+F8)",
        "outEntRef" : "Run from select BOX routine (Ctrl+Shift+F8)",
        "outWarn" : "Running this program",
        "outStop" : "Force Stop by MUPIP (Ctrl+F9)",
        "outSendESC" : "Send ESC (Ctrl+[)",
        "intSubmit" : "Submit input text"
    }
};
/**
 * Select2 en-US translation.
 */
(function ($) {
    "use strict";

    $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; }
    });
})(jQuery);

