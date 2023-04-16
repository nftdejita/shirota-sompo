import Link from 'next/link'
import styles from 'styles/logo.module.css'
import Image from 'next/image'
import logoImage from 'images/logo.png'

export default function Logo() {
  return (
    <Link href="/">
        <Image 
          src={logoImage}
          alt="" 
          layout="responsive" 
          priority
          placeholder="blur"
        />
    </Link>
  )
}