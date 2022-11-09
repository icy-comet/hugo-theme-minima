const comment = '{{ .Site.Params.comment.provider }}'
const icon_light = '{{ index .Site.Params.switch 1 }}'
const icon_dark = '{{ index .Site.Params.switch 0 }}'
const THEME_LIGHT = 'light'
const THEME_DARK = 'dark'

/** @type {HTMLElement} */
let toggler
/** @type {HTMLIFrameElement} */
let utterances
/** @type {HTMLIFrameElement} */
let giscus

/** @param {string} id */
export function setup_theme_switch(id) {
    if (!toggler) {
        toggler = document.getElementById(id)
    }
    toggler.innerHTML = localStorage.theme === THEME_LIGHT ? icon_light : icon_dark
    toggler.addEventListener('click', switch_theme);
}

function switch_theme() {
    const current = localStorage.getItem('theme')
    const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT

    switch_minima_theme(current, next)

    switch (comment) {
    case 'utterances': 
        switch_utterances_theme(`github-${next}`)
        break
    case 'giscus':
        switch_giscus_theme(next)
        break
    default:
    }
}

/**
 * @param {string} current  
 * @param {string} next 
 */
function switch_minima_theme(current, next) {
    const { classList } = document.documentElement
    const icon = next === THEME_LIGHT ? icon_light : icon_dark;

    classList.remove(current);
    classList.add(next);
    localStorage.setItem('theme', next);
    toggler.innerHTML = icon;
}

/** @param {string} theme  */
function switch_utterances_theme(theme) {
    if (!utterances) {
        utterances = document.querySelector('iframe.utterances-frame')
    }
    utterances.contentWindow.postMessage({ type: 'set-theme', theme }, 'https://utteranc.es')
}

/** @param {string} theme */
function switch_giscus_theme(theme) {
    if (!giscus) {
        giscus = document.querySelector('iframe.giscus-frame')
    }
    giscus.contentWindow.postMessage({giscus: {setConfig: {theme}}}, 'https://giscus.app')
}
