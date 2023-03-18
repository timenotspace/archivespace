// pages/index.tsx
import Head from 'next/head';
import Scene from '../components/Scene';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>3D App</title>
        <meta name="description" content="3D multiplayer app with Next.js and Three.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Scene />
      </main>
    </div>
  );
};

export default Home;
