import type { FC } from 'hono/jsx';

type Size = 'md' | 'lg';

interface Dimensions {
	icon: number;
	title: number;
	description: number;
}

const SIZES: Record<Size, Dimensions> = {
	md: { icon: 192, title: 70, description: 32 },
	lg: { icon: 256, title: 80, description: 40 }
};

interface Props {
	title: string;
	description: string;
	size?: Size;
}

const Tagline: FC<Props> = ({ title, description, size = 'md' }) => {
	const dim = SIZES[size];

	return (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
			<div style={{ width: `${dim.icon}px`, height: `${dim.icon}px` }}>
				<img src="icon" />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span style={{ fontSize: dim.title, fontWeight: 800 }}>{title}</span>
				<span style={{ fontSize: dim.description }}>{description}</span>
			</div>
		</div>
	);
};

export default Tagline;
