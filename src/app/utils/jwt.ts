export interface UserTokenPayload {
    phone: string;
    roles: string[];
    companyName: string;
    name: string;
    designation: string;
    userId: string;
    email: string;
    sub: string;
    iat: number;
    exp: number;
}

export const decodeToken = (token: string): UserTokenPayload | null => {
    try {
        if (!token) return null;

        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};
