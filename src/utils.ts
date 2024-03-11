import {type Tray} from 'electron'
import path from 'path'
import puppeteer, {type Page} from 'puppeteer-core'
import {fileURLToPath} from 'url'
import {EXECUTABLE_PATH, PASSWORD, ROUTER_URL, USERNAME} from './constants.ts'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export const aboutPanelOptions = {
  applicationName: 'home wifi',
  applicationVersion: '1.0.0',
  iconPath: path.join(__dirname, '/icons/icon.png'),
  website: 'https://junagao.com',
  authors: ['Juliane Nagao'],
  copyright: 'Copyright © 2024 Juliane Nagao. All rights reserved.',
}

export const getBrowser = async () =>
  await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    executablePath: EXECUTABLE_PATH,
  })

let loadingInterval: string | number | NodeJS.Timeout = null
let frameIndex = 0

const getFrame = (index: number) => path.join(__dirname, `/icons/loader/frame-${index}.png`)

export const startLoadingAnimation = ({tray}: {tray: Tray}) => {
  const loadingFrames: string[] = [getFrame(0), getFrame(1), getFrame(2), getFrame(3)]
  loadingInterval = setInterval(() => {
    if (frameIndex >= loadingFrames.length) {
      frameIndex = 0
    }
    tray.setImage(loadingFrames[frameIndex])
    frameIndex++
  }, 300)
  return loadingInterval
}

export const checkIsLoggedIn = async (page: Page) => {
  try {
    const page_url = page.url()
    if (page_url.includes('login')) {
      return false
    } else {
      return true
    }
  } catch (e) {
    console.error('Login error!')
    console.error(e)
    return false
  }
}

export const login = async (page: Page) => {
  await page.goto(ROUTER_URL, {waitUntil: 'domcontentloaded'})
  await sleep(2)

  const isLoggedIn = await checkIsLoggedIn(page)

  if (!isLoggedIn) {
    console.log('Start login')
    await page.type("input[id='name']", USERNAME, {delay: 20})
    await page.type("input[id='password']", PASSWORD, {delay: 20})
    await page.keyboard.press('Enter')
    await page.waitForNavigation({waitUntil: 'networkidle2'})
    await page.keyboard.press('Enter')
    console.log('Login successfully')
  }
}

type Status = 'UP' | 'DOWN'

export const checkWifiStatus = async (page: Page) => {
  const wifi24GhzSelector = '#wifiGeneralTip12 > span'
  await page.waitForSelector(wifi24GhzSelector)
  const wifi24GhzStatus = (await page.$eval(
    wifi24GhzSelector,
    (element: {textContent: string}) => element.textContent
  )) as Status
  console.log('wifi 2.4Ghz status:', wifi24GhzStatus)

  const wifi5GhzSelector = '#wifiGeneralTipSSId5 > span'
  await page.waitForSelector(wifi5GhzSelector)
  const wifi5GhzStatus = (await page.$eval(
    wifi5GhzSelector,
    (element: {textContent: string}) => element.textContent
  )) as Status
  console.log('wifi 5Ghz status:', wifi5GhzStatus)

  return {wifi24GhzStatus, wifi5GhzStatus}
}

export const getTrayIcon = (wifi24GhzStatus: string, wifi5GhzStatus: string) =>
  wifi24GhzStatus === 'UP' || wifi5GhzStatus === 'UP'
    ? path.join(__dirname, '/icons/tray-icon-on.png')
    : path.join(__dirname, '/icons/tray-icon-off.png')

export const sleep = (sec: number) => new Promise((resolve) => setTimeout(resolve, sec * 1000))
