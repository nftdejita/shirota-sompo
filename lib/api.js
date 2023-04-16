import { createClient } from 'microcms-js-sdk'

export const client = createClient({
  serviceDomain: process.env.SERVICE_DOMAIN,
  apiKey: process.env.API_KEY,
})

export async function getPostBySlug(slug) {
  try {
    const post = await client.get({
      endpoint: 'pages',
      queries: { filters: `slug[equals]${slug}` },
    })
    return post.contents[0]
  } catch (err) {
    console.log('~~ getPostBySlug ~~')
    console.log(err)
  }
}

export async function getProductBySlug(slug) {
  try {
    const product = await client.get({
      endpoint: 'products',
      queries: { filters: `slug[equals]${slug}` },
    })
    return product.contents[0]
  } catch (err) {
    console.log('~~ getProductBySlug ~~')
    console.log(err)
  }
}
export async function getAllSlugs(limit = 100) {
  try {
    const slugs = await client.get({
      endpoint: 'products',
      queries: { fields: 'title,slug', orders: 'publishDate', limit: limit },
    })
    return slugs.contents
  } catch (err) {
    console.log('~~ getAllSlugs ~~')
    console.log(err)
  }
}


export async function getAllProducts(limit = 100) {
  try {
    const products = await client.get({
      endpoint: 'products',
      queries: {
        orders: '-publishDate',
        limit: limit,
      },
    })
    return products.contents
  } catch (err) {
    console.log('~~ getAllProducts ~~')
    console.log(err)
  }
}

export async function getAllCategories(limit = 100) {
  try {
    const categories = await client.get({
      endpoint: 'categories',
      queries: {
        fields: 'name,id,slug',
        limit: limit,
      },
    })
    return categories.contents
  } catch (err) {
    console.log('~~ getAllCategories ~~')
    console.log(err)
  }
}

export async function getAllPostsByCategory(catID, limit = 100) {
  try {
    const posts = await client.get({
      endpoint: 'blogs',
      queries: {
        filters: `categories[contains]${catID}`,
        fields: 'title,slug,eyecatch',
        orders: '-publishDate',
        limit: limit,
      },
    })
    return posts.contents
  } catch (err) {
    console.log('~~ getAllPostsByCategory ~~')
    console.log(err)
  }
}
