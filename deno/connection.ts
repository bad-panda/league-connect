import { authenticate } from './authenticate.ts'
import { Credentials } from '../shared/types.ts'
import { LeagueWebSocket } from './websocket.ts'

/**
 * Connect to the web socket
 *
 * @remarks
 * Connect to the League Client APIs websocket and wrap it into a
 * {LeagueWebSocket}
 *
 * @param credentials - The credentials to authenticate with
 *
 * @returns The websocket connection to the league client
 */
export async function connect(
  credentials: Credentials | undefined = undefined
): Promise<LeagueWebSocket> {
  const _credentials = credentials || await authenticate()
  const url = `wss://riot:${_credentials.token}@localhost:${_credentials.port}`

  const ws = new LeagueWebSocket(url)

  ws.on('open', () => {
    ws.socket.send(JSON.stringify([5, 'OnJsonApiEvent']))
  })

  return ws
}