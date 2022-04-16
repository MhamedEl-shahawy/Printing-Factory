import Head from 'next/head'

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';
import Image from "next/image"
import styles from '@styles/Product.module.scss'
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client/core";
export default function Product({product}) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`Find ${product.name}`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <Image alt={product.name} src={product.image.url} height={product.image.height} width={product.image.width} />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1>
            <div className={styles.productDescription} dangerouslySetInnerHTML={{
            __html:product.description?.html
          }} />
            <div className={styles.productDescription} >

              <p>Description</p>
            </div>
            <p className={styles.productPrice}>
              ${product.price}
            </p>
            <p className={styles.productBuy}>
              <Button>
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({params}){
  const client = new ApolloClient({
    uri: process.env.GRAPHQL_KEY,
    cache: new InMemoryCache()
  });
  const data = await client.query({
    query: gql`
     query PageProducts($slug:String) {
      products(where:{slug:$slug}){
    
    price
    name
    id
    description{
      html
    }

    image
  }
}`,
  variables:{
    slug:params.slug
}
});
console.log(data.data)
  return {
     props:{
        product:data.data.products[0]
     }
  }
}
export  async function getStaticPaths(){
  const client = new ApolloClient({
    uri: process.env.GRAPHQL_KEY,
    cache: new InMemoryCache()
  });
  const data = await client.query({
    query: gql`
     query PageProducts {
      products{
    slug
    price
    name
  
  }
}`
});
const paths = data.data.products.map((product)=>{
  return {
    params:{
      slug:product.slug
    }
  }
})
  return{
    paths,
    fallback:false
  }
}