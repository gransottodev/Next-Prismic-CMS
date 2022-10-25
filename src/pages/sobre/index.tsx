import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'
import styles from './styles.module.scss'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import { FiLinkedin, FiGithub} from 'react-icons/fi'


interface contentProps{
  content:{
    title: string;
    description: string;
    banner: string,
    linkedin: string,
    github: string
  }
}

export default function Sobre({content} : contentProps){
  return(
    <>
      <div className={styles.container}>
        <article className={styles.content}>
          <h1>{content.title}</h1>
          <div dangerouslySetInnerHTML={{__html: content.description}} />
          <div className={styles.social}>
            <a href={content.linkedin}>
              <FiLinkedin 
                size={40}
              />
            </a>

            <a href={content.github}>
              <FiGithub 
                size={40}
              />
            </a>

          </div>

        </article>
          <Image 
            src={content.banner}
            quality={100}
            width={700}
            height={410}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPUUAy+AQACiwF28riJVwAAAABJRU5ErkJggg=='
          />
      </div>
    </>
  )
}

export const getStaticProps : GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'about')
  ])

  const {
    title,
    description,
    banner,
    linkedin,
    github
  } = response.results[0].data

  const content = {
    title: RichText.asText(title),
    description: RichText.asHtml(description),
    banner: banner.url,
    linkedin: linkedin.url,
    github: github.url
  }

  return{
    props:{
      content
    },
    revalidate: 60 * 60 * 24
  }
  
}