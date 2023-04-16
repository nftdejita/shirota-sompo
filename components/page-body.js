import styles from 'styles/page-body.module.css'

export default function PageBody({ children }) {
  return (
    <div className={styles.stack}>
      {children}
    </div>
  )
}
