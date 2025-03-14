import { AuthProvider } from "../context/AuthContext";
import '../styles/users.css';
import '../styles/style.css'; 
import '../styles/global.css';
import '../styles/article.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;