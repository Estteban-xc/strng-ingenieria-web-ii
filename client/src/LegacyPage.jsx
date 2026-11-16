import { useEffect, useMemo, useRef } from 'react'

const BASE_PATH = '/strng-ingenieria-web-ii/'

const ROUTES = {
  rutinas: 'rutinas',
  alimentacion: 'alimentacion',
  suplementacion: 'suplementacion',
  implementos: 'implementos',
  imc: 'imc',
  contacto: 'contacto',
  tienda: 'tienda',
  rastreo: 'rastreo',
  admin: 'admin'
}

function prepareMarkup(source) {
  const doc = new DOMParser().parseFromString(source, 'text/html')

  const rewrite = value => {
    if (!value) return value

    if (/^(https?:|data:|mailto:|tel:|javascript: )/i.test(value)) {
      return value
    }

    const original = value.trim()

    // Recursos públicos: imágenes, iconos, fuentes, sonidos y videos.
    const assetsMatch = original.match(
      /^(?:\.\.\/|\.\/)?(?:\/)?assets\/(.+)$/i
    )

    if (assetsMatch) {
      return `${BASE_PATH}assets/${assetsMatch[1]}`
    }

    // Enlace a la página de inicio.
    const normalized = original
      .replace(/^(\.\.\/|\.\/)+/, '')
      .replace(/^\/+/, '')

    if (
      normalized === 'index.html' ||
      normalized === '' ||
      normalized === '/'
    ) {
      return `${BASE_PATH}#/`
    }

    // Enlaces internos de las páginas de STRNG.
    const routeMatch = normalized.match(
      /(?:^|\/)(rutinas|alimentacion|suplementacion|implementos|IMC|contacto|tienda|rastreo|admin)\.html(?:\?(.*))?$/i
    )

    if (routeMatch) {
      const routeName = routeMatch[1].toLowerCase()
      const route = ROUTES[routeName] || routeName
      const query = routeMatch[2] ? `?${routeMatch[2]}` : ''

      return `${BASE_PATH}#/${route}${query}`
    }

    // Enlaces internos que ya vienen sin extensión .html.
    const directRouteMatch = normalized.match(
      /^(rutinas|alimentacion|suplementacion|implementos|imc|contacto|tienda|rastreo|admin)(?:\?(.*))?$/i
    )

    if (directRouteMatch) {
      const route = directRouteMatch[1].toLowerCase()
      const query = directRouteMatch[2]
        ? `?${directRouteMatch[2]}`
        : ''

      return `${BASE_PATH}#/${route}${query}`
    }

    return value
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
          const scriptSrc = src.includes('js/script.js')
            ? `${BASE_PATH}legacy-script.js`
            : src.startsWith('/')
              ? `${BASE_PATH}${src.slice(1)}`
              : src

          script.src = scriptSrc

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
