import {app, shell, type MenuItemConstructorOptions} from 'electron'

import {ROUTER_URL} from './constants.ts'

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
