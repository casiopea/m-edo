# m-edo

 Web Based Mumps Editor and Executor Mumps routine for [gtm](http://www.fisglobal.com/products-technologyplatforms-gtm) to edit and execute mumps routines online by utilizing ewd.js and Node.js.

## Screen shot:

[m-edo sample screen shot](
https://sites.google.com/site/gtmstudy/m-gateway/ewdgateway2/m-edo/ext307.png?attredirects=0)

## Github

https://github.com/casiopea/m-edo

## Setup Instructions

1. Change directory to ewd directory in your ewdjs setup e.g. /home/youruser/ewdjs/www/ewd/
2. Do git clone https://github.com/casiopea/m-edo.git
3. Move the m-edo.js to your node_modules directory. e.g. /home/youruser/ewdjs/node_modules/

## About

- Editor part is left side on screen. m-edo is hacking and enhancement [m-editor](https://github.com/faisalsami/m-editor) that made by Mr. Faisal.
- Do(execute) part is right side on screen.
- Before Do start, **selected label's line** on editor, and click play icon, start this label^routineName. 
- Stop at click stop button, process Killed by **MUPIP STOP**.

## Features and enhanced m-editor
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

## Process List View and Zombie Kill.

###Usage:
click glyphicon-stats icon on Top Nav-bar
( glyphicon-stats link to http://getbootstrap.com/components/ )

###Screen shot:
[m-edo Process List View and Zombie Kill sample](
https://sites.google.com/site/gtmstudy/m-gateway/ewdgateway2/m-edo/ext308.png?attredirects=0)

###^%zmedoProcess 
m-edo executing process management global is ^%zmedoProcess.

###Meaning of the status is as follows:
<dl>
  <dt>osRun</dt>
  <dd>Execute mumps -run "label^routine" from other console, so it is not useing m-edo that is not exists ^%zmedoProcess node.</dd>
  <dt>nowRunning</dt>
  <dd>You or other user now executing. This process exists ^%zmedoProcess node</dd>
  <dt>pastFinish</dt>
  <dd>m-edo session is abnormal termination, but mumps process is normaly finish. Garbage m-edo session in ^%zmedoProcess node</dd>
  <dt>maybeZombie</dt>
  <dd>m-edo session is abnormal termination, and mumps process is uncontrollable. It may be Zombie.</dd>
</dl>

Kill Zombie process be careful. 



