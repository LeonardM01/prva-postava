// @vitest-environment node
// The module reads server-only environment variables, which t3env refuses to hand out when a
// `window` exists, so this file runs outside the browser environment the other tests use.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { addSignupToAudience } from './loops-audience'

const fetchMock = vi.fn<typeof fetch>()

function loopsAccepts() {
  return Promise.resolve(Response.json({ success: true }))
}

interface SentRequest {
  readonly body: unknown
  readonly method: string | undefined
  readonly url: string
}

function requestAt(index: number): SentRequest {
  const call = fetchMock.mock.calls[index]
  if (call === undefined) {
    throw new Error(
      `Loops was called ${String(fetchMock.mock.calls.length)} times, not ${String(index + 1)}`,
    )
  }
  const [url, init] = call
  if (typeof url !== 'string' || typeof init?.body !== 'string') {
    throw new TypeError('Loops was not called with a URL and a JSON body')
  }
  const body: unknown = JSON.parse(init.body)
  return { body, method: init.method, url }
}

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockImplementation(loopsAccepts)
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('a signup from the CTA band', () => {
  it('joins a player to the players list in the language they read', async () => {
    await addSignupToAudience({ email: 'luka@mail.hr', language: 'hr', role: 'player' })

    const contact = requestAt(0)
    expect(contact.url).toBe('https://app.loops.so/api/v1/contacts/update')
    expect(contact.method).toBe('PUT')
    expect(contact.body).toEqual({
      email: 'luka@mail.hr',
      language: 'hr',
      source: 'Landing signup',
      userGroup: 'player',
      mailingLists: { 'list-for-players': true },
    })
  })

  it('joins a club to the clubs list', async () => {
    await addSignupToAudience({ email: 'scout@nk.hr', language: 'en', role: 'club' })

    expect(requestAt(0).body).toEqual({
      email: 'scout@nk.hr',
      language: 'en',
      source: 'Landing signup',
      userGroup: 'club',
      mailingLists: { 'list-for-clubs': true },
    })
  })

  it('sends the event that triggers the welcome email', async () => {
    await addSignupToAudience({ email: 'luka@mail.hr', language: 'hr', role: 'player' })

    const event = requestAt(1)
    expect(event.url).toBe('https://app.loops.so/api/v1/events/send')
    expect(event.method).toBe('POST')
    expect(event.body).toEqual({
      email: 'luka@mail.hr',
      eventName: 'joined_lineup',
      eventProperties: { language: 'hr', role: 'player' },
    })
  })

  it('fails, and sends no welcome email, when Loops refuses the contact', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(Response.json({ success: false, message: 'Invalid list' }, { status: 400 })),
    )

    await expect(
      addSignupToAudience({ email: 'luka@mail.hr', language: 'hr', role: 'player' }),
    ).rejects.toThrow('Loops answered 400')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fails when Loops answers without confirming the write', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(Response.json({ success: false })))

    await expect(
      addSignupToAudience({ email: 'luka@mail.hr', language: 'hr', role: 'player' }),
    ).rejects.toThrow('did not confirm')
  })
})
