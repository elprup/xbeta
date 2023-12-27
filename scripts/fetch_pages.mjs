import fs from 'fs'
// fetch all post and store in data/article directory
async function fetchObj(postId) {
  const url = `https://xbeta.info/wp-json/wp/v2/pages/${postId}`
  console.log(url)
  const response = await fetch(url)
  const data = await response.json()
  if (data.code === undefined) {
    return data
  }
  return null
}
const MAX_POST_ID = 10000

async function main() {
  let n = 626
  while (n < MAX_POST_ID) {
    const d = await fetchObj(n)
    if (d !== null) {
      d['wp_type'] = d['type']
      delete d['type']
      fs.writeFileSync(`./data/pages/${n}.json`, JSON.stringify(d))
    }
    n += 1
  }
}

main()
