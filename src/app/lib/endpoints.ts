import { getBaseUrl } from "../services/apiService";

export const endpoints = {
    login: 'user/login',
    register: 'user/register',
    updateUser: (userId: string) => `user/${userId}`,
    profiles: 'profiles',
    getProfileById: (id: string) => `profiles/${id}`,
    getProfileByIdPopulateDummy: (id: string) => `profiles/${id}/populate-dummy`,
    createProfile: 'profiles',
    updateProfile: (id: string) => `profiles/request/${id}`,
    deleteProfile: (id: string) => `profiles/${id}`,
    getProfileSection: (id: string, text: string) => `profiles/${id}/section?text=${encodeURIComponent(text)}`,
    getProfileSectionRaw: (id: string, text: string) => `profiles/${id}/section?text=${text}`,
    getProductsByUserId: (userId: string) => `product/user/${userId}`,
    createProduct: (userId: string) => `product?userId=${userId}`,
    updateProduct: 'product',
    deleteProduct: (productId: string, userId: string) => `product/${productId}?userId=${userId}`,
    getProductFile: (productId: string, fileName: string) => `product/${productId}/files/${fileName}`,
    getProductImage: (productId: string) => `product/${productId}/image`,
    uploadProductFiles: 'product/files',
    downloadProductTemplate: 'product/download/product-template',
    downloadProductTemplate1: 'product/download/product-template1',
    googleLogin: `${getBaseUrl().replace('/v1/api/', '')}/oauth2/authorization/google`,
    notifications: '/notification',
    verifyOtp: 'user/verify-otp',
    resendOtp: 'user/resend-otp'
}