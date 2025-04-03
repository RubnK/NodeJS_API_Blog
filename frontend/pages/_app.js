import { AuthProvider } from "../context/AuthContext";
import '../styles/users.css';
import '../styles/style.css'; 
import '../styles/global.css';
import '../styles/article.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;