import { BrowserWindow } from "electron"
import type { TProccessMessage,TInitialStatus } from '../preload.cjs'



class ChannalMessager {
    private _main_win:BrowserWindow

    constructor(main_window:BrowserWindow){
        this._main_win = main_window
    }

    RecordHandleProcess(message:TProccessMessage){
        this._main_win.webContents.send('FETCHDATA_CHANNEL',message)
    }

    ResetProgramStatus(status:TInitialStatus['Status']) {
        this._main_win.webContents.send('INITAIL_CHANNEL',{Status: status})
    }
}


export {
    ChannalMessager
}