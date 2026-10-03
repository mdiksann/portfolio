/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from '../importMap.js'
import '@payloadcms/next/css'

export const metadata: Metadata = {
  title: 'Payload Admin',
}

type ServerFunctionArgs = Omit<Parameters<typeof handleServerFunctions>[0], 'config' | 'importMap'>

async function serverFunction(args: ServerFunctionArgs) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>
}
