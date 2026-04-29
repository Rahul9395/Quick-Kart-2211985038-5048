import React from 'react'
import Navbar from '../components/Navbar'
import PosterSlider from '../components/PosterSlider '
import ViewCategory from '../components/ViewCategory'
import ProductDis from '../components/ProductDis'
import Footer from '../components/Footer'

function Home() {
  return (
    <div>
        <Navbar />
        <PosterSlider />
        <ViewCategory />
        <ProductDis />
        <Footer />

      
    </div>
  )
}

export default Home
