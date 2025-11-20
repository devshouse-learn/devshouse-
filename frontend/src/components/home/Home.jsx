import Hero from './Hero';
import About from './About';
import Impact from './Impact';
import ServiceCards from './ServiceCards';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <About />
      <Impact />
      <ServiceCards />
    </div>
  );
};

export default Home;
