const { createWindow } = require('./main')
const { app } = require('electron')
require('./database')
require('./models/user')
require('./models/list')
require('./models/client')
app.allowRendererProcessReuse = true
//app.whenReady().then(createWindow)