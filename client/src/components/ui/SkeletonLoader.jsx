import React from 'react'
import { twMerge } from 'tailwind-merge'

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={twMerge(
        'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded',
        'motion-safe:animate-[shimmer_2s_ease-in-out_infinite]',
        className
      )}
      {...props}
    />
  )
}

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <Skeleton className="w-full aspect-square rounded-lg mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <Skeleton className="w-full aspect-square rounded-lg mb-3" />
      <Skeleton className="h-5 w-3/4 mx-auto" />
    </div>
  )
}

export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <Skeleton className="w-16 h-16 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export default Skeleton
