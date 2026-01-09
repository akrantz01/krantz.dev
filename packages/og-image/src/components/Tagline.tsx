import type { FC } from 'hono/jsx';

interface Props {
	title: string;
	description: string;
}

const Tagline: FC<Props> = ({ title, description }) => (
	<div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
		<div style={{ width: '256px', height: '256px' }}>
			<img src="icon" />
		</div>
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<span style={{ fontSize: 80, fontWeight: 800 }}>{title}</span>
			<span style={{ fontSize: 40 }}>{description}</span>
		</div>
	</div>
);

export default Tagline;
