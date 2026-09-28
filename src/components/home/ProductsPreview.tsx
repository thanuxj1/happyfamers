import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { HomePage, Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import { TiltCard } from '@/components/motion/TiltCard'

export const ProductsPreview: React.FC<{ data: HomePage; products: Product[] }> = ({
  data,
  products,
}) => {
  const { productsHeading } = data

  return (
    <div className="pt-2" id="products">
      <div className="mb-5 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-zinc-300 sm:w-16" />
        <h2 className="flex items-center gap-1.5 text-center font-serif text-base font-bold text-emerald-950 sm:text-lg">
          {productsHeading}
          <span className="text-xs">🍃</span>
        </h2>
        <span className="h-px w-12 bg-zinc-300 sm:w-16" />
      </div>

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
        {products.map((product, i) => (
          <RevealItem
            className={i === 2 ? 'sm:col-span-2 lg:col-span-1' : undefined}
            key={product.id}
          >
            <TiltCard className="h-full" strength={4}>
              <div className="flex h-full flex-col justify-between rounded-xl border border-brand-border-cream bg-brand-cream-card/70 p-3.5 shadow-sm transition-shadow hover:shadow-xl sm:p-4">
                <div className="mb-2.5 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-stone-200/60 p-2 sm:h-28">
                  {product.heroImage && typeof product.heroImage !== 'string' && (
                    <div className="relative h-full w-full">
                      <Media
                        resource={product.heroImage as MediaType}
                        fill
                        imgClassName="object-contain mix-blend-multiply"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-zinc-900">{product.title}</h3>
                  <p className="mb-3 text-[11px] leading-tight text-zinc-600">
                    {product.shortDescription}
                  </p>
                </div>
                <Link
                  className="group mt-auto flex items-center gap-1 pt-1 text-xs font-semibold text-brand-forest-green hover:text-emerald-800"
                  href={`/products/${product.slug}`}
                >
                  Learn More{' '}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
