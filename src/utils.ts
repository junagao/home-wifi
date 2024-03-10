import path from 'path'
import {fileURLToPath} from 'url'

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
