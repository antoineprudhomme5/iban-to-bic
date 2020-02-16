import * as fs from "fs";
import * as puppeteer from "puppeteer";

const sleep = (milliseconds: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const readIbansFromJson = (): string[] => {
  const rawIbansBuffer = fs.readFileSync("ibans.json");
  const rawIbans = rawIbansBuffer.toString();
  return JSON.parse(rawIbans);
};

const writeIbanToBicMapInCsvFile = (ibanToBicMap: Map<string, string>) => {
  const csvRows: string[] = [];
  ibanToBicMap.forEach((bic, iban) => {
    csvRows.push(`${iban},${bic}`);
  });
  const csvContent = csvRows.join("\n");
  fs.writeFileSync("ibans_with_bics.csv", csvContent);
};

const scrapBics = async (ibans: string[]): Promise<Map<string, string>> => {
  const ibanToBicMap = new Map<string, string>();

  const browser = await puppeteer.launch();
  for (let i = 0; i < ibans.length; i++) {
    const iban = ibans[i];
    const page = await browser.newPage();
    try {
      await page.goto("https://www.ibancalculator.com/");
      await page.$eval(
        'input[name="tx_valIBAN_pi1[iban]"]',
        (el: any, value: string) => (el.value = value),
        iban
      );
      await page.click('input[name="tx_valIBAN_pi1[iban]"]');
      await page.keyboard.press("Enter");
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      const bic = await page.evaluate(() => {
        const bicTextField = document
          .querySelector(".tx-valIBAN-pi1")
          .querySelectorAll("fieldset")[2]
          .querySelectorAll("p")[2].innerText;
        return bicTextField
          .split(" ")[1]
          .split("BIC")[0]
          .trim();
      });
      console.log(`${iban}, ${bic}`);
      ibanToBicMap.set(iban, bic);
    } catch (error) {
      console.error(error);
    }
    await page.close();
    await sleep(1000);
  }

  await browser.close();
  return ibanToBicMap;
};

const ibans = readIbansFromJson();
scrapBics(ibans).then(writeIbanToBicMapInCsvFile);
