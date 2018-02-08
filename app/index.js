'use strict'

const {app, BrowserWindow} = require('electron')

app.on('ready', function () {
  console.log('Evil in progress...')
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
  })
  win.loadURL(`file://${__dirname}/index.html`)
  if (process.env.DEVTOOLS === '1') {
    win.openDevTools({detach: true})
  }
  win.show()
})

app.on('window-all-closed', function () {
  app.quit()
})
