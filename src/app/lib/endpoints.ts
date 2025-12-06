export const endpoints = {
    login: 'user/login',
    register: 'user/register',
    profiles: 'profiles',
    getProfileById: (id: string) => `profiles/${id}`
}