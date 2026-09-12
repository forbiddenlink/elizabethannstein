import { baseUrl } from '@arcjet/env'
import arcjetNextPackage from '@arcjet/next/package.json'
import { createClient, resolveClientTimeout } from '@arcjet/protocol/client.js'
import { createConnectTransport } from '@connectrpc/connect-web'

// Same client @arcjet/next builds by default (createRemoteClient), but over
// fetch instead of its node:http2 transport. A GOAWAY on that transport's idle
// http2 session is thrown as an uncaughtException that kills the function
// (Sentry ELIZABETHANNSTEIN-2). This is the transport @arcjet/transport already
// uses on edge runtimes, so the wire format is unchanged.
const url = baseUrl(process.env)

export const arcjetClient = createClient({
  transport: createConnectTransport({
    baseUrl: url,
    fetch: (input, init) => fetch(input, { ...init, redirect: 'follow' }),
  }),
  baseUrl: url,
  timeout: resolveClientTimeout(),
  sdkStack: 'NEXTJS',
  sdkVersion: arcjetNextPackage.version,
})
