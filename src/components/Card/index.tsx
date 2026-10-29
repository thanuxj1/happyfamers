'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post, Product } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'> & {
  heroImage?: Post['heroImage']
}
export type CardProductData = Pick<Product, 'slug' | 'meta' | 'title' | 'priceLabel'> & {
  heroImage?: Product['heroImage']
  categories?: never
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData | CardProductData
  relationTo?: 'posts' | 'products'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const priceLabel = doc && 'priceLabel' in doc ? doc.priceLabel : undefined
  const { description } = meta || {}

  // The social image is an override; without one the card shows the item's own
  // photo rather than "No image".
  const cardImage = meta?.image ?? doc?.heroImage

  const isProduct = relationTo === 'products'
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      {/* Product photographs are cut out on transparent backgrounds, so they
          are stood on the card with a drawn shadow rather than run edge to
          edge. Bleeding them cropped the packaging and left products touching
          the card's sides. Posts keep the full-bleed photo. */}
      {isProduct ? (
        <div className="relative flex h-[240px] w-full items-end justify-center px-5 pb-5 pt-6">
          {!cardImage && <div>No image</div>}
          {cardImage && typeof cardImage !== 'string' && (
            <>
              <span
                aria-hidden
                className="absolute bottom-4 left-1/2 h-[14px] w-[48%] -translate-x-1/2 rounded-[50%]"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(60,45,25,0.26), rgba(60,45,25,0) 70%)',
                }}
              />
              <Media
                resource={cardImage}
                size="(max-width: 640px) 90vw, 33vw"
                className="relative flex items-end justify-center"
                imgClassName="max-h-[196px] w-auto object-contain"
              />
            </>
          )}
        </div>
      ) : (
        <div className="relative w-full ">
          {!cardImage && <div className="">No image</div>}
          {cardImage && typeof cardImage !== 'string' && <Media resource={cardImage} size="33vw" />}
        </div>
      )}
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            {/* h2: these cards sit directly under the page h1, so h3 skipped a level */}
            <h2>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h2>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
        {priceLabel && (
          <div className="mt-3 text-sm font-medium text-primary">{priceLabel}</div>
        )}
      </div>
    </article>
  )
}
