// @ts-ignore
import chrome from 'chrome-aws-lambda'
import login from '../helpers/login'

export default async callback => {
    const browser = await chrome.puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        defaultViewport: chrome.defaultViewport,
        headless: chrome.headless,
        ignoreHTTPSErrors: true
    })

    const auth = await login(browser)
    const cookies = await auth.cookies()
    const data = await callback(browser, cookies)
    await browser.close()
    return data
}