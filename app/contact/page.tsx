import { Pages, allPages } from 'contentlayer/generated'
// import { MDXLayoutRenderer } from 'pliny/mdx-components'
import PageLayout from '@/layouts/PageLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allPages.find((p) => p.id === 1248) as Pages
  const mainContent = coreContent(author)

  return (
    <>
      <PageLayout content={mainContent}>
        <div dangerouslySetInnerHTML={{ __html: author.body.html }} />
      </PageLayout>
    </>
  )
}
