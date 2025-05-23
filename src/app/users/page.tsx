'use client'

import { useSession } from "next-auth/react"

// import { useSession } from "next-auth"

export default function Page() {
    const {data: session} = useSession()
    console.log("🚀 ~ Users ~ session:", session)
    return (
        <div>
            page user
        </div>
    )
}