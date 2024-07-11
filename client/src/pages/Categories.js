import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import useCategory from '../hooks/useCategory'

const Categories = () => {
    const categories = useCategory()
  return (
    <Layout title={'All categoies'}>
      <div className='container'>
       <div className='row'>
        {categories.map((c)=>(
            <div className='col-md-6 mt-5 mb-3 gx-3 gy-3'>
             <button className='btn btn-primary text-light'><Link className='btn btn-primary' to={`/category/${c.slug}`}>{c.name}</Link></button>
         </div>
        ))}
         
       </div>
      </div>
    </Layout>
  )
}

export default Categories
