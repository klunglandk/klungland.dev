<script lang="ts">
    import Tooltip from './Tooltip.svelte';

    let {
        message = 'Dette er innholdet i tooltipen.',
        triggerMode = 'click',
    }: { message?: string; triggerMode?: 'click' | 'hover' } = $props();
</script>

<Tooltip placement="top">
    {#snippet trigger({ toggle, open })}
        <button
            type="button"
            onclick={triggerMode === 'click' ? toggle : undefined}
            onmouseenter={triggerMode === 'hover' && !open ? toggle : undefined}
            onmouseleave={triggerMode === 'hover' && open ? toggle : undefined}
        >Hover / klikk meg</button>
    {/snippet}
    {message}
</Tooltip>
