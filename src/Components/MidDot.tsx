import styled from "styled-components";
const MidDotContainer = styled.span`
	color: ${(props) => props.theme.white.darker};
	margin: 0 4px;
`;

export function MidDot() {
	return <MidDotContainer>•</MidDotContainer>;
}
