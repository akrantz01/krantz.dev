import type { FC } from 'hono/jsx';

interface Props {
	title: string;
	description: string;
}

const DefaultImage: FC<Props> = ({ title, description }) => (
	<div
		style={{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			color: 'oklch(0.85 0.01 8)',
			backgroundColor: 'oklch(13% 0.126 8deg)',
			fontFamily: "'Noto Sans'",
			fontWeight: 400,
			fontStyle: 'normal',
			padding: '3.5rem'
		}}
	>
		<div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
			<div style={{ width: '256px', height: '256px' }}>
				<img src="icon" />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span style={{ fontSize: 80, fontWeight: 800 }}>{title}</span>
				<span style={{ fontSize: 40 }}>{description}</span>
			</div>
		</div>
	</div>
);

export default DefaultImage;
