import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { put } from "@vercel/blob"

import { authOptions } from "@/lib/auth"

/**
 * /api/upload/avatar — image upload for the /settings editor.
 *
 * Accepts a single image file under the `file` field of a multipart
 * form. Stores it on Vercel Blob (public access — avatars are public
 * data) and returns `{ url }` so the client can immediately PATCH the
 * profile with the new `photo_url`.
 *
 * Constraints:
 *   - Only image/* content types
 *   - Max 4 MB (Vercel server functions cap body size; pick something
 *     comfortably under that and leave headroom for the multipart frame)
 *   - Signed-in non-guest users only
 *
 * Failure modes:
 *   - 401 unauthenticated
 *   - 403 guest
 *   - 400 missing/oversize/wrong-type file
 *   - 503 if BLOB_READ_WRITE_TOKEN env var isn't set on this deploy
 */

const MAX_BYTES = 4 * 1024 * 1024
const ALLOWED_PREFIX = "image/"

function safeFilename(name: string, fallback: string): string {
  const trimmed = (name || "").trim()
  // Strip any path component the browser may have included on Windows.
  const base = trimmed.split(/[\\/]/).pop() ?? ""
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100)
  return safe || fallback
}

function emailToPathSegment(email: string): string {
  return email.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    return NextResponse.json(
      { error: "Sign in required." },
      { status: 401 },
    )
  }
  if (email.endsWith("@guest.sof.ai")) {
    return NextResponse.json(
      {
        error:
          "Guest identities can't upload photos. Sign in with a real email first.",
      },
      { status: 403 },
    )
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Photo uploads aren't configured on this deploy. Ask Freedom to set BLOB_READ_WRITE_TOKEN.",
      },
      { status: 503 },
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { error: "Body must be multipart/form-data." },
      { status: 400 },
    )
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing `file` field." },
      { status: 400 },
    )
  }
  if (file.size === 0) {
    return NextResponse.json(
      { error: "File is empty." },
      { status: 400 },
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File too large. Max ${Math.floor(MAX_BYTES / 1024 / 1024)}MB.`,
      },
      { status: 400 },
    )
  }
  if (!file.type.startsWith(ALLOWED_PREFIX)) {
    return NextResponse.json(
      { error: "Only image files are accepted." },
      { status: 400 },
    )
  }

  // Path namespaces uploads by email so multiple uploads from the same
  // user are easy to discover/clean later. addRandomSuffix lets the
  // user re-upload without us hand-rolling cache-busting.
  const filename = safeFilename(file.name, "avatar.png")
  const key = `avatars/${emailToPathSegment(email)}/${filename}`

  try {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    })
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    return NextResponse.json(
      {
        error: `Upload failed: ${
          err instanceof Error ? err.message : "Unknown blob error"
        }`,
      },
      { status: 502 },
    )
  }
}
