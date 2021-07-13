import { RouteProps } from "react-router";

export type Order = 'asc' | 'desc';

export interface User {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
	last_login: string;
	is_superuser: boolean;
}

export enum TableTitles {
	id = "ID",
	username = "Username",
	first_name = "First name",
	last_name = "Last name",
	is_active = "Active",
	last_login = "Last login",
	is_superuser = "Is Superuser",
}
export interface PrivateRouteProps extends RouteProps {
	component: any;
}
