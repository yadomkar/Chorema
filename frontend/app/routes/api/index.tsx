import axios from "axios"

export const post = (url: string, data?: object) => {
  return axios.post('/api/' + url + '/', data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    baseURL: "http://localhost",
  })
}

export const getWithAuth = (url: string, data?: object) => {
  return axios.get('/api/' + url + '/', {
    baseURL: "http://localhost",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    params: data
  })
}

export const getAllGroups = () => {
  return getWithAuth("groups");
}

export const createNewGroup = (data: { group_name: string; members: string[] }) => {
  return post("groups/create", data);
}


export const getUsersList = () => {
  return getWithAuth("users");
}
