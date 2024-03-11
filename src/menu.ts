import {app, shell, type MenuItemConstructorOptions, type Tray} from 'electron'
import path from 'path'
import {type Browser} from 'puppeteer-core'

import {ROUTER_URL} from './constants.ts'
import {toggleWifi} from './main.ts'
import {__dirname} from './utils.ts'

const about: MenuItemConstructorOptions = {
  label: 'About',
  role: 'about',
  click: () => app.showAboutPanel(),
}

const routerPage: MenuItemConstructorOptions = {
  label: 'Open Router Page',
  type: 'normal',
  click: () => shell.openExternal(ROUTER_URL),
}

const separator: MenuItemConstructorOptions = {type: 'separator'}

const quit: MenuItemConstructorOptions = {
  label: 'Quit',
  role: 'quit',
  accelerator: 'Cmd+Q',
}

export const initialMenu: MenuItemConstructorOptions[] = [
  {
    label: 'Wifi 2.4Ghz',
    enabled: false,
  },
  {
    label: 'Wifi 5Ghz',
    enabled: false,
  },
  separator,
  routerPage,
  separator,
  about,
  {...quit, click: () => app.quit()},
]

type Status = 'UP' | 'DOWN'

export const updateMenuItemIcon = (status: Status) => {
  return status === 'UP'
    ? path.join(__dirname, '/icons/wifi-up.png')
    : path.join(__dirname, '/icons/wifi-down.png')
}

type GetMenuProps = {
  browser: Browser
  tray: Tray
  wifi24GhzStatus: Status
  wifi5GhzStatus: Status
}

export const getMenu = ({
  browser,
  tray,
  wifi24GhzStatus,
  wifi5GhzStatus,
}: GetMenuProps): MenuItemConstructorOptions[] => [
  {
    label: 'Wifi 2.4Ghz',
    icon: updateMenuItemIcon(wifi24GhzStatus),
    click: async () => {
      await browser.close()
      await toggleWifi({
        selector: `input[id="enable-wifi-24"]`,
        tray,
      })
    },
  },
  {
    label: 'Wifi 5Ghz',
    icon: updateMenuItemIcon(wifi5GhzStatus),
    click: async () => {
      await toggleWifi({
        selector: `input[id="enable-wifi-5"]`,
        tray,
      })
    },
  },
  separator,
  routerPage,
  separator,
  about,
  {
    ...quit,
    click: async () => {
      await browser.close()
      app.quit()
    },
  },
]
