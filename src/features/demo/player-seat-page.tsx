import { useDemoLanguage } from './use-demo-language'

export function PlayerSeatPage() {
  const { strings } = useDemoLanguage()

  return <h1>{strings.seat.title}</h1>
}
