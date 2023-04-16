import { getProductBySlug, getAllSlugs } from 'lib/api'
import Meta from 'components/meta'
import Container from 'components/container'
import Hero from 'components/hero'
import PageBody from 'components/page-body'
import SidePanel from 'components/side-panel'
import {
  TwoColumn,
  TwoColumnMain,
  TwoColumnSidebar,
} from 'components/two-column'
import ConvertBody from 'components/convert-body'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'

export default function Page({
  title,
  eyecatch,
  body1,
  body2,
  body3,
}) {
  return (
    <Container>
      <Meta
        pageTitle={title}
        pageImg={eyecatch.url}
        pageImgW={eyecatch.width}
        pageImgH={eyecatch.height}
      />

      <article>
        <Hero title={title} subtitle="商品のご案内" image={eyecatch} />

        <TwoColumn>
          <TwoColumnMain>
            <PageBody>
              <ConvertBody contentHTML={body1} />
              <ConvertBody contentHTML={body2} />
              <ConvertBody contentHTML={body3} />
            </PageBody>
          </TwoColumnMain>
          <TwoColumnSidebar>
            <SidePanel />
          </TwoColumnSidebar>
        </TwoColumn>

      </article>
    </Container>
  )
}

export async function getStaticPaths() {
  const allSlugs = await getAllSlugs()
  
  return {
    paths: allSlugs.map(({ slug }) => `/products/${slug}`),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const slug = context.params.slug
  const product = await getProductBySlug(slug)

  const eyecatch = product.eyecatch

  const { base64 } = await getPlaiceholder(eyecatch.url)
  eyecatch.blurDataURL = base64


  return {
    props: {
      title: product.title,
      eyecatch: eyecatch,
      body1: product.body1,
      body2: product.body2,
      body3: product.body3,
    },
  }
}
