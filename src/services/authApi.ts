import { credentialsService } from 'utils/axios';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await credentialsService.post('/auth/login', credentials);

    console.log('LOGIN RESPONSE DATA:', res.data);

    // ✅ Use the real field from your backend response
    const token = res.data?.token?.accessToken ?? null;

    if (token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    return res;
  },

  register: (data: { email: string; password: string; firstname: string; lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data)
};
