import Meta from 'components/meta'
import PageHeader from 'components/page-header'
import PageBody from 'components/page-body'
import ConvertBody from 'components/convert-body'
import Container from 'components/container'
import EyeCatch from 'components/eyecatch'
import { getPostBySlug } from 'lib/api'
import styles from 'styles/request.module.css'
import { getPlaiceholder } from 'plaiceholder'

export default function Request({title,subtitle,banner,body}) {
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

      <PageBody className={styles.text}>

        <form className={styles.form}>
          <label htmlFor="document">資料名</label>
          <div className={styles.cp_ipselect}>
          <select id="document" name="document">
            <option value="--">ご希望の書類を選択してください</option>
            <option value="資料1">資料1</option>
            <option value="資料2">資料2</option>
            <option value="資料3">資料3</option>
            <option value="資料4">資料4</option>
          </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="postalCode">郵便番号</label>
            <input type="text" id="postalCode" name="postalCode" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="prefecture">都道府県</label>
            <input type="text" id="prefecture" name="prefecture" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="city">市区町村</label>
            <input type="text" id="city" name="city" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="street">番地</label>
            <input type="text" id="street" name="street" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="building">建物名・部屋番号</label>
            <input type="text" id="building" name="building" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="building">お客様名</label>
            <input type="text" id="toname" name="toname" />
          </div>
          <button type="submit" className={styles.submitButton}>送信</button>
          <br/>
        </form>
          <br/>
          <br/>



      </PageBody>

    </Container>
  )
}

export async function getStaticProps(context) {
  const slug = 'request'

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