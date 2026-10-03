import assert from 'node:assert/strict'

// Run against a dev server: node scripts/check-blog.mjs http://localhost:3000 [draftId]
const base = new URL(process.argv[2] || 'http://localhost:3000')
const draftId = process.argv[3]

async function request(path) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(60_000) })
}

const [index, api] = await Promise.all([request('/blog'), request('/api/posts?limit=100')])
assert.equal(index.status, 200, 'Blog index must load')
assert.equal(api.status, 200, 'Published articles must be publicly readable')
const indexHTML = await index.text()
assert.match(indexHTML, /aria-current="page"[^>]*href="\/blog"/, 'Blog navigation must be active')
const { docs } = await api.json()
assert.ok(Array.isArray(docs), 'Posts API must return a list')

for (const post of docs) {
  assert.equal(post.status, 'published', 'Drafts must never appear in the public API')
  assert.ok(indexHTML.includes(`href="/blog/${post.id}"`), 'Published article must link to its stable ID')
  const detail = await request(`/blog/${post.id}`)
  assert.equal(detail.status, 200, 'Published article detail must load')
  const html = await detail.text()
  assert.match(html, /class="blog-prose/, 'Article body must render')
  assert.doesNotMatch(html, /unknown node/, 'Editor content must have a supported renderer')
  if (post.project?.id) {
    assert.ok(html.includes(`href="/work#project-${post.project.id}"`), 'Related project must be linked')
  }
}

for (const id of ['invalid', '0', '-1', '1.5', '9007199254740992', '9007199254740991', ...(draftId ? [draftId] : [])]) {
  const response = await request(`/blog/${id}`)
  assert.equal(response.status, 404, `Unavailable article ${id} must return 404`)
  assert.match(await response.text(), /Article not found/, '404 must help readers return to the blog')
}

if (draftId) {
  assert.ok(!docs.some(({ id }) => String(id) === draftId), 'Draft must be absent from the public list')
  const draft = await request(`/api/posts/${draftId}`)
  assert.equal(draft.status, 404, 'Draft must be inaccessible through the public API')
}

console.log(`Blog checks passed: ${docs.length} published articles, navigation, content, invalid IDs${draftId ? ', and draft privacy' : ''}.`)
