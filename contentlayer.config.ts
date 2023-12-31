import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer/source-files'
import { writeFileSync } from 'fs'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import path from 'path'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from './data/siteMetadata'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { convert } from 'html-to-text'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createCount(name, names, allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file[names] && (!isProduction || file.draft !== true)) {
      file[names].forEach((tag) => {
        const formattedTag = GithubSlugger.slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync(`./app/${name}-data.json`, JSON.stringify(tagCount))
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
    console.log('Local search index generated...')
  }
}

export const Blog2 = defineDocumentType(() => ({
  name: 'Blog2',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

const computedFields2: ComputedFields = {
  title: { type: 'string', resolve: (doc) => doc.title.rendered },
  lastmod: { type: 'date', resolve: (doc) => doc.modified },
  draft: { type: 'boolean', resolve: () => false },
  summary: { type: 'string', resolve: (doc) => convert(doc.excerpt.rendered) },
  images: { type: 'json', resolve: () => {} },
  authors: { type: 'list', resolve: () => [] },
  layout: { type: 'string', resolve: () => '' },
  bibliography: { type: 'string', resolve: () => '' },
  canonicalUrl: { type: 'string', resolve: () => '' },
  body: { type: 'json', resolve: (doc) => ({ html: doc.content.rendered }) },

  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.content.rendered) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.content.rendered) },
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.json',
  contentType: 'data',
  fields: {
    id: { type: 'number' },
    date: { type: 'date', required: true },
    date_gmt: { type: 'date' },
    guid: { type: 'json' },
    modified: { type: 'date' },
    modified_gmt: { type: 'date' },
    slug: { type: 'string', required: true },
    status: { type: 'string' },
    wp_type: { type: 'string' },
    link: { type: 'string' },
    title: { type: 'json' },
    content: { type: 'json' },
    excerpt: { type: 'json' },
    author: { type: 'number' },
    featured_media: { type: 'number' },
    comment_status: { type: 'string' },
    ping_status: { type: 'string' },
    sticky: { type: 'boolean' },
    template: { type: 'string' },
    format: { type: 'string' },
    meta: { type: 'list', of: { type: 'string' } },
    categories: { type: 'list', of: { type: 'number' } },
    tags: { type: 'list', of: { type: 'string' } },
    _links: { type: 'json' },
  },
  computedFields: computedFields2,
}))

export const Pages = defineDocumentType(() => ({
  name: 'Pages',
  filePathPattern: 'pages/**/*.json',
  contentType: 'data',
  fields: {
    id: { type: 'number' },
    date: { type: 'date', required: true },
    date_gmt: { type: 'date' },
    guid: { type: 'json' },
    modified: { type: 'date' },
    modified_gmt: { type: 'date' },
    slug: { type: 'string', required: true },
    status: { type: 'string' },
    wp_type: { type: 'string' },
    link: { type: 'string' },
    title: { type: 'json' },
    content: { type: 'json' },
    excerpt: { type: 'json' },
    author: { type: 'number' },
    featured_media: { type: 'number' },
    comment_status: { type: 'string' },
    ping_status: { type: 'string' },
    template: { type: 'string' },
    format: { type: 'string' },
    parent: { type: 'number' },
    menu_order: { type: 'number' },
    meta: { type: 'list', of: { type: 'string' } },
    _links: { type: 'json' },
  },
  computedFields: computedFields2,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors, Blog2, Pages],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, 'data') }],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData()
    createCount('tag', 'tags', allBlogs)
    createCount('category', 'categories', allBlogs)
    createSearchIndex(allBlogs)
  },
})
