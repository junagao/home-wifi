import {Menu, Tray, app, type MenuItemConstructorOptions} from 'electron'
import path from 'path'

import {ROUTER_WIFI_URL} from './constants.ts'
import {initialMenu} from './menu.ts'
import {
  __dirname,
  aboutPanelOptions,
  checkWifiStatus,
  getBrowser,
  getTrayIcon,
  login,
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
})
