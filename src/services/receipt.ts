import Utils from '../utils'
import PageUtil from '../utils/page'

const toJSON = (keys, items) => {
    const data = []
    for (let i = 0; i < items.length; i += keys.length) {
        const obj = {}
        keys.map((k, ki) => {
            if (!k.match(/actions/gi)) obj[Utils.camelize(k)] = items[ki + i]
        })
        data.push(obj)
    }
    return data
}

const getDocCount = async page => await page.$eval('span.card-pf-aggregate-status-count', el => el.textContent)

const getContent = async (page, id) => await page.$$eval(id, opts => opts.map(({innerText}) => innerText))

const scrapTable = async page => {
    let results = []
    const max = await getDocCount(page)
    const total = parseInt(max.replace(/,/g, ''), 10)

    for (let i = 0; i < total; i++) {
        Utils.progress(i, total)
        await page.waitFor(100)
        results = results.concat(await getContent(page, 'table.dataTable tbody tr td'))
        if (i !== total - 1) await page.click('#DataTables_Table_0_next')
        console.clear()
    }

    return results
}

export default {
    get: async (browser, cookies) => {
        const url = process.env.NRFA_URL + '/merchants/transactions/toll-card-collections/search'
        const page = await PageUtil.get(browser, url, cookies)

        await page.$eval('#from-date', el => {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            return el.value = yesterday.toDateString()
        })

        await page.$eval('#to-date', el => {
            const today = new Date()
            return el.value = today.toDateString()
        })

        await page.$eval('select#merchant option:nth-child(5)', el => el.selected = true)

        await PageUtil.click(page, '.btn-primary')

        const headers = await getContent(page, 'table.dataTable thead tr th')
        const data = await scrapTable(page)
        return toJSON(headers, data)
    }
}