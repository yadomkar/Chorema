import axios from "axios"

export const post = (url: string, data?: object) => {
  return axios.post('/api/' + url + '/', data, {
    headers: {
      "WWW-Authenticate": localStorage.getItem("token"),
    },
    baseURL: "http://localhost",
  })
}

export const getWithAuth = (url: string, data?: object) => {
  return axios.get('/api/' + url + '/', {
    baseURL: "http://localhost",
    headers: {
      "WWW-Authenticate": localStorage.getItem("token"),
    },
    params: data
  })
}

export const getAllGroups = () => {
  return getWithAuth("groups");
}
