import React from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="text-center">
        <Image 
          src="/uni_transparentbg.png" 
          alt="UniRoute DE" 
          width={500} 
          height={160} 
          className="h-36 sm:h-44 w-auto mx-auto object-contain animate-pulse -my-4 dark:brightness-[2.2] dark:contrast-[1.2]" 
          priority
        />
        <p className="text-muted-foreground mt-1 text-sm font-medium">Loading your dashboard...</p>
      </div>
    </div>
  )
}
 