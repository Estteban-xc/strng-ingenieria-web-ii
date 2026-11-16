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

    const original = value.trim()

    // No modificar enlaces externos ni datos incrustados.
    if (/^(https?:|data:|mailto:|tel:|javascript: )/i.test(original)) {
      return original
    }

    // Corregir rutas de imágenes, iconos, sonidos y videos.
    const assetsMatch = original.match(
      /^(?:\.\.\/|\.\/)?\/?assets\/(.+)$/i
    )

    if (assetsMatch) {
      return `${BASE_PATH}assets/${assetsMatch[1]}`
    }

    // Normalizar la ruta para analizar enlaces internos.
    const normalized = original
      .replace(/^(\.\.\/|\.\/)+/, '')
      .replace(/^\/+/, '')

    // Enlace a Inicio.
    if (
      normalized === '' ||
      normalized === '/' ||
      normalized === 'index.html'
    ) {
      return `${BASE_PATH}#/`
    }

    // Enlaces internos terminados en .html.
    const htmlRouteMatch = normalized.match(
      /(?:^|\/)(rutinas|alimentacion|suplementacion|implementos|IMC|contacto|tienda|rastreo|admin)\.html(?:\?(.*))?$/i
    )

    if (htmlRouteMatch) {
      const routeKey = htmlRouteMatch[1].toLowerCase()
      const route = ROUTES[routeKey] || routeKey
      const query = htmlRouteMatch[2]
        ? `?${htmlRouteMatch[2]}`
        : ''

      return `${BASE_PATH}#/${route}${query}`
    }

    // Enlaces internos sin extensión .html.
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

    return original
  }

  // Corrige las rutas escritas directamente en atributos HTML.
  doc
    .querySelectorAll('[src], [poster], [href]')
    .forEach(node => {
      for (const attribute of ['src', 'poster', 'href']) {
        if (node.hasAttribute(attribute)) {
          const value = node.getAttribute(attribute)
          node.setAttribute(attribute, rewrite(value))
        }
      }
    })

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
        !href.includes('fonts.googleapis.com') &&
        !href.includes('fonts.gstatic.com')
    )
    .map(rewrite)

  // Los estilos y scripts se cargan manualmente desde React.
  doc
    .querySelectorAll('link[rel="stylesheet"], link[rel="icon"], style')
    .forEach(node => node.remove())

  doc.querySelectorAll('script').forEach(node => node.remove())

  return {
    body: doc.body.innerHTML,
    scripts,
    styles,
    externalStyles
  }
}

function rewriteScriptText(text) {
  if (!text) return text

  return text
    // Rutas como '../assets/images/whey.jpg'
    .replace(
      /(['"`])\.\.\/assets\//g,
      `$1${BASE_PATH}assets/`
    )
    // Rutas como './assets/images/archivo.png'
    .replace(
      /(['"`])\.\/assets\//g,
      `$1${BASE_PATH}assets/`
    )
    // Rutas como 'assets/images/archivo.png'
    .replace(
      /(['"`])assets\//g,
      `$1${BASE_PATH}assets/`
    )
}

export default function LegacyPage({ source, title }) {
  const root = useRef(null)
  const prepared = useMemo(
    () => prepareMarkup(source),
    [source]
  )

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
      // Cargar estilos incluidos dentro de las páginas heredadas.
      prepared.styles.forEach(text => {
        const style = document.createElement('style')
        style.textContent = text
        document.head.appendChild(style)
        addedStyles.push(style)
      })

      // Cargar hojas de estilo externas, si existen.
      prepared.externalStyles.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
        addedStyles.push(link)
      })

      // Ejecutar los scripts originales de cada página.
      for (const { src, text } of prepared.scripts) {
        if (!mounted) return

        const script = document.createElement('script')

        if (src) {
          let scriptSrc

          if (src.includes('js/script.js')) {
            scriptSrc = `${BASE_PATH}legacy-script.js`
          } else {
            scriptSrc = src
          }

          script.src = scriptSrc

          await new Promise(resolve => {
            script.onload = resolve
            script.onerror = resolve
            document.body.appendChild(script)
          })
        } else {
          // Aquí se corrigen las imágenes definidas dentro
          // del JavaScript de la tienda.
          script.textContent = rewriteScriptText(text)
          document.body.appendChild(script)
        }

        addedScripts.push(script)
      }

      // Las páginas originales utilizan DOMContentLoaded
      // para iniciar algunas funcionalidades.
      if (mounted) {
        document.dispatchEvent(
          new Event('DOMContentLoaded')
        )
      }
    }

    loadScripts()

    return () => {
      mounted = false

      addedScripts.forEach(script => {
        script.remove()
      })

      addedStyles.forEach(style => {
        style.remove()
      })
    }
  }, [title, prepared])

  return (
    <div
      ref={root}
      dangerouslySetInnerHTML={{
        __html: prepared.body
      }}
    />
  )
}
