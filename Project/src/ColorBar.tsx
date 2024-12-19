import React from "react";
import { getColorFromTemp } from "./colors";

interface ColorBarProps {
	stepCount: Map<number, number>;
}

const ColorBar: React.FC<ColorBarProps> = ({ stepCount }) => {
	const colors = Array.from({ length: 10 }, (_, i) => {
		const heat = i / 9; // Dividir o intervalo de 0 a 1 em 10 partes
		const { r, g, b } = getColorFromTemp(heat);
		return `rgb(${r}, ${g}, ${b})`;
	}).reverse();

	const maxStep = Math.max(...Array.from(stepCount.values()));

	// const sortedSteps = Array.from({ length: 10 }, (_, i) => [
	// 	i * (maxStep / 10),
	// 	i * (maxStep / 10),
	// ]);

	var sortedSteps: number[] = [];
	for (let i = 10; i >= 1; i--) {
		const x = Math.floor((maxStep / 10) * i);
		sortedSteps.push(x);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				position: "fixed",
				right: "5px",
				bottom: "0",
				height: "50vh",
				width: "100px",
				backgroundColor: "white",
				padding: "12px",
				boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
				zIndex: 9999,
			}}
		>
			<div
				style={{
					marginRight: "10px",
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				{sortedSteps.map((step, index) => (
					<div
						key={step}
						style={{
							height: "10%",
							display: "flex",
							alignItems: "center",
						}}
					>
						{step}
					</div>
				))}
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "50px",
					height: "100%",
				}}
			>
				{colors.map((color, index) => (
					<div
						key={index}
						style={{
							backgroundColor: color,
							width: "100%",
							height: "10%",
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default ColorBar;
