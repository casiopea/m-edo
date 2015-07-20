# m-edo

 Web Based Mumps Editor and Executor Mumps routine for [gtm](http://www.fisglobal.com/products-technologyplatforms-gtm) to edit and execute mumps routines online by utilizing ewd.js and Node.js.

### Screen shot:

[m-edo sample screen shot](
https://sites.google.com/site/gtmstudy/m-gateway/ewdgateway2/m-edo/ext307.png?attredirects=0)

### Github

https://github.com/casiopea/m-edo

### Setup Instructions

1. Change directory to ewd directory in your ewdjs setup e.g. /home/youruser/ewdjs/www/ewd/
2. Do git clone https://github.com/casiopea/m-edo.git
3. Move the m-edo.js to your node_modules directory. e.g. /home/youruser/ewdjs/node_modules/

### About

- Editor part is left side on screen. m-edo is hacking and enhancement [m-editor](https://github.com/faisalsami/m-editor) that made by Mr. Faisal.
- Do(execute) part is right side on screen.
- Before Do start, **selected label's line** on editor, and click play icon, start this label^routineName. 
- Stop at click stop button, process Killed by **MUPIP STOP**.

### Features and enhanced m-editor
- Multi-user, Multi-routines edit and parallel executing.
- A selected label^routineName Do execute, be impossible Do with paramater and $$function.
- Executing stdout write to contents view aria (from mumps write).
- Executing stdin read input and submit with enter code (to mumps read).
- Apend execute history to select-Box, and in select-Box selected label^routineName re-execute.
- Send ESC code $c(27) at read input. 
- Stop execute by MUPIP STOP.
- Toggled KeepAlive ON/OFF. When long time executing to avoid time out, KeepAlive is ON. 
- Process List View and Zombie Kill.
- Login/Logout, and Balus!
- It is possible using ewdMonitor Login user and password, editing EWD.application.loginType in app.js 
- RoutineName's tab horizontal scroll bar, when many selected routines or/and narrow screen 
- Support Internationalization(i18n). default is en-us.
- I18n client side locales are en-us.js and ja-jp.js file in locale, and i18n array at server m-edo.js node_module file.  

-----------------------------------------------------------------------------
# Appendix

### Login Type

m-edo has two login types, one is 'medo' and other is 'ewdMonitor'. 
Default is 'medo', that fixed a username 'medo' and a password 'gtmuser'.

'ewdMonitor' use ewdMonitor's username and password.
ewdMonitor Administrator maintain at security > ewdMonitor User Management.

You can change loginType from 'medo' to 'ewdMonitor' in app.js.

```javascript:app.js

    loginType : 'medo',   // or 'ewdMonitor'

```

### error trap in mumps routine (gtm_etrap)

##### default environment variable gtm_etrap

Set the environment variable gtm_etrap which overrides the default $ZTRAP="B"

See [GT.M Programmer's Guide > Development Cycle > Processing Errors from Direct Mode and Shell](http://tinco.pair.com/bhaskar/gtm/doc/books/pg/UNIX_manual/ch03s07.html)

##### gtm_etrap in m-edo.js

If leave this default, when an error occurs, it will into GT.M direct mode.
In order to avoid it, before spawn mumps -run in m-edo.js, set environment variable gtm_etrap = "goto CLIERR^%XCMD"

See [function gtmSpawn code in m-edo.js](https://github.com/casiopea/m-edo/blob/master/m-edo.js)


### Support Internationalization(i18n).

##### Server side

It is i18n array in m-edo.js node_module file.
If changing respons message other langueges, set values in i18n array.
See: https://github.com/casiopea/m-edo/blob/master/m-edo.js

##### Client side

I18n client side locales are en-us.js or ja-jp.js file in locale directory.
See: https://github.com/casiopea/m-edo/blob/master/locale/en-us.js

If you want be changing message other langueges ,

1. Copy from en-us.js to your locale faile. e.g. de-de.js
2. Editing your langueges your locale file.
3. Change locale file pointer in index.html.

e.g.


```html:index.html

   <script type="text/javascript" src="locale/de-de.js"></script>
   <!-- 
    <script type="text/javascript" src="locale/en-us.js"></script>
    -->

```



### Process List View and Zombie Kill.

##### Usage:
click glyphicon-stats icon on Top Nav-bar
( glyphicon-stats link to http://getbootstrap.com/components/ )

##### Screen shot:
[m-edo Process List View and Zombie Kill sample](
https://sites.google.com/site/gtmstudy/m-gateway/ewdgateway2/m-edo/ext308.png?attredirects=0)

##### ^%zmedoProcess 
m-edo executing process management global is ^%zmedoProcess.

##### Meaning of the status is as follows:
<dl>
  <dt>osRun</dt>
  <dd>Execute mumps -run "label^routine" from other console, so it is not invoke from m-edo that is not exists ^%zmedoProcess node.</dd>
  <dt>nowRunning</dt>
  <dd>You or other user now executing. This process exists ^%zmedoProcess node</dd>
  <dt>pastFinish</dt>
  <dd>m-edo session is abnormal termination, but mumps process is normaly finish. Garbage m-edo session in ^%zmedoProcess node</dd>
  <dt>maybeZombie</dt>
  <dd>m-edo session is abnormal termination, and mumps process is uncontrollable exist. It may be Zombie.</dd>
</dl>

Kill Zombie process be careful. 



