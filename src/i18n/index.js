import { createI18n } from 'vue-i18n'
import pt from './pt.json'
import en from './en.json'
import es from './es.json'

export default createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || 'pt',
    fallbackLocale: 'en',
    messages: {
        pt,
        en,
        es
    }
})