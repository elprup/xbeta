import fs from 'fs'

function getIdMapping(names) {
  const result = {}
  fs.readdirSync('./data/' + names).forEach((file) => {
    const content = fs.readFileSync(`./data/${names}/${file}`)
    const data = JSON.parse(content)
    result[data.id.toString()] = data.name
  })
  return result
}
// fetch all post and store in data/article directory
async function fetchPost(postId) {
  const url = `https://xbeta.info/wp-json/wp/v2/posts/${postId}`
  console.log(url)
  const response = await fetch(url)
  const data = await response.json()
  if (data.code === undefined) {
    return data
  }
  return null
}
const MAX_POST_ID = 1903

async function main() {
  const id2tag = getIdMapping('tags')
  const id2category = getIdMapping('categories')

  let n = 1154
  while (n < MAX_POST_ID) {
    const d = await fetchPost(n)
    if (d !== null) {
      d['wp_type'] = d['type']
      delete d['type']

      const newTag = d.tags.map((i) => id2tag[i.toString()] || '').filter((i) => i != '')
      newTag.push('all')
      d.tags = newTag

      const newCategories = d.categories
        .map((i) => id2category[i.toString()] || '')
        .filter((i) => i != '')
      d.categories = newCategories
      fs.writeFileSync(`./data/blog/${n}.json`, JSON.stringify(d))
    }
    n += 1
  }
}

main()
