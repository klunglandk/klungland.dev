<script lang="ts">
    import Tooltip from './Tooltip.svelte';
</script>

<Tooltip placement="top">
    {#snippet trigger({ toggle })}
        <button type="button" onclick={toggle}>Hover / klikk meg</button>
    {/snippet}
    Dette er innholdet i tooltipen.
</Tooltip>
