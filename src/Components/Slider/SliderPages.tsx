import styled from "styled-components";
import { motion } from "framer-motion";
import { SLIDER_MARGIN } from "../../utils/consts";

interface IPaginationProps {
	maxindex: number;
	currindex: number;
	margin: number;
}

const Pagination = styled(motion.div)<IPaginationProps>`
	opacity: 0;
	margin-right: 3.5rem;
	display: grid;
	position: absolute;
	right: 0;
	top: -20px;
	z-index: 10;
	grid-template-columns: repeat(${(props) => props.maxindex + 1}, 1fr);
	grid-gap: 2px;
	> div {
		height: 2px;
		width: 20px;
		background-color: ${(props) => props.theme.black.lighter};
	}
	> div:nth-child(${(props) => props.currindex + 1}) {
		background-color: ${(props) => props.theme.white.darker};
	}
`;

const BigMoviePagination = styled(Pagination)`
	margin-right: 0;
`;

const paginationVariants = {
	hidden: {
		opacity: 0,
	},
	hover: {
		opacity: 1,
		transition: {
			duration: 0.1,
			type: "tween",
		},
	},
};

export interface ISliderPages {
	maxIndex: number;
	index: number;
}

export function SliderPages({ maxIndex, index }: ISliderPages) {
	return (
		<Pagination
			maxindex={maxIndex}
			currindex={index}
			margin={SLIDER_MARGIN}
			variants={paginationVariants}
		>
			{Array(maxIndex + 1)
				.fill(null)
				.map((_, index) => (
					<div key={index}></div>
				))}
		</Pagination>
	);
}
