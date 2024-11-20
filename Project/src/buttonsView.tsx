import React from "react";

interface ButtonsViewInterface {
	exampleFiles: string[];
	handleFileSelected: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	fileSelectorLabel: string;
	handleFileImported: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleLeftArrowClick: () => void;
	handleRightArrowClick: () => void;
	handleDoubleLeftArrowClick: () => void;
	handleDoubleRightArrowClick: () => void;
	handleViewSwitch: () => void;
	is3DView: boolean;
	handleHeatmapSwitch: () => void;
	isHeatmap: boolean;
}

const ButtonsView: React.FC<ButtonsViewInterface> = ({
	exampleFiles,
	handleFileSelected,
	fileSelectorLabel,
	handleFileImported,
	handleLeftArrowClick,
	handleRightArrowClick,
	handleDoubleLeftArrowClick,
	handleDoubleRightArrowClick,
	handleViewSwitch,
	is3DView,
	handleHeatmapSwitch,
	isHeatmap,
}) => {
	return (
		<div
			style={{
				backgroundColor: "transparent",
				padding: "10px",
				display: "flex",
				flexDirection: "row",
				position: "absolute",
				top: "25px",
				left: "25px",
				zIndex: 10,
			}}
		>
			<select onChange={handleFileSelected} value={fileSelectorLabel}>
				<option value="-" disabled>
					Escolha um exemplo
				</option>
				<optgroup label="Grafos prontos">
					{exampleFiles.map((file) => (
						<option key={file} value={file}>
							{`Exemplo ${file.replace(".json", "")}`}
						</option>
					))}
				</optgroup>
			</select>
			<input
				id="fileInput"
				type="file"
				accept=".json, .in"
				onChange={handleFileImported}
				style={{
					marginLeft: "10px",
					backgroundColor: "white",
					paddingRight: "10px",
					width: "auto",
				}}
			/>
			<div
				style={{
					position: "fixed",
					top: "25px",
					right: "25px",
					display: "flex",
					flexDirection: "row",
				}}
			>
				<button
					onClick={handleDoubleLeftArrowClick}
					style={{
						fontSize: "16px",
						padding: "4px 8px",
						marginRight: "16px",
					}}
				>
					&#8678;
				</button>
				<button
					onClick={handleLeftArrowClick}
					style={{
						fontSize: "16px",
						padding: "8px 16px",
					}}
				>
					&#8592;
				</button>
				<button
					onClick={handleRightArrowClick}
					style={{
						fontSize: "16px",
						padding: "8px 16px",
						marginLeft: "16px",
					}}
				>
					&#8594;
				</button>
				<button
					onClick={handleDoubleRightArrowClick}
					style={{
						fontSize: "16px",
						padding: "4px 8px",
						marginLeft: "16px",
					}}
				>
					&#8680;
				</button>
				<button
					onClick={handleViewSwitch}
					style={{
						marginLeft: "16px",
						padding: "8px 16px",
						backgroundColor: is3DView ? "#4cd964" : "#ccc",
						color: "white",
						border: "none",
						borderRadius: "20px",
						cursor: "pointer",
						transition: "background-color 0.3s",
					}}
				>
					{is3DView ? "3D View" : "2D View"}
				</button>
				<button
					onClick={handleHeatmapSwitch}
					style={{
						marginLeft: "16px",
						padding: "8px 16px",
						backgroundColor: isHeatmap ? "#4cd964" : "#ccc",
						color: "white",
						border: "none",
						borderRadius: "20px",
						cursor: "pointer",
						transition: "background-color 0.3s",
					}}
				>
					{isHeatmap ? "Hide Heatmap" : "Show Heatmap"}
				</button>
			</div>
		</div>
	);
};

export default ButtonsView;
