import type { FC } from 'hono/jsx';
import { Wrapper, Tagline } from './components';

interface Props {
	title: string;
	description: string;
}

const DefaultImage: FC<Props> = ({ title, description }) => (
	<Wrapper style={{ justifyContent: 'center' }}>
		<Tagline title={title} description={description} size="lg" />
	</Wrapper>
);

export default DefaultImage;
