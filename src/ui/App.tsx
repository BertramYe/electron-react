

import './App.css'
import type{ TInitialStatus } from '../electron/preload.cjs'
import loading from './asserts/loading.gif'
import { useState } from 'react'

function App() {

  const [status,setStatus] = useState<TInitialStatus>({Status:0})
  // 修改程序初始化状态
  window.ElectronAPI.OnGet<TInitialStatus>("INITAIL_CHANNEL",(_,data)=> setStatus(data))
 
  
  return (
      <div>
        <div>{  window.ElectronAPI.InitialDict[status.Status]  }</div>
        {
          status.Status == 0 && <img src={loading} alt="" />
        }
      </div> 
  )
}

export default App
