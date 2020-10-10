const puppeteer = require('puppeteer');

const APP = `http://localhost:8080/`;

describe('Front-end Integration/Features', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    page = await browser.newPage();
  });

  afterAll(() => {
    APP.destroy();
  });

  describe('initial load',()=>{
    it('loads successfully', async () => {
      // We navigate to the page at the beginning of each case so we have a fresh start
      await page.goto(APP);
      await page.waitForSelector('#queryDisplay');
      const title = await page.$eval('#queryPlaceholder', (el) => el.innerHTML);
      expect(title).toBe('No query results to display');
    });
  })

})