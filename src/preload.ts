// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
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

console.log("preload complete");