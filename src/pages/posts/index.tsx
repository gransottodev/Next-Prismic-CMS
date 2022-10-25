import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic'
import { useState } from 'react'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from './styles.module.scss'
import {FiChevronLeft ,FiChevronsLeft, FiChevronRight ,FiChevronsRight} from 'react-icons/fi'


type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updatedAt: string;
}

interface PostsProps{
  posts: Post[];
  page: string;
  totalPage: string;
}

export default function Posts({posts: postsBlog, page, totalPage} : PostsProps){

  const [currentPage, setCurrentPage] = useState(Number(page))
  const [posts, setPosts] = useState(postsBlog || [])

  // function de buscar posts 
  async function reqPost(pageNumber : number){
    const prismic = getPrismicClient()

    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
      orderings: '[document.last_publication_date desc]',  // Ordenando por desc
      fetch: ['post.title', 'post.description', 'post.cover'],
      pageSize: 2,
      page: String(pageNumber)
    })


    return response
  }

  async function navigatePage(pageNumber : number){
    const response = await reqPost(pageNumber)

    if(response.results.length === 0){
      return
    }

    const getPosts = response.results.map(post => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
        cover: post.data.cover.url,
        updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      }
    })

    setCurrentPage(pageNumber)
    setPosts(getPosts)
  }

  return(
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
            <a key={post.slug}>
              <Image 
                src={post.cover} 
                alt={post.title} 
                width={720}
                height={410}
                quality={100}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPUUAy+AQACiwF28riJVwAAAABJRU5ErkJggg=='
              />

              <strong>{post.title}</strong>
              <time>{post.updatedAt}</time>
              <p>{post.description}</p>
            </a>
          </Link>
          ))}
          <div className={styles.navigation}>
            {Number(currentPage) >= 2 && (
              <div>
                <button onClick={ () => navigatePage(1)}>
                  <FiChevronsLeft size={25} color='#fff' />
                </button>
                <button onClick={ () => navigatePage(Number(currentPage -1))}>
                  <FiChevronLeft size={25} color='#fff' />
                </button>
              </div>
            )}

            {Number(currentPage) < Number(totalPage) && (
              <div>
                <button onClick={ () => navigatePage(Number(currentPage + 1))}>
                  <FiChevronRight size={25} color='#fff' />
                </button>
                <button onClick={ () => navigatePage(Number(totalPage))}>
                  <FiChevronsRight size={25} color='#fff' />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'post') // selecionando o a 'tabela' que os dados serão requisitados 
  ], {
    orderings: '[document.last_publication_date desc]',  // Ordenando por desc
    fetch: ['post.title', 'post.description', 'post.cover'],
    pageSize: 2
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })


  return{
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages
    },
    revalidate: 60 * 60 * 3
  }
}