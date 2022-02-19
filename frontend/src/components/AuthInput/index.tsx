import { useField } from 'formik'
import React, { useState } from 'react'
import clsx from 'clsx'

const AuthInput: React.FC<any> = ({ label, desc, ...props }) => {
  const [field, meta] = useField(props)
  const [didFocus, setDidFocus] = useState(false)
  const handleFocus = () => setDidFocus(true)

  const showFeedback =
    (!!didFocus && field.value.trim().length > 2) || meta.touched

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <label className="capitalize font-bold text-md" htmlFor={props.id}>
          {label}
        </label>
        {showFeedback ? (
          <div
            id={`${props.id}-feedback`}
            aria-live="polite"
            className={clsx(
              'text-sm',
              { 'text-red-500': meta.error },
              { 'text-green-500': !meta.error },
            )}
          >
            {meta.error ? meta.error : '✓'}
          </div>
        ) : null}
      </div>

      <input
        className={clsx(
          'w-full flex-grow px-6 py-3',
          'text-gray-700 placeholder-gray-500',
          'border-2 bg-white outline-none',
          'rounded-lg transition-all duration-200 ease-in-out',
          'focus:border-gray-500 focus:placeholder-transparent',
          'hover:border-gray-400',
          {
            'border-red-500': showFeedback && meta.error,
          },
        )}
        {...props}
        {...field}
        aria-describedby={`${props.id}-feedback ${props.id}-help`}
        onFocus={handleFocus}
      />

      <div className="text-sm text-gray-400">{desc}</div>
    </div>
  )
}

export default AuthInput
