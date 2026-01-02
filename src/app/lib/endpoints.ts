export const endpoints = {
    login: 'user/login',
    register: 'user/register',
    profiles: 'profiles',
    getProfileById: (id: string) => `profiles/${id}`,
    getProfileByIdPopulateDummy: (id: string) => `profiles/${id}/populate-dummy`,
    createProfile: 'profiles',
    getProductsByUserId: (userId: string) => `product/user/${userId}`,
    createProduct: (userId: string) => `products?userId=${userId}`,
    updateProduct: 'products',
    deleteProduct: (productId: string, userId: string) => `products/${productId}?userId=${userId}`,
    uploadProductFiles: 'products/products/files',
    downloadProductTemplate: 'profiles/download/product-template',
    downloadProductTemplate1: 'profiles/download/product-template1',
    googleLogin: 'https://magic-carpet.data-magnum.com/v1/oauth2/authorization/google'
}