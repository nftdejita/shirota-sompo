import styles from 'styles/hero.module.css'
import Image from 'next/image'
import banner from 'images/hero.png'

export default function Hero({ title, subtitle, image}) {
  return (
    <div className={styles.flexContainer}>

      <div className={styles.text}>
        <p className={styles.subtitle}>{subtitle}</p>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <figure className={styles.image}>
        <Image
          src={image.url}
          alt=""
          layout="responsive"
          width={image.width}
          height={image.height}
          sizes="(min-width: 1152px) 576px, (min-width: 768px) 50vw, 100vw"
          priority
          blurDataURL={image.blurDataURL} 
          placeholder="blur"
        />
      </figure>
    </div>
  )
}