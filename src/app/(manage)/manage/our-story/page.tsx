import { getServerSideURL } from '@/utilities/getURL'
import { getManagePayload } from '@/utilities/getManagePayload'
import { getOurStoryContent } from '@/globals/OurStoryPage/content'
import { OurStoryForm } from '../_components/OurStoryForm'

export default async function ManageOurStoryPage() {
  const { payload } = await getManagePayload()

  // The resolved content is used as the starting point so the form opens
  // showing the words that are on the page today, even for fields that have
  // never been saved through the manager.
  const [stored, content] = await Promise.all([
    payload.findGlobal({ slug: 'our-story-page', depth: 1 }).catch(() => null),
    getOurStoryContent(),
  ])

  const data = {
    ribbonText: content.ribbonText,
    heroEyebrow: content.heroEyebrow,
    headingLine1: content.headingLine1,
    headingLine2: content.headingLine2,
    heroSubtext: content.heroSubtext,
    heroButtonLabel: content.heroButtonLabel,
    heroImage: stored?.heroImage ?? null,
    storyEyebrow: content.storyEyebrow,
    storyHeading: content.storyHeading,
    storyParagraphs: content.storyParagraphs.map((text) => ({ text })),
    storyImage: stored?.storyImage ?? null,
    highlights: content.highlights.map((text) => ({ text })),
    missionTitle: content.missionTitle,
    missionText: content.missionLines.join('\n'),
    visionTitle: content.visionTitle,
    visionText: content.visionLines.join('\n'),
    closingHeading: content.closingHeading,
    closingSubtext: content.closingSubtext,
    closingButtonLabel: content.closingButtonLabel,
    closingImage: stored?.closingImage ?? null,
    meta: content.meta as { title?: string | null; description?: string | null; image?: never } | null,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Our Story page</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything on the Our Story page, top to bottom.
      </p>
      <div className="mt-6">
        <OurStoryForm data={data} siteUrl={getServerSideURL()} />
      </div>
    </div>
  )
}
