/* jshint esversion: 6 */

const electron = require('electron');

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const windowStateKeeper = require('electron-window-state');

const fs = require('fs');

let mainWindow;

function createWindow () {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    mainWindow = new BrowserWindow({
        title: app.getName(),
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 768,
        minHeight: 600,
        center: true,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        backgroundColor: '#000'
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindowState.manage(mainWindow);

    require(__dirname + '/assets/js/menu');
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if(mainWindow === null) {
        createWindow();
    }
});

app.on('web-contents-created', (e, contents) => {
    if(contents.getType() == 'webview') {
        contents.on('will-navigate', (e, reqUrl) => {
            let getHost = url=>require('url').parse(url).host;
            let reqHost = getHost(reqUrl);
            let isExternal = reqHost && reqHost != getHost(contents.getURL());
            if(isExternal) {
                electron.shell.openExternal(reqUrl);
                e.preventDefault();
            }
        });
        contents.on('new-window', (e, url) => {
            electron.shell.openExternal(url);
            e.preventDefault();
        });
        contents.on('dom-ready', function() {
            fs.readFile(__dirname + '/assets/css/inject.css', 'utf-8', function(error, data) {
                contents.insertCSS(data);
            });
        });
    }
});