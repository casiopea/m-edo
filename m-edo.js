// <s>Re-usable core VistA interface functions</s>
// usable general interface functions. comment in toUpperCase()  

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var crypto = require("crypto");
var medo = new Object();
var medoUser = '';

//  required i18n array! if use your locale's languege, Change message values of i18n array.

var i18n = {
    username: 'You must enter your username.',
    password: 'Missing or invalid password',
    invaliduser: 'Invalid login attempt',
    pathtoget: 'Invalid path to get routine.',
    pathnotgiven: 'Routine Path not given.',
    pathtosave: 'Invalid path to save routine.',
    pathtobuild: 'Invalid path to build routine.',
    alreadyexists: 'Routine with this name already exists.',
    routinename: 'Invalid Routine Name.',
    loginType: 'invalid loginType! Please contact system administrator.'
};

/*
var i18n = {
    username: 'あなたのユーザ名を入力してください',
    password: 'パスワードの入力ミスまたは無効なパスワードです',
    invaliduser: 'ログインに失敗しました。IDまたはパスワードが無効です',
    pathtoget: 'ルーチン取得では無効なパスです',
    pathnotgiven: 'ルーチンパスが指定されていません',
    pathtosave: 'ルーチン保存では無効なパスです',
    pathtobuild: 'ルーチンのビルドでは無効なパスです',
    alreadyexists: 'このルーチン名は既に存在します',
    routinename: 'ルーチン名が無効です',
    loginType: 'ログインタイプが無効です。システム管理者へ連絡してください'
}
*/
var password = {
  encrypt: function(password) {
    if (!password || password === '') return {error: i18n.password ? i18n.password : 'Missing or invalid password' };
    // if (!password || password === '') return {error: 'Missing or invalid password'};
    var salt = crypto.randomBytes(64);
    var iterations = 10000;
    var keyLength = 64;
    var encrypted = crypto.pbkdf2Sync(password, salt, iterations, keyLength);
    return {
      type: 'password',
      hash: encrypted.toString('base64'),
      salt: salt.toString('base64')
    };
  },
  matches: function(fromUser, credentials) {
    var iterations = 10000;
    var keyLength = 64;
    var salt = new Buffer(credentials.salt, 'base64');
    var encrypted = crypto.pbkdf2Sync(fromUser, salt, iterations, keyLength);
    encrypted = encrypted.toString('base64');
    if (credentials.hash === encrypted) return true;
    return false;
  }
};
var listRoutines = function(routineName){
    var files = [];
    var count = 0;
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    var dirs = [];
    for(var i=1; i < rsplit.length; i++){
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
    }
    for(var i=0; i < dirs.length; i++){
        var dir = dirs[i];
        fs.readdirSync(dir).forEach(function(name){
            if(count > 19){return files;}
            var stats = fs.statSync(dir + '/' + name);
            if(!stats.isDirectory()){
                // if(name.toUpperCase().indexOf(routineName) === 0){   // This routine Name Pattern is VistA agreement.
                if(name.indexOf(routineName) === 0){                    // This Pattern usable general interface.
                    count = count + 1;
                    files.push({
                        id: count,
                        path: dir + '/' + name,
                        text: name.split('.')[0]
                    });
                }
            }
        });
    }
    return files;
};
var getRoutine = function(routinePath){
    var result = {};
    result.error = '';
    var invalid = true;
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    var dirs = [];
    for(var i=1; i < rsplit.length; i++){
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
    }
    for(var i=0; i < dirs.length; i++){
        var dir = dirs[i];
        if(routinePath.indexOf(dir) === 0){
            invalid = false;
        }
    }
    if(invalid){
        result.error = i18n.pathtoget ? i18n.pathtoget :  'Invalid path to get routine.' ;
        // result.error = 'Invalid path to get routine.';
        return result;
    }
    if(fs.existsSync(routinePath)){
        var routineName = path.basename(routinePath);
        result.name = routineName.split('.')[0];
        result.path = routinePath;
        result.routine = fs.readFileSync(routinePath).toString();
    }else{
        result.error = i18n.pathnotgiven ? i18n.pathnotgiven : 'Routine Path not given.' ;
        // result.error = 'Routine Path not given.'
    }
    return result;
};
var saveRoutine = function(routinePath,routineText,isNew){
    var result = {};
    result.error = '';
    var invalid = true;
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    var dirs = [];
    for(var i=1; i < rsplit.length; i++){
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
    }
    for(var i=0; i < dirs.length; i++){
        var dir = dirs[i];
        if(routinePath.indexOf(dir) === 0){
            invalid = false;
        }
    }
    if(invalid){
        result.error = i18n.pathtosave ? i18n.pathtosave : 'Invalid path to save routine.' ;
        // result.error = 'Invalid path to save routine.';
        return result;
    }
    if(fs.existsSync(routinePath) || isNew){
        fs.writeFileSync(routinePath, routineText);
        result.saved = true;
    }else{
        result.error = i18n.pathnotgiven ? i18n.pathnotgiven : 'Routine Path not given.' ;
        // result.error = 'Routine Path not given.'
    }
    return result;
};
var gtmMUPIPstop = function(routineName, pid, ewd) {

    var gedo = new ewd.mumps.GlobalNode('%zmedoProcess', [ 'session', ewd.session.sessid, routineName ]);

    if (medo[routineName].pid == gedo.$('pid')._value ) {
        var command = process.env.gtm_dist + "/mupip stop " + pid ;
        var child = exec(command,
            function (error, stdout, stderr){
                gedo._delete();
                if(stdout.toString()){
                    console.log('stdout = ',stdout.toString());
                }
                if(stderr.toString()){
                    ewd.sendWebSocketMsg({
                        type: 'gtmSpawnStdErr',
                        message: 
                            {
                                exec: false,
                                routineName : routineName,
                                stderr: "GT.M MUPIP forced STOP\n" + stderr.toString()
                            }
                    });
                }
            });
    }
};
var gtmSpawn = function(routineName,label,ewd) {

    var gedo = new ewd.mumps.GlobalNode('%zmedoProcess', [ 'session', ewd.session.sessid, routineName ]);
    gedo._delete();

    process.env.gtm_etrap = "goto CLIERR^%XCMD";
    var entryref = '"' + label + '^' + routineName.replace('_','%') + '"';
    var command = 'mumps -run ' + entryref;
    gedo.$('command')._value = command;
    gedo.$('username')._value = medoUser;

    medo[routineName] = spawn('mumps', ['-run', entryref ]);

    var pid = medo[routineName].pid;
    gedo.$('pid')._value = pid;
    ewd.sendWebSocketMsg({
        type: 'gtmSpawnPid',
        message: 
            {
                pid: pid,
                routineName : routineName,
                label: label
            }
    });

    medo[routineName]
        .on('exit', function (code) {
            console.log('pid = ' + pid + ' : command = ' + command + ' : child process exited with code ' + code);
            gedo._delete();
            ewd.sendWebSocketMsg({
                type: 'gtmSpawnExit',
                message:
                    {
                        exit: true,
                        routineName : routineName,
                        label: label,
                        pid: pid,
                        code: code
                    } 
            });
        })
        .on('error', function(err) {
            ewd.sendWebSocketMsg({
                type: 'gtmSpawnError',
                message:
                    {
                        error: err,
                        routineName : routineName,
                        label: label,
                        pid: pid
                    } 
            });
        });

    medo[routineName].stderr.on('error', function (data) {
        console.log('pid = ' + pid + ' : command = ' + command + ' : stderr = ', data.toString());
        ewd.sendWebSocketMsg({
            type: 'gtmSpawnStdErr',
            message: 
                {
                    exec: false,
                    routineName : routineName,
                    stderr: data.toString()
                }
        });
    });
    medo[routineName].stdout.setEncoding('utf8');
    medo[routineName].stdin.setEncoding('utf8');
    medo[routineName].stdout
        .on('data', function (data) {
            var buff = new Buffer(data);
            ewd.sendWebSocketMsg({
                type: 'gtmSpawnStdOut',
                message:
                    {
                        exec: true,
                        routineName : routineName,
                        label: label,
                        stdout: buff.toString('utf8')
                    } 
            });
        });
    medo[routineName].stdin.setEncoding('utf8');
    medo[routineName].stdin.resume();
};
var buildRoutine = function(routinePath,ewd){
    var result = {};
    result.error = '';
    var invalid = true;
    var objPath = '';
    var gtmRoutines = process.env.gtmroutines;
    var rsplit = gtmRoutines.split('(');
    for(var i=1; i < rsplit.length; i++){
        var dirs = [];
        var idir = rsplit[i].split(')')[0].trim();
        if(idir.indexOf(' ')>0){
            var indirs = idir.split(' ');
            for(var i=0; i < indirs.length; i++){
                dirs.push(indirs[i].trim());
            }
        }else{
            dirs.push(idir);
        }
        for(var j=0; j<dirs.length; j++){
            dir = dirs[j];
            if(routinePath.indexOf(dir) === 0){
                if(rsplit[i-1].indexOf(')')>=0){
                    objPath = rsplit[i-1].split(')')[1].trim();
                }else{
                    objPath = rsplit[i-1].trim();
                }
                invalid = false;
            }
        }
    }
    if(invalid){
        result.error = i18n.pathtobuild ? i18n.pathtobuild : 'Invalid path to build routine.' ;
        // result.error = 'Invalid path to build routine.';
        ewd.sendWebSocketMsg({
            type: 'buildRoutine',
            message: result
        });
        return;
    }
    if(fs.existsSync(routinePath)){
        var routineName = path.basename(routinePath);
        routineName = routineName.split('.')[0];
        var command = 'mumps -object=' + objPath + '/' + routineName + '.o ' + routinePath;
        var child = exec(command,
            function (error, stdout, stderr) {
                var result = {};
                result.output = '';
                if(stdout.toString()){
                    result.output = result.output + '\n' + stdout.toString();
                }
                if(stderr.toString()){
                    result.output = result.output + '\n' + stderr.toString();
                }
                result.build = true;
                ewd.sendWebSocketMsg({
                    type: 'buildRoutine',
                    message: result
                });
            });
        // console.log('Build child =',child.pid);
    }else{
        result.error = i18n.pathnotgiven ? i18n.pathnotgiven : 'Routine Path not given.';
        // result.error = 'Routine Path not given.';
        ewd.sendWebSocketMsg({
            type: 'buildRoutine',
            message: result
        });
    }
};
var checkRoutineName = function(routineName){
    var result = {};
    result.check = false;
    result.error = '';
    // var patt = /^[A-Z%][0-9A-Z]{0,7}$/i;       // This routine Name Pattern is VistA agreement.
    var patt = /^[A-Za-z%][0-9A-Za-z]{0,27}$/i;   // This Pattern usable general interface. 
    if(patt.test(routineName)){
        var gtmRoutines = process.env.gtmroutines;
        var rsplit = gtmRoutines.split('(');
        result.dirs = [];
        for(var i=1; i < rsplit.length; i++){
            var idir = rsplit[i].split(')')[0].trim();
            if(idir.indexOf(' ')>0){
                var indirs = idir.split(' ');
                for(var i=0; i < indirs.length; i++){
                    result.dirs.push(indirs[i].trim() + '/');
                }
            }else{
                result.dirs.push(idir + '/');
            }
        }
        result.check = true;
        result.routine = routineName;
        for(var i=0; i < result.dirs.length; i++){
            var dir = result.dirs[i];
            fs.readdirSync(dir).forEach(function(name){
                var stats = fs.statSync(dir + name);
                if(!stats.isDirectory()){
                    if(name == (routineName + '.m')){
                        result.check = false;
                        result.error = i18n.alreadyexists ? i18n.alreadyexists : 'Routine with this name already exists.' ;
                        // result.error = 'Routine with this name already exists.';
                        return result;
                    }
                }
            });
        }
    }else{
        result.error = i18n.routinename ? i18n.routinename : 'Invalid Routine Name.';
        // result.error = 'Invalid Routine Name.';
    }
    return result;
};
var initLoginType = function(loginType, ewd){
    if (loginType == 'ewdMonitor') {
        var loginMon = new ewd.mumps.GlobalNode('zewdMonitor', ['login']);
        return loginMon._exists
    } else {
        var loginMedo = new ewd.mumps.GlobalNode('zewdMedo', ['login', 'medo']);
        if (loginMedo._exists) {
            return true;
        } else {
            loginMedo._setDocument(password.encrypt('gtmuser'));
            return true;
        }
    }
    return false;
};
var zombieAction = function(params, ewd) {
    var gedo = new ewd.mumps.GlobalNode('%zmedoProcess', [ 'session', params.sessionid, params.routineName ]);
    gedo._delete();
    if (params.action == 'pidKill') {
        var command = process.env.gtm_dist + "/mupip stop " + params.pid ;
        var child = exec(command,
            function (error, stdout, stderr){
                if(stdout.toString()){
                    console.log('stdout = ',stdout.toString());
                }
                if(stderr.toString()){
                    ewd.sendWebSocketMsg({
                        type: 'zombieAction',
                        message: 
                            {
                                action: params.action,
                                result: stderr.toString()
                            }
                    });
                }
            });
    } else {
        ewd.sendWebSocketMsg({
            type: 'zombieAction',
            message: 
                {
                    action: params.action,
                    result: 'session Global Delete'
                }
        });
    }
};
var getAllProcess = function(params, ewd){
    var nowsessid = ewd.session.sessid;
    var nowuser = process.env.USER;
    var l,psstr,pid,subarr,medopid,status,sessionList;

    var gedo = new ewd.mumps.GlobalNode('%zmedoProcess', [ 'session' ]);
    var gsess = new ewd.mumps.GlobalNode('%zewdSession', [ 'session' ]);

    var arrps = new Object();
    var arrmedo = new Object();
    var arrRes = new Object();
    var child = exec('ps -ef | grep "[m]umps -r"',
        function (error, stdout, stderr){
            if(stdout.toString()){
                psstr = stdout.toString().split('\n');
                psstr.pop();
                for(var i=0; i < psstr.length; i++){
                    l = psstr[i].split(/\s+/);
                    pid = l[1];
                    arrps[pid] = { 
                        sessionid : '', pid: pid, osUser : l[0], medoUser : '', 
                        command: l[7] + ' ' + l[8] + ' ' + l[9] , status : 'osRun'
                    };
                }
                gedo._forEach(function(sessid, routineNode){
                    routineNode._forEach(function(routineName, sub){
                        subarr = sub._getDocument();
                        medopid = subarr.pid;
                        if (arrps[medopid]) {
                            if (gsess.$(sessid)._exists){
                                status = 'nowRunning';
                            }
                            else{
                              status = 'maybeZombie';
                            }
                            arrRes[medopid] = { 
                                sessionid : sessid, pid: medopid, osUser : arrps[medopid].osUser, 
                                medoUser : subarr.username , routineName : routineName ,
                                command: subarr.command , status : status
                            };
                            delete arrps[medopid];
                        } else {
                            arrRes[medopid] = { 
                                sessionid : sessid, pid: medopid, osUser : nowuser, 
                                medoUser : subarr.username , routineName : routineName ,
                                command: subarr.command , status : 'pastFinish'
                            };
                        }
                    });
                });
                for(i in arrps) {  arrRes[i] = arrps[i];  }
                ewd.sendWebSocketMsg({
                    type: 'getAllProcess',
                    message:
                        {
                            error: false,
                            result: arrRes
                        } 
                });
            } 
            if(stderr.toString()){
                console.log('**** ps exec stderr m-edo getAllProcess: ', stderr.toString()); 
            }
            if (error !== null) { 
                console.log('**** m-edo getAllProcess ps exec error: ', error.toString()); 
                gedo._forEach(function(sessid, routineNode){
                    routineNode._forEach(function(routineName, sub){
                        subarr = sub._getDocument();
                        medopid = subarr.pid;
                        arrRes[medopid] = { 
                            sessionid : sessid, pid: medopid, osUser : nowuser, 
                            medoUser : subarr.username , routineName : routineName ,
                            command: subarr.command , status : 'pastFinish'
                        };
                    });
                });
                ewd.sendWebSocketMsg({
                    type: 'getAllProcess',
                    message:
                        {
                            error: false,
                            result: arrRes
                        } 
                });
            }
        });
};

