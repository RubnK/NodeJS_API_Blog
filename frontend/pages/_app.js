import '../styles/users.css';
import '../styles/global.css';
import '../styles/article.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

function BlogEFREI({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default BlogEFREI;