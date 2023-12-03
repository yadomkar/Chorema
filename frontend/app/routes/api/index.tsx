import axios from "axios";

export const post = (url: string, data?: object) => {
  return axios.post("/api/" + url + "/", data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    baseURL: "http://localhost",
  });
};

export const put = (url: string, data?: object) => {
  return axios.put("/api/" + url + "/", data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    baseURL: "http://localhost",
  });
};

export const getWithAuth = (url: string, data?: object) => {
  return axios.get("/api/" + url + "/", {
    baseURL: "http://localhost",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    params: data,
  });
};

export const getAllGroups = () => {
  return getWithAuth("groups");
};

export const createNewGroup = (data: {
  group_name: string;
  members: string[];
}) => {
  return post("groups/create", data);
};

export const getUsersList = () => {
  return getWithAuth("users");
};

export const getGroupDetails = (groupId: string) => {
  return getWithAuth(`groups/${groupId}`);
};

export const getGroupTransactions = (groupId: string) => {
  return getWithAuth(`groups/transactions/${groupId}`);
};

export const updateGroupDetails = (
  groupId: string,
  data: { group_name?: string; members?: string[] },
) => {
  return put(`groups/update/${groupId}`, data);
};
