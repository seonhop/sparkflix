import styled from "styled-components";
import { motion } from "framer-motion";
import { ISliderBtnPos } from "../../Interfaces/Components/ISlider";

const SliderBtn = styled(motion.div)<{ pos: ISliderBtnPos }>`
	opacity: 0;
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	width: 3.5rem;
	height: 120px;
	display: flex;
	left: ${(props) => (props.pos === "left" ? 0 : "none")};
	right: ${(props) => (props.pos === "right" ? 0 : "none")};
	justify-content: center;
	align-items: center;
	font-size: 48px;
	:hover {
		cursor: pointer;
	}
`;

export const SliderBtnBigMovie = styled(SliderBtn)`
	top: 15%;
`;

const sliderBtnVariants = {
	hidden: {
		opacity: 0,
		scale: 1,
	},
	hover: {
		scale: 1,
		opacity: 1,
		transition: {
			duaration: 0,
			type: "tween",
		},
	},
};

const SliderBtnIcon = styled(motion.span)``;

export interface ISliderBtnProps {
	manipulateIndex: (sliderBtnPos: ISliderBtnPos, maxIndex: number) => void;
	maxIndex: number;
	dirRight: boolean;
	inBigMovie: boolean;
}

export function SliderButton({
	manipulateIndex,
	maxIndex,
	inBigMovie,
}: ISliderBtnProps) {
	return (
		<>
			<SliderBtn
				variants={sliderBtnVariants}
				transition={{ type: "tween" }}
				pos="left"
				onClick={() => manipulateIndex("left", maxIndex)}
				style={{ top: inBigMovie ? "15%" : "0" }}
			>
				<SliderBtnIcon className="material-icons">arrow_back_ios</SliderBtnIcon>
			</SliderBtn>
			<SliderBtn
				variants={sliderBtnVariants}
				transition={{ type: "tween" }}
				pos="right"
				onClick={() => manipulateIndex("right", maxIndex)}
			>
				<SliderBtnIcon className="material-icons">
					arrow_forward_ios
				</SliderBtnIcon>
			</SliderBtn>
		</>
	);
}
