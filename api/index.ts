import Receipts from '@/controllers/receipts'

export default (req, res) => {
    switch (req.method) {
        case 'GET':
            return Receipts.get(req, res)
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}