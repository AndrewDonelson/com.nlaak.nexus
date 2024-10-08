//file: @/components/LoaderSpinner.tsx
import { Loader } from 'lucide-react'
import React from 'react'

const LoaderSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50">
      <Loader className="animate-spin text-red-1" size={30} />
    </div>
  )
}

export default LoaderSpinner