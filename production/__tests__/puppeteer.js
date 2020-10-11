const puppeteer = require("puppeteer");

const APP = `http://localhost:8080/`;

describe("Front-end Integration/Features", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    page = await browser.newPage();
  });

  afterAll(() => {
    APP.destroy();
  });

  describe("initial load", () => {
    it("loads successfully", async () => {
      // We navigate to the page at the beginning of each case so we have a fresh start
      await page.goto(APP);
      await page.waitForSelector("#queryDisplay");
      const title = await page.$eval("#queryPlaceholder", (el) => el.innerHTML);
      expect(title).toBe("No query results to display");
    });

    it("child elements load", async () => {
      // We navigate to the page at the beginning of each case so we have a fresh start
      await page.goto(APP);
      await page.waitForSelector("#mainContainer");
      const childNodes = await page.$eval(
        "#mainContainer",
        (el) => el.childNodes.length
      );
      expect(childNodes).toBe(4);
    });

    it("top row child elements load", async () => {
      await page.goto(APP);
      await page.waitForSelector("#topRow");
      const childNodes = await page.$eval(
        "#topRow",
        (el) => el.childNodes.length
      );
      expect(childNodes).toBe(2);
    });

    it("bottom row child elements load", async () => {
      await page.goto(APP);
      await page.waitForSelector("#bottomRow");
      const childNodes = await page.$eval(
        "#bottomRow",
        (el) => el.childNodes.length
      );
      expect(childNodes).toBe(2);
    });
  });

  //   xdescribe('Executes successful queries or mutations',() => {

  //     it('displays a usable input field for queries or mutations', async () => {
  //       await page.goto(APP); // takes a URL
  //       await page.waitForSelector('#controlPanel'); // takes a selector - waits for it to appear in page
  //       await page.waitForSelector('.ReactCodeMirror'); // fetches element (selector)
  //       const childNodes = await page.$$eval('.ReactCodeMirror', (el) => el.childNodes);
  //       console.log("childnodes:", childNodes)
  //       // await page.keyboard.type('{ people { gender }}');
  //       // const inputValue = await page.$eval('.ReactCodeMirror', el => el.value);
  //       // expect(inputValue).toBe('{ people { gender }}');
  //     });

  // // #queryDisplay
  // // .topLeftButtons.length(3)
  //   })

  //   describe("TEST", () => {
  //     it("displays a usable input field for queries or mutations", async () => {
  //       await page.goto(APP);

  //       await page.waitForSelector("#submitQuery");

  //       // await page.evaluate(() => {
  //       //   let dom = document.querySelector("textarea");
  //       //   dom.innerHTML = "{people {name}}";
  //       // });

  //       await page.click("#submitQuery", async (el) => {
  //         const buttons = (await page.$(".topLeftButtons")) !== null;
  //         expect(buttons).toBe(true);
  //       });

  // await page.waitForSelector(".topLeftButtons"); // takes a selector - waits for it to appear in page
  // //   await page.waitForSelector(".ReactCodeMirror"); // fetches element (selector)
  // const element = await page.$eval(".topLeftButtons", (el) => {
  //   console.log(el);
  //   return el;
  // });
  // await console.log("textarea:", element);
  // await page.waitForSelector("textarea");
  // await page.type("textarea", "Hello"); // Types instantly

  // const element2 = await page.$("textarea");
  //   await page.waitForSelector("textarea");
  //   await page.focus("textarea"); // fetches element (selector)
  //   await page.keyboard.type("Tallahassee");
  //   const textInput = await page.$eval("textarea", (el) => el.innerHTML);
  //   // console.log(textInput);
  //   expect(textInput).toBe("Tallahassee");
  // await console.log(element2);

  //   await page.waitForSelector(".CodeMirror-line");
  //   await page.focus(".CodeMirror-line"); // fetches element (selector)
  //   await page.keyboard.type("Tallahassee");
  //   const textInput = await page.$eval(
  //     ".CodeMirror-line",
  //     (el) => el.childNodes
  //   );
  //   // console.log(textInput);
  //   expect(textInput).toBe("Tallahassee");
  // await console.log(element2);

  //   const spans = await page.$$("span");
  //   spans.forEach((el) => console.log(el.innerHTML));
  //   await page.focus(spans[1]); // fetches element (selector)
  //   await page.keyboard.type("Tallahassee");
  //   const textInput = await page.$eval("textarea", (el) => el.innerHTML);
  //   expect(textInput).toBe("Tallahassee");
  //     });
  //   });

  describe("Schema Viz Loads", () => {
    it("import schema works", async () => {
      await page.goto(APP);
      await page.waitForSelector("#graphViz");
      await page.click("#updateSchema", async (el) => {
        // expect there to be a div now with visualization...
        // graphBox should be a div on the page
        // const graphLoad = await page.$eval('#graphBox', (el) => el.childNodes.length);
        // expect(graphLoad).toBe(2)
        const graphLoad = (await page.$("#graphBox")) !== null;
        expect(graphLoad).toBe(true);
        const fullVizBut = (await page.$("#fullVizClick")) !== null;
        expect(fullVizBut).toBe(true);
      });
    });
  });

  describe("TEST", () => {
    it("displays a usable input field for queries or mutations", async () => {
      await page.goto(APP);
      await page.waitForSelector("#controlPanel");
      // await page.evaluate(() => {
      //   let dom = document.querySelector("textarea");
      //   dom.innerHTML = "{people {name}}";
      // });

      await page.click("#submitQuery", async (el) => {
        const buttons = (await page.$("#responseButtons")) !== null;
        expect(buttons).toBe(true);
      });
    });
  });
});
