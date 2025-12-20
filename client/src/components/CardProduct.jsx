import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'
import Badge from './ui/Badge'

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const discountedPrice = pricewithDiscount(data.price, data.discount)
  const hasDiscount = Boolean(data.discount) && data.discount > 0
  
  return (
    <Link 
      to={url} 
      className='group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 animate-fadeIn min-w-[160px] w-[160px] md:min-w-[180px] md:w-[180px] lg:min-w-[200px] lg:w-[200px] flex-shrink-0'
    >
      {/* Image Container with Hover Effect */}
      <div className='relative w-full h-48 sm:h-52 lg:h-56 bg-gray-50 overflow-hidden'>
        {!imageLoaded && !imageError && (
          <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]' />
        )}
        
        <img 
          src={data.image[0]}
          alt={data.name}
          className={`w-full h-full object-contain p-4 transition-all duration-300 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(true)
          }}
        />
        
        {imageError && (
          <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className='absolute top-2 right-2'>
            <Badge variant="discount" size="sm" className='font-semibold shadow-lg'>
              {data.discount}% OFF
            </Badge>
          </div>
        )}
        
        {/* Stock Badge */}
        {data.stock === 0 && (
          <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
            <Badge variant="danger" size="lg" className='font-semibold'>
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className='p-4 space-y-3'>
        {/* Delivery Time */}
        <div className='flex items-center gap-2'>
          <Badge variant="success" size="sm" className='flex items-center gap-1'>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            10 min
          </Badge>
        </div>

        {/* Product Name */}
        <h3 className='font-semibold text-gray-900 text-sm lg:text-base line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]'>
          {data.name}
        </h3>

        {/* Unit */}
        <p className='text-sm text-gray-700'>
          {data.unit}
        </p>

        {/* Price and Cart Section */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='text-lg lg:text-xl font-bold text-gray-900'>
                {DisplayPriceInRupees(discountedPrice)}
              </span>
            </div>
            {hasDiscount && (
              <span className='text-xs text-gray-500 line-through'>
                {DisplayPriceInRupees(data.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className='flex-shrink-0'>
            {data.stock === 0 ? (
              <button 
                disabled 
                className='px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed'
              >
                Unavailable
              </button>
            ) : (
              <AddToCartButton data={data} />
            )}
          </div>
        </div>

        {/* Savings Indicator */}
        {hasDiscount && (
          <div className='pt-2'>
            <p className='text-xs text-green-600 font-medium'>
              You save {DisplayPriceInRupees(data.price - discountedPrice)}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}

export default CardProduct
