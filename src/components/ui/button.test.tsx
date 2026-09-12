import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('renders its label and is enabled by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })

  it('can be disabled', () => {
    render(<Button disabled>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
