import Hero from '../sections/Hero'
import Products from '../sections/Products'
import WhySunmount from '../sections/WhySunmount'
import Offers from '../sections/Offers'
import Testimonials from '../sections/Testimonials'
import Team from '../sections/Team'
import useSeo from '../hooks/useSeo'

// The product cards are prerendered so crawlers see all six systems; only their
// 3D canvases load lazily (see components/Model3D).
const Home = () => {
  useSeo('/')
  return (
  <main>
    <Hero />
    <Products />
    <WhySunmount />
    <Offers />
    <Testimonials />
    <Team />
  </main>
  )
}

export default Home
