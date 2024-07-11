import Layout from '../components/Layout/Layout'
import React from 'react'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
const CartPage = () => {
    const [auth,setAuth] = useAuth()
    const [cart,setCart] = useCart()
    const navigate = useNavigate()

    //total price 
    const totalPrice = () => {
        try {
          let total = 0;
          cart?.map((item) => {
            total = total + item.price;
          });
          return total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
        } catch (error) {
          console.log(error);
        }
      };

    const removeCartItem=(pid)=>{
        try{
           let myCart = [...cart]
           let index = myCart.findIndex(item => item.id === pid)
           myCart.splice(index,1)
           setCart(myCart)
           localStorage.setItem('cart',JSON.stringify(myCart));
        }
        catch(err){
            console.log(err)
        }
    }
  return (
    <Layout>
        <div className='container'>
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${cart?.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout"
                  }`
                : " Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className='row '>
           <div className='col-md-7'>
                 <div className='row'>
                    <div className='col-md-8 '>
                      {
                        cart?.map((p)=>(
                            <div className='row mb-2 p-2 card flex-row'>
                                <div className='col-md-4'>
                                <img
                  src={`/api/v1/products/product-photo/${p._id}`}
                  className="card-img-top "
                  alt={p.name}
                  style={{height:"12rem"}}
                />
                                </div>
                                <div className='col-md-8'>
                                    <h4>{p.name}</h4>
                                    <p>{p.description.substring(0,30)}...</p>
                                    <h4>price: ${p.price}</h4>
                                    <button className='btn btn-danger' onClick={()=>removeCartItem(p._id)}>Remove </button>
                                </div>

                            </div>
                        )) 
                      }
                    </div>
                </div>  
           </div>
           <div className='col-md-4 text-center'>
                  <h2>Cart Summary</h2>
                  <p>Total | checkout | Payment</p>
                  <hr/>
                  <h4>Total : {totalPrice()}</h4>
                  {auth?.user?.address ? (
                    <div className='mb-3'>
                        <h4>Current Address</h4>
                        <h5>{auth?.user?.address}</h5>
                        <button className='btn btn-outline-warning' onClick={()=>navigate('/dashboard/user/profile')}>Update address</button>
                    </div>
                  ):(
                    <div className='mb-3'>
                        {
                            auth?.token ? (
                               <button className='btn btn-outline-warning' onClick={()=>navigate('/dashboard/user/profile')}>update address</button>
                            ):(
                                <button className='btn btn-outline-warning' onClick={()=>navigate('/login',{state:"/cart"})}>Please login to checkout</button>
                            )
                        }
                    </div>
                  )}
                  <hr/>
                    <div className="mt-2">
                     
                     <h2 className='btn btn-primary' onClick={()=>{toast.success("Payment successfully")
                      navigate('/')
                     }}>Make Payment</h2>
                      
                   </div>
           </div>
        </div>
        </div>
    </Layout>
  )
}

export default CartPage
