import Receipt from '../services/receipt'
import launch from '../helpers/launch'

export default {
    get: async (req, res) => {
        try {
            const data = await launch(Receipt.get)
            res.send({data})
        } catch (e) {
            console.error(e)
            res.status(500).send({error: 'Something went wrong, try again'})
        }
    }
}