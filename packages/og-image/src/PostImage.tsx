import type { FC } from 'hono/jsx';
import { format } from 'date-fns';
import { Tagline, Wrapper } from './components';

interface Site {
	title: string;
	description: string;
}

interface Props {
	title: string;
	date: Date;
	site: Site;
}

const PostImage: FC<Props> = ({ title, date, site }) => (
	<Wrapper style={{ justifyContent: 'space-between' }}>
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
			<span style={{ fontSize: 96, flexGrow: '1' }}>{title}</span>
			<span style={{ fontSize: 36, textAlign: 'right' }}>{format(date, 'MMMM do, yyyy')}</span>
		</div>
		<Tagline {...site} />
	</Wrapper>
);

export default PostImage;
