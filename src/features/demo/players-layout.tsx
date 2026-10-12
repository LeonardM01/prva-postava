import { Outlet } from '@tanstack/react-router'

import { useDemoLanguage } from './use-demo-language'

export function PlayersLayout() {
  const { strings } = useDemoLanguage()

  return (
    <>
      <h1>{strings.entry.title}</h1>
      <Outlet />
    </>
  )
}
