

class AuthService {

    async register() {

    }

    async login() {

    }

    async sendOtp(data) {
        return await postCall("/auth/sendOtp", data);
    }

    async verifyOtp(data) {
        return await postCall("/auth/verifyOtp", data);
    }

    async logout() {

    }

    async getCurrentUser() {

    }
}