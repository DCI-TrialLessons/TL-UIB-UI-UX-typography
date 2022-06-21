const puppeteer = require("puppeteer");
const path = require('path');

const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
}

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('UIB - Typography', () => {
    it("Page should contain a Navigtion Bar with 4 links", async () => {
        const navBar = await page.$('.nav-container');
        const navBarLinks = await navBar.$$('a');
        expect(navBarLinks.length).toBe(4);
    });
    it("Navigation links should link to corresponding section on the page", async () => {
        const navBar = await page.$('.nav-container');
        const navBarLinks = await navBar.$$('a');
        for (let i = 0; i < navBarLinks.length; i++) {
            const navBarLink = navBarLinks[i];
            const navBarLinkText = await page.evaluate(el => el.innerText, navBarLink);
            await page.evaluate(el => el.click(), navBarLink);
            await page.waitForSelector('h2');
            const allSectionHeaders = await page.$$('section h2');
            const sectionHeader = allSectionHeaders[i];
            const sectionHeaderText = await page.evaluate(el => el.innerText, sectionHeader);
            expect(sectionHeaderText.toLowerCase()).toBe(navBarLinkText.toLowerCase());
        }
    });
    it("Links on page should change color on hover", async () => {
        const linkColors = await page.$eval('a', el => getComputedStyle(el).getPropertyValue('color'));
        const navBar = await page.$('.nav-container');
        const navBarLinks = await navBar.$$('a');
        await navBarLinks[0].hover();
        const linkColorsAfterHover = await page.$eval('a', el => getComputedStyle(el).getPropertyValue('color'));
        expect(linkColorsAfterHover).not.toBe(linkColors);
    });
    it("Semantic html tags should be present on page", async () => {
        const semantic = await page.waitForSelector('em');
        expect(semantic).toBeTruthy();
    });
    it("Page should contain an image from the image directory as a background-image", async () => {
        const backgroundProperty = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('background-image')));
        expect(backgroundProperty).toBeTruthy();
        expect(backgroundProperty.some(e => e.includes('img/bg.jpg'))).toBe(true);
    });
});
