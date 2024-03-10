import {Menu, Tray, app, type MenuItemConstructorOptions} from 'electron'
import path from 'path'

import {initialMenu} from './menu.ts'
import {__dirname, aboutPanelOptions} from './utils.ts'

let menu: MenuItemConstructorOptions[]
let tray: Tray = null

app.on('ready', async () => {
  app.setAboutPanelOptions(aboutPanelOptions)

  tray = new Tray(path.join(__dirname, '/icons/tray-icon-on.png'))

  menu = initialMenu
  const initialContextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(initialContextMenu)
})
