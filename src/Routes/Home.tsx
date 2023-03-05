import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const Span = styled.span`
	display: block;
	padding: 200px;
`;

function Home() {
	return (
		<Container>
			<Span>Hi</Span>
			<Span>Hi</Span>
			<Span>Hi</Span>
			<Span>Hi</Span>
			<Span>Hi</Span>
			<Span>Hi</Span>
			<Span>Hi</Span>
		</Container>
	);
}

export default Home;
