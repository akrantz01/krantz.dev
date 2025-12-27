<script lang="ts">
	import { format } from 'date-fns';

	interface Props {
		value: Date;
	}
	const { value }: Props = $props();

	const formatted = $derived(format(value, 'MMMM do, yyyy'));
</script>

<span>{formatted}</span>
