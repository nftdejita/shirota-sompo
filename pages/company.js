import Meta from 'components/meta'
import PageHeader from 'components/page-header'
import PageBody from 'components/page-body'
import ConvertBody from 'components/convert-body'
import Container from 'components/container'
import EyeCatch from 'components/eyecatch'
import { getPostBySlug } from 'lib/api'
import { getPlaiceholder } from 'plaiceholder'
import {
  TwoColumn,
  TwoColumnMain,
  TwoColumnSidebar,
} from 'components/two-column'
import Image from 'next/image'
import shirota from 'images/shirota.jpg'
import styles from 'styles/company.module.css'

export default function Company({title,subtitle,banner,body}) {
  return (
    <Container>
      <Meta
        pageTitle={title}
        pageDesc={title}
        pageImg={banner.url}
        pageImgW={banner.width}
        pageImgH={banner.height}
      />
      <div  className={styles.text}>
        <EyeCatch image={banner} />
        <PageHeader title={title} subtitle={subtitle} />
      </div>

      <article className={styles.text}>
        <TwoColumn>
          <TwoColumnMain>
            <PageBody>
              <ConvertBody contentHTML={body} />
            </PageBody>
          </TwoColumnMain>
          <TwoColumnSidebar>
            <figure>
              <Image
                src={shirota}
                alt=""
                layout="responsive"
                sizes="(min-width: 1152px) 576px, (min-width: 768px) 50vw, 100vw"
                priority
                placeholder="blur"
              />
            </figure>
            <p>
            城田損害保険　代表取締役<br />
            城田　靖久
            </p>
          </TwoColumnSidebar>
        </TwoColumn>

      </article>

    </Container>
  )
}

export async function getStaticProps(context) {
  const slug = 'company'

  const post = await getPostBySlug(slug)
  //console.log("post data ",post)
  const banner = post.banner

  const { base64 } = await getPlaiceholder(banner.url)
  banner.blurDataURL = base64


  return {
    props: {
      title:post.title,
      subtitle:post.subtitle,
      banner:banner,
      body:post.body
    },
  }
}