import styles from 'styles/side-panel.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopesBulk } from '@fortawesome/free-solid-svg-icons'

export default function SidePanel() {
  return (
    <div className={styles.flexContainer}>
      <h3 className={styles.heading}>
        <FontAwesomeIcon icon={faEnvelopesBulk} />
        <span className="sr-only">Categories</span>
      </h3>
      <ul className={styles.list}>
          <li>
            <Link className={styles.btnorange } href='/request'>
              各種ご請求
            </Link>
          </li>
      </ul>
    </div>
  )
}
