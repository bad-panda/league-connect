import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { authenticate } from '../authenticate.ts'
import { request } from '../http.ts'
import { connect } from '../connection.ts'

Deno.test("fetching the credentials from the lockfile", async () => {
  const credentials = await authenticate()

  assert(credentials !== undefined)
})

Deno.test("sending a basic request to the help endpoint", async () => {
  const res = await request({
    method: 'POST',
    url: 'Help'
  })
  await res.text()

  assert(res instanceof Response)
})

Deno.test("a path may have as many slashes in front as it wishes", async () => {
  const res = await request({
    method: 'POST',
    url: '/////////Help'
  })
  await res.text()

  assert(res instanceof Response)
})

Deno.test({
  name: "connecting to the websocket",
  fn: async () => {
    const ws = await connect()

    assert(ws !== undefined)

    await ws.socket.close()
  },
  sanitizeOps: false
})

Deno.test({
  name: "subscribing to a websocket",
  fn: async () => {
    const ws = await connect()

    ws.subscribe('/lol-chat/v1/conversations/active', () => 0)

    assertEquals(1, ws.getListeners()['/lol-chat/v1/conversations/active'].length)

    ws.socket.close()
  },
  sanitizeOps: false
})

Deno.test({
  name: "a subscription url may have as many prefix slashes as it wants",
  fn: async () => {
    const ws = await connect()

    ws.subscribe('/////////////lol-chat/v1/conversations/active', () => 0)

    assertEquals(1, ws.getListeners()['/lol-chat/v1/conversations/active'].length)

    ws.socket.close()
  },
  sanitizeOps: false
})
