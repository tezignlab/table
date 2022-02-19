export const isiOS = () => {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}
