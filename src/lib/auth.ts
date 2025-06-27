import axios from 'axios';

export async function loginUser({ email, password }) {
    try {
        const res = await axios.post('https://z.satyamjha.me/auth/signin', {
            email,
            password
        });
        console.log("res.data", res.data)
        return res.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}


export async function signupUser({ name, email, password, referralCode }) {
    const payload: { name: any; email: any; password: any; referralCode?: any } = { name, email, password };
    if (referralCode) payload.referralCode = referralCode;

    const res = await axios.post('https://z.satyamjha.me/auth/signup', payload);
    return res.data;
}