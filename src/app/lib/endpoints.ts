export const endpoints = {
    login: 'user/login',
    register: 'user/register',
    profiles: 'profiles',
    getProfileById: (id: string) => `profiles/${id}`,
    getProfileByIdPopulateDummy: (id: string) => `profiles/${id}/populate-dummy`,
    createProfile: 'profiles',
    getProductsByUserId: (userId: string) => `product/user/${userId}`,
    createProduct: (userId: string) => `product?userId=${userId}`,
    updateProduct: 'product',
    deleteProduct: (productId: string, userId: string) => `product/${productId}?userId=${userId}`,
    getProductFile: (productId: string, fileName: string) => `product/${productId}/files/${fileName}`,
    getProductImage: (productId: string) => `product/${productId}/image`,
    uploadProductFiles: 'product/files',
    downloadProductTemplate: 'product/download/product-template',
    downloadProductTemplate1: 'product/download/product-template1',
    googleLogin: 'https://magic-carpet.data-magnum.com/v1/oauth2/authorization/google'
}