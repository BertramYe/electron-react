import { parentPort } from 'worker_threads';

// handle the task
parentPort?.on('message', (params) => {
    let { task_data, additional_data } = params
    console.log('task_data',task_data)
    console.log('additional_data',additional_data)
    // 这里将获取到的单个 woker 参数接收后，进行对应的处理

    // 将处理完的结果回传给主进程
    parentPort?.postMessage(params)
});























