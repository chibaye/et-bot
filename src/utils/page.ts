export default {
    get: async (browser, url, cookies?: any) => {
        const page = await browser.newPage()
        if (cookies) await page.setCookie(...cookies)

        await page.setDefaultNavigationTimeout(0)
        await page.goto(url)
        return page
    },
    click: async (page, id, clickCount = 1) =>
        await Promise.all([
            page.click(id, {clickCount}),
            page.waitForNavigation()
        ])
}