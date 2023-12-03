import axios from "axios";

axios.defaults.baseURL = "http://localhost/api/";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["Authorization"] = `Token ${localStorage.getItem("token")}`;


export const post = (url: string, data?: object) => {
  return axios.post(url + '/', data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")} `,
    },
  })
}

export const put = (url: string, data?: object) => {
  return axios.put(url + '/', data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")} `,
    },
  })
}

export const getWithAuth = (url: string, data?: object) => {
  return axios.get(url + '/', {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")} `,
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

export const onDeleteAGroup = (groupId: string) => {
  return axios.delete(`groups/delete/${groupId}/`);
}


export const getUsersList = () => {
  return getWithAuth("users");
}

export const getGroupDetails = (groupId: string) => {
  return getWithAuth(`groups/${groupId}`);
}

export const updateGroupDetails = (groupId: string, data: { group_name?: string, members?: string[] }) => {
  return put(`groups/update/${groupId}`, data);
}

export const addChoreToAGroup = (data: {
  name: string,
  description?: string,
  karma_value: number, group: string, assigned_to?: string,
  is_recurring?: boolean,
  due_date?: string,
}) => {
  return post(`chores/create`, data);
}

