import { useEffect, useMemo, useRef } from 'react'

function prepareMarkup(source) {
  const doc = new DOMParser().parseFromString(source, 'text/html')
  const scripts = [...doc.querySelectorAll('script')].map(node => ({ src: node.getAttribute('src'), text: node.textContent }))
  const styles = [...doc.querySelectorAll('style')].map(node => node.textContent)
  const externalStyles = [...doc.querySelectorAll('link[rel="stylesheet"]')]
    .map(node => node.getAttribute('href'))
    .filter(href => href && /^(https?:|\/)/i.test(href) && !href.includes('fonts.googleapis.com'))
  doc.querySelectorAll('link[rel="stylesheet"], link[rel="icon"], style').forEach(node => node.remove())
  doc.querySelectorAll('script').forEach(node => node.remove())
  const rewrite = value => {
    if (!value) return value
    if (/^(https?:|data:|#|mailto:|tel:)/i.test(value)) return value
    return value
      .replace(/^\.\.\/assets\//, '/assets/')
      .replace(/^assets\//, '/assets/')
      .replace(/^\.\.\/index\.html$/, '/')
      .replace(/^index\.html$/, '/')
      .replace(/^\.\.\/pages\//, '/')
      .replace(/^pages\//, '/')
      .replace(/(^|\/)rutinas\.html/g, '$1rutinas')
      .replace(/(^|\/)alimentacion\.html/g, '$1alimentacion')
      .replace(/(^|\/)suplementacion\.html/g, '$1suplementacion')
      .replace(/(^|\/)implementos\.html/g, '$1implementos')
      .replace(/(^|\/)IMC\.html/g, '$1imc')
      .replace(/(^|\/)contacto\.html/g, '$1contacto')
      .replace(/(^|\/)tienda\.html/g, '$1tienda')
      .replace(/(^|\/)rastreo\.html/g, '$1rastreo')
      .replace(/(^|\/)admin\.html/g, '$1admin')
  }
  doc.querySelectorAll('[src], [poster], [href]').forEach(node => {
    for (const attr of ['src', 'poster', 'href']) {
      if (node.hasAttribute(attr)) node.setAttribute(attr, rewrite(node.getAttribute(attr)))
    }
  })
  return { body: doc.body.innerHTML, scripts, styles, externalStyles }
}

export default function LegacyPage({ source, title }) {
  const root = useRef(null)
  const prepared = useMemo(() => prepareMarkup(source), [source])
  useEffect(() => {
    document.title = title
    const container = root.current
    if (!container) return undefined
    const added = []
    const addedStyles = []
    let mounted = true
    const loadScripts = async () => {
      // Las páginas originales (Tienda, Rastreo y Admin) definen su layout
      // dentro de <head><style>. React solo renderiza el body, por lo que
      // reinstalamos esos estilos originales antes de ejecutar sus scripts.
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
          script.src = src.includes('js/script.js') ? '/legacy-script.js' : src
          await new Promise(resolve => { script.onload = resolve; script.onerror = resolve; document.body.appendChild(script) })
        } else {
          script.textContent = text
          document.body.appendChild(script)
        }
        added.push(script)
      }
      // Las plantillas originales inicializan su JS en DOMContentLoaded. Como
      // React las monta después de ese evento, lo reenviamos tras cargar scripts.
      if (mounted) document.dispatchEvent(new Event('DOMContentLoaded'))
    }
    loadScripts()
    return () => {
      mounted = false
      added.forEach(script => script.remove())
      addedStyles.forEach(style => style.remove())
    }
  }, [title, prepared])
  return <div ref={root} dangerouslySetInnerHTML={{ __html: prepared.body }} />
}
