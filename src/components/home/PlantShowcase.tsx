import Image from 'next/image'
import React from 'react'

import { Media } from '@/components/Media'
import type { ShowcaseTile } from '@/globals/HomeShowcase/content'

/**
 * Two photos filling the space under the 3-step process.
 *
 * The process column shares a row with the taller products column, so it used
 * to end in an empty block. These grow to take up exactly that space on wide
 * screens (`flex-1` inside the column) and keep a fixed height when the
 * columns stack.
 */
export const PlantShowcase: React.FC<{ tiles: ShowcaseTile[] }> = ({ tiles }) => {
  return (
    <div className="mt-5 grid min-h-[190px] flex-1 grid-cols-2 gap-4 lg:min-h-[150px]">
      {tiles.map((tile, i) => (
        <figure key={i} className="relative m-0 overflow-hidden rounded-xl bg-[#eee7d8]">
          {tile.media ? (
            <Media
              resource={tile.media}
              fill
              size="(max-width: 1024px) 50vw, 280px"
              imgClassName="object-cover"
            />
          ) : (
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 280px"
              // The subject of each built-in photo sits below centre: the
              // seedling's root ball, and the pots on the windowsill.
              className={i === 0 ? 'object-cover object-[50%_62%]' : 'object-cover object-[50%_58%]'}
            />
          )}
          {tile.label && (
            // A solid pill rather than text on a gradient: the nursery photo
            // is white tray along its bottom edge, where light text over a
            // scrim falls short of contrast.
            <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-[#132c1c]/85 px-3 py-1 text-[12px] font-semibold text-white">
              {tile.label}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
