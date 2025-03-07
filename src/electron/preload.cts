import { contextBridge,ipcRenderer } from 'electron';

type TPOSTChannel = "Login"  

type TPostData<T> = {
    key:TPOSTChannel,
    data?:T
}
type TResponse<T> = {
    success:boolean,
    data?:T,
    message?:string
}
interface IOnCallBack<T> {
    (event:Electron.IpcRendererEvent,data:T):void
}
type TInitialStatus = {
    Status:number,
}

type TInformLevel = 'success' | 'information' | 'warning' | 'error'

type TProccessMessage = {
    finishedFile:number,
    message:string,
    level:TInformLevel
}


interface ElectronAPI {
    InitialDict:{
        [key:number]:string
    },
    POST:<P,R>(post_data:TPostData<P>)=>Promise<TResponse<R>>,
    OnGet:<T,>(key:string,callback:IOnCallBack<T>)=>void,
    SetMaxListener:()=>void
}



contextBridge.exposeInMainWorld('ElectronAPI',{
    POST:async(PostData)=>{
        return await ipcRenderer.invoke("POST_CHANNEL",PostData)
    },
    OnGet:(key,callback) => {

        ipcRenderer.on(key,callback)
    },
    SetMaxListener:() => { // 这里可以设置对应的 MaxListeners 用于解决对应的报警信息
        // ipcRenderer.setMaxListeners(Infinity)
    }
} as ElectronAPI )


export {
    type TPostData,
    type TResponse,
    type TInitialStatus,
    type IOnCallBack,
    type ElectronAPI,
    type TPOSTChannel,
    type TProccessMessage
}

