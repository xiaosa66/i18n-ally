import * as bcp47 from 'bcp-47'
import { BaseTagSystem } from './base'
import { Config } from '~/core'

// https://tools.ietf.org/html/bcp47
export class BCP47 extends BaseTagSystem {
  normalize(locale?: string, fallback = 'en', strict = false) {
    if (!locale)
      return fallback

    // 先用 bcp47 解析
    const parsed = bcp47.parse(locale, { normalize: strict, forgiving: !strict })
    // 如果解析后有 region，或解析后 language+region 能还原原始 locale，则用 stringify
    if (parsed && parsed.language) {
      if (parsed.region)
        return bcp47.stringify(parsed)
      // 兼容 zh_CN、zh_TW、en_US 等下划线写法
      if (locale.match(/^[a-z]{2,3}[_-][A-Z]{2,4}$/)) {
        // 统一转为 BCP47 标准格式 zh-CN
        return locale.replace('_', '-')
      }
      // 兼容只有主语言的情况
      return parsed.language
    }
    // 解析失败，直接返回原 locale
    return locale || fallback
  }

  toBCP47(locale: string) {
    return bcp47.stringify(bcp47.parse(locale, { normalize: true, forgiving: false })) || undefined
  }

  toFlagname(locale: string) {
    const { region, language } = bcp47.parse(locale, { normalize: true, forgiving: true })
    if (!language)
      return ''
    return (region || Config.localeCountryMap[language] || language || '').toLowerCase()
  }

  lookup(locale: string) {
    locale = this.normalize(locale)
    // @ts-ignore
    const canonical = Intl.getCanonicalLocales(locale)[0]
    return Intl.Collator.supportedLocalesOf(canonical, { localeMatcher: 'lookup' })[0]
  }
}
