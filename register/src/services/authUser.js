/**
 * authUser.js
 */
import axios from "axios";
import authHeader from "./authHeader";

const BASE_URL = "http://localhost:8080/auth";

class UserService {
  getUserBoard() {
    return axios.get(BASE_URL + "user", { headers: authHeader() });
  }
  getAnonymousBoard() {
    return axios.get(BASE_URL + "anonymous", { headers: authHeader() });
  }
}

export default new UserService();