module.exports = {

    // EWD.js Application Handlers/wrappers

    onMessage: {
        Login: function(params,ewd){
            var loginType = params.loginType;
            if ( !initLoginType(loginType, ewd) ) {      //  loginType must be 'medo' or 'ewdMonitor'
                return {
                    error: i18n.loginType ? i18n.loginType : 'invalid loginType! Please contact system administrator.' ,
                    authenticated: false
                };
            }
            if (params.username === '') {
                return {
                    error: i18n.username ? i18n.username : 'You must enter your username.' ,
                    authenticated: false
                };
            }
            if (params.password === '') {
                return {
                    error: i18n.password ? i18n.password : 'Missing or invalid password' ,
                    authenticated: false
                };
            }
            var glv = (loginType == 'ewdMonitor') ? 'zewdMonitor' : 'zewdMedo';
            var loginGlo = new ewd.mumps.GlobalNode(glv, ['login']);
            if (loginGlo._exists) { 
                var userGlo = loginGlo.$(params.username);
                if (!userGlo._exists){
                    return {
                        error: i18n.invaliduser ? i18n.invaliduser : 'Invalid login attempt' ,
                        authenticated: false
                    };
                } 
                var credentials = userGlo._getDocument();
                if ( credentials.type === 'password' &&
                     !password.matches(params.password, credentials)) {
                        return {
                            error: i18n.password ? i18n.password : 'Invalid Password.' ,
                            authenticated: false
                        };
                }
            } else {
                return {
                    error: i18n.loginType ? i18n.loginType : 'invalid loginType! Please contact system administrator.' ,
                    authenticated: false
                };
            }

            ewd.session.setAuthenticated();
            medoUser = params.username;
            return {
                error: '',
                username : params.username,
                authenticated: true
            };
        },
        routineQuery: function(params, ewd) {
            if (!ewd.session.isAuthenticated) {return;}
            // var files = listRoutines(params.prefix.toUpperCase());
            var files = listRoutines(params.prefix);
            ewd.sendWebSocketMsg({
                type: 'routineMatches',
                message: files
            });
        },
        getRoutine: function(params, ewd) {
            if (!ewd.session.isAuthenticated) {return;}
            var result = getRoutine(params.routinePath);
            return result;
        },
        saveRoutine: function(params,ewd){
            if (!ewd.session.isAuthenticated) {return;}
            var result = saveRoutine(params.routinePath,params.routineText,params.newRoutine);
            return result;
        },
        buildRoutine: function(params,ewd){
            if (!ewd.session.isAuthenticated) {return;}
            buildRoutine(params.routinePath,ewd);
        },
        checkRoutineName: function(params,ewd){
            if (!ewd.session.isAuthenticated) {return;}
            // var result = checkRoutineName(params.routineName.trim().toUpperCase());
            var result = checkRoutineName(params.routineName.trim());
            return result;
        },
        gtmSpawn: function(params,ewd){
            if (!ewd.session.isAuthenticated) {return;}
            gtmSpawn(params.routineName.trim(), params.label.trim(), ewd);
        },
        gtmMUPIPstop: function(params,ewd){
            if (!ewd.session.isAuthenticated) {return;}
            gtmMUPIPstop(params.routineName.trim(), params.pid, ewd);
        },
        medoDelete: function(params, ewd){
            if (!ewd.session.isAuthenticated) {return;}
            var routineName = params.routineName.trim();
            delete medo[routineName];
        },
        interactiveModeSubmit: function(params, ewd) {
            if (!ewd.session.isAuthenticated) {return;}
            var routineName = params.routineName.trim();
            medo[routineName].stdin.write( params.input + params.enterCode);
        },
        submitESC: function(params, ewd) {
            if (!ewd.session.isAuthenticated) {return;}
            var routineName = params.routineName.trim();
            medo[routineName].stdin.write('\033');
        },
        keepAlive: function(params, ewd) {
          return {ok: true};
        },
        getAllProcess: function(params, ewd){
            if (!ewd.session.isAuthenticated) {return;}
            getAllProcess(params, ewd);
        },
        zombieAction: function(params, ewd){
            if (!ewd.session.isAuthenticated) {return;}
            zombieAction(params, ewd);
        }
    }
};