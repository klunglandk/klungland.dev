<script lang="ts">
    import { Multiselect } from '@klungland/multiselect';

    let {
        allowUserOptions = false,
        disabled = false,
        loading = false,
        maxSelect = null,
        minSelect = 0,
        maxOptions = null,
        placeholder = 'Select your favorite frameworks...',
        width,
        height = 330,
        scrollX = true,
        scrollY = true,
        selectAllOption,
    }: {
        allowUserOptions?: boolean;
        disabled?: boolean;
        loading?: boolean;
        maxSelect?: number | null;
        minSelect?: number;
        maxOptions?: number | null;
        placeholder?: string;
        width?: string;
        height?: number;
        scrollX?: boolean;
        scrollY?: boolean;
        selectAllOption?: boolean;
    } = $props();

    const options = ['React', 'Svelte', 'Vue', 'Angular', 'Solid'];
    let selected = $state<string[]>([]);
</script>

<Multiselect
    {options}
    bind:selected
    {maxSelect}
    {minSelect}
    {maxOptions}
    {placeholder}
    {width}
    {height}
    {scrollX}
    {scrollY}
    {selectAllOption}
    {allowUserOptions}
    {disabled}
    {loading}
/>
