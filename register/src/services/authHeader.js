/**
 * authHeader.js
 * Ponemos la cabecera para el JWT si el usuario está autenticado
 * @returns Bearer + token
 */
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return { Authorization: "Bearer " + user.accessToken };
  } else {
    return {};
  }
}
