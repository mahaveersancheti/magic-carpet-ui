export const endpoints = {
    login: 'user/login',
    register: 'user/register',
    profiles: 'profiles',
    getProfileById: (id: string) => `profiles/${id}`,
    getProfileByIdPopulateDummy: (id: string) => `profiles/${id}/populate-dummy`,
    createProfile: 'profiles',
    getProductsByUserId: (userId: string) => `products/user/${userId}`,
    createProduct: (userId: string) => `products?userId=${userId}`,
    updateProduct: (productId: string, userId: string) => `products/${productId}?userId=${userId}`,
    deleteProduct: (productId: string, userId: string) => `products/${productId}?userId=${userId}`,
    googleLogin: 'https://magic-carpet.data-magnum.com/v1/oauth2/authorization/google'
}