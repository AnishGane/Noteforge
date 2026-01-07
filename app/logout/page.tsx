"use client";
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import React from 'react'

function LogoutPage() {
    const router = useRouter();
    const  handleLogout = async () => {
        await authClient.signOut();
        router.push("/");

    }
  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}

export default LogoutPage