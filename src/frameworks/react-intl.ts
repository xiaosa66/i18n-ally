import { Framework } from './base'
import { LanguageId } from '~/utils'

class ReactFramework extends Framework {
  id= 'react'
  display= 'React'

  detection= {
    packageJSON: [
      'react-intl',
    ],
  }

  languageIds: LanguageId[] = [
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact',
    'ejs',
  ]

  // for visualize the regex, you can use https://regexper.com/
  usageMatchRegex = [
    // Support id="xxx", id='xxx', id={`xxx`}, id={'xxx'}, id={"xxx"}
    // 1. id="xxx" or id='xxx' or id=`xxx`
    '[^\\w\\d](?:i18nKey=|FormattedMessage[ (]\\s*id=|t\\(\\s*)[\'"`]({key})[\'"`]',
    // 2. TSX/JSX attribute id={'xxx.xxx'} or id="xxx.xxx"
    'id\\s*=\\s*(?:\\{\\s*)?[\'"]([a-zA-Z0-9_.\\-]+)[\'"]\\s*\\}?',
    // useIntl() hooks, https://github.com/formatjs/react-intl/blob/master/docs/API.md#useintl-hook
    '[^\\w\\d](?:formatPlural|formatNumber|formatDate|formatTime|formatHTMLMessage|formatMessage|formatRelativeTime)\\(.*?[\'"`]?id[\'"`]?:\\s*[\'"`]({key})[\'"`]',
    '<Trans>({key})<\\/Trans>',
  ]

  refactorTemplates(keypath: string) {
    return [
      `{t('${keypath}')}`,
      `t('${keypath}')`,
      keypath,
    ]
  }
}

export default ReactFramework
