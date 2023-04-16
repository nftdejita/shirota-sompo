import styles from 'styles/page-header.module.css'

export default function PageHeader({ title, subtitle }) {
  return (
    <div className={styles.stack}>
      <p className={styles.subtitle}>{subtitle}</p>
      <h1 className={styles.title}>{title}</h1>
    </div>
  )
}
