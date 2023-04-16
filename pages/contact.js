import Meta from 'components/meta'
import PageHeader from 'components/page-header'
import PageBody from 'components/page-body'
import ConvertBody from 'components/convert-body'
import Container from 'components/container'
import EyeCatch from 'components/eyecatch'
import SidePanel from 'components/side-panel'
import { getPostBySlug } from 'lib/api'
import { getPlaiceholder } from 'plaiceholder'
import {
  TwoColumn,
  TwoColumnMain,
  TwoColumnSidebar,
} from 'components/two-column'
import Image from 'next/image'
import shirota from 'images/shirota.jpg'
import styles from 'styles/contact.module.css'

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
            <SidePanel />
          </TwoColumnSidebar>
        </TwoColumn>

      </article>

    </Container>
  )
}

export async function getStaticProps(context) {
  const slug = 'contact'

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