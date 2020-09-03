import ReceiptService from '@/services/receipt'

export default {
    get: async (req, res) => {
        try {
            const data = await ReceiptService.get()
            return res.send(data)
        } catch (e) {
            return res.status(500).send({error: 'Something went wrong, try again'})
        }
    }
}