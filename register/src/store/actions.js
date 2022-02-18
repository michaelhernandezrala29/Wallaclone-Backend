/**
 * actions.js *
 */

import {
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
} from "./types";

export function authRegisterRequest() {
  return {
    type: AUTH_REGISTER_REQUEST,
  };
}

export function authRegisterSuccess() {
  return {
    type: AUTH_REGISTER_SUCCESS,
  };
}

export function authRegisterFailure(error) {
  return {
    type: AUTH_REGISTER_FAILURE,
    error: true,
    payload: error,
  };
}
