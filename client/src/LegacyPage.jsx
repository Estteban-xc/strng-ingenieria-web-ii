import { useEffect, useMemo, useRef } from 'react'

const BASE_PATH = '/strng-ingenieria-web-ii/'

function prepareMarkup(source) {
  const doc = new DOMParser().parseFromString(source, 'text/html')

  const rewrite = value => {
    if (!value) return value

    if (/^(https?:|data:|#|mailto:|tel:|javascript: )/i.test(value)) {
      return value
    }

    return value
      .replace(/^\.\.\/assets\//, `${BASE_PATH}assets/`)
      .replace(/^assets\//, `${BASE_PATH}assets/`)
      .replace(/^\/assets\//, `${BASE_PATH}assets/`)
      .replace(/^\.\.\/index\.html$/, `${BASE_PATH}#/`)
      .replace(/^index\.html$/, `${BASE_PATH}#/`)
      .replace(/^\.\.\/pages\//, `${BASE_PATH}#/`)
      .replace(/^pages\//, `${BASE_PATH}#/`)
      .replace(/(^|\/)rutinas\.html/g, '$1#/rutinas')
      .replace(/(^|\/)alimentacion\.html/g, '$1#/alimentacion')
      .replace(/(^|\/)suplementacion\.html/g, '$1#/suplementacion')
      .replace(/(^|\/)implementos\.html/g, '$1#/implementos')
      .replace(/(^|\/)IMC\.html/g, '$1#/imc')
      .replace(/(^|\/)contacto\.html/g, '$1#/contacto')
      .replace(/(^|\/)tienda\.html/g, '$1#/tienda')
      .replace(/(^|\/)rastreo\.html/g, '$1#/rastreo')
      .replace(/(^|\/)admin\.html/g, '$1#/admin')
      .replace(
        /^\/(rutinas|alimentacion|suplementacion|implementos|imc|contacto|tienda|rastreo|admin)$/,
        `${BASE_PATH}#$1`
      )
      .replace(/^\/$/, `${BASE_PATH}#/`)
  }

  const scripts = [...doc.querySelectorAll('script')].map(node => ({
    src: node.getAttribute('src'),
    text: node.textContent
  }))

  const styles = [...doc.querySelectorAll('style')].map(
    node => node.textContent
  )

  const externalStyles = [...doc.querySelectorAll('link[rel="stylesheet"]')]
    .map(node => node.getAttribute('href'))
    .filter(
      href =>
        href &&
        /^(https?:|\/|\.?\.?\/ )/i.test(href) &&
        !href.includes('fonts.googleapis.com')
    )
    .map(rewrite)

  doc
    .querySelectorAll('link[rel="stylesheet"], link[rel="icon"], style')
    .forEach(node => node.remove())

  doc.querySelectorAll('script').forEach(node => node.remove())

  doc.querySelectorAll('[src], [poster], [href]').forEach(node => {
    for (const attr of ['src', 'poster', 'href']) {
      if (node.hasAttribute(attr)) {
        node.setAttribute(attr, rewrite(node.getAttribute(attr)))
      }
    }
  })

  return {
    body: doc.body.innerHTML,
    scripts,
    styles,
    externalStyles
  }
}

export default function LegacyPage({ source, title }) {
  const root = useRef(null)
  const prepared = useMemo(() => prepareMarkup(source), [source])

  useEffect(() => {
    document.title = title

    const container = root.current

    if (!container) {
      return undefined
    }

    const addedScripts = []
    const addedStyles = []
    let mounted = true

    const loadScripts = async () => {
      prepared.styles.forEach(text => {
        const style = document.createElement('style')
        style.textContent = text
        document.head.appendChild(style)
        addedStyles.push(style)
      })

      prepared.externalStyles.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
        addedStyles.push(link)
      })

      for (const { src, text } of prepared.scripts) {
        if (!mounted) return

        const script = document.createElement('script')

        if (src) {
          const rewrittenSrc = src.includes('js/script.js')
            ? `${BASE_PATH}legacy-script.js`
            : src.startsWith('/')
              ? `${BASE_PATH}${src.slice(1)}`
              : src

          script.src = rewrittenSrc

          await new Promise(resolve => {
            script.onload = resolve
            script.onerror = resolve
            document.body.appendChild(script)
          })
        } else {
          script.textContent = text
          document.body.appendChild(script)
        }

        addedScripts.push(script)
      }

      if (mounted) {
        document.dispatchEvent(new Event('DOMContentLoaded'))
      }
    }

    loadScripts()

    return () => {
      mounted = false
      addedScripts.forEach(script => script.remove())
      addedStyles.forEach(style => style.remove())
    }
  }, [title, prepared])

  return (
    <div
      ref={root}
      dangerouslySetInnerHTML={{ __html: prepared.body }}
    />
  )
}
