import { BrowserWindow, Menu,app } from "electron"
import { isDev } from "./Utils.js"



//  创建 tray 的 menu
const CreateTrayMenu = (main_win:BrowserWindow) => {
    // 创建真正的隐藏 icon 的表单内容，以下是根据表单内容创建的例子
    // 以下菜单列表的标签顺序，决定了对应的 icon 隐藏图标点击的菜单选项出现的顺序
    const menu = Menu.buildFromTemplate([
        {
            label:'Show',
            click:()=> {
                main_win.show()
                if(app.dock){ // macOS的程序标签栏也一并显示
                    app.dock.show()
                }
            },
            type:'normal' // 也可以指定 menu 显示的类型, 默认是 normal
        },
        {
            label:'Quit',
            click:()=> {
                app.quit()
            }
        }
    ])
    return menu
}




//  创建和自定义主窗口菜单
const CreateWindowMenu = (main_win:BrowserWindow) => {
    //  在创建之前，最好将对应的 窗口菜单重置，避免重复渲染
    Menu.setApplicationMenu(null)
    // 之后再继续创建
    const windows_menu = Menu.buildFromTemplate([
        // { label: '', visible:false  },  // 在 MacOs 中，为了让第一层 菜单栏只显示我们自己的内容时，也可以自定义一个隐藏菜单栏也是可以的
        {
            label:process.platform == 'darwin'? undefined:'App', // MacOS 默认会将第一个标签名设置为 当前应用名
            type:'submenu', // 定义当前的菜单标签类型为子菜单
            submenu:[  // 当以上开启了子菜单后,即设置为 submenu ，就可以自定义下面的子菜单的详细选项
                {
                    label:'DevTools',
                    click: () => main_win.webContents.openDevTools(),
                    visible: isDev() // 根据是否是开发模式，从而决定能否启用 devTools
                },
                {
                    label:'Quit',
                    click:()=>app.quit()
                }
            ]
        }
    ])
    // 同时这个 menu 自带的方法能够设置程序的 Menu 类型
    Menu.setApplicationMenu(windows_menu)

    // 注意，因为创建了app的菜单，那么下面的这个AutoHideMenuBar 属性一定要设置为 false，即不能隐藏菜单，否则我们会看不到我们以上自定义的菜单
    // main_win.setAutoHideMenuBar(false)

    return windows_menu
}


export {
    CreateTrayMenu,
    CreateWindowMenu
}