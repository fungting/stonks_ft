import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import "../css/PowerBI.css";

export default function PowerBI() {
	return (
		<div className="power-bi">
			<Helmet>
				<title>Dashboard | Stonks</title>
			</Helmet>
			<Container fluid>
				<iframe
					title="stonks dashboard - treasury rates"
					width="100%"
					height="800px"
					src="https://app.powerbi.com/view?r=eyJrIjoiZDJjMmUwNDMtOGNiYi00ZjYxLThhOWMtYzBlNDIxNjM3ZWI2IiwidCI6IjFjZmJiZDYwLTI1ZjAtNDU1YS05NzZmLWRmYzRkMTcyYjViOSIsImMiOjEwfQ%3D%3D"
					frameBorder="0"
					allowFullScreen={true}
				/>
			</Container>
		</div>
	);
}
