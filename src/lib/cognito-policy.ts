export function usesCognitoPolicy(pathname: string) {
  return /^\/(?:wmcc-weekend-school|wmcc-sunday-arabic-school|wmcc-quran-program)\/?$/.test(pathname)
    || pathname.startsWith("/events/");
}
