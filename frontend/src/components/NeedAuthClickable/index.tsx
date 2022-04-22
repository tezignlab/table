import { useRouter } from 'next/router'
import React from 'react'
import { AuthModelState } from '../../models/auth'

const NeedAuthClickable: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useSelector(({ auth }: { auth: AuthModelState }) => auth)
  const ref = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    ref.current?.addEventListener('click', (e) => {
      if (!auth.user) {
        e.stopPropagation()
        e.preventDefault()
        router.push('/auth/sign-in')
      }
    })
  }, [])

  return (
    <div ref={ref} className="cursor-pointer">
      {children}
    </div>
  )
}

export default NeedAuthClickable
