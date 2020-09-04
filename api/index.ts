// @ts-ignore
import chrome from 'chrome-aws-lambda'

const launch = async () => {
    const browser = await chrome.puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        defaultViewport: chrome.defaultViewport,
        headless: chrome.headless
    })
    const page = await browser.newPage()
    await page.goto('https://gozambiajobs.com/')
}

launch()
console.log('CALLED')