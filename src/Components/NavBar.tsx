import styled from "styled-components";
import { Link, useMatch, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	motion,
	useAnimation,
	useScroll,
	useMotionValueEvent,
} from "framer-motion";
import { useState, useEffect } from "react";

const Nav = styled(motion.nav)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	width: 100%;
	height: 5rem;
	font-size: 0.9rem;
	color: ${(props) => props.theme.white.lighter};
	padding: 0 3.5rem;
	z-index: 99;
`;

const NavCol = styled.div`
	display: flex;
	align-items: center;
	:first-child {
		gap: 2rem;
	}
`;

const Logo = styled(motion.svg)`
	width: 95px;
	height: 25px;
	fill: ${(props) => props.theme.red};
	path {
		stroke-width: 6px;
		stroke: black;
	}
`;

const logoVariants = {
	normal: {
		fillOpacity: 1,
	},
	onHover: {
		fillOpacity: [0.75, 0, 0.75],
		transition: {
			repeat: Infinity,
		},
	},
};

const NavColItems = styled.ul`
	display: flex;
	align-items: center;
	gap: 8px;
	position: relative;
`;

const NavColItem = styled.li`
	display: flex;
	padding: 0 12px;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	:hover {
		color: ${(props) => props.theme.white.lighter};
	}
`;

const Search = styled.form`
	color: white;
	display: flex;
	align-items: center;
	position: relative;
	svg {
		height: 25px;
	}
`;

const Input = styled(motion.input)`
	display: flex;
	padding: 8px;
	border: none;
	background-color: transparent;
	color: white;
	:focus {
		outline: none;
	}
`;

const Circle = styled(motion.span)`
	position: absolute;
	width: 6px;
	height: 6px;
	border-radius: 100%;
	background-color: ${(props) => props.theme.white.lighter};
	bottom: -12px;
`;

const SearchIcon = styled(motion.span)`
	:hover {
		cursor: pointer;
	}
`;

const SearchBar = styled(motion.form)`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	border: 1px solid white;
	padding: 0 8px;
	border-radius: 2px;
	position: absolute;
	transform-origin: right center;
	background-color: rgba(255, 255, 255, 0.1);
	right: 3.5rem;
	transition: {
		delaychildren: 0.5;
		staggerchildren: 0.5;
	}
`;

const navVariants = {
	top: {
		backgroundColor: "rgba(0, 0, 0, 0)",
	},
	scroll: {
		backgroundColor: "rgba(0, 0, 0, 1)",
	},
};

interface IForm {
	keyword: string;
}

const SearchCloseBtn = styled.span`
	:hover {
		cursor: pointer;
	}
`;

function NavBar() {
	const homeMatch = useMatch("/");
	const navigate = useNavigate();
	const tvMatch = useMatch("/tv");
	const searchMatch = useMatch("/search");
	const [searchParams, setSearchParams] = useSearchParams();
	const keyword = searchParams.get("keyword");
	console.log("searchparam", searchParams.get("keyword"));
	const [searchOpen, setSearchOpen] = useState(false);
	const searchBarAni = useAnimation();
	const navBarAni = useAnimation();
	const { scrollY } = useScroll();
	useMotionValueEvent(scrollY, "change", (latest) => {
		if (scrollY.get() > 80) {
			navBarAni.start("scroll");
		} else {
			navBarAni.start("top");
		}
	});

	const onClickSearch = () => {
		setSearchOpen((prev) => !prev);
		if (searchOpen) {
			searchBarAni.start({
				scaleX: 0,
			});
		} else {
			searchBarAni.start({ scaleX: 1 });
		}
	};

	const { register, handleSubmit } = useForm<IForm>();
	const onValid = (data: IForm) => {
		navigate(`/search?keyword=${data.keyword}`);
	};
	const onClickClose = () => {
		setSearchOpen(false);
		if (homeMatch) {
			navigate("/");
		} else if (tvMatch) {
			navigate("/tv");
		} else {
			navigate(`/search?keyword=${keyword}`);
		}
	};

	return (
		<Nav variants={navVariants} animate={navBarAni} initial={"top"}>
			<NavCol>
				<Logo
					xmlns="http://www.w3.org/2000/svg"
					width="1024"
					height="276.742"
					viewBox="0 0 1024 276.742"
					whileHover="onHover"
					initial="normal"
					variants={logoVariants}
				>
					<path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
				</Logo>
				<NavColItems>
					<NavColItem>
						<Link to={"/"}>Home</Link>
						{homeMatch && <Circle layoutId="circle" />}
					</NavColItem>
					<NavColItem>
						<Link to={"/tv"}>TV Shows</Link>
						{tvMatch && <Circle layoutId="circle" />}
					</NavColItem>
				</NavColItems>
			</NavCol>
			<NavCol>
				{!searchOpen ? (
					<SearchIcon
						className="material-symbols-outlined"
						onClick={onClickSearch}
						layoutId="searchIcon"
						transition={{ type: "linear" }}
					>
						search
					</SearchIcon>
				) : null}
				{searchOpen ? (
					<SearchBar
						animate={searchBarAni}
						transition={{ type: "linear" }}
						onSubmit={handleSubmit(onValid)}
					>
						<SearchIcon
							className="material-symbols-outlined"
							onClick={onClickSearch}
							layoutId="searchIcon"
						>
							search
						</SearchIcon>
						<Input
							{...register("keyword", { required: true, minLength: 2 })}
							transition={{ delay: 1 }}
							placeholder="Title, Genre, Actor..."
						/>
						{searchOpen && (
							<SearchCloseBtn className="material-icons" onClick={onClickClose}>
								close
							</SearchCloseBtn>
						)}
					</SearchBar>
				) : null}
			</NavCol>
		</Nav>
	);
}

export default NavBar;
