import {app, BrowserWindow, ipcMain,nativeTheme, Tray} from 'electron'
import { ChannalMessager } from './lib/Messager.js';
import { GetPreloadPath, LoadUI } from './lib/PathResolve.js';
import { PostHandler } from './lib/RequestHandler.js';
import { CreateTray } from './lib/TrayHelper.js';
import { CreateWindowMenu } from './lib/MenuHelper.js';



const CreateWindows = () => {
    // 设置软件主题样式默认为夜间模式
    nativeTheme.themeSource = 'dark'; 
    const main_win = new BrowserWindow({
        title:'electron-react-template',
        alwaysOnTop:false,
        // autoHideMenuBar:true, // 自定义菜单时，这个选项一定要关闭，否则就看不到自定义菜单内容了
        width:800,
        height:700,
        webPreferences:{
            // devTools:isDev(),   // 这里移除是因为我将其是否打开 开发工具选项放进了 menu 里面了
            nodeIntegrationInWorker: true,
            nodeIntegration:false,
            // preload
            preload:GetPreloadPath(), 
        },
        // 如果想自定义当前软件的 frame 类型，可以将下面这个设置为 false 然后再在 App.tsx 里面 自定义和重写 frame 里面自带的 关闭，放大，缩小等功能键
        // 但是这么做，有一个弊端，那就是会导致对应的自定义菜单栏我们看不到，从而也必须在 App.tsx 里面 重写对应的菜单功能
        frame:true 
    })
    
    // 这个对象类用于信息的发送与log的处理
    const channel_messager = new ChannalMessager(main_win)

    // 初始化状态，用于改变整个应用程序的首页状态
    // 当然这里可以有更多可以写和描述的东西
    main_win.webContents.on('did-finish-load',()=>main_win.webContents.send('INITAIL_CHANNEL',{Status:2}))
    // 创建隐藏托盘
    CreateTray(main_win)

    // 创建主菜单
    CreateWindowMenu(main_win)
   
    // 根据不同的环境加载UI界面
    LoadUI(main_win)
    // 对于post请求的监听
    ipcMain.handle('POST_CHANNEL',async(e,post_data)=> await PostHandler(e,post_data,main_win))
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