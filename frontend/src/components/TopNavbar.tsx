import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../redux/store/state";
import "../css/NavBar.css";
import { Col, Container, Dropdown, Nav, Navbar, Row } from "react-bootstrap";
import { SearchForm } from "./SearchForm";
import { env } from "../env";
import { logoutThunk } from "../redux/auth/thunk";
import { toggleThemeAction } from "../redux/theme/action";
import { push } from "connected-react-router";

export default function NavBar() {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.auth.user);
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<nav className="nav-bar">
			<Container fluid>
				<Row className="align-items-center">
					<Col xs={3}>
						{!user && (
							<div className="login">
								<NavLink className="non-user" to="/login">
									Login
								</NavLink>
								<NavLink className="non-user" to="/login">
									Register
								</NavLink>
							</div>
						)}
						{user && (
							<Dropdown>
								<Dropdown.Toggle className="user-avatar-btn">
									<img
										className="user-avatar"
										src={`${env.url}/${user.payload.avatar}`}
										alt="user-avatar"
									/>
								</Dropdown.Toggle>
								<Dropdown.Menu variant={theme}>
									<Dropdown.Item onClick={() => dispatch(push(`/portfolio`))}>
										{user.payload.username}
									</Dropdown.Item>
									{/* <Dropdown.Item>
										<NavLink className="dropdown-item" to="/setting">
										User Setting
										</NavLink>
									</Dropdown.Item> */}
									<Dropdown.Item onClick={() => dispatch(toggleThemeAction())}>
										Change Theme
									</Dropdown.Item>
									<Dropdown.Item onClick={() => dispatch(logoutThunk())}>Log Out</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						)}
					</Col>
					<Col xs={6} className="brand-name">
						<NavLink to="/">
							<span>STONKS</span>
							<div>Tecky Academy</div>
						</NavLink>
					</Col>
					<Col xs={3} className="search-bar">
						<SearchForm />
					</Col>
				</Row>
			</Container>
			<Navbar collapseOnSelect expand="md" className="blue" variant="dark">
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="m-auto">
						<Nav.Link href="#" onClick={() => dispatch(push("/"))}>
							<span className="nav-item">Home</span>
						</Nav.Link>
						<Nav.Link href="#" onClick={() => dispatch(push("/watchlist"))}>
							<span className="nav-item">Watchlist</span>
						</Nav.Link>
						<Nav.Link href="#" onClick={() => dispatch(push("/screener"))}>
							<span className="nav-item">Screener</span>
						</Nav.Link>
						<Nav.Link href="#" onClick={() => dispatch(push("/portfolio"))}>
							<span className="nav-item">Portfolio</span>
						</Nav.Link>
						<Nav.Link href="#" onClick={() => dispatch(push("/dashboard"))}>
							<span className="nav-item">Dashboard</span>
						</Nav.Link>
						<Nav.Link href="#" onClick={() => dispatch(push("/calendar"))}>
							<span className="nav-item">Calendar</span>
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</nav>
	);
}
