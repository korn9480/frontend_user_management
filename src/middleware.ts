import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

// page ที่ต้อง login ถึงจะเข้าได้
const PROTECTED_PATHS = ["users"]

export async function middleware(request: NextRequest) {
  const token = await getToken({req: request})
  if (!token) {
    const pathname = request.nextUrl.pathname.split("/")[1]
    // ถ้าไม่มีได้ login เเละ พยายามเข้าหน้าที่ต้อง loginก่อน ให้ไปหน้า login
    if (PROTECTED_PATHS.includes(pathname)) {
      return NextResponse.redirect(`${request.nextUrl.origin}/login`)
    }
  }
  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}