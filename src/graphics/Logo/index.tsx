import React from 'react'

/**
 * Replaces Payload's default wordmark on the admin login screen
 * (admin.components.graphics.Logo) with the Happy Farmers brand mark.
 */
export const Logo: React.FC = () => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Rendered as a CSS mask (not a plain <img>) so it's always the exact
          same color as the "Happy Farmers" text below, in any admin theme. */}
      <div
        role="img"
        aria-label="Happy Farmers"
        style={{
          backgroundColor: 'var(--theme-elevation-1000, #fff)',
          height: '80px',
          width: '52px',
          WebkitMaskImage: 'url(/logo-farmer-dark.png)',
          maskImage: 'url(/logo-farmer-dark.png)',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      <span
        style={{
          color: 'var(--theme-elevation-1000, #fff)',
          fontSize: '28px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}
      >
        Happy Farmers
      </span>
    </div>
  )
}

export default Logo
