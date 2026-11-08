const COOKIE_NAME = "pixel3d_admin"
const SESSION_DAYS = 7

const getSecret = (): string => {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error("AUTH_SECRET or ADMIN_PASSWORD is not set")
  }
  return secret
}

export const getAdminEmails = (): string[] => {
  const raw = process.env.ADMIN_EMAILS ?? ""
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export const isAdminEmail = (email: string): boolean => {
  return getAdminEmails().includes(email.trim().toLowerCase())
}

const toBase64Url = (bytes: ArrayBuffer | Uint8Array): string => {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let binary = ""
  for (const byte of array) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const getKey = async (secret: string): Promise<CryptoKey> => {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

const signPayload = async (payload: string, secret: string): Promise<string> => {
  const key = await getKey(secret)
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  )
  return toBase64Url(signature)
}

export const createAdminSession = async (email: string): Promise<string> => {
  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        email: email.toLowerCase(),
        exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
      })
    )
  )
  const signature = await signPayload(payload, getSecret())
  return `${payload}.${signature}`
}

export const verifyAdminSession = async (
  token: string | undefined
): Promise<{ email: string } | null> => {
  if (!token) return null

  const secret = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) return null

  const parts = token.split(".")
  if (parts.length !== 2) return null

  const [payload, signature] = parts

  try {
    const key = await getKey(secret)
    const signatureBytes = Uint8Array.from(fromBase64Url(signature))
    const payloadBytes = new TextEncoder().encode(payload)
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      payloadBytes
    )
    if (!valid) return null

    const decoded = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload))
    ) as { email?: string; exp?: number }

    if (!decoded.email || !decoded.exp || decoded.exp < Date.now()) {
      return null
    }

    if (!isAdminEmail(decoded.email)) return null
    return { email: decoded.email }
  } catch {
    return null
  }
}

export const getAdminCookieName = (): string => COOKIE_NAME

export const getAdminCookieMaxAge = (): number => SESSION_DAYS * 24 * 60 * 60

export const validateAdminLogin = (
  email: string,
  password: string
): string | null => {
  const allowed = getAdminEmails()
  if (allowed.length === 0) {
    return "ADMIN_EMAILS no está configurado"
  }

  if (!isAdminEmail(email)) {
    return "Este correo no tiene acceso de administrador"
  }

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return "ADMIN_PASSWORD no está configurado"
  }

  if (password !== expected) {
    return "Contraseña incorrecta"
  }

  return null
}
