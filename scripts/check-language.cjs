const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');

function load(file, dependencies = {}, globals = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: (name) => dependencies[name] || require(name), ...globals,
  }, { filename: file });
  return module.exports;
}

const dictionary = load('src/lib/translations.ts');
function keys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, entry]) =>
    typeof entry === 'string' ? [`${prefix}${key}`] : keys(entry, `${prefix}${key}.`));
}
assert.deepEqual(keys(dictionary.translations.en), keys(dictionary.translations.id));
const storage = new Map();
const document = { cookie: '', documentElement: { lang: 'en' } };
const language = load('src/context/LanguageContext.tsx', {
  '@/lib/translations': dictionary,
  react: { ...React, useEffect: (effect) => effect(), useSyncExternalStore: (_, snapshot) => snapshot() },
}, {
  document, window: new EventTarget(), Event,
  localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
});
const current = () => language.LanguageProvider({ children: null }).props.value;
assert.equal(current().lang, 'en');
current().toggleLang();
assert.equal(current().lang, 'id');
assert.equal(current().t('nav.work'), 'Proyek');
assert.equal(document.documentElement.lang, 'id');
assert.equal(storage.get('portfolio_lang'), 'id');
assert.match(document.cookie, /portfolio_lang=id/);
current().toggleLang();
assert.equal(current().lang, 'en');
assert.equal(current().t('nav.work'), 'Work');
console.log('Language checks passed: dictionary keys, EN/ID switching, persistence, and HTML language.');
