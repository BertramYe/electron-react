import { Worker } from 'worker_threads';
import fs from 'fs'
import path from 'path'
interface IFinishedCallBack<R> {
    (result:R[]):void
}
type TAdditionalParams = {
    [key:string]:any
}

// hanle the cacualtion of the property 
class WorkerManager <T,R>{
    private _taskQue:T[] = []
    private _maxWrokers:number = 0
    private _subworkerpath
    private _resultList:R[] = []
    private _workers_list:Worker[] =[]
    private _workers_status_list:boolean[] = [] // false : idle / true busy busy 
    private _total_tasks:number = 0 //recored wheather all task finished or not
    private _finished_tasks:number = 0
    private _finished_callback?:IFinishedCallBack<R>
    private _addition_parms:TAdditionalParams = {}
    
    constructor(
        maxWorkers: number,subworker?:string,
        addition_params?:TAdditionalParams,
        finished_callback?:IFinishedCallBack<R>
        ) {
        if(maxWorkers <= 0){
            throw new Error(`workers's number can't be  0 !`)
        }else{
            this._subworkerpath = subworker ?? path.resolve("dist-electron/electron/lib/worker/subworker.js")  
            if(!fs.existsSync(this._subworkerpath)){
                throw new Error(`the subworkers files not exited! in the path : ${this._subworkerpath}`)
            }
            this._maxWrokers = maxWorkers
            for(let i = 0; i < this._maxWrokers; i ++){
                const worker = this._createWorker()
                this._workers_list.push(worker)
                this._workers_status_list.push(false) 
            }
        }
        if(finished_callback){
            this._finished_callback = finished_callback
        }
        if(addition_params){
            this._addition_parms = addition_params
        }
    }
    
    // initial a threading
    private _createWorker(){
        const worker = new Worker(this._subworkerpath) // task details
        worker.on('message',(data)=>{
            this._resultList.push(data)
            // excel title compare and difined by myself
            this._finished_tasks += 1  // recored the task finishe numbers
            this._handleTaskStatus(worker,'message')
        })
        worker.on('error',(e)=>{ // resolve the error on the task
            console.error(`there were somthing wrong on error ${e}`)
            // ignore the erro and make the nect taks going on
            this._finished_tasks += 1  // faile or not just make the next task going on
            this._handleTaskStatus(worker,'error')
        })
        worker.on('exit',(code)=>{
            if(code !== 0){
                console.log(`worker terminal with task finished !!`)
                // this._finished_tasks += 1 // current project no need add this one, because the try catch already in the sub workers
            }else{
                // need checked
                console.error(`something happned caused the worker break down !`)
            }
            this._handleTaskStatus(worker,'exit')

        })
        return worker
    }
    private _handleTaskStatus(worker: Worker,type:'message' | 'error' | 'exit') {
        const worker_index = this._workers_list.indexOf(worker)
        if (worker_index === -1) return; // ignore no task
        this._workers_status_list[worker_index] = false
        if(this._taskQue.length > 0){ // there were still the task need to be finished 
            if(type == 'exit'){
                // replace the shut down task 
                worker = this._createWorker()
                this._workers_list[worker_index] = worker
            }
            worker.postMessage({task_data:this._taskQue.shift(),additional_data:this._addition_parms})
            this._workers_status_list[worker_index] = true
        }else{
            worker.terminate()
            this._workers_list.splice(worker_index, 1);
            this._workers_status_list.splice(worker_index, 1);
            if(this._total_tasks == this._finished_tasks){ // all task finished 
                if(this._finished_callback){
                    this._finished_callback(this._resultList)
                }
            }
        }
    }

    // assgin the task to the worker
    StartTasks(taskData_list: T[]) { 
        for(let task_data of taskData_list){
            this._total_tasks +=1
            let task_assign = false
            for(let j=0; j < this._workers_status_list.length ; j ++){
                if(!this._workers_status_list[j]){
                    this._workers_list[j].postMessage({task_data,additional_data:this._addition_parms});
                    task_assign = true
                    this._workers_status_list[j] = true
                    break;
                }
            }
            if(!task_assign){
                this._taskQue.push(task_data)
                task_assign = true
            }
            
            if(this._workers_list.length < this._maxWrokers && taskData_list.length > this._workers_list.length){
                const needed_workers = this._maxWrokers - this._workers_list.length
                for(let k = 0 ; k < needed_workers; k ++){
                    const needed_worker = this._createWorker()
                    this._workers_list.push(needed_worker)
                    needed_worker.postMessage({task_data:this._taskQue.shift(),additional_data:this._addition_parms})
                    this._workers_status_list.push(true)
                }
            }
        }
    }
    
}

export {
    WorkerManager
}
