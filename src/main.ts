import {Menu, Tray, app, type MenuItemConstructorOptions} from 'electron'
import path from 'path'

import {ROUTER_WIFI_URL} from './constants.ts'
import {getMenu, initialMenu, updateMenuItemIcon} from './menu.ts'
import {
  __dirname,
  aboutPanelOptions,
  checkWifiStatus,
  getBrowser,
  getTrayIcon,
  login,
  sleep,
  startLoadingAnimation,
} from './utils.ts'

let menu: MenuItemConstructorOptions[]
let tray: Tray = null

app.on('ready', async () => {
  app.setAboutPanelOptions(aboutPanelOptions)

  tray = new Tray(path.join(__dirname, '/icons/tray-icon-on.png'))
  const loadingInterval = startLoadingAnimation({tray})

  menu = initialMenu
  const initialContextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(initialContextMenu)

  const browser = await getBrowser()

  const page = await browser.newPage()

  await login(page)

  await page.goto(ROUTER_WIFI_URL, {waitUntil: 'domcontentloaded'})

  const {wifi24GhzStatus, wifi5GhzStatus} = await checkWifiStatus(page)
  const trayIcon = getTrayIcon(wifi24GhzStatus, wifi5GhzStatus)
  tray.setImage(trayIcon)

  setTimeout(() => clearInterval(loadingInterval))

  menu = getMenu({browser, tray, wifi24GhzStatus, wifi5GhzStatus})

  const contextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(contextMenu)
  await page.close()
  await browser.close()
})

export const toggleWifi = async ({selector, tray}: {selector: string; tray: Tray}) => {
  const loadingInterval = startLoadingAnimation({tray})

  const browser = await getBrowser()

  const page = await browser.newPage()

  await login(page)

  await page.goto(ROUTER_WIFI_URL, {waitUntil: 'domcontentloaded'})

  await page.waitForSelector(selector, {visible: true})
  await page.click(selector)

  const applyButtonSelector = `button[translate="apply"]`
  await page.waitForSelector(applyButtonSelector)
  await page.click(applyButtonSelector)
  console.log(`Please wait...`)

  await sleep(1)

  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  await page.waitForSelector(`div[translate="pleaseWaitLoading"]`, {hidden: true})

  const {wifi24GhzStatus, wifi5GhzStatus} = await checkWifiStatus(page)
  const trayIcon = getTrayIcon(wifi24GhzStatus, wifi5GhzStatus)
  tray.setImage(trayIcon)

  setTimeout(() => clearInterval(loadingInterval))

  menu[0].icon = updateMenuItemIcon(wifi24GhzStatus)
  menu[1].icon = updateMenuItemIcon(wifi5GhzStatus)
  const contextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(contextMenu)

  await page.close()
  await browser.close()
}
