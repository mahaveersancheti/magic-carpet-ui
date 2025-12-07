export const endpoints = {
    login: 'user/login',
    register: 'user/register',
    profiles: 'profiles',
    getProfileById: (id: string) => `profiles/${id}`,
    getProfileByIdPopulateDummy: (id: string) => `profiles/${id}/populate-dummy`,
    createProfile: 'profiles',
    googleLogin: 'http://magic-carpet.data-magnum.com:8080/oauth2/authorization/google'
}