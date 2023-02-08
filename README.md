# electron_ipc
Shows three methods for communicating over IPC

Typically this requires orchestration acros the main, preload, and renderer processes.

## Main process
``` typescript
  ipcMain.on('asyncPing', (event, args) => {
    console.log("asyncPing received");
    event.sender.send('asyncPong', 'asyncPong');
  })


  ipcMain.on('syncPing', (event, args) => {
    console.log('syncPing received');
    event.returnValue = 'syncPong';
  })


  ipcMain.handle('handlePing', (event, args) => {
    console.log('handlePing received');
    return 'handlePong';
  })


  ipcMain.handle('handlePingWithError', () => {
    throw new Error("Something Went Wrong");
  })
```

## Preload process
``` typescript
import { contextBridge, ipcRenderer } from "electron"
import { IElectronAPI } from "./IElectronAPI"

const electronAPI: IElectronAPI = {
    asyncPing: () => ipcRenderer.send("asyncPing"),
    syncPing: () => ipcRenderer.sendSync("syncPing"),
    handlePing: () => ipcRenderer.invoke("handlePing"),
    handlePingWithError: () => ipcRenderer.invoke("handlePingWithError")
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

ipcRenderer.on('asyncPong', (event, args) => {
    console.log("asyncPong received");
    const asyncResponseElement = document.getElementById('asyncPingResponse');
    asyncResponseElement.textContent = args;
})
``` 

## Renderer process
``` typescript
    const asyncPingButton = document.querySelector("#asyncPingButton");
    asyncPingButton.addEventListener('click', (e) => {
        console.log("Async Ping Clicked");
        window.electronAPI.asyncPing();        
    });


    const syncPingButton = document.querySelector("#syncPingButton");
    syncPingButton.addEventListener('click', (e) => {
        console.log("Sync Ping Clicked");
        const response = window.electronAPI.syncPing();
        console.log(response);
        const responseElement = document.getElementById("syncPingResponse")
        responseElement.textContent = response;
    });


    const handlePingButton = document.querySelector("#handlePingButton");
    handlePingButton.addEventListener('click', (e) => {
        console.log("Handle Ping Clicked");
        window.electronAPI.handlePing().then((result) => {
            console.log(result);
            const responseElement = document.getElementById("handlePingResponse")
            responseElement.textContent = result;
        });
    });


    const handlePingWithErrorButton = document.querySelector("#handlePingWithErrorButton");
    handlePingWithErrorButton.addEventListener('click', (e) => {
        console.log("Handle Ping with Error Clicked");
        window.electronAPI.handlePingWithError()
        .then((result) => {
            console.log("then");
            console.log(result);
            const responseElement = document.getElementById("handlePingWithErrorResponse")
            responseElement.textContent = result;
        })
        .catch((err) => {
            console.log("catch");
            console.log(err);
            const responseElement = document.getElementById("handlePingWithErrorResponse")
            responseElement.textContent = err;
        })
    })
```

Please note that in this case in order to be as typesafe as possible I created an Interface for the electronAPI that I am exporting.
This made it so that I could be sure that I am creating an object with the methods that I expected to build, and that the global window could be updated with those
methods as well.

IElectronAPI.ts
``` typescript
export interface IElectronAPI {
    asyncPing: () => void
    syncPing: () => string
    handlePing: () => Promise<string>
    handlePingWithError: () => Promise<string>
}
```

usage in preload...
``` typescript
import { IElectronAPI } from "./IElectronAPI"

const electronAPI: IElectronAPI = {
    asyncPing: () => ipcRenderer.send("asyncPing"),
    syncPing: () => ipcRenderer.sendSync("syncPing"),
    handlePing: () => ipcRenderer.invoke("handlePing"),
    handlePingWithError: () => ipcRenderer.invoke("handlePingWithError")
}
```

usage in renderer
``` typescript
import { IElectronAPI } from "./IElectronAPI"

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
```

without this then the render will complain that electronAPI is not on the window.

Take note that the first string paramater of contextBridge.exposeInMainWorld will be what the window object will be. so if we passed in "fooBar" as 
the first paramater of that method then we would need to make this interface say fooBar instead of electronAPI.

All in all I would say that the handle method is probably the most useful; however, it will depend on the use case to dtermine which mehtod to use.