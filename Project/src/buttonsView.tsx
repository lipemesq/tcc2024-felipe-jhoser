import React from "react";

interface ButtonsViewInterface {
	exampleFiles: string[];
	handleFileSelected: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	fileSelectorLabel: string;
	handleFileImported: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ButtonsView: React.FC<ButtonsViewInterface> = ({
	exampleFiles,
	handleFileSelected,
	fileSelectorLabel,
	handleFileImported,
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
				{/* <optgroup label="Calcular aliança">
						{inputFiles.map((file) => (
							<option key={file} value={file}>
								{`Input ${file.replace(".in", "")}`}
							</option>
						))}
					</optgroup> */}
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
		</div>
	);
};

export default ButtonsView;
