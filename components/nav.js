import { useState } from 'react'
import Link from 'next/link'
import styles from 'styles/nav.module.css'

export default function Nav({products}) {
  const [navIsOpen, setNavIsOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false);

  const toggleNav = () => {
    setNavIsOpen((prev) => !prev)
  }

  const closeNav = () => {
    setNavIsOpen(false)
  }
  
  return (
    <nav className={navIsOpen ? styles.open : styles.close}>
      {navIsOpen && (
        <style jsx global>{`
          @media (max-width: 767px) {
            body {
              overflow: hidden;
              position: fixed;
              width: 100%;
            }
          }
        `}</style>
      )}
      
      <button className={styles.btn} onClick={toggleNav}>
        <span className={styles.bar}></span>
        <span className="sr-only">MENU</span>
      </button>      
      
      <ul className={styles.list} onClick={closeNav}>
        <li>
          <Link href="/" >
            ホーム
          </Link>
        </li>

        <li
          className={styles.menuItem}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <span>商品種類</span>
          {(showMenu || navIsOpen) && (
            <ul className={styles.subMenu}>
              <li>
                <Link href='/products/car'>自動車保険</Link>
              </li>
              <li>
                <Link href='/products/house'>火災保険</Link>
              </li>
              <li>
                <Link href='/products/medical'>傷害疾病保険</Link>
              </li>
              <li>
                <Link href='/products/travel'>旅行保険</Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link href="/company">
            会社概要
          </Link>
        </li>
        <li>
          <Link href="/contact">
            お問い合わせ
          </Link>
        </li>
        <li>
          <Link href="/request">
            資料請求
          </Link>
        </li>
      </ul>
    </nav>
  )
  
}

