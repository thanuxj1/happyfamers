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
            {/* The product photographs are cut out on transparent backgrounds, so
                they stand on the card itself rather than inside a tile. The old
                white tile read as a pasted-on rectangle against the cream. The
                shadow below is drawn, not photographed, which is what grounds
                the product now that its own backdrop is gone. */}
            <div className="relative mb-2 flex h-[170px] w-full items-end justify-center sm:h-[132px]">
              <span
                aria-hidden
                className="absolute bottom-1 left-1/2 h-[13px] w-[54%] -translate-x-1/2 rounded-[50%]"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(60,45,25,0.3), rgba(60,45,25,0) 70%)',
                }}
              />
              {product.heroImage && typeof product.heroImage !== 'string' && (
                <Media
                  resource={product.heroImage as MediaType}
                  size="(max-width: 640px) 90vw, (max-width: 1024px) 30vw, 200px"
                  // Capped in pixels rather than percentages. Without `fill`,
                  // Media nests the image inside a plain <div> and a <picture>,
                  // both auto-height, so a percentage height on the <img>
                  // resolves against nothing and collapses it to zero.
                  className="relative flex items-end justify-center"
                  imgClassName="max-h-[164px] w-auto object-contain sm:max-h-[126px]"
                />
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
              className="text-[12px] font-medium text-[#3a7030] hover:underline"
            >
              Learn More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
