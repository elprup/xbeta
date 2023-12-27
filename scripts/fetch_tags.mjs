import fs from 'fs'
// fetch all post and store in data/article directory
async function fetchPost(postId) {
  const url = `https://xbeta.info/wp-json/wp/v2/tags/${postId}`
  console.log(url)
  const response = await fetch(url)
  const data = await response.json()
  if (data.code === undefined) {
    return data
  }
  return null
}
const MAX_POST_ID = 1000

async function main() {
  let n = 1
  while (n < MAX_POST_ID) {
    const d = await fetchPost(n)
    if (d !== null) {
      fs.writeFileSync(`./data/tags/${n}.json`, JSON.stringify(d))
    }
    n += 1
  }
}

main()
