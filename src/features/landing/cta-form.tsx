import { useForm, useSelector } from '@tanstack/react-form'
import { useId, useRef, useState } from 'react'

import { CtaSubmitButton } from './cta-submit-button'
import { joinLineup } from './join-lineup.functions'
import { type LineupSignup, signupEmailSchema } from './lineup-signup-schema'
import { useRole } from './role-context'
import { RoleSwitch } from './role-switch'
import { type LandingStrings } from './strings'
import { useLandingLanguage } from './use-landing-language'

function pickMessage(
  strings: LandingStrings,
  isEmailInvalid: boolean,
  hasSubmitFailed: boolean,
): null | string {
  if (isEmailInvalid) {
    return strings.cta.emailError
  }
  return hasSubmitFailed ? strings.cta.submitFailed : null
}

interface CtaFormProps {
  readonly onJoined: (signup: LineupSignup) => void
}

/**
 * The band's signup form. The email is checked only on submit; the side comes from the shared
 * role, so both switches on the page decide it.
 */
export function CtaForm({ onJoined }: CtaFormProps) {
  const { role } = useRole()
  const { strings } = useLandingLanguage()
  const [hasSubmitFailed, setHasSubmitFailed] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const emailId = useId()
  const messageId = useId()

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      setHasSubmitFailed(false)
      let signup: LineupSignup
      try {
        signup = await joinLineup({ data: { role, email: value.email } })
      } catch (error) {
        console.error('The lineup signup did not go through', error)
        setHasSubmitFailed(true)
        return
      }
      onJoined(signup)
    },
    onSubmitInvalid: () => {
      emailRef.current?.focus()
    },
  })
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <form
      noValidate
      className="flex flex-col gap-2.5 md:max-w-140 lg:max-w-none lg:flex-row lg:items-end lg:gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <RoleSwitch tone="band" />
      <form.Field name="email" validators={{ onSubmit: signupEmailSchema }}>
        {(field) => {
          const isInvalid = field.state.meta.errors.length > 0
          const message = pickMessage(strings, isInvalid, hasSubmitFailed)
          return (
            <div className="relative flex flex-col gap-1.5 lg:w-80">
              <label
                htmlFor={emailId}
                className="text-[13px] leading-[normal] font-medium text-card"
              >
                {strings.cta.emailLabel}
              </label>
              <input
                ref={emailRef}
                id={emailId}
                name={field.name}
                type="email"
                autoComplete="email"
                spellCheck={false}
                placeholder={strings.cta.emailPlaceholder}
                value={field.state.value}
                aria-invalid={isInvalid}
                aria-describedby={message === null ? undefined : messageId}
                className="h-11.5 w-full rounded-[10px] border border-card/28 bg-card/12 px-4 text-[15px] text-card caret-card placeholder:text-card focus-visible:outline-card aria-invalid:border-2 aria-invalid:border-band-error"
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value)
                }}
              />
              {message !== null && (
                // Below the row on wide screens, so the error does not push the controls around.
                <p
                  id={messageId}
                  role="alert"
                  className="flex items-center gap-1.5 text-[13px] leading-[normal] font-medium text-band-error lg:absolute lg:top-full lg:left-0 lg:mt-1.5 lg:whitespace-nowrap"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-band-error"
                  />
                  {message}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>
      <CtaSubmitButton isSubmitting={isSubmitting} />
    </form>
  )
}
