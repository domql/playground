'use strict'

import { injectGlobal } from 'emotion'
import { opacify } from '@symbo.ls/scratch'

export const style = {
  margin: 6,
  background: opacify('#D8D8D8', 0.05),
  padding: '16 20',
  minWidth: 420,
  maxWidth: 540,
  position: 'relative',
  borderRadius: 6,
  
  flex: '0 1 42%',
  display: 'flex',
  flexDirection: 'column',

  '> header': {
    padding: '0 0 10',
    opacity: 0.35,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 12,
    userSelect: 'none'
  }
}

export const code = {
  flex: 1,
  position: 'relative'
}

injectGlobal`
  .codeflask.codeflask {
    background: none;
    color: white;
    padding: 0;
  }
  .codeflask__textarea.codeflask__textarea {
    background: none;
    color: white;
    caret-color: white;
  }
  .codeflask__flatten.codeflask__flatten {
    padding: 0;
    color: white;
    line-height: 22px;
  }
  .codeflask.codeflask .token.punctuation {
    color: #4a4a4a;
  }
  .codeflask.codeflask .token.keyword {
    color: #8500ff;
  }
  .codeflask.codeflask .token.operator {
    color: #ff5598;
  }
  .codeflask.codeflask .token.string {
    color: #41ad8f;
  }
  .codeflask.codeflask .token.comment {
    color: #9badb7;
  }
  .codeflask.codeflask .token.function {
    color: #8500ff;
  }
  .codeflask.codeflask .token.boolean {
    color: #8500ff;
  }
  .codeflask.codeflask .token.number {
    color: #8500ff;
  }
  .codeflask.codeflask .token.selector {
    color: #8500ff;
  }
  .codeflask.codeflask .token.property {
    color: #8500ff;
  }
  .codeflask.codeflask .token.tag {
    color: #8500ff;
  }
  .codeflask.codeflask .token.attr-value {
    color: #8500ff;
  }
`
