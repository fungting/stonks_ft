import { useSelector } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { RootState } from "../redux/store/state";

export default function PrivateRoute({ component, ...rest }: RouteProps) {
	const user = useSelector((state: RootState) => state.auth.user);
	const Component = component;
	if (Component == null) {
		return null;
	}
	return (
		<Route
			{...rest}
			render={(props: any) =>
				user ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
}
