import Head from 'next/head'
import LocationProofGenerator from '../components/LocationProofGenerator'

export default function Home() {
  return (
    <>
      <Head>
        <title>GeoPrivacy - Preuves de Localisation à Connaissance Nulle</title>
        <meta name="description" content="Générez des preuves de localisation sécurisées et privées" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LocationProofGenerator />
    </>
  )
}
