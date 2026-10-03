import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'

/**
 * These images are packshots — a bag or bottle on a plain backdrop — so they
 * are shown contained at a sensible size against the brand colour rather than
 * stretched across the viewport. Covering the full width both cropped the
 * product badly and magnified a small source well past its real detail.
 */
export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const { heroImage, title, shortDescription, priceLabel } = product

  return (
    // No negative margin: that existed so a full-bleed photo could run behind
    // the header. The hero now has its own background, so pulling it up and
    // padding it back down only left an empty band under the nav.
    <div className="relative overflow-hidden bg-brand-dark-green text-white">
      <div className="container relative z-10 grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="mb-5 text-sm uppercase tracking-[0.12em] text-brand-light-lime">Product</div>

          <h1 className="mb-5 font-serif text-4xl leading-tight md:text-5xl lg:text-[56px]">{title}</h1>

          {shortDescription && (
            <p className="mb-4 max-w-xl text-base leading-relaxed text-zinc-200 md:text-lg">
              {shortDescription}
            </p>
          )}

          {priceLabel && <p className="text-sm font-medium text-zinc-300 md:text-base">{priceLabel}</p>}
        </div>

        {heroImage && typeof heroImage !== 'string' && (
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-2xl bg-[#eee7d8]">
            <Media fill priority imgClassName="object-contain" resource={heroImage} />
          </div>
        )}
      </div>
    </div>
  )
}
