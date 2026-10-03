import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'

const loadDependency = createRequire(import.meta.url)

let expanded = true, scroll, effect, refIndex = 0, observerCallback, disconnected = false
const refs = []
const header = { dataset: {} }
const home = {}
const windowMock = { innerWidth: 390, addEventListener() {}, removeEventListener() {} }
const motion = new Proxy({}, { get: (_, name) => name })
const react = {
  useState: () => [expanded, value => { expanded = value }],
  useSyncExternalStore: (_, snapshot) => snapshot(),
  useRef: value => refs[refIndex++] ||= { current: value },
  useId: () => 'navigation-menu',
  useEffect: callback => { effect = callback },
}
const moduleMock = { exports: {} }
const code = ts.transpileModule(fs.readFileSync('src/components/ui/navigation-menu.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText
vm.runInNewContext(code, {
  module: moduleMock, exports: moduleMock.exports, window: windowMock,
  document: { getElementById: () => home, activeElement: null },
  IntersectionObserver: class {
    constructor(callback) { observerCallback = callback }
    observe(target) { assert.equal(target, home) }
    disconnect() { disconnected = true }
  },
  require(name) {
    if (name === 'react') return react
    if (name === 'next/link') return 'a'
    if (name === 'framer-motion') return { motion, useScroll: () => ({ scrollY: {} }), useMotionValueEvent: (_, __, callback) => { scroll = callback }, useReducedMotion: () => false }
    if (name === '@/context/LanguageContext') return { useLanguage: () => ({ lang: 'en', t: key => key, toggleLang() {} }) }
    if (name === '@/lib/utils') return { cn: (...values) => values.filter(Boolean).join(' ') }
    return loadDependency(name)
  },
})
function render() {
  refIndex = 0
  return moduleMock.exports.AnimatedNavFramer({})
}
let element = render()
refs[0].current = header
const cleanup = effect()
observerCallback([{ isIntersecting: false }]); assert.equal(header.dataset.dimmed, 'true')
observerCallback([{ isIntersecting: true }]); assert.equal(header.dataset.dimmed, 'false')
assert.equal(element.props.children.props.variants.expanded.width, 358)
scroll(160); assert.equal(expanded, false)
render(); scroll(700); scroll(650); assert.equal(expanded, false)
scroll(619); assert.equal(expanded, true)
element = render()
const nav = element.props.children
const [toggle, menu] = nav.props.children
const [links, language] = menu.props.children
assert.equal(toggle.props['aria-expanded'], true)
assert.equal(language.props.children.props.children, 'EN')
assert.equal(menu.props.inert, false)
assert.deepEqual(Array.from(links, node => node.props.children.props.href), ['/#projects', '/#experience', '/#stack', '/#contact', '/blog'])
toggle.props.onClick(); assert.equal(expanded, false)
element = render()
assert.equal(element.props.children.props.children[1].props.inert, true)
assert.equal(element.props.children.props.variants.collapsed.width, 56)
assert.equal(element.props.children.props.variants.collapsed.width, element.props.children.props.style.height)
element.props.children.props.children[0].props.onClick(); assert.equal(expanded, true)
cleanup(); assert.equal(disconnected, true)
console.log('Navigation checks passed: scroll direction, click toggle, mobile width, links, language button, hidden-link accessibility, and Home opacity.')
