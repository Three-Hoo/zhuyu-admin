import NextNProgress from 'nextjs-progressbar';

export default function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <NextNProgress />
      <Component {...pageProps} />;
    </>
  );
}