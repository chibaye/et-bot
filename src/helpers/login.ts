import pageUtil from '../utils/page'

export default async browser => {
    const page = await pageUtil.get(browser, process.env.NRFA_URL + '/merchants/login')

    await page.setRequestInterception(true)
    page.on('request', request => {
        if (request.url().endsWith('merchants/home'))
            request.abort()
        else
            request.continue()
    })

    await page.type('[name="auth_id"]', process.env.USERNAME)
    await page.type('[name="auth_password"]', process.env.PASSWORD)
    await pageUtil.click(page, '.btn-deep-purple')
    return page
}