'use strict'

import DOM from 'domql'
import * as components from 'smbls'
import './define'

import App from './app'

window.DOM = DOM
window.Symbols = components

DOM.create(App, null, 'app', { components })
