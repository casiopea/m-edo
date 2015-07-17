EWD.sockets.log = true;

EWD.application = {
    name: 'm-edo',
    timeout: 3600,
    labels: {
        'ewd-title': 'Mumps Editor & Do',
        'ewd-navbar-title-phone': 'M Editor & Do',
        'ewd-navbar-title-other': 'M Editor & Do'
    },
    loginType : 'medo' ,  // set 'ewdMonitor', if you use ewdMonitor Users's login 'user' and 'password'.
    enableSelect2: function(authorization) {
        $("#selectedRoutine").select2({
            minimumInputLength: 1,
            query: function (query) {
                EWD.application.select2 = {
                    callback: query.callback
                };
                EWD.sockets.sendMessage({
                    type: 'routineQuery',
                    params: {
                        prefix: query.term,
                        authorization: authorization
                    }
                });
            }
        });
    },
    setText: function(routine,text){
        EWD.application.routines[routine].editor.getDoc().setValue(text);
    },
    getText: function(routine){
        return EWD.application.routines[routine].editor.getDoc().getValue();
    },
    newRoutine: function(event){
        event.preventDefault();
        $('#txtNewRoutine').val('');
        $('#newRoutineModal').modal({
            keyboard: false,
            backdrop: 'static'
        });
    },
    Login: function(event){
        event.preventDefault();
        var username = $('#txtUsername').val();
        var password = $('#txtPassword').val();
        EWD.sockets.sendMessage({
            type: 'Login',
            params: {
                username: username,
                password: password,
                loginType: EWD.application.loginType,
                authorization: EWD.application.authorization
            }
        });
    },
    logOut: function(event){
        event.preventDefault();
        EWD.sockets.sendMessage({
         type: 'EWD.logout'
        });
        $('#logoutConfirmPanel').modal('hide');
        location.replace("./index.html");
    },
    sessionDeleted: function(event){
        event.preventDefault();
        $('#deleteConfirmPanel').modal('hide');
        location.replace("./index.html");
    },
    openLogOutModal: function(event){
        event.preventDefault();
        var btnlogOut = true;
        $.each(EWD.application.routines, function(key, value) {
            if (value.Running) btnlogOut = false;
        });
        if (btnlogOut) {
            $('#logoutConfirmPanel').modal({
                keyboard: false,
                backdrop: 'static'
            });
        } else {
            var mess = locale.alert.runningRoutine ? locale.alert.runningRoutine : 'exist Running Routine!';
            toastr.error(mess);
        }
    },
    openRoutine: function(routineName,routinePath){
        var found = false;
        $('.nav-tabs li').each(function(index, element) {
            if(routineName == $(element).find('a').text().replace(' *','')){
                found = true;
                $(element).find('a').click();
            }
        });
        if(!found) {
            EWD.sockets.sendMessage({
                type: 'getRoutine',
                params: {
                    routinePath: routinePath,
                    authorization: EWD.application.authorization
                }
            });
        }
    },
    saveRoutine: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        if(!routineName){return;}
        var routineText = EWD.application.getText(routineName);
        var routinePath = EWD.application.routines[routineName].path;
        var newRoutine = EWD.application.routines[routineName].new;
        EWD.sockets.sendMessage({
            type: 'saveRoutine',
            params: {
                routinePath: routinePath,
                routineText: routineText,
                newRoutine: newRoutine,
                authorization: EWD.application.authorization
            }
        });
    },
    buildRoutine: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text();
        if(!routineName){return;}
        if(routineName.indexOf('*')>=0){
            var mess = locale.alert.buildRoutine ? locale.alert.buildRoutine : 'Please save the routine first.';
            toastr.error(mess);
            // alert(locale.alert.buildRoutine);
            // alert('Please save the routine first.');
            return;
        }
        var routinePath = EWD.application.routines[routineName].path;
        EWD.sockets.sendMessage({
            type: 'buildRoutine',
            params: {
                routinePath: routinePath,
                authorization: EWD.application.authorization
            }
        });
    },
    checkRoutineName: function(routineName){
        EWD.sockets.sendMessage({
            type: 'checkRoutineName',
            params: {
                routineName: routineName,
                authorization: EWD.application.authorization
            }
        });
    },
    setResult: function(resultArray){
        var result = '';
        for(var i=0; i < resultArray.length; i++){
            result = result + resultArray[i] + '<br/>';
        }
        $('#content_results').html(result);
    },
    textChanged: function(instance,changeObj){
        instance.off("change",EWD.application.textChanged);
        if($('.nav-tabs .active a').text().indexOf('*')<0){
            $('.nav-tabs .active a').text($('.nav-tabs .active a').text() + ' *');
        }
    },
    setEditMode: function(mode){
        if(mode){
            $('#btnSave').show();
            $('#btnBuild').show();
            $('#btnExecute').show();
            $('#btnFullScreen').show();
            $('#mnuEdit').show();
            $('#mnuBuild').show();
            $('#mnuRun').show();
            $('#mnuSave').parents().removeClass('disabled');
        }else{
            $('#btnSave').hide();
            $('#btnBuild').hide();
            $('#btnExecute').hide();
            $('#btnFullScreen').hide();
            $('#mnuEdit').hide();
            $('#mnuBuild').hide();
            $('#mnuRun').hide();
            $('#mnuSave').parent().addClass('disabled');
            EWD.application.setResult([]);
        }
    },
    setEditorFullScreen : function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        if(!routineName){return;}
        EWD.application.routines[routineName].editor.setOption("fullScreen", !EWD.application.routines[routineName].editor.getOption("fullScreen"));
    },
    toggleBookmark: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        if(!routineName){return;}
        var editor = EWD.application.routines[routineName].editor;
        var lineNumber = editor.getCursor().line;
        var found = false;
        editor.getDoc().findMarksAt({line: lineNumber, ch:0}).forEach(function(bookmark){
            bookmark.clear();
            found = true;
        });
        if(!found){
            var elem = document.createElement("span");
            elem.className = 'glyphicon glyphicon-bookmark';
            elem.setAttribute("aria-hidden", "true");
            var bm = editor.getDoc().setBookmark({line: lineNumber, ch:0},{widget: elem});
        }
    },
    clearBookmarks: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        if(!routineName){return;}
        var editor = EWD.application.routines[routineName].editor;
        editor.getDoc().getAllMarks().forEach(function(bookmark){
            bookmark.clear();
        });
    },
    nextBookmark: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        if(!routineName){return;}
        var editor = EWD.application.routines[routineName].editor;
        var cLine = editor.getDoc().getCursor().line;
        if(editor.getDoc().getAllMarks().length > 0){
            var found = false;
            for(var i=cLine +1; i<editor.getDoc().lineCount(); i++){
                if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
                    editor.getDoc().setCursor({line: i, ch:0});
                    found = true;
                    return;
                }
            }
            if(!found){
                for(var i=0; i<editor.getDoc().lineCount(); i++){
                    if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
                        editor.getDoc().setCursor({line: i, ch:0});
                        return;
                    }
                }
            }
        }
    },
    previousBookmark: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        if(!routineName){return;}
        var editor = EWD.application.routines[routineName].editor;
        var cLine = editor.getDoc().getCursor().line;
        if(editor.getDoc().getAllMarks().length > 0){
            var found = false;
            if(cLine === 0){
                cLine = editor.getDoc().lineCount() - 1;
            }
            for(var i=cLine - 1; i>=0; i--){
                if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
                    editor.getDoc().setCursor({line: i, ch:0});
                    found = true;
                    return;
                }
            }
            if(!found){
                for(var i=editor.getDoc().lineCount() - 1; i>=0; i--){
                    if(editor.getDoc().findMarksAt({line: i, ch:0}).length > 0){
                        editor.getDoc().setCursor({line: i, ch:0});
                        return;
                    }
                }
            }
        }
    },
    setGTMrunMode: function(mode, routineName){
        if(mode){
            $('#outRun' + routineName).hide();
            $('#outStatus' + routineName).text('Running');
            $('#outWarn' + routineName).show();
            $('#outLabel' + routineName).addClass('disabled');
            $('#outEntRef' + routineName).addClass('disabled');
            $('#intInput' + routineName).prop('disabled',false);
            $('#intSubmit' + routineName).removeClass('disabled');
            $('#outSendESC' + routineName).removeClass('disabled');
            $('#outStop' + routineName).removeClass('disabled');
            $('#btnLogout').hide();
        }else{
            $('#outRun' + routineName).show();
            $('#outStatus' + routineName).text('Do');
            $('#outWarn' + routineName).hide();
            $('#outLabel' + routineName).removeClass('disabled');
            $('#outEntRef' + routineName).removeClass('disabled');
            $('#intInput' + routineName).prop('disabled',true);
            $('#intSubmit' + routineName).addClass('disabled');
            $('#outSendESC' + routineName).addClass('disabled');
            $('#outStop' + routineName).addClass('disabled');

            var btnlogOut = true;
            $.each(EWD.application.routines, function(key, value) {
                if (value.Running) btnlogOut = false;
            });
            if (btnlogOut) {
                $('#btnLogout').show();
            } else {
                $('#btnLogout').hide();
            }
        }
    },
    entrefRun: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        var entrefobj = $('#outLabel' + routineName).select2('data');
        if (typeof entrefobj == 'undefined' || entrefobj == '' || entrefobj == null) {
            var mess = locale.alert.entreftext ? locale.alert.entreftext : 'Select label^routine in Box!';
            toastr.error(mess);
            return ;
        }
        var label = entrefobj.text.split("^")[0];
        EWD.application.setGTMrunMode(true, routineName);
        EWD.application.routines[routineName].Running = true;
        EWD.application.setEditMode(false);
        EWD.sockets.sendMessage({
            type: 'gtmSpawn',
            params: {
                routineName : routineName,
                label : label
            }
        });
    },
    gtmRun: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text();
        if(!routineName){return;}
        if(routineName.indexOf('*')>=0){
            var mess = locale.alert.gtmRunSaveBuild ? locale.alert.gtmRunSaveBuild : 'Please save and build the routine first.';
            toastr.error(mess);
            // toastr.error('Please save and build the routine first.');
            // alert('Please save the routine first.');
            return;
        }
        if (EWD.application.routines[routineName].Running){
            var mess = locale.alert.running ? locale.alert.running : 'Now Running!';
            toastr.warning(mess);
            return;
        }
        var editor = EWD.application.routines[routineName].editor;
        var entryref = editor.getLine(editor.getCursor().line).split(/\s|\t/)[0];
        if (typeof entryref == 'undefined' || entryref == '' || entryref == null) {
            var mess = locale.alert.labelonlyline ? locale.alert.labelonlyline : 'Place cursor on only label line !';
            toastr.warning(mess);
            // toastr.warning("Place cursor on only label line !");
            return;
        }
        var label = entryref.split('(')[0].trim();
        var params = entryref.split('(')[1];
        if (typeof params != 'undefined') {
            var mess = locale.alert.parametorsexists ? locale.alert.parametorsexists : 'Parametors exists in Label!';
            toastr.warning(mess);
            // toastr.warning("Parametors exists in Label!");
            return ;
        }
        var erstr = label + '^' + routineName.replace('_','%');
        var addFlag = true;
        var options = $('#outLabel' + routineName).children();
        for(var i=0; i < options.length; i++){
            if (options.eq(i).text() == erstr ) addFlag = false ;
        }
        if (addFlag) $('#outLabel' + routineName).append('<option value="' + erstr + '">' + erstr + '</option>');
        EWD.application.setGTMrunMode(true, routineName);
        EWD.application.routines[routineName].Running = true;
        EWD.application.setEditMode(false);

        EWD.sockets.sendMessage({
            type: 'gtmSpawn',
            params: {
                routineName : routineName,
                label : label
            }
        });
    },
    submitESC: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        EWD.sockets.sendMessage({
            type: 'submitESC',
            params: {
                routineName : routineName
            }
        });
    },
    interactiveModeSubmit : function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text();
        if(!routineName){return;}
        if(routineName.indexOf('*')>=0){
            var mess = locale.alert.gtmRunSaveBuild ? locale.alert.gtmRunSaveBuild : 'Please save and build the routine first.';
            toastr.error(mess);
            return;
        }
        if (!EWD.application.routines[routineName].Running){
            var mess = locale.alert.notrunning ? locale.alert.notrunning : 'not Running!';
            toastr.warning(mess);
            return;
        }
        var pid = EWD.application.routines[routineName].runId;
        var strings = $('#intInput' + routineName).val();
        EWD.sockets.sendMessage({
            type: 'interactiveModeSubmit',
            params: {
                routineName : routineName,
                pid: pid,
                input: strings,
                enterCode: "\n"
            }
        });
        $('#intInput' + routineName).val('');
        document.getElementById('intInput' + routineName).focus();
        EWD.application.stdOutAppendTail(routineName, strings + "\n");
    },
    stdOutAppendTail : function(routineName, stdOut){
        var outBodyid = '#outBody' + routineName;
        $(outBodyid).append(stdOut);
        var preLength = $(outBodyid).text().split('\n').length;
        if (preLength > (EWD.application.maxConsoleLength || 2000)) {
          var text = $(outBodyid).text();
          var arr = text.split('\n');
          var diff = preLength - EWD.application.maxConsoleLength;
          var arr2 = arr.splice(diff);
          text = arr2.join('\n');
          $(outBodyid).text(text);
        }
        $(outBodyid).animate({ scrollTop: $(outBodyid)[0].scrollHeight}, 5);
    },
    gtmMUPIPstop: function(event){
        event.preventDefault();
        var routineName = $('.nav-tabs .active a').text().replace(' *','');
        // console.log('gtmMUPIPstop = ',routineName);
        if (EWD.application.routines[routineName].Running){
            EWD.sockets.sendMessage({
                type: 'gtmMUPIPstop',
                params: {
                    routineName : routineName,
                    pid : EWD.application.routines[routineName].runId
                }
            });
        } else {
            var mess = locale.alert.notrunning ? locale.alert.notrunning : 'not Running!';
            toastr.error(mess);
            return;
        }
    },
    medoDelete: function(routineName){
        EWD.sockets.sendMessage({
            type: 'medoDelete',
            params: {
                routineName : routineName
            }
        });
    },
    createRoutineTab: function(routineName,routinePath,routineText,newRoutine){
        // lists of Tab
        var rid = 'tab' + routineName;
        var li = '';
        if(routineText){
            li = '<li role="presentation"><a href="#' + rid + '">' + routineName + '</a> <span> x </span></li>';
        }else{
            li = '<li role="presentation"><a href="#' + rid + '">' + routineName + ' *</a> <span> x </span></li>';
        }
        $(".nav-tabs").append(li);
        var mc = $("#main_Container");
        var mchight = mc.height();
        var prehight = mchight - 200 ;
        // Editor Text Area
        var tid = 'txt' + routineName;
        var tarea = '<textarea id="' + tid + '" name="' + tid + '"></textarea>';
        // Executor output Area
        var outHeaderid = 'outHeader' + routineName;
        var outStatusid = 'outStatus' + routineName;
        var outLabelid = 'outLabel' + routineName;
        var outEntRefid = 'outEntRef' + routineName;
        var outRunid = 'outRun' + routineName;
        var outWarnid = 'outWarn' + routineName;
        // Executor output Header
        var outHeaderarea = 
                '<div class="form-inline form-group" id="' + outHeaderid + '">' +
                    '<div class="controls input-group">' +
                      '<button type="button" class="btn btn-default btn-run" style="display: none" data-toggle="tooltip"' +
                           ' data-name="' + routineName + '" id="' + outRunid +  '"' +
                           ' data-placement="bottom" title="Run from label-line on Editor (Ctrl+F8)">' + 
                        '<span class="glyphicon glyphicon-play" aria-hidden="true"></span>' +
                      '</button>' +
                    '</div>' +
                    '<div class="controls input-group">' +
                      '<button type="button" class="btn btn-default btn-warn" style="display: none" data-toggle="tooltip"' +
                           ' data-name="' + routineName + '" id="' + outWarnid +  '"' +
                           ' data-placement="bottom" title="Running this program">' + 
                        '<span class="glyphicon glyphicon-warning-sign alert-danger" aria-hidden="true"></span>' +
                      '</button>' +
                    '</div>' +
                    '<div class="controls input-group">' +
                      '<span class="input-group-addon" id="' + outStatusid + '">Do</span>' +
                      '<select id="' + outLabelid + '" name="entryRef" style="width:250px" class="form-control js-example-basic-single">' +
                      '</select>' +
                      '<span class="input-group-btn">' +
                          '<button class="btn btn-default btn-entref" type="button" data-toggle="tooltip"' +
                          ' id="' + outEntRefid +  '" title="Run from select BOX routine (Ctrl + Shift + F8)">Run</button>' +
                      '</span>' +
                    '</div>' +
                '</div>' ;
        // Executor output Body
        var outBodyid = 'outBody' + routineName;
        var outBodyarea = '<pre class="pre-out" id="' + outBodyid + '" name="' + outBodyid + '" style="height: ' + prehight + 'px;"></pre>' ;
        // Executor output Footer
        var intModeid = 'intMode' + routineName;
        var outFooterid = 'outFooter' + routineName ;
        var intInputid = 'intInput' + routineName;
        var intSubmitid = 'intSubmit' + routineName;
        var outSendLFid = 'outSendLF' + routineName;
        var outSendESCid = 'outSendESC' + routineName;
        var outStopid = 'outStop' + routineName;
        var outFooterarea = 
                '<div class="form-inline form-group" style="display: inline" id="' + outFooterid + '">' +
                    '<div class="controls input-group">' +
                      '<span class="input-group-addon">Read</span>' +
                      '<input id="' + intInputid + '" name="inputText" type="text" value="" class="form-control">' +
                      '<span class="input-group-btn">' +
                          '<button class="btn btn-default btn-submit" type="button" id="' + intSubmitid +
                          '" data-toggle="tooltip" data-placement="bottom" title="Submit input text">Enter</button>' +
                      '</span>' +
                    '</div>' +
                    '<div class="controls input-group">' +
                      '<button type="button" class="btn btn-default btn-esc" style="display: inline" data-toggle="tooltip"' +
                           ' data-name="' + routineName + '" id="' + outSendESCid +  '"' +
                           ' data-placement="bottom" title="Send ESC (Ctrl+[)">' + 
                        '<span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>' +
                      '</button>' +
                    '</div>' +
                    '<div class="controls input-group">' +
                      '<button type="button" class="btn btn-default btn-stop" style="display: inline" data-toggle="tooltip"' +
                           ' data-name="' + routineName + '" id="' + outStopid +  '"' +
                           ' data-placement="bottom" title="Force Stop by MUPIP (Ctrl+F9)">' + 
                        '<span class="glyphicon glyphicon-stop" aria-hidden="true"></span>' +
                      '</button>' +
                    '</div>' +
                '</div>' ;
        var outPanelClass = 'outPanel';
        var content =   '<div class="row">' + 
                            '<div class="col-md-7">' + tarea +  '</div>' +
                            '<div class="col-md-5 ' + outPanelClass + '">' + outHeaderarea + outBodyarea + outFooterarea + '</div>' +
                        '</div>' ;
        $('.tab-content').append('<div class="tab-pane" id="' + rid + '">' + content + '</div>');
        // console.log('mc =',mc.height());
        var editor = CodeMirror.fromTextArea(document.getElementById(tid), {
            mode: "mumps",
            styleActiveLine: true,
            lineNumbers: true,
            lineWrapping: false,
            extraKeys: {
                "Esc": function(cm) {
                    if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                }
            }
        });
        editor.setSize(null, mchight);
        EWD.application.routines[routineName] = {
            path: routinePath,
            new: newRoutine,
            editor: editor,
            runId: '',
            Running: false
        };
        EWD.application.setText(routineName,routineText);
        editor.on("change",EWD.application.textChanged);
        $('.nav-tabs li:last-child a').click();
        $("#js_image_selection").trigger('append');

        EWD.application.stdOutAppendTail(routineName, "\n".repeat(100) + "GTM>\n");
        EWD.application.setEditMode(true);
        if ( typeof(locale.tabContentTooltip) != 'undefined' ){
            $('#' + outRunid).attr('title',locale.tabContentTooltip.outRun);
            $('#' + outWarnid).attr('title',locale.tabContentTooltip.outWarn);
            $('#' + outStopid).attr('title',locale.tabContentTooltip.outStop);
            $('#' + outSendESCid).attr('title',locale.tabContentTooltip.outSendESC);
            $('#' + outEntRefid).attr('title',locale.tabContentTooltip.outEntRef);
            $('#' + intSubmitid).attr('title',locale.tabContentTooltip.intSubmit);
        }
        $('#' + outLabelid).select2();
        EWD.application.setGTMrunMode(false, routineName);
    },
    zombieAction: function(mode, id){
        var v = id.split('-');
        var pid = v[1];
        var sessionid = v[2];
        var routineName = v[3];
        EWD.sockets.sendMessage({
          type : 'zombieAction',
          params: {
            action: mode,
            pid: pid,
            sessionid: sessionid,
            routineName: routineName
          },
          done: function(messageObj) {
            EWD.application.openZombieStatusModal();
          }
        });
    },
    openZombieStatusModal: function(){
        EWD.sockets.sendMessage({
          type : 'getAllProcess',
          params: {},
          done: function(messageObj) {
            if(messageObj.message.error == false) {
                var obj = messageObj.message.result;
                var html = '';
                var icon = '';
                var line,sessionid,routineName;
                var zombieKillMode = '',statusTip='',remove='',color='';
                for (pid in obj) {
                  line = obj[pid];
                  status = line.status;
                  routineName = line.routineName
                  sessionid = line.sessionid;
                  if (status == 'maybeZombie') {
                     zombieKillMode = 'pidKill';
                     remove = 'remove';
                     color = 'danger';
                     statusTip = locale.alert.zombieKillProcess ? locale.alert.zombieKillProcess : 'KILL process by MUPIP STOP';
                  }
                  if (status == 'pastFinish'){
                     zombieKillMode = 'sessionDelete';
                     remove = 'trash';
                     color = 'primary';
                     statusTip = locale.alert.zombieDeleteSession ? locale.alert.zombieDeleteSession : 'Delete session from M-EDO session Table';
                 }
                 icon = 
                      '<button class="btn btn-xs btn-' + color + ' pull-right ' + zombieKillMode +'"' +
                        ' type="button" id="zombiePidKillBtn-' + pid + '-' + sessionid + '-' + routineName +
                        '" data-toggle="tooltip" data-placement="top" title="' + statusTip + '" ' + 
                        'data-original-title="' + statusTip + '">' +
                        '<span class="glyphicon glyphicon-' + remove + '"></span>' +
                        '</button>';
                  if (status == 'osRun' || status == 'nowRunning') icon = "&nbsp;";
                  html = html + '<tr class="table" id="zombieValidModal-row-' + pid + '">';
                  html = html + '<td>' + line.sessionid + '</td>';
                  html = html + '<td>' + pid + '</td>';
                  html = html + '<td>' + line.osUser + '</td>';
                  html = html + '<td>' + line.medoUser + '</td>';
                  html = html + '<td>' + line.command + '</td>';
                  html = html + '<td>' + status + '</td>';
                  html = html + '<td>' + icon + '</td>';
                  html = html + '</tr>';
                }
                $('#zombieValidModal-table tbody').html(html);
            } else {
                $('#zombieValidModal-table tbody').html('');
            }
          }
        });
    },
    showAbout: function(event){
        event.preventDefault();
        $('#txtNewRoutine').val('');
        var mbody = '<script type="IN/MemberProfile" data-id="https://www.linkedin.com/in/faisalsami" data-format="inline" data-related="false"></script>';
        $('#aboutModalSocial').html(mbody);
        $('#aboutModal').modal({
            keyboard: true,
            backdrop: 'static'
        });
    },
    showAboutExe: function(event){
        event.preventDefault();
        $('#txtNewRoutine').val('');
        $('#aboutModalExe').modal({
            keyboard: true,
            backdrop: 'static'
        });
    },
    keepAlive: function() {
        if (EWD.application.life){
          setTimeout(function() {
            if (EWD.application.life){
                EWD.sockets.sendMessage({
                  type: 'keepAlive'
                });
            }
          },3400000);
        }
    },
    onStartup: function() {
        EWD.application.maxConsoleLength = 2000;
        $("#js_image_selection").horizontalTabs();
        toastr.options.target = 'body';
        if (typeof(locale) != "undefined") {
            $.each(locale.text, function(id, mess) { $('#' + id).text(mess); });
            $.each(locale.placeholder, function(id, mess) { $('#' + id).attr('placeholder',mess); });
            $.each(locale.tooltip, function(id, mess) { $('#' + id).attr('title',mess); });
        }
        $('#loginModal').modal({
            keyboard: false,
            backdrop: 'static'
        });
        EWD.application.routines = {};
        EWD.application.saveonclosing = false;
        EWD.application.life = false;
        $('#btnKeepAliveNowOff').show();
        this.enableSelect2(EWD.application.authorization);
        $(document).on('keydown', function(event){
            // detect key pressed
            var key = event.keyCode;
            if (event.ctrlKey) {
                if (key === 82) {
                    event.preventDefault();
                    $('#btnNew').click();
                }
                if (key === 83) {
                    event.preventDefault();
                    $('#btnSave').click();
                }
                if (key === 122){
                    event.preventDefault();
                    $('#btnFullScreen').click();
                }
                if (key === 118) {
                    event.preventDefault();
                    $('#btnBuild').click();
                }
                if (key === 119) {     // ctrl + F8
                    event.preventDefault();
                    var routineName = $('.nav-tabs .active a').text().replace(' *','');
                    if (typeof routineName != 'undefined' && routineName != '' && routineName != null) {
                        $('#outRun' + routineName).click();
                    }
                }
                if (key === 120) {     // ctrl + F9
                    event.preventDefault();
                    var routineName = $('.nav-tabs .active a').text().replace(' *','');
                    if (typeof routineName != 'undefined' && routineName != '' && routineName != null) {
                        $('#outStop' + routineName).click();
                    }
                }
                if (key === 219) {     // ctrl + [
                    event.preventDefault();
                    var routineName = $('.nav-tabs .active a').text().replace(' *','');
                    if (typeof routineName != 'undefined' && routineName != '' && routineName != null) {
                        $('#outSendESC' + routineName).click();
                    }
                }
                if (key === 113) {
                    event.preventDefault();
                    $('#mnuToggleBookmark').click();
                }
                if (event.shiftKey){
                    if (key === 113){
                        event.preventDefault();
                        $('#mnuClearBookmark').click();
                    }
                    if (key === 119) {     // ctrl + shift + F8
                        event.preventDefault();
                        var routineName = $('.nav-tabs .active a').text().replace(' *','');
                        if (typeof routineName != 'undefined' && routineName != '' && routineName != null) {
                            $('#outEntRef' + routineName).click();
                        }
                    }
                }
            }else{
                if(event.shiftKey){
                    if (key === 113){
                        event.preventDefault();
                        $('#mnuPreviousBookmark').click();
                    }
                }else{
                    if (key === 113){
                        event.preventDefault();
                        $('#mnuNextBookmark').click();
                    }
                }
            }
        });
        $('#loginPanelBody').keydown(function(event){
            if (event.keyCode === 13) {
                document.getElementById('btnLogin').click();
            }
        });
        $('body')
            .on( 'click', '#openBtn', function(event) {
                event.preventDefault();
                if($('#selectedRoutine').select2('val')>0){
                    var routineName = $('#selectedRoutine').select2('data').text;
                    var routinePath = $('#selectedRoutine').select2('data').path;
                    EWD.application.openRoutine(routineName,routinePath);
                    $("#selectedRoutine").select2("val", "");
                }
            })
            .on('click','#btnSave', EWD.application.saveRoutine)
            .on('click','#mnuSave',EWD.application.saveRoutine)
            .on('click','#btnNew', EWD.application.newRoutine)
            .on('click','#mnuNew', EWD.application.newRoutine)
            .on('click','#btnBuild', EWD.application.buildRoutine)
            .on('click','#mnuCompile', EWD.application.buildRoutine)
            .on('click','#btnFullScreen',EWD.application.setEditorFullScreen)
            .on('click','#mnuFullScreen',EWD.application.setEditorFullScreen)
            .on('click','#mnuToggleBookmark',EWD.application.toggleBookmark)
            .on('click','#mnuClearBookmark',EWD.application.clearBookmarks)
            .on('click','#mnuNextBookmark',EWD.application.nextBookmark)
            .on('click','#mnuPreviousBookmark',EWD.application.previousBookmark)
            .on('click','#btnLogin',EWD.application.Login)
            .on('click','#btnLogout',EWD.application.openLogOutModal)
            .on('click','#logoutConfirmPanelOKBtn',EWD.application.logOut)
            .on('click','#deleteConfirmPanelOKBtn',EWD.application.sessionDeleted)
            .on('click','#mnuAbout',EWD.application.showAbout)
            .on('click','#mnuAboutExe',EWD.application.showAboutExe)
            .on('click','#zombieValidModalRefresh',EWD.application.openZombieStatusModal)
            .on('click','#btnZombieStatus', function(event){
                event.preventDefault();
                EWD.application.openZombieStatusModal();
                $('#zombieValidModal').modal({
                    keyboard: false,
                    backdrop: 'static'
                });
            })
            .on('click','.pidKill, .sessionDelete', function(event) {
                var action = '';
                var id = event.target.parentNode.id;
                var className = event.target.parentNode.className;
                if ( className.match(/pidKill/)) action = 'pidKill';
                if ( className.match(/sessionDelete/)) action = 'sessionDelete';
                if (action) EWD.application.zombieAction('pidKill',id);
            })
            .on('click','#btnKeepAliveNowOff', function(event){
                EWD.application.life = true;
                $('#btnKeepAliveNowOff').hide();
                $('#btnKeepAliveNowOn').show();
                EWD.sockets.sendMessage({ type: 'keepAlive' });
            })
            .on('click','#btnKeepAliveNowOn', function(event){
                EWD.application.life = false;
                $('#btnKeepAliveNowOff').show();
                $('#btnKeepAliveNowOn').hide();
            })
            .on('click','#btnNROK', function(event){
                var routineName = $('#txtNewRoutine').val();
                EWD.application.checkRoutineName(routineName);
            })
            .on('click','#btnSDOK', function(event){
                var dir = $('#selectDirectoryBody .active');
                if(dir.length > 0){
                    $('#selectDirectoryModal').modal('hide');
                    var routineName = $('#selDirRoutine').html();
                    var routinePath = dir.html();
                    routinePath = routinePath + routineName + '.m';
                    EWD.application.createRoutineTab(routineName,routinePath,'',true);
                }else{
                    var mess = locale.alert.selectdirectory ? locale.alert.selectdirectory : 'select directory from the list.';
                    toastr.error(mess);
                    // alert(locale.alert.selectdirectory);
                    // alert('select directory from the list.');
                }
            })
            .on('click','#btnSCYes', function(event){
                $('#saveChnagesModal').modal('hide');
                var routineName = EWD.application.eltobeClosed.siblings('a').text().replace(' *','');
                var routineText = EWD.application.getText(routineName);
                var routinePath = EWD.application.routines[routineName].path;
                EWD.application.saveonclosing = true;
                EWD.application.saveRoutine(routinePath,routineText);
                var anchor = EWD.application.eltobeClosed.siblings('a');
                $(anchor.attr('href')).remove();
                EWD.application.eltobeClosed.parent().remove();
                if($('.nav-tabs li').length > 0){
                    $(".nav-tabs li").children('a').first().click();
                }else{
                    EWD.application.setEditMode(false);
                }
                EWD.application.eltobeClosed = null;
            })
            .on('click','#btnSCNo', function(event){
                $('#saveChnagesModal').modal('hide');
                var anchor = EWD.application.eltobeClosed.siblings('a');
                $(anchor.attr('href')).remove();
                EWD.application.eltobeClosed.parent().remove();
                if($('.nav-tabs li').length > 0){
                    $(".nav-tabs li").children('a').first().click();
                }else{
                    EWD.application.setEditMode(false);
                }
                EWD.application.eltobeClosed = null;
            });
        $(".tab-content")
            .on("click", ".btn-run", EWD.application.gtmRun)
            .on("click", ".btn-entref", EWD.application.entrefRun)
            .on("click", ".btn-submit", EWD.application.interactiveModeSubmit)
            .on("click", ".btn-esc", EWD.application.submitESC)
            .on("click", ".btn-stop", EWD.application.gtmMUPIPstop)
            ;
        $(".nav-tabs").on("click", "a", function (e) {
            e.preventDefault();
            $(this).tab('show');
            var routineName = $(this).text().replace(' *','');
            EWD.application.routines[routineName].editor.refresh();
            if (EWD.application.routines[routineName].Running){
                EWD.application.setEditMode(false);
            } else {
                EWD.application.setEditMode(true);
            }
        })
            .on("click", "span", function () {
                var routineName = $(this).siblings('a').text();
                if(routineName.indexOf('*')>=0){
                    EWD.application.eltobeClosed = $(this);
                    var mess = locale.alert.saveChangesBody ? locale.alert.saveChangesBody : 'Save changes to <b>';
                    $('#saveChangesBody').html(mess + routineName.replace(' *','') + '</b>.');
                    // $('#saveChangesBody').html('Save changes to <b>' + routineName.replace(' *','') + '</b>.');
                    $('#saveChnagesModal').modal({
                        keyboard: false,
                        backdrop: 'static'
                    });
                    $("#js_image_selection").trigger('adjustScroll');
                }else{
                    if (EWD.application.routines[routineName].Running){
                        var mess = locale.alert.running ? locale.alert.running : 'Now Running!';
                        toastr.warning(mess);
                        return;
                    }
                    var anchor = $(this).siblings('a');
                    $(anchor.attr('href')).remove();
                    $(this).parent().remove();
                    if($('.nav-tabs li').length > 0){
                        $(".nav-tabs li").children('a').first().click();
                        $("#js_image_selection").trigger('adjustScroll');
                    }else{
                        EWD.application.setEditMode(false);
                    }
                }
            });
        $()


    },

    onPageSwap: {
    },
    onFragment: {
    },

    onMessage: {
        getRoutine: function(messageObj) {
            if(messageObj.message.error){
                toastr.error(messageObj.message.error);
                // alert(messageObj.message.error);
            }else{
                if(messageObj.message.routine){
                    var routineName = messageObj.message.name;
                    var routineText = messageObj.message.routine;
                    var routinePath = messageObj.message.path;
                    EWD.application.createRoutineTab(routineName,routinePath,routineText,false);
                }else{
                    var mess = locale.alert.getRoutine ? locale.alert.getRoutine : 'Some error occurred while fething routine.';
                    toastr.error(mess);
                    // alert(locale.alert.getRoutine);
                    // alert('Some error occurred while fething routine.');
                }
            }
            return;
        },
        routineMatches : function(messageObj){
            if (messageObj.params) {
                EWD.application.select2.results = messageObj.params;
            }
            else {
                EWD.application.select2.results = messageObj.message;
            }
            EWD.application.select2.callback(EWD.application.select2);
            return;
        },
        saveRoutine: function(messageObj){
            if(messageObj.message.error){
                toastr.error(messageObj.message.error);
                // alert(messageObj.message.error);
            }else{
                if(messageObj.message.saved){
                    if(EWD.application.saveonclosing){
                        EWD.application.saveonclosing = false;
                        return;
                    }
                    var routineName = $('.nav-tabs .active a').text().replace(' *','');
                    $('.nav-tabs .active a').text(routineName);
                    EWD.application.routines[routineName].editor.on("change",EWD.application.textChanged);
                }else{
                    var mess = locale.alert.saveRoutine ? locale.alert.saveRoutine : 'Some error occurred in saving routine.';
                    toastr.error(locale.alert.saveRoutine);
                    // alert(locale.alert.saveRoutine);
                    // alert('Some error occurred in saving routine.');
                }
            }
            return;
        },
        buildRoutine : function(messageObj){
            if(messageObj.message.error){
                toastr.error(messageObj.message.error);
                // alert(messageObj.message.error);
            }else{
                if(messageObj.message.build){
                    if(messageObj.message.output){
                        var mess = locale.alert.buildRoutineError ? locale.alert.buildRoutineError : 'Detected errors during compilation\n';
                        EWD.application.setResult((mess + messageObj.message.output).split('\n'));
                        // EWD.application.setResult(('Detected errors during compilation\n' + messageObj.message.output).split('\n'));
                    }else{
                        var routineName = $('.nav-tabs .active a').text().replace(' *','');
                        var mess = locale.alert.buildRoutineSuccess ? locale.alert.buildRoutineSuccess : ' compiled successfully.';
                        EWD.application.setResult((routineName + mess).split('\n'));
                        // EWD.application.setResult((routineName + ' compiled successfully.').split('\n'));
                    }
                }else{
                    var mess = locale.alert.saveRoutine ? locale.alert.saveRoutine : 'Some error occurred in saving routine.';
                    toastr.error(mess);
                    // alert(locale.alert.saveRoutine);
                    // alert('Some error occurred in saving routine.');
                }
            }
            return;
        },
        gtmSpawnStdOut : function(messageObj){
            var routineName = messageObj.message.routineName;
            var stdout = messageObj.message.stdout;
            if(messageObj.message.exec){
                EWD.application.stdOutAppendTail(routineName, stdout);
            }else{
                var mess = locale.alert.RoutineExecuteError ? locale.alert.RoutineExecuteError : 'Routine Execute Error';
                toastr.error(mess);
                // toastr.error(locale.alert.saveRoutine);
            }
            return;
        },
        gtmSpawnExit : function(messageObj) {
            var routineName = messageObj.message.routineName;
            EWD.application.medoDelete(routineName);
            EWD.application.routines[routineName].Running = false;
            EWD.application.routines[routineName].runId = '';
            var exitCode = messageObj.message.code;

            if (exitCode != 0){
                if (exitCode == 241) {
                    EWD.application.stdOutAppendTail(routineName, "%MUPIP-STOP, mupip stop encountered\n");
                }
            }

            EWD.application.setGTMrunMode(false, routineName);
            EWD.application.setEditMode(true);
            return;
        },
        gtmSpawnError : function(messageObj) {
            var routineName = messageObj.message.routineName;
            EWD.application.medoDelete(routineName);
            EWD.application.routines[routineName].Running = false;
            var str = JSON.stringify(messageObj.message.error)
            str = str.replace('{','').replace('}','').replace('"','').split(',');
            EWD.application.setResult(str);
            EWD.application.setGTMrunMode(false, routineName);
            EWD.application.setEditMode(true);
            return;
        },
        gtmSpawnStdErr : function(messageObj){
            var routineName = messageObj.message.routineName;
            EWD.application.medoDelete(routineName);
            EWD.application.setGTMrunMode(false, routineName);
            EWD.application.routines[routineName].Running = false;
            EWD.application.setEditMode(true);
            if(!messageObj.message.exec){
                EWD.application.setResult(messageObj.message.stderr.split('\n'));
            }else{
                var mess = locale.alert.gtmRunStdErr ? locale.alert.gtmRunStdErr : 'error!';
                toastr.error(mess);
                // toastr.error('locale.alert.gtmRunStdErr');
            }
            return;
        },
        gtmSpawnPid : function(messageObj){
            var routineName = messageObj.message.routineName;
            if(messageObj.message.pid){
                EWD.application.routines[routineName].runId = messageObj.message.pid ;
            }
            return;
        },
        checkRoutineName: function(messageObj){
            if(messageObj.message.error){
                toastr.error(messageObj.message.error);
                // alert(messageObj.message.error);
            }else{
                if(messageObj.message.check){
                    $('#newRoutineModal').modal('hide');
                    if(messageObj.message.dirs.length > 1){
                        var dirHtml = '';
                        for(var i=0; i < messageObj.message.dirs.length; i++){
                            dirHtml = dirHtml + '<a href="#" class="list-group-item">' + messageObj.message.dirs[i] + '</a>'
                        }
                        $('#selDirRoutine').html(messageObj.message.routine);
                        $('#selectDirectoryBody').html(dirHtml);
                        $('#selectDirectoryBody a').click(function(e) {
                            e.preventDefault();
                            $(this).parent().find('a').removeClass('active');
                            $(this).addClass('active');
                        });
                        $('#selectDirectoryModal').modal({
                            keyboard: false,
                            backdrop: 'static'
                        });
                    }else{
                        var routineName = messageObj.message.routine;
                        var routinePath = messageObj.message.dirs[0];
                        if(routinePath){
                            routinePath = routinePath + routineName + '.m';
                            EWD.application.createRoutineTab(routineName,routinePath,'',true);
                        }
                    }
                }else{
                    var mess = locale.alert.checkRoutineName ? locale.alert.checkRoutineName : 'error!';
                    toastr.error(locale.alert.checkRoutineName);
                    // alert(locale.alert.checkRoutineName);
                    // alert('error!');
                }
            }
            return;
        },
        Login: function(messageObj){
            if(messageObj.message.error){
                toastr.error(messageObj.message.error);
                // alert(messageObj.message.error);
            }else{
                if(messageObj.message.authenticated){
                    $('#loginModal').modal('hide');
                    EWD.application.username = messageObj.message.username;
                    var mess = locale.tooltip.btnLogout ? locale.tooltip.btnLogout : ' user Logout (Ctrl+Q)';
                    $('#btnLogout').attr('title',EWD.application.username + mess);
                    $('#btnLogout').show();
                }else{
                    var mess = locale.alert.Login ? locale.alert.Login : 'error!';
                    toastr.error(locale.alert.Login);
                    // alert(locale.alert.Login);
                    // alert('error!');
                }
            }
        },
        keepAlive: function(messageObj) {
          EWD.application.keepAlive();
          return;
        },
        'EWD.session.deleted': function(messageObj){
            $('.bs-example-modal-sm').modal('hide');
            $('#deleteConfirmPanel').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }
    }

};
EWD.onSocketsReady = function() {
    for (id in EWD.application.labels) {
        try {
            document.getElementById(id).innerHTML = EWD.application.labels[id];
        }
        catch(err) {}
    };
    if (EWD.application.onStartup) EWD.application.onStartup();
};
EWD.onSocketMessage = function(messageObj) {
    if (EWD.application.messageHandlers) EWD.application.messageHandlers(messageObj);
};