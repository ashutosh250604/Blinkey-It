import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
  }


  return (
   <section className='bg-gradient-to-b from-blue-50 to-white min-h-screen'>
      {/* Hero Banner */}
      <div className='container mx-auto px-4 py-6'>
          <div className={`w-full h-full min-h-48 rounded-2xl overflow-hidden shadow-xl ${!banner && "animate-pulse bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 bg-[length:200%_100%]"} `}>
              <img
                src={banner}
                onClick={() => {
                  const paanCorner = categoryData.find(cat => cat.name.toLowerCase().includes('paan corner'));
                  if (paanCorner) handleRedirectProductListpage(paanCorner._id, paanCorner.name);
                }}
                className='w-full h-full hidden lg:block object-cover cursor-pointer hover:opacity-95 transition-opacity'
                alt='banner' 
              />
              <img
                src={bannerMobile}
                onClick={() => {
                  const homeOffice = categoryData.find(cat => cat.name.toLowerCase().includes('home') && cat.name.toLowerCase().includes('office'));
                  if (homeOffice) {
                    const poojaNeeds = subCategoryData.find(sub => sub.name.toLowerCase().includes('pooja needs'));
                    if (poojaNeeds) {
                      navigate(`/${valideURLConvert(homeOffice.name)}-${homeOffice._id}/${valideURLConvert(poojaNeeds.name)}-${poojaNeeds._id}`);
                    }
                  }
                }}
                className='w-full h-full lg:hidden object-cover cursor-pointer hover:opacity-95 transition-opacity'
                alt='banner' 
              />
          </div>
      </div>
      
      {/* Categories Section */}
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>Shop by Category</h2>
          <p className='text-gray-700'>Browse through our wide range of product categories</p>
        </div>

        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded-xl p-4 shadow-md'>
                    <div className='bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] aspect-square rounded-lg mb-3'></div>
                    <div className='bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] h-4 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div 
                    key={cat._id+"displayCategory"} 
                    onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                    className='group cursor-pointer bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-blue-300 animate-fadeIn'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className='aspect-square overflow-hidden rounded-lg bg-gray-50 mb-2'>
                        <img 
                          src={cat.image}
                          alt={cat.name}
                          className='w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300'
                        />
                    </div>
                    <p className='text-xs lg:text-sm font-medium text-gray-900 text-center line-clamp-2 group-hover:text-blue-600 transition-colors'>
                      {cat.name}
                    </p>
                  </div>
                )
              })
              
            )
          }
        </div>
      </div>

      {/***display category product */}
      <div className='container mx-auto px-4 space-y-12 pb-12'>
        {
          categoryData?.map((c,index)=>{
            return(
              <div key={c?._id+"CategorywiseProduct"} className='animate-slideUp' style={{ animationDelay: `${index * 100}ms` }}>
                <CategoryWiseProductDisplay 
                  id={c?._id} 
                  name={c?.name}
                />
              </div>
            )
          })
        }
      </div>
   </section>
  )
}

export default Home
