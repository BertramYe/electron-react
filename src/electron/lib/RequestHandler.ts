
import { BrowserWindow } from 'electron'
import { TPostData } from '../preload.cjs'


//  这里可以更具不同的 postdata 请求来进行不同的处理
const PostHandler = async<T>(e:Electron.IpcMainInvokeEvent,postdata:TPostData<T>,main_win:BrowserWindow) => {
    const { key,data } = postdata
    // 以下只是一个例子而已
    switch (key){
        case 'Login':
            break;
        default:
            break
    }

}






export {
    PostHandler
}