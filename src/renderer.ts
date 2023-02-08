/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { IElectronAPI } from "./IElectronAPI"

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}

console.log('👋 This message is being logged by "renderer.js", included via webpack');

const main = async () => {
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
}

main();
