import Hero from 'components/hero'
import Container from 'components/container'
import Image from 'next/image'
import banner from 'images/hero.png'
import Meta from 'components/meta'
import Products from 'components/products'
import { getPlaiceholder } from 'plaiceholder'
import { getAllProducts } from 'lib/api'
import { eyecatchLocal } from 'lib/constants'

export default function Home({products}) {
  return (
    <Container>
      <Meta />
      <figure>
        <Image 
          src={banner} 
          alt="" 
          layout="responsive" 
          sizes="(min-width: 1280px)  1280px, 100vw" 
          priority
          placeholder="blur"
        />
      </figure>

      <Products products={products} />

    </Container>
  )
}

export async function getStaticProps() {
  const products = await getAllProducts()

  for (const product of products) {
    if (!product.hasOwnProperty('eyecatch')) {
      product.eyecatch = eyecatchLocal
    }
    const { base64 } = await getPlaiceholder(product.eyecatch.url)
    product.eyecatch.blurDataURL = base64
  }

  return {
    props: {
      products: products,
    },
  }
}