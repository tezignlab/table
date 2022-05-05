import clsx from 'clsx'
import { useField } from 'formik'
import React from 'react'

const Input: React.FC<any> = (props) => {
  const { id, name, icon, hasError, placeholder, type, label, desc, disabled, ...config } = props
  return (
    <div className="w-full relative flex flex-col justify-center">
      {!!label && <div className="text-lg font-bold py-1">{label}</div>}

      <input
        id={id}
        name={name}
        className={clsx(
          'w-full flex-grow pr-6 py-2',
          {
            'pl-12': !!icon,
            'pl-6': !icon,
          },
          'text-gray-500 placeholder-gray-500 text-md',
          'border-2 bg-gray-100 outline-none',
          'rounded-lg transition-all duration-200 ease-in-out',
          'focus:border-gray-500 focus:placeholder-transparent focus:bg-white',
          { 'hover:border-gray-400 hover:bg-white': !disabled },
          { 'border-gray-100': !hasError, 'border-red-500': hasError },
          { 'cursor-not-allowed': disabled },
        )}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...config}
      />

      {!!desc && <div className="text-gray-500 mt-1">{desc}</div>}

      <div className="absolute h-6 w-6 top-2 ml-3 text-gray-300">{icon}</div>
    </div>
  )
}

export const FormikInput: React.FC<any> = ({ placeholder, icon, ...props }) => {
  const [field, meta] = useField(props)
  return <Input hasError={meta.touched && !!meta.error} placeholder={placeholder} icon={icon} {...field} {...props} />
}

export default Input
