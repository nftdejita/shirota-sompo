import Link from 'next/link'
import styles from 'styles/logo.module.css'

export default function Logo({ boxOn = false }) {
  return (
    <Link href="/" className={boxOn ? styles.box : styles.basic}>
      城田損害保険
    </Link>
  )
}