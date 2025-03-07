

import './App.css'
import type{ TInitialStatus } from '../electron/preload.cjs'

// import { TestUploadFiles} from './tools/test.js';
// import {FetchedAllUploadedDatas} from './tools/FileUploader.js'

function App() {
  window.ElectronAPI.OnGet<TInitialStatus>("INITAIL_CHANNEL",(_,data)=> {
      console.log('value',data)
    
  })
 

  return (
      <div>
        this is the homepage
      </div> 
  )
}

export default App
