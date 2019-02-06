"use strict";

var createTitlebar = function createTitlebar() {
     const $ = require('jquery');
     const remote = require('electron').remote;

     $('body').prepend($('<div></div>', { id: "title-bar" }).load(`titlebar.html`));

     $(`#title-bar`).ready(() => {

          let window = remote.BrowserWindow.getFocusedWindow();

          $('#min-btn').click(() => {
               window = remote.BrowserWindow.getFocusedWindow();
               window.minimize();
          });

          $('#max-btn').click(() => {
               window = remote.BrowserWindow.getFocusedWindow();
               window.maximize();
               toggleMaxRestoreButtons();
          });

          $('#restore-btn').click(() => {
               window = remote.BrowserWindow.getFocusedWindow();
               window.unmaximize();
               toggleMaxRestoreButtons();
          });

          toggleMaxRestoreButtons();
          window.on('maximize', toggleMaxRestoreButtons);
          window.on('unmaximize', toggleMaxRestoreButtons);

          $('#close-btn').click(() => {
               window = remote.BrowserWindow.getFocusedWindow();
               window.close();
          });

          function toggleMaxRestoreButtons() {
               window = remote.BrowserWindow.getFocusedWindow();
               if (window.isMaximized()) {
                    $('#max-btn').css('display', 'none');
                    $('#restore-btn').css('display', 'flex');
               } else {
                    $('#max-btn').css('display', 'flex');
                    $('#restore-btn').css('display', 'none');
               }
          }
     })
}

var test = function test() {
     console.log("It works!")
}

createTitlebar();