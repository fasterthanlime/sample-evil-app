'use strict'

const {app, BrowserWindow} = require('electron')

app.on('ready', function () {
  console.log('Alright then!')
  const win = new BrowserWindow()
  win.loadURL(`file://${__dirname}/index.html`)
  win.show()
})

app.on('window-all-closed', function () {
  app.quit()
})
