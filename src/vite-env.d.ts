/// <reference types="vite/client" />

import { ElectronAPI } from "./electron/preload.cjs"

declare global {
    interface Window extends Window {
        ElectronAPI:ElectronAPI
    } 
}

