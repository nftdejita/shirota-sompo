import Container from 'components/container'
import Logo from 'components/logo'
import styles from 'styles/footer.module.css'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className={styles.wrapper}>
      <Container>
        <div className={styles.flexContainer}>
          <Link href="/">
            <p className={styles.title}>城田損害保険</p>
          </Link>
          <p className={styles.copyright}>Copyright © SHIROTA SOMPO. All right reserved.</p>
        </div>
      </Container>
    </footer>
  )
}
