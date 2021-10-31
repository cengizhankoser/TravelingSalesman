const taskForm2 = document.querySelector('#taskForm2')
const name = document.querySelector('#Username1')
const Email = document.querySelector('#Email')

const { ipcRenderer } = require('electron')


taskForm2.addEventListener("submit",async e=>{
    e.preventDefault();
    const client={
      email:Email.value,
  clientName:name.value,
 
    }
    
 ipcRenderer.invoke('new-client', client).then(()=> console.log('new client entered')).catch((err)=> console.error('Error'))
 taskForm2.reset()
  })

  ipcRenderer.on("new-client-created", (e, arg) => {
    console.log(arg);
    const clientSaved = JSON.parse(arg);
    users.push(clientSaved);
   
    
  });