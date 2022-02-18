import axios from "axios";
const BASE_URL = "http://localhost:8080/auth/";
class AuthService {
  //   async login(username, password) {
  //     const response = await axios.post(BASE_URL + "signin", {
  //       username,
  //       password,
  //     });
  //     if (response.data.accessToken) {
  //       localStorage.setItem("user", JSON.stringify(response.data));
  //     }
  //     return response.data;
  //   }
  //   logout() {
  //     localStorage.removeItem("user");
  //   }
  register(username, email, password) {
    return axios.post(BASE_URL + "signup", {
      username,
      email,
      password,
    });
  }
}
export default new AuthService();
