import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp  } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state)=> state?.user)
    const [openUserMenu,setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    // const [totalPrice,setTotalPrice] = useState(0)
    // const [totalQty,setTotalQty] = useState(0)
    const { totalPrice, totalQty} = useGlobalContext()
    const [openCartSection,setOpenCartSection] = useState(false)
 
    const redirectToLoginPage = ()=>{
        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }

        navigate("/user")
    }

    //total item and total price
    // useEffect(()=>{
    //     const qty = cartItem.reduce((preve,curr)=>{
    //         return preve + curr.quantity
    //     },0)
    //     setTotalQty(qty)
        
    //     const tPrice = cartItem.reduce((preve,curr)=>{
    //         return preve + (curr.productId.price * curr.quantity)
    //     },0)
    //     setTotalPrice(tPrice)

    // },[cartItem])

  return (
    <header className='h-24 lg:h-20 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95'>
        {
            !(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center px-4 justify-between'>
                    {/**logo */}
                    <div className='h-full'>
                        <Link to={"/"} className='h-full flex justify-center items-center transition-transform duration-200 hover:scale-105'>
                            <img 
                                src={logo}
                                width={170}
                                height={60}
                                alt='logo'
                                className='hidden lg:block'
                            />
                            <img 
                                src={logo}
                                width={120}
                                height={60}
                                alt='logo'
                                className='lg:hidden'
                            />
                        </Link>
                    </div>

                    {/**Search */}
                    <div className='hidden lg:block flex-1 max-w-2xl mx-8'>
                        <Search/>
                    </div>

                    {/**login and my cart */}
                    <div className='flex items-center gap-4'>
                        {/**user icons display in only mobile version**/}
                        <button 
                            className='text-neutral-600 lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors' 
                            onClick={handleMobileUser}
                            aria-label='User account'
                        >
                            <FaRegCircleUser size={26}/>
                        </button>

                        {/**Desktop**/}
                        <div className='hidden lg:flex items-center gap-6'>
                            {
                                user?._id ? (
                                    <div className='relative'>
                                        <button 
                                            onClick={()=>setOpenUserMenu(preve => !preve)} 
                                            className='flex select-none items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-700'
                                        >
                                            <FaRegCircleUser size={20}/>
                                            <span>Account</span>
                                            {
                                                openUserMenu ? (
                                                    <GoTriangleUp size={20} className='transition-transform'/> 
                                                ) : (
                                                    <GoTriangleDown size={20} className='transition-transform'/>
                                                )
                                            }
                                        </button>
                                        {
                                            openUserMenu && (
                                                <div className='absolute right-0 top-14 animate-slideDown'>
                                                    <div className='bg-white rounded-xl p-2 min-w-56 shadow-xl border border-gray-200'>
                                                        <UserMenu close={handleCloseUserMenu}/>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <button 
                                        onClick={redirectToLoginPage} 
                                        className='px-6 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-all duration-200'
                                    >
                                        Login
                                    </button>
                                )
                            }
                            <button 
                                onClick={()=>setOpenCartSection(true)} 
                                className='relative flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-2.5 rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                            >
                                {/**add to cart icons */}
                                <div className='relative'>
                                    <BsCart4 size={24}/>
                                    {cartItem[0] && (
                                        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse'>
                                            {totalQty}
                                        </span>
                                    )}
                                </div>
                                <div className='font-semibold text-sm'>
                                    {
                                        cartItem[0] ? (
                                            <div>
                                                <p className='text-xs opacity-90'>Cart Total</p>
                                                <p className='text-base'>{DisplayPriceInRupees(totalPrice)}</p>
                                            </div>
                                        ) : (
                                            <p>My Cart</p>
                                        )
                                    }
                                </div>    
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        
        <div className='container mx-auto px-4 lg:hidden'>
            <Search/>
        </div>

        {
            openCartSection && (
                <DisplayCartItem close={()=>setOpenCartSection(false)}/>
            )
        }
    </header>
  )
}

export default Header
