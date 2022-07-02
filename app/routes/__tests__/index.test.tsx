import { loader } from '../'

describe('home route', () => {
  test('loader should remove output from entries', async () => {
    const res = await loader({
      request: new Request('https://silvenon.com/'),
      params: {},
      context: {},
    })
    const data = await res.json()
    expect(JSON.stringify(data)).not.toContain('output')
  })
})
