import type { FC, JSX, PropsWithChildren } from 'hono/jsx';

interface Props {
	style?: JSX.CSSProperties;
}

const Wrapper: FC<PropsWithChildren<Props>> = ({ style, children }) => (
	<div
		style={{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			color: 'oklch(0.85 0.01 8)',
			backgroundColor: 'oklch(13% 0.126 8deg)',
			fontFamily: "'Noto Sans'",
			fontWeight: 400,
			fontStyle: 'normal',
			padding: '3.5rem',
			...style
		}}
	>
		{children}
	</div>
);

export default Wrapper;
