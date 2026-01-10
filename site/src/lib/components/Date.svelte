<script lang="ts">
	import { format } from 'date-fns';

	interface Props {
		value: Date;
		time?: boolean;
	}
	const { value, time = false }: Props = $props();

	const formatted = $derived(format(value, time ? "MMMM do, yyyy 'at' pp" : 'MMMM do, yyyy'));
</script>

<span>{formatted}</span>
