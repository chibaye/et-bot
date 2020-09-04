import axios from 'axios'

import Receipt from '../services/receipt'
import launch from '../helpers/launch'

export default {
    get: async (req, res) => {
        try {
            res.send('Crawler started.')
            const data = await launch(Receipt.get)
            const url = 'https://retail.etoll.co.zm/api/v1.0/receipts/populate'
            await axios.post(url, data)
            return null
        } catch (e) {
            console.error(e)
            res.status(500).send({error: 'Something went wrong, try again'})
        }
    }
}