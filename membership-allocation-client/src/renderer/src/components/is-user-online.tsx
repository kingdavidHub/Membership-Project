import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const IsUserOnline = () => {
  const [isUserOnline, setIsUserOnline] = useState(navigator.onLine)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsUserOnline(navigator.onLine)
    }

    // Listen to online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return (
    <div className="relative flex items-center justify-center h-3 w-3">
      {/* Stationary status indicator */}
      <div className={isUserOnline ? 'isOnline' : 'isOffline'}></div>

      {/* Animated pulse ring */}
      <motion.div
        className={`absolute inset-0 rounded-full ${isUserOnline ? 'bg-green-600' : 'bg-red-600'}`}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.6, 0.2, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
