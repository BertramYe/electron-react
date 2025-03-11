
import { BrowserWindow, app } from 'electron'
import path from 'path'
import { isDev } from './Utils.js'


const GetPreloadPath = () => {
    return  path.join(app.getAppPath(),"dist-electron/preload.cjs")
}



const LoadUI = (main_win:BrowserWindow) => {
    if(isDev()){  // development enviroment
        // main_win.webContents.openDevTools()
        main_win.loadURL("http://localhost:5123")
    }else{ // production
        main_win.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'))
    }
}




export {
    GetPreloadPath,
    LoadUI
}