import { Routes, Route, Navigate } from 'react-router-dom'
import LegacyPage from './LegacyPage.jsx'
import home from './legacy/Home.html?raw'
import rutinas from './legacy/rutinas.html?raw'
import alimentacion from './legacy/alimentacion.html?raw'
import suplementacion from './legacy/suplementacion.html?raw'
import implementos from './legacy/implementos.html?raw'
import imc from './legacy/IMC.html?raw'
import contacto from './legacy/contacto.html?raw'
import tienda from './legacy/tienda.html?raw'
import rastreo from './legacy/rastreo.html?raw'
import admin from './legacy/admin.html?raw'

const pages = { home: ['STRNG | Entrenamiento y Salud', home], rutinas: ['STRNG | Rutinas de Entrenamiento', rutinas], alimentacion: ['STRNG | Alimentación', alimentacion], suplementacion: ['STRNG | Suplementación', suplementacion], implementos: ['STRNG | Implementos', implementos], imc: ['STRNG | Calculadora IMC', imc], contacto: ['STRNG | Contacto', contacto], tienda: ['STRNG | Tienda de Suplementos', tienda], rastreo: ['STRNG | Rastrear Pedido', rastreo], admin: ['STRNG | Administración', admin] }
function Original({ page }) { const [title, source] = pages[page]; return <LegacyPage title={title} source={source} /> }

export default function App() {
  return <Routes>
    <Route path="/" element={<Original page="home" />} />
    <Route path="/rutinas" element={<Original page="rutinas" />} />
    <Route path="/alimentacion" element={<Original page="alimentacion" />} />
    <Route path="/suplementacion" element={<Original page="suplementacion" />} />
    <Route path="/implementos" element={<Original page="implementos" />} />
    <Route path="/imc" element={<Original page="imc" />} />
    <Route path="/contacto" element={<Original page="contacto" />} />
    <Route path="/tienda" element={<Original page="tienda" />} />
    <Route path="/rastreo" element={<Original page="rastreo" />} />
    <Route path="/admin" element={<Original page="admin" />} />
    <Route path="/login" element={<Navigate to="/admin" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
