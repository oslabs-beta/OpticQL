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

  xdescribe('initial load',() => {
    
    it('loads successfully', async () => {
      // We navigate to the page at the beginning of each case so we have a fresh start
      await page.goto(APP);
      await page.waitForSelector('#queryDisplay');
      const title = await page.$eval('#queryPlaceholder', (el) => el.innerHTML);
      expect(title).toBe('No query results to display');
    });

    it('child elements load', async () => {
      // We navigate to the page at the beginning of each case so we have a fresh start
      await page.goto(APP);
      await page.waitForSelector('#mainContainer');
      const childNodes = await page.$eval('#mainContainer', (el) => el.childNodes.length);
      expect(childNodes).toBe(4);
    });

    it('top row child elements load', async () => {
      await page.goto(APP);
      await page.waitForSelector('#topRow');
      const childNodes = await page.$eval('#topRow', (el) => el.childNodes.length);
      expect(childNodes).toBe(2);
    });

    it('bottom row child elements load', async () => {
      await page.goto(APP);
      await page.waitForSelector('#bottomRow');
      const childNodes = await page.$eval('#bottomRow', (el) => el.childNodes.length);
      expect(childNodes).toBe(2);
    });

  })

  xdescribe('Executes successful queries or mutations',() => {
  
    it('displays a usable input field for queries or mutations', async () => {
      await page.goto(APP); // takes a URL
      await page.waitForSelector('#controlPanel'); // takes a selector - waits for it to appear in page
      await page.waitForSelector('.ReactCodeMirror'); // fetches element (selector)
      const childNodes = await page.$$eval('.ReactCodeMirror', (el) => el.childNodes);
      console.log("childnodes:", childNodes)
      // await page.keyboard.type('{ people { gender }}');
      // const inputValue = await page.$eval('.ReactCodeMirror', el => el.value);
      // expect(inputValue).toBe('{ people { gender }}');
    });

// #queryDisplay
// .topLeftButtons.length(3)



  })

  xdescribe('Schema Viz Loads',()=>{
    it('import schema works', async () => {
      await page.goto(APP);
      await page.waitForSelector('#graphViz');
      await page.click('#updateSchema', (async (el)=>{
      // expect there to be a div now with visualization...
      // graphBox should be a div on the page
      // const graphLoad = await page.$eval('#graphBox', (el) => el.childNodes.length);
      // expect(graphLoad).toBe(2)
      const graphLoad = (await page.$('#graphBox')) !== null;
      expect(graphLoad).toBe(true);
      const fullVizBut = (await page.$('#fullVizClick')) !== null;
      expect(fullVizBut).toBe(true);
    }))
  
    })

  })

})