<script lang="ts">
    import Multiselect from './Multiselect.svelte';

    const options = ['React', 'Svelte', 'Vue', 'Angular', 'Solid'];
    let selected = $state<string[]>([]);

    function handleChange() {
        console.log('Selection changed in the Svelte component');
    }
</script>

<Multiselect
    {options}
    bind:selected
    maxSelect={null}
    placeholder="Select your favorite frameworks..."
    onChange={handleChange}
/>
