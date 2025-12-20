import React, { useState, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const UploadCategoryModel = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)

    // Handle image upload with comprehensive error handling
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0]
        
        if (!file) {
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (jpg, png, gif, etc.)')
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        try {
            setLoading(true)
            
            // Create FormData
            const formData = new FormData()
            formData.append('image', file)

            // Make API call
            const response = await Axios({
                ...SummaryApi.uploadImage,
                data: formData
            })

            // SAFE access to response data
            if (response && response.data) {
                
                if (response.data.success && response.data.data && response.data.data.url) {
                    // Success!
                    setData(prev => ({
                        ...prev,
                        image: response.data.data.url
                    }))
                    toast.success('Image uploaded successfully! ✅')
                } else {
                    // API returned but without expected data
                    toast.error(response.data.message || 'Upload failed - unexpected response')
                }
            } else {
                // No response data at all
                toast.error('Upload failed - no response from server')
            }

        } catch (error) {
            // Handle different error types
            if (error.response) {
                // Server responded with error
                const status = error.response.status
                const message = error.response.data?.message || 'Upload failed'
                
                if (status === 401) {
                    toast.error('Please login again')
                } else if (status === 413) {
                    toast.error('File too large')
                } else if (status === 500) {
                    toast.error('Server error. Check Cloudinary credentials.')
                } else {
                    toast.error(message)
                }
            } else if (error.request) {
                // Request made but no response
                toast.error('No response from server. Check if backend is running.')
            } else {
                // Error in request setup
                toast.error('Upload error: ' + error.message)
            }

            // Use AxiosToastError if available
            if (typeof AxiosToastError === 'function') {
                AxiosToastError(error)
            }

        } finally {
            setLoading(false)
        }
    }

    // Trigger file input
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    // Remove uploaded image
    const handleRemoveImage = () => {
        setData(prev => ({
            ...prev,
            image: ""
        }))
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        toast.success('Image removed')
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!data.name) {
            toast.error('Please enter category name')
            return
        }

        if (!data.image) {
            toast.error('Please upload an image')
            return
        }

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addCategory,
                data: data
            })

            // Safe access
            if (response?.data?.success) {
                toast.success('Category created successfully! 🎉')
                close()
                if (typeof fetchData === 'function') {
                    fetchData()
                }
            } else {
                toast.error(response?.data?.message || 'Failed to create category')
            }

        } catch (error) {
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Failed to create category')
            }

            if (typeof AxiosToastError === 'function') {
                AxiosToastError(error)
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white w-full max-w-md p-6 rounded-lg shadow-xl'>
                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-semibold'>Add Category</h2>
                    <button 
                        onClick={close}
                        className='text-gray-500 hover:text-red-500 transition-colors'
                        type='button'
                    >
                        <IoClose size={25} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Category Name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Category Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            placeholder='e.g., Vegetables & Fruits'
                            value={data.name}
                            onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Category Image <span className='text-red-500'>*</span>
                        </label>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            onChange={handleImageUpload}
                            className='hidden'
                            disabled={loading}
                        />

                        {!data.image ? (
                            // Upload button
                            <button
                                type='button'
                                onClick={handleUploadClick}
                                disabled={loading || !data.name}
                                className={`w-full py-4 border-2 border-dashed rounded-lg transition-all text-center
                                    ${loading ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-wait' :
                                      !data.name ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' :
                                      'border-green-500 bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer'
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className='flex items-center justify-center gap-2'>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-green-600'></div>
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    <div>
                                        <div className='text-3xl mb-2'>📤</div>
                                        <div className='font-medium'>Click to Upload Image</div>
                                        <div className='text-xs text-gray-500 mt-1'>JPG, PNG, GIF (Max 5MB)</div>
                                    </div>
                                )}
                            </button>
                        ) : (
                            // Image preview
                            <div className='relative border-2 border-green-500 rounded-lg overflow-hidden'>
                                <img
                                    src={data.image}
                                    alt='Category preview'
                                    className='w-full h-48 object-cover'
                                />
                                <button
                                    type='button'
                                    onClick={handleRemoveImage}
                                    className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg'
                                    disabled={loading}
                                >
                                    <IoClose size={20} />
                                </button>
                                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3'>
                                    <p className='text-white text-sm font-medium'>✅ Image uploaded</p>
                                </div>
                            </div>
                        )}

                        {!data.name && (
                            <p className='text-xs text-amber-600 mt-2 flex items-center gap-1'>
                                💡 Enter category name first to enable upload
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading || !data.name || !data.image}
                        className={`w-full py-3 rounded-lg font-medium transition-all
                            ${loading || !data.name || !data.image
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                            }
                        `}
                    >
                        {loading ? (
                            <span className='flex items-center justify-center gap-2'>
                                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                                Creating...
                            </span>
                        ) : (
                            'Create Category'
                        )}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default UploadCategoryModel