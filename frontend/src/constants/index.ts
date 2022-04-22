export const ACCESS_TOKEN_NAME = 'user-access-token'
export const VERIFICATION_CODE_TIME_NAME = 'verification-code-time'
export const STATIC_URL = 'https://ai.tezign.com/static/naodong'

export const ROUTES = [
  { name: 'index.trend', path: '/', visibleOnMobile: true },
  {
    name: 'index.recommend',
    path: '/project/recommend',
    visibleOnMobile: true,
  },
  { name: 'site.routes.app', path: '/download-app', visibleOnMobile: false },
]

export const USERNAME_MIN_LENGTH = 4
export const USERNAME_MAX_LENGTH = 16
export const PASSWORD_MIN_LENGTH = 6
export const PASSWORD_MAX_LENGTH = 16
export const COLLECTION_NAME_MAX_LENGTH = 64
export const COLLECTION_DESC_MAX_LENGTH = 160
export const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_]+$/i

export const SHOT_LIST_PAGE_SIZE = 30

export const CALENDAR_COLOR_MAP = ['#2563EB', 'gray']

export const APP_ICON_URL = 'https://ai.tezign.com/static/naodong/app-icon.png'
