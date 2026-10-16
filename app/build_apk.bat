@echo off
set "PATH=E:\flutter\bin;%PATH%"
set "ANDROID_HOME=C:\Users\rupaj\AppData\Local\Android\Sdk"
set "JAVA_HOME=C:\Program Files\Java\jdk-22"
set "FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn"
cd /d "e:\OTD\fashion_companion_app"
flutter build apk --debug --verbose > build_apk.log 2>&1
