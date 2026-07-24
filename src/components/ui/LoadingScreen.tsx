import React from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="text-center">
        <Image 
          src="/uni_transparentbg.png" 
          alt="UniRoute DE" 
          width={96} 
          height={96} 
          className="w-24 h-24 mx-auto object-contain animate-pulse" 
          priority
        />
        <h1 className="text-2xl font-bold mt-4 text-foreground">UniRoute DE</h1>
        <p className="text-muted-foreground mt-2">Loading your dashboard...</p>
      </div>
    </div>
  )
}
 