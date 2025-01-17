import React from 'react'
import Header from './Header'
import Footer from './Footer'
import {Helmet} from 'react-helmet'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';

const Layout = ({children,title,description,keywords,author}) => {
  return (
    <div>
       <Helmet>
        <meta charSet='utf-8'/>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
        <Header/>
        <main style={{minHeight:"76vh"}}>
        <Toaster/>
        {children}
        </main>
        <Footer/>
    </div>
  )
}

Layout.defaultProps = {
  title:'ecommerce app - shop now',
  description:'mern stack project',
  keywords:'mern,react,node,mongoDB,express',
  author:'Mayank'
}

export default Layout