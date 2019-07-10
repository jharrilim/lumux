import { parentPort, workerData } from 'worker_threads';

parentPort.on('message', ({ type, value }) => {
    switch (type) {
        case 'request': 
            workerData.middleware(value.req, value.res);
            break;
        default:
            break;
    }
});
