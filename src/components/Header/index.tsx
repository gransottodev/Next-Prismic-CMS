import styles from './style.module.scss'
import Image from 'next/image'
import { ActiveLink } from '../ActiveLink'
import logo from '../../../public/images/logo.svg'

export function Header(){
  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink href="/" activeClassName={styles.active}>
          <a>
            <Image src={logo} alt='Sujeito programador logo'/>
          </a>
        </ActiveLink>
        <nav>
          <ActiveLink href='/' activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink href='/posts' activeClassName={styles.active}>
            <a>Conteudos</a>
          </ActiveLink>

          <ActiveLink href='/sobre' activeClassName={styles.active}>
            <a>Quem somos?</a>
          </ActiveLink>
        </nav>

        <a className={styles.readyButton} type='button' href="https://sujeitoprogramador.com">Começar</a>
      </div>
    </header>
  )
}