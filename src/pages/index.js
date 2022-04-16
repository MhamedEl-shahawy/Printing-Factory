import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";
import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';


import styles from '@styles/Page.module.scss'

export default function Home({data,products}) {
  const {heroLink,heroText,heroTitle,heroBackground} = data;
  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Space Jelly Gear</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
                <p>{heroText}</p>
              </div>
              <Image height={heroBackground.height} width={heroBackground.width} className={styles.heroImage} src={heroBackground.url} alt={heroTitle} />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.map(product => {
            return (
              <li key={product.slug}>
                <Link href={"products/"+product.slug}>
                  <a>
                    <div className={styles.productImage}>
                      <Image  src={product.image.url} height={product.image.height} width={product.image.width} alt="" />
                    </div>
                    <h3 className={styles.productTitle}>
                      { product.name }
                    </h3>
                    <p className={styles.productPrice}>
                      ${ product.price }
                    </p>
                  </a>
                </Link>
                <p>
                  <Button>
                    Add to Cart
                  </Button>
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps(){
  const client = new ApolloClient({
    uri: process.env.GRAPHQL_KEY,
    cache: new InMemoryCache()
  });
  const data = await client.query({
    query: gql`
     query PageHome {
      page(where:{slug:"home"}) {
        heroText
        heroLink
        heroTitle
        heroBackground
        id
        name
        slug
      }
      products(first: 4) {
    slug
    price
    name
    id
    image
  }
}`
});
  return{
     props:{
     data:data.data.page,
     products:data.data.products
     }
  }
}