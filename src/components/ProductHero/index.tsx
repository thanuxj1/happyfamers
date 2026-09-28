import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'

export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const { heroImage, title, shortDescription, priceLabel } = product

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">Product</div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          {shortDescription && (
            <p className="max-w-2xl mb-4 text-base md:text-lg">{shortDescription}</p>
          )}

          {priceLabel && <p className="text-sm md:text-base font-medium">{priceLabel}</p>}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
