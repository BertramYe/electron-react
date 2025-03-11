import { BrowserWindow, Tray, app } from "electron"
import path from 'path'
import { CreateTrayMenu } from "./MenuHelper.js"

// 创建隐藏托盘
const CreateTray = (main_win:BrowserWindow) => {
    // 注意下面的 路径 之所以使用 '/src/assets/log.png'，是因为当前的 assets 不在 react项目下，所以图片资源名不会被编译修改
    // 另外，对于icon而言，windows 系统的 icon 名可以随意，但是 MacOS 的 icon 最好是以 xxxTemplate 结尾并且，其图片内容必须是全黑色的
    // process.platform == 'darwin' ---> MacOS 系统
    const iconPath = path.join(path.join(app.getAppPath(),process.platform == 'darwin'? '/src/assets/logTemplate.png':'/src/assets/log.png'))
    const tray = new Tray(iconPath)
    
    // 下面这个变量控制是否可以真正退出当前事件
    let willClosed = false
    // 当完成以上的 托盘事件后，最好添加下面的 closed-windows 的监听
    main_win.on('close',(e)=> {
        if(!willClosed){ // 只有不想关闭时，才触发这个 阻止默认行为的事件
            e.preventDefault() // 阻止默认事件，也就是不会关闭当前所有窗口,也就是关闭当前应用无效
            main_win.hide() // 只隐藏窗口，不退出和关闭当前项目进程
            if(app.dock){ // 如果是在 MacOS 系统中,除了当前窗口，它还有一个多余的软件运行时的下方的窗口栏
                app.dock.hide()
            }
        }
    })

    //在程序真正打算推出前
    app.on('before-quit',()=> { // 这个事件只有在 app.quit 才会真正触发，即真正退出才行，否则只是关闭窗口，不会真正的关闭后台进程
        //  设置可以退出
        willClosed = true
    })

    // 当窗口真正出现前 ，设置 以下参数，保证关闭窗口的行为不会关闭后台进程
    main_win.on('show',()=> {
        willClosed = false
    })

    // 创建 tray 所需要的menu
    const tray_menu = CreateTrayMenu(main_win)
    
    // 设置表单内容
    // 注意在 MacOS 的点击左键会出现对应的隐藏托盘的上面的菜单选项
    // 而在 windows 上需要右键点击对应的隐藏菜单图标
    tray.setContextMenu(tray_menu)
    return tray
}






export {
    CreateTray
}