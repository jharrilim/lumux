import { createServer, Server } from 'http';
import { Worker } from 'worker_threads';

export class Lumux {
    private port: number;
    private prefix: string;
    private pool: { [key: string]: Worker };
    private server: Server;

    constructor(port, prefix) {
        this.port = port;
        this.prefix = prefix;
        
        this.pool = {};
        this.server = createServer((req, res) => {
            if (!req.url.startsWith(prefix)) {
                res.statusCode = 404;
                res.write('resource does not exist');
                res.end();
            } else {
                for(const key of Object.keys(this.pool)) {
                    if(req.url.startsWith(`${prefix}/${key}`)) {
                        this.pool[key].emit('message', {
                           type: 'request',
                           value: { req, res } 
                        });
                    }
                }
            }
        });
    }

    addArea(name, middleware) {
        if(typeof this.pool[name] !== 'undefined') {
            throw new Error(`The ${name} area already exists.`);
        }
        const route = `${this.prefix}/${name}`;
        const worker = new Worker('area.js', { 
            workerData: { 
                route,
                middleware
            }
        });
        this.pool[name] = worker;
        worker.on('error', err => {
            worker.removeAllListeners();
            console.error(err);
            if (typeof this.pool[name] !== 'undefined')
                delete this.pool[name];
        });
    }
}
