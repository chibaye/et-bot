import axios from 'axios'
import { NowRequest, NowResponse } from '@vercel/node'

const chromium = require('chrome-aws-lambda')

const BASE_URL = 'https://41.72.118.210:8095'
const RECEIPT_URL = BASE_URL + '/merchants/transactions/toll-card-collections/search'
const ETRA_URL = 'https://retail.etoll.co.zm/api/v1.0/receipts/populate'

const camelize = str => {
    const s = str.replace(/\W/g, '')
    return s.charAt(0).toLowerCase() + s.slice(1)
}

const getContent = async (page, selector) => await page.$$eval(selector, opts => opts.map(({innerText}) => innerText))

const getData = async page =>
    await getContent(page, 'table tbody tr td')

const toJSON = (keys, items) => new Promise(async (resolve, reject) => {
    try {
        const data = []
        for (let i = 0; i < items.length; i += keys.length) {
            const item = {}
            for (const [index, key] of keys.entries()) {
                const value = items[index + i]
                if (!key.match(/actions/gi) && value) item[camelize(key)] = value
            }
            if (Object.keys(item).length === keys.length - 1) data.push(item)
        }
        return resolve(data)
    } catch (e) {
        return reject(e)
    }
})

export default async (req: NowRequest, res: NowResponse) => {
    try {
        let browser = null
        let result = null
        let took = null

        try {
            browser = await chromium.puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
                ignoreHTTPSErrors: true
            })
            const start = Date.now()

            const page = await browser.newPage()
            // await page.setDefaultNavigationTimeout(0)
            await page.setRequestInterception(true)
            page.on('request', request => {
                if (request.resourceType().match(/image|stylesheet|font/) || request.url().match(/merchants\/home|sweetalert|ico|image|datepicker|select|blockui|simple/))
                    request.abort()
                else
                    request.continue()
            })

            await page.goto(RECEIPT_URL)

            // LOGIN
            await page.waitForSelector('.btn-deep-purple')

            await page.$eval('[name="auth_id"]', (e, arg) => e.value = arg, process.env.USERNAME)
            await page.$eval('[name="auth_password"]', (e, arg) => e.value = arg, process.env.PASSWORD)
            await Promise.all([page.waitForNavigation(), page.click('.btn-deep-purple')])

            //RECEIPTS
            await page.waitForSelector('#from-date')

            await page.$eval('#from-date', el => {
                const date = new Date()
                // date.setDate(date.getDate() - 1)
                return el.value = date.toDateString()
            })

            await page.$eval('#to-date', el =>
                el.value = new Date().toDateString())

            await page.$eval('select#merchant option:nth-child(5)', el => el.selected = true)
            await Promise.all([page.waitForNavigation(), page.click('.btn-primary')])

            const headers = await getContent(page, 'table thead tr th')
            const data = await getData(page)
            result = await toJSON(headers, data)
            await axios.post(ETRA_URL, result)
            took = Date.now() - start
        } catch (error) {
            return error
        } finally {
            if (browser !== null) {
                await browser.close()
            }
        }

        res.send({message: `Transaction Completed Successfully! Took: ${took}ms`, data: result })
    } catch (e) {
        console.error(e)
        res.status(500).send({error: 'Something went wrong, try again'})
    }
}