import { GetStaticProps } from 'next'
import { getPrismicClient  } from '../services/prismic'
import Prismic from '@prismicio/client'
import { RichText  } from 'prismic-dom'
import React from 'react'
import Head from 'next/head'
import styles from '../styles/home.module.scss'

type Content = {
  principal: string;
  principal_content: string;
  principal_link: string;
  mobileTitle: string;
  mobileSubtitle: string;
  bannerMobile: string;
  webTitle: string;
  webSubtitle: string;
  bannerWeb: string;
}


interface ContetProps{
 content: Content
}

export default function Home({ content } : ContetProps) {

  return (
    <> 
      <Head>
        <title>Teste</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.principal}</h1>
            <span>
              {content.principal_content}
            </span>
            <a>
              <button>
                Começar agora!
              </button>
            </a>
          </section>
            <img src="/images/banner-conteudos.png" alt="conteudos" />
        </div>

        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}>
          <section>
            <h2>{content.mobileTitle}</h2>
            <span> 
             {content.mobileSubtitle}
            </span>
          </section>

          <img src={content.bannerWeb} alt="conteudos mobile" />
        </div>

        <hr className={styles.divisor}/>
        
        <div className={styles.sectionContent}>
          <img src={content.bannerWeb} alt="programação web conteudos" />
          <section>
            <h2>{content.webTitle}</h2>
            <span> 
              {content.webSubtitle}
            </span>
          </section>
        </div>

        <div className={styles.ctaSection}>
          <img src="/images/techs.svg" alt="conteudos" />
          <section>
            <h2>
              Mais de <span className={styles.ctaSpanBlue}>15 mil</span> já levaram
              sua carreira ao próximo nível!
            </h2>
            <span> 
              E você vai perder a oportunidade de evoluir de uma vez por todas?
            </span>
          </section>
          <button>Acessar turma</button>
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'home')
  ])  

  const {
    title, 
    subtitle, 
    link, 
    mobile, 
    mobilecontent, 
    mobile_banner,
    titleweb, 
    webcontent, 
    webbanner
  } = response.results[0].data

  const content = {
    principal: RichText.asText(title),
    principal_content: RichText.asText(subtitle),
    principal_link: link.url,
    mobileTitle: RichText.asText(mobile),
    mobileSubtitle: RichText.asText(mobilecontent),
    bannerMobile: mobile_banner.url,
    webTitle: RichText.asText(titleweb),
    webSubtitle: RichText.asText(webcontent),
    bannerWeb: webbanner.url
  }
  
  return{
    props:{
      content
    },
    revalidate: 60 * 60 * 2
  }
}