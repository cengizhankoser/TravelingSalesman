/*const electron = require("electron");
const url = require("url");
const path = require("path");*/

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const user = require('./models/user.js')
const kargo = require('./models/list.js')
const client = require('./models/client.js');



function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      traceProcessWarnings: true
    },
  })
  win.loadFile('index.html')
}

function createWindow_1() {
  const mainWindow = new BrowserWindow({
    width: 1400, height: 1050,
  });

  mainWindow.loadFile('main.html');
}
function createWindow_2() {
  const mainWindow = new BrowserWindow({
    width: 800, height: 750,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      traceProcessWarnings: true
    },
  });
  mainWindow.loadFile('kargolist.html');
}

function createWindow_3() {
  const mainWindow = new BrowserWindow({
    width: 1400, height: 1050,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      traceProcessWarnings: true
    },
  });
  const mainWindow1 = ""
  mainWindow.loadFile('client.html');
}
function createWindow_4() {
  mainWindow1 = new BrowserWindow({
    width: 1400, height: 1050,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      traceProcessWarnings: true
    },
  });

  mainWindow1.loadFile('map.html');
}


ipcMain.handle('new', async (e, arg) => {
  const s = JSON.stringify(arg)
  const f = JSON.parse(s)
  const newUser = new user(arg)
  const t = await user.find({ email: f.email }).exec();
  const n = await user.find({ name: f.name }).exec();

  if (t.length !== 0) {
    dialog.showErrorBox('used-email', 'This  email is used!')
  }
  else if (n.length !== 0) {
    dialog.showErrorBox('This username is unavailable', 'Please choose another username!')
  }
  else {
    const newUser = new user(arg)
    const userSaved = await newUser.save()
    console.log(userSaved)
    e.sender.send('new-user-created', JSON.stringify(userSaved))
    dialog.showErrorBox('new-user', 'New User Created')
  }

})
ipcMain.handle('not-new', async (e, arg) => {

  dialog.showErrorBox('Passwords do not match!', '')
})

ipcMain.handle('get-users', async (e, arg) => {
  const s = JSON.stringify(arg)
  const f = JSON.parse(s)
  const n = await user.find({ name: f.name }).exec();
  const p = await user.find({ pass: f.pass }).exec();
  if ((!n || n.length === 0) || (!p || p.length === 0)) {
    dialog.showErrorBox('Username or Password is incorrect!', '')
  }
  else {
    const tasks = await user.find(arg).exec();
    e.sender.send('enter', (createWindow_2(), createWindow_4()))


  }
});


ipcMain.handle('update-user', async (e, arg) => {
  const s = JSON.stringify(arg)
  const f = JSON.parse(s)
  const t = await user.find({ email: f.email }).exec();
  const n = await user.find({ name: f.name }).exec();
  const p = await user.find({ pass: f.pass }).exec();
  if (!t || t.length === 0) {
    dialog.showErrorBox('This Email Is Not Registered!', '')
  }
  else if (!n || n.length === 0) {
    dialog.showErrorBox('Username is not correct!', '')
  }
  else if (!p || p.length === 0) {
    dialog.showErrorBox('Password is not correct!', '')
  } else {
    console.log(f.newpass)
    const updatedTask = await user.updateOne({ name: f.name }, { pass: f.newpass })
    dialog.showErrorBox('Password has been changed successfully!', '')
  }
  // e.sender.send("update-task-success", JSON.stringify(updatedTask));
});


ipcMain.handle('new-kargo', async (e, arg) => {


  const s = JSON.stringify(arg)
  const f = JSON.parse(s)
  const newKargo = new kargo(arg)
  const t = await kargo.find({ clientName: f.clientName }).exec();
  const kargoSaved = await newKargo.save()
  console.log(kargoSaved)
  e.sender.send('new-kargo-created', (JSON.stringify(kargoSaved), mainWindow1.reload()))

})



ipcMain.handle('cl', async (e, arg) => {

  const tasks = await client.find({}).distinct('clientName');
  e.sender.send("get-tasks", JSON.stringify(tasks));
});

ipcMain.handle('get-list', async (e, arg) => {

  const tasks = await kargo.find();
  e.sender.send('send-list', JSON.stringify(tasks));
});



ipcMain.handle("update-kargo", async (e, args) => {
  console.log(args);
  const updatedKargo = await kargo.findByIdAndUpdate(
    args.idToUpdate,
    { clientName: args.clientName, address: args.address, lat: args.lat, lng: args.lng }
  ).exec();
  console.log(updatedKargo);
  e.sender.send("update-kargo-success", (JSON.stringify(updatedKargo), mainWindow1.reload()));
});

ipcMain.handle('delete-kargo', async (e, args) => {
  const kargoDeleted = await kargo.findByIdAndDelete(args);
  let options = {
    buttons: ["Yes", "No", "Cancel"],
    message: "Do you really want to delete this record?"
  }
  dialog.showMessageBox(options).then(data => {
    if (data.response === 0) {
      console.log(data.response)

      e.sender.send("delete-kargo-success", (JSON.stringify(kargoDeleted), mainWindow1.reload()));

    }
  }).catch(err => {
    console.log(err)
  });


});

ipcMain.handle('new-client', async (e, arg) => {
  const s = JSON.stringify(arg)
  const f = JSON.parse(s)
  const newClient = new client(arg)
  const t = await client.find({ clientName: f.clientName }).exec();

  if (t.length !== 0) {
    dialog.showErrorBox('', 'This  client is already registered!')
  }

  else {

    const clientSaved = await newClient.save()

    e.sender.send('new-client-created', JSON.stringify(clientSaved))
    dialog.showErrorBox('new-client', 'New Client Entry')
  }
})

ipcMain.handle('get-latlongs', async (e, arg) => {

  const tasks = await kargo.find().select('-_id lat lng ').exec()
  var number = ""
  var z = []

  for (var i = 0; i < tasks.length; i++) {
    number = i + 1;
    z.push({ lat: tasks[i].lat, lng: tasks[i].lng, number: number })

  }

  e.sender.send('send-latlongs', JSON.stringify(z));

});

module.exports = { createWindow_1, createWindow, createWindow_2, createWindow_3, createWindow_4 }
app.whenReady().then(createWindow)
