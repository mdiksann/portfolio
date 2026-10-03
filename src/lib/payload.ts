import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

export async function getProfile() {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'profile',
    depth: 1,
  })
}

export async function getProjects() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    sort: 'order',
    limit: 20,
    depth: 1,
  })
  return result.docs
}

export async function getSkills() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'skills',
    sort: 'order',
    limit: 20,
  })
  return result.docs
}