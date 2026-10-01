import Link from 'next/link'
import React from 'react'
import type { HomePage, Media as MediaType, Product } from '@/payload-types'
import { Media } from '@/components/Media'
import { SectionHeading } from './SectionHeading'

export const ProductsPreview: React.FC<{ data: HomePage; products: Product[] }> = ({ data, products }) => {
  const { productsHeading } = data
  return (
    <div className="pt-[10px]">
      <SectionHeading className="mb-3 justify-center" rule="both">
        {productsHeading}
      </SectionHeading>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col rounded-xl bg-[#eee7d8] p-3">
            {/* The photo carries the card's own background tone, so it sits flush. */}
            <div className="relative mb-2 h-[170px] w-full sm:h-[112px]">
              {product.heroImage && typeof product.heroImage !== 'string' && (
                <Media resource={product.heroImage as MediaType} fill imgClassName="object-contain" />
              )}
            </div>
            {/* font-sans overrides the serif default that globals.css sets on headings */}
            <h3 className="mb-1 font-sans text-[13.5px] font-semibold text-[#2b2b2b]">
              {product.title}
            </h3>
            <p className="mb-1.5 flex-1 text-[11px] leading-[1.4] text-[#6b6355]">
              {product.shortDescription}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="text-[12px] font-medium text-[#4a8f3f] hover:underline"
            >
              Learn More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
