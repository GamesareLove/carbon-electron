"use strict";

const { app, BrowserWindow } = require('electron');

let win;

function createWindow(){
    win = new BrowserWindow({ 
        width: 1200,
        height: 900,
        frame: false,
        webPreferences: {devTools: true},
        'minHeight': 900,
        'minWidth': 1200,
        'maxHeight': 900,
        'maxWidth': 1200,
        //'fullscreen': true
    });

    win.loadFile('public/login.html');

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});