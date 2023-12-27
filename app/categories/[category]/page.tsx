import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const category = decodeURI(params.category)
  return genPageMetadata({
    title: category,
    description: `${siteMetadata.title} ${category} categoried content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/categories/${category}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = categoryData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((category) => ({
    category: encodeURI(category),
  }))
  return paths
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const tag = decodeURI(params.category)
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) => post.categories && post.categories.map((t) => slug(t)).includes(tag)
      )
    )
  )
  return <ListLayout groupBy="categories" posts={filteredPosts} title={title} />
}
