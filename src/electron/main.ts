import {app, BrowserWindow, ipcMain,nativeTheme} from 'electron'
import path from 'path';
import { isDev } from './lib/utils.js'
import { ChannalMessager } from './lib/Messager.js';


const CreateWindows = () => {
    const isdev = isDev()
    const main_win = new BrowserWindow({
        title:'electron-react-template',
        alwaysOnTop:false,
        autoHideMenuBar:true,
        width:800,
        height:700,
        webPreferences:{
            devTools:isdev,
            nodeIntegrationInWorker: true,
            nodeIntegration:false,
            // preload
            preload:path.join(app.getAppPath(), "dist-electron/preload.cjs"), 
        }
    })
    
    // 这个对象类用于信息的发送与log的处理
    const channel_messager = new ChannalMessager(main_win)

    main_win.webContents.on('did-finish-load',async()=>{
        // 设置软件主题样式默认为夜间模式
        nativeTheme.themeSource = 'dark'; 
    })
   
    if(isdev){  // development enviroment
        main_win.webContents.openDevTools()
        main_win.loadURL("http://localhost:5123")
    }else{ // production
        main_win.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'))
    }
    
    ipcMain.handle('POST_CHANNEL',async(e,postdata)=> {
        console.log('postdata',postdata)
    })
    return main_win
}




app.on('ready',()=>{
    // 创建主窗口
    CreateWindows()
    //  添加这个监听是为了保证苹果系统在被关闭主窗口后，能正常创建重新创建窗口
    //  "activate" 事件一般只有在 MacOS 里面才有
    app.on('activate', async() => {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateWindows()
        }
    })
})



// 以下监听的添加是为了区分MacOS系统的启动问题
app.on('window-all-closed', () => {
    // 表示非 mac 系统环境下的整个 electron 程序退出时，能正常退出
    // darwin 是 macOS 系统的标志
    if (process.platform !== 'darwin') {
        app.quit()
    }
})