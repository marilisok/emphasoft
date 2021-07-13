import axios from "axios";
import {API_TOKEN_AUTH, API_V1_USERS, BASE_URL} from "./general/constants";


export const signIn = async (username: string, password: string) => {
	return await axios
		.post(`${BASE_URL}${API_TOKEN_AUTH}`, {
			username: username,
			password: password,
		})
};

export const getUsers = async (token: string) =>{
	return await axios.get(`${BASE_URL}${API_V1_USERS}`, {
		headers: {
			Authorization: `Token ${token}`,
		},
	});
};
