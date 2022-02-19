import React from 'react'

export const Collect: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

export const Like: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
)

export const Loading: React.FC<{ color?: string }> = ({ color }) => (
  <div className="w-full h-full flex justify-center">
    <svg
      className="animate-spin h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color ?? 'currentColor'}
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill={color ?? 'currentColor'}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
)

export const Close: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

export const Check: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

export const Plus: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
)

export const FolderPlus: React.FC<{ bgClassName: string }> = ({
  bgClassName,
}) => (
  <svg
    className="h-full w-full"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 5.33333C2 4.71449 2.21071 4.121 2.58579 3.68342C2.96086 3.24583 3.46957 3 4 3H9L11 5.33333H16C16.5304 5.33333 17.0391 5.57917 17.4142 6.01675C17.7893 6.45434 18 7.04783 18 7.66667V14.6667C18 15.2855 17.7893 15.879 17.4142 16.3166C17.0391 16.7542 16.5304 17 16 17H4C3.46957 17 2.96086 16.7542 2.58579 16.3166C2.21071 15.879 2 15.2855 2 14.6667V5.33333Z"
      fill="currentColor"
    />
    <path d="M8 11H12H8ZM10 9V13Z" fill="currentColor" />
    <path
      className={bgClassName}
      d="M10 9V13M8 11H12H8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Search: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

export const Menu: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
)

export const Left: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
)

export const Right: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
)
export const Detail: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
      clipRule="evenodd"
    />
  </svg>
)
