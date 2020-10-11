const express = require('express');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');
const { httpLogger, errorHandler, notFoundHandler } = require('./middleware');
const { users } = require('./routers');
const { isDev, paths } = require('../utils');
const fs = require('fs')

///////
const puppeteer = require('puppeteer');
let dataWeek = [];
let dataMonth = [];
let dataDay = [];
let spread = [];
let roundedNumber = [];
let dowFutOnCfD = [];
let dowFutRoundOnCfD = [];
let dfDowData = [];
let HighLowCloseData = [];
////////

const app = express();

app.use(helmet());
app.use(httpLogger());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }), hpp());

app.use('/api/users', users);


// serve files in production environment
if (!isDev) {
  app.use('/build', express.static(`${paths.public}/build`));
  app.get('*', (req, res) => {
    res.sendFile(`${paths.public}/index.html`);
  });
}

app.use(notFoundHandler());
app.use(errorHandler());

const PORT = parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, error => {
  if (error) {
    console.error(`ERROR: ${chalk.red(error)}`);
  }
  console.info(chalk.cyan(`Express server is listening PORT (${PORT})`));
});

//////////////

const getMyData = (url1, url2, url3, url4, url5, url6) => {
  return new Promise((resolve, reject) => {
  (async () => {
    console.log ("Scrapping en cours")
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    function myPivotPoints(high, low, close) {
      let myPp = Math.round((( high + low  + close ) / 3) * 100) / 100
      let myR1 = Math.round (((myPp * 2) - low) * 100) / 100
      let myS1 = Math.round (((myPp * 2) - high) * 100) / 100
      let myR2 = Math.round ((myPp + (high - low)) * 100) / 100
      let myS2 = Math.round ((myPp - (high - low)) * 100) / 100
      let myR3 = Math.round ((high + 2 * (myPp - low)) * 100) / 100
      let myS3 = Math.round ((low - 2 * (high - myPp)) * 100) / 100
    return [myPp, myR1,myS1, myR2, myS2, myR3, myS3]
    }

    await page.goto(url3); //get Month Data
    const dowMonthData = await page.evaluate(() => {
      let high = (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(2) > td:nth-of-type(4)").innerText,10))
      let low =  (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(2) > td:nth-of-type(5)").innerText,10))
      let close =  (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(2) > td:nth-of-type(6)").innerText,10))

      return [high, low, close]
    })
    dataMonth = myPivotPoints(dowMonthData[0], dowMonthData[1], dowMonthData[2])
    console.log (`Month : High ${dowMonthData[0]} Low ${dowMonthData[1]} Close ${dowMonthData[2]}`)
    HighLowCloseData.push(dowMonthData[0], dowMonthData[1], dowMonthData[2])

    await page.goto(url4); //get Week Data
    const dowWeekData = await page.evaluate(() => {
      let high = (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(2) > td:nth-of-type(4)").innerText,10))
      let low =  (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(2) > td:nth-of-type(5)").innerText,10))
      let close =  (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(2) > td:nth-of-type(6)").innerText,10))
      return [high, low, close]
    })
    dataWeek = myPivotPoints(dowWeekData[0], dowWeekData[1], dowWeekData[2])
    console.log (`Week : High ${dataWeek[0]} Low ${dataWeek[1]} Close ${dataWeek[2]}`)
    HighLowCloseData.push(dowWeekData[0], dowWeekData[1], dowWeekData[2])

    await page.goto(url5); //get Day data
    const dowDayData = await page.evaluate(() => {
      let high = (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(1) > td:nth-of-type(4)").innerText,10))
      let low =  (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(1) > td:nth-of-type(5)").innerText,10))
      let close =  (parseInt(document.querySelector(".fth1 > tbody > tr:nth-of-type(1) > td:nth-of-type(6)").innerText,10))
      return [high, low, close]
    })
    dataDay = myPivotPoints(dowDayData[0], dowDayData[1], dowDayData[2])
    console.log (`Day : High ${dataDay[0]} Low ${dataDay[1]} Close ${dataDay[2]}`)
    HighLowCloseData.push(dowDayData[0], dowDayData[1], dowDayData[2])

    await page.goto(url1); // recupération valeur futur actuel
    const getDowFutur = await page.$x('//*[@id="last_last"]');
    const getDowFuturProperty = await getDowFutur[0].getProperty('textContent');
    const rawDowFuturValue = getDowFuturProperty._remoteObject.value;
    let dowFuturValue = rawDowFuturValue.split('.').join("");

    await page.goto(url2);  // recupération valeur cash actuel
    const getcloseCash = await page.$x('//*[@id="last_last"]', 2000);
    const getcloseCashProperty = await getcloseCash[0].getProperty('textContent');
    const rawcloseCashValue = getcloseCashProperty._remoteObject.value;
    let closeCashValue = rawcloseCashValue.split('.').join("");

    dowFuturValue = parseInt(dowFuturValue, 10);
    closeCashValue = parseInt(closeCashValue, 10);
    spread.push(closeCashValue - dowFuturValue)

    closeCashValue = closeCashValue /100
    closeCashValue = parseInt(closeCashValue)
    closeCashValue = closeCashValue + "00"
    closeCashValue = parseFloat(closeCashValue)

    roundedNumber.push(closeCashValue, closeCashValue + 100, closeCashValue +200, closeCashValue + 300, closeCashValue + 400, closeCashValue +500, closeCashValue -100, closeCashValue -200, closeCashValue -300, closeCashValue -400, closeCashValue -500)
    roundedNumber.forEach(function (data){dowFutRoundOnCfD.push(data+spread[0])})
    await page.goto(url6);  // dailyFx
    const dfDowS1 = await page.$eval('.dfx-slidableContent > .dfx-adGutterWrapper > .container > .row > div.col-lg-12.col-xl-8.dfx-border--r-xl-1.mb-4  > div.dfx-supportResistanceComponent.jsdfx-supportResistanceComponent--tableViewMd > div:nth-child(21) > div.dfx-supportResistanceBlock__values > div.dfx-supportResistanceBlock__valuesS.mr-1.mr-md-0 > div:nth-child(1) > span.dfx-supportResistanceBlock__valueLevel.mx-1', el => el.innerText)
    const dfDowS2 = await page.$eval('.dfx-slidableContent > .dfx-adGutterWrapper > .container > .row > div.col-lg-12.col-xl-8.dfx-border--r-xl-1.mb-4  > div.dfx-supportResistanceComponent.jsdfx-supportResistanceComponent--tableViewMd > div:nth-child(21) > div.dfx-supportResistanceBlock__values > div.dfx-supportResistanceBlock__valuesS.mr-1.mr-md-0 > div:nth-child(2) > span.dfx-supportResistanceBlock__valueLevel.mx-1', el => el.innerText)
    const dfDowS3 = await page.$eval('.dfx-slidableContent > .dfx-adGutterWrapper > .container > .row > div.col-lg-12.col-xl-8.dfx-border--r-xl-1.mb-4  > div.dfx-supportResistanceComponent.jsdfx-supportResistanceComponent--tableViewMd > div:nth-child(21) > div.dfx-supportResistanceBlock__values > div.dfx-supportResistanceBlock__valuesS.mr-1.mr-md-0 > div:nth-child(3) > span.dfx-supportResistanceBlock__valueLevel.mx-1', el => el.innerText)
    const dfDowR1 = await page.$eval('body > div.dfx-slidableContent > div > div.container > div.row > div.col-lg-12.col-xl-8.dfx-border--r-xl-1.mb-4 > div.dfx-supportResistanceComponent.jsdfx-supportResistanceComponent--tableViewMd > div:nth-child(21) > div.dfx-supportResistanceBlock__values > div.dfx-supportResistanceBlock__valuesR.ml-1.ml-md-0 > div:nth-child(1) > span.dfx-supportResistanceBlock__valueLevel.mx-1', el => el.innerText)
    const dfDowR2 = await page.$eval('body > div.dfx-slidableContent > div > div.container > div.row > div.col-lg-12.col-xl-8.dfx-border--r-xl-1.mb-4 > div.dfx-supportResistanceComponent.jsdfx-supportResistanceComponent--tableViewMd > div:nth-child(21) > div.dfx-supportResistanceBlock__values > div.dfx-supportResistanceBlock__valuesR.ml-1.ml-md-0 > div:nth-child(2) > span.dfx-supportResistanceBlock__valueLevel.mx-1', el => el.innerText)
    const dfDowR3 = await page.$eval('body > div.dfx-slidableContent > div > div.container > div.row > div.col-lg-12.col-xl-8.dfx-border--r-xl-1.mb-4 > div.dfx-supportResistanceComponent.jsdfx-supportResistanceComponent--tableViewMd > div:nth-child(21) > div.dfx-supportResistanceBlock__values > div.dfx-supportResistanceBlock__valuesR.ml-1.ml-md-0 > div:nth-child(3) > span.dfx-supportResistanceBlock__valueLevel.mx-1', el => el.innerText)

    dfDowData.push(dfDowS1,dfDowS2,dfDowS3, dfDowR1, dfDowR2, dfDowR3)
    //
    let dji = {
      "djiDPP" : dataDay[0],
      "djiDR1" : dataDay[1],
      "djiDS1" : dataDay[2],
      "djiDR2" : dataDay[3],
      "djiDS2" : dataDay[4],
      "djiDR3" : dataDay[5],
      "djiDS3" : dataDay[6],
      "djiWPP" : dataWeek[0],
      "djiWR1" : dataWeek[1],
      "djiWS1" : dataWeek[2],
      "djiWR2" : dataWeek[3],
      "djiWS2" : dataWeek[4],
      "djiWR3" : dataWeek[5],
      "djiWS3" : dataWeek[6],
      "djiMPP" : dataMonth[0],
      "djiMR1" : dataMonth[1],
      "djiMS1" : dataMonth[2],
      "djiMR2" : dataMonth[3],
      "djiMS2" : dataMonth[4],
      "djiMR3" : dataMonth[5],
      "djiMS3" : dataMonth[6],

      "djiMHigh" : HighLowCloseData[0],
      "djiMLow" : HighLowCloseData[1],
      "djiMClose" : HighLowCloseData[2],
      "djiWHigh" : HighLowCloseData[3],
      "djiWLow" : HighLowCloseData[4],
      "djiWClose" : HighLowCloseData[5],
      "djiDHigh" : HighLowCloseData[6],
      "djiDLow" : HighLowCloseData[7],
      "djiDClose" : HighLowCloseData[8],

       "xS1" : dfDowData[0],
       "xS2" : dfDowData[1],
       "xS3" : dfDowData[2],
       "xR1" : dfDowData[3],
       "xR2" : dfDowData[4],
       "xR3" : dfDowData[5],

        "z" : roundedNumber[0],
        "zh1" : roundedNumber[1],
        "zh2" : roundedNumber[2],
        "zh3" : roundedNumber[3],
        "zh4" : roundedNumber[4],
        "zh5" : roundedNumber[5],
        "zl1" : roundedNumber[6],
        "zl2" : roundedNumber[7],
        "zl3" : roundedNumber[8],
        "zl4" : roundedNumber[9],
        "zl5" : roundedNumber[10]

    }

    let donnees = JSON.stringify(dji)
    fs.writeFileSync('dji.json', donnees)

    console.log ("Scrapping terminé")
    resolve() //return
  })();
})
}

getMyData("https://fr.investing.com/indices/us-30-futures", "https://fr.investing.com/indices/us-30", "https://stooq.com/q/d/?s=%5Edji&c=0&i=m", "https://stooq.com/q/d/?s=%5Edji&c=0&i=w", "https://stooq.com/q/d/?s=%5Edji&c=0", "https://www.dailyfx.com/support-resistance").then(()=>{

console.log("Page générée sur localhost 5000")
})
