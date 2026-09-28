import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.css'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to the Happy Farmers dashboard!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' to load starter content (pages, products, resources and the contact form), then '}
          <a href="/" target="_blank">
            visit your website
          </a>
          {' to see the results.'}
        </li>
        <li>
          The homepage, header and footer are edited under <b>Site Settings</b> in the menu — not
          Pages.
        </li>
        <li>Edit the Our Story and Organic Certification pages under Website Content → Pages.</li>
        <li>Add or update products under Website Content → Products.</li>
        <li>Publish articles under Website Content → Resources.</li>
        <li>Read messages visitors send from the contact form under Website Content → Contact Messages.</li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
