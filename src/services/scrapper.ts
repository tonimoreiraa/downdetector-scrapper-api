import puppeteer from "puppeteer";
import { redis } from "../database/redis";

declare var document: any;

export async function scrappeDownDetector() {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/116.0.5845.96 Safari/537.36')
    const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" })
    await page.goto('https://downdetector.com.br/')
    await navigationPromise
    await page.waitForSelector('.companies > div')

    const companiesList = await page.evaluate(() => {
        const companies = document.querySelectorAll('.companies > div')
        const companiesArray = Array.from(companies)
        return companiesArray.map((company: any) => {
            const a = company.querySelector('a')
            const img = company.querySelector('img')
            const svg = company.querySelector('svg')
            const name = a?.title
            const link = a?.href
            const status = svg?.getAttribute('class').split(' ').filter((a: string) => a != 'sparkline').join('')
            const image = img ? img.getAttribute('data-original') : null
            return { name, link, image, status }
        })
    })

    await redis.set('cached-sites', JSON.stringify(companiesList))
    await redis.set('last-update-time', new Date().toString())
    console.log(companiesList)
    await browser.close()
}