export const sagaErrorStatusHandler: (error: any) => string = (error) => {
  const { response, data } = error

  if (!!data && !!data.code) {
    return sagaErrorCodeHandler(data.code)
  }

  if (!!response && [401, 403, 404, 422, 500].includes(response.status)) {
    return 'error.status.' + response.status
  }

  return 'error.status.other'
}

export const sagaErrorCodeHandler: (code: string) => string = (code) => {
  return `error.code.${code}`
}
