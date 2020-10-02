const { workerData, parentPort } = require('worker_threads')

const greet = args => {
    console.log(args)
    return 'completed!'
}

parentPort.postMessage(greet(workerData.value))