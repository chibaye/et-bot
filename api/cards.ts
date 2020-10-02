import {isMainThread, Worker} from 'worker_threads'
import {NowRequest, NowResponse} from '@vercel/node'

export default async (req: NowRequest, res: NowResponse) => {
    switch (req.method) {
        case 'GET':
            if (isMainThread) {
                console.log('Inside Main Thread')
                new Worker('./src/services/card.js', { workerData: { value: 'Tiko' } })
            }
            return res.send('Crawler started')
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}