<script module>
    let idCounter = 0;
</script>

<script lang="ts">
    import { untrack } from 'svelte';
    import { autoUpdate, computePosition, flip, shift, size } from '@floating-ui/dom';

    type MultiselectOption = { label: string; value: string | number } | string | number;

    // Multiselect component that allows users to select one or more options from a dropdown list
    // allowUserOptions: If true, users can add their own options that are not in the provided list
    // disabled: If true, the multiselect is disabled and cannot be interacted with
    // loading: If true, a loading message is displayed in the dropdown
    // maxOptions: Maximum number of options to display in the dropdown (null for no limit)
    // minSelect: Minimum number of options that must be selected (default is 0)
    // maxSelect: Maximum number of options that can be selected (null for no limit)
    // If maxSelect is 1, the component behaves like a single select dropdown
    // contextKey: A key that can be used to reset user added options when the context changes (e.g., switching to a different filter)
    // Uses floating-ui to position the dropdown and ensure it fits within the viewport

    let {
        allowUserOptions = false,
        disabled = false,
        id,
        loading = false,
        maxOptions = null,
        maxSelect = null,
        minSelect = 0,
        onChange,
        onClose,
        onOpen,
        onRemove,
        onRemoveAll,
        options,
        placeholder = '',
        required = false,
        contextKey,
        selectAllOption,
        selected = $bindable([]),
    }: {
        allowUserOptions?: boolean;
        disabled?: boolean;
        id?: string;
        loading?: boolean;
        maxOptions?: number | null;
        maxSelect: number | null;
        minSelect?: number;
        onChange?: () => void;
        onClose?: () => void;
        onOpen?: () => void;
        onRemove?: () => void;
        onRemoveAll?: () => void;
        options?: MultiselectOption[];
        placeholder?: string;
        required?: boolean;
        contextKey?: unknown;
        selectAllOption?: boolean;
        selected: MultiselectOption[];
    } = $props();

    const fallbackId = `multiselect-${idCounter++}`;
    const dropdownId = $derived(id ? `${id}-dropdown` : fallbackId);

    let open = $state(false);
    let searchText = $state('');
    let activeIndex: number | null = $state(null);
    let containerEl: HTMLElement;
    let dropdownEl: HTMLElement | undefined = $state();
    let dropdownContentEl: HTMLElement | undefined = $state();
    let inputEl: HTMLInputElement | undefined = $state();
    let orderedOptions = $state<MultiselectOption[]>([]);
    let selectedSnapshot: typeof selected = [];

    const DEFAULT_MAX_CONTENT_HEIGHT = 330;

    // Reset activeIndex when searchText changes, so that the highlighted option is cleared
    $effect(() => {
        searchText;
        activeIndex = null;
    });

    function getLabel(option: MultiselectOption): string {
        return option !== null && typeof option === 'object' ? option.label : String(option);
    }

    function getValue(option: MultiselectOption): string | number {
        if (option !== null && typeof option === 'object') {
            const value = option.value;
            if (value === undefined || value === null) return '';
            return typeof value === 'string' || typeof value === 'number' ? value : String(value);
        }
        return option;
    }

    function isSelected(option: MultiselectOption): boolean {
        return !!selected.find((s) => getValue(s) === getValue(option));
    }

    // Sort options by label, case insensitive
    const byLabel = (a: MultiselectOption, b: MultiselectOption) => getLabel(a).localeCompare(getLabel(b), undefined, { sensitivity: 'base' });

    const knownOptionKeys = $derived(new Set((options ?? []).map((o) => getValue(o))));

    let userOptions = $state<MultiselectOption[]>([]);
    let previousContextKey: unknown;
    let contextKeyInitialized = false;

    // React to changes in selected or contextKey to manage userOptions, if contextKey changes, reset userOptions
    $effect(() => {
        const currentSelected = selected;
        const currentContextKey = contextKey;
        const currentKnownOptionKeys = knownOptionKeys;
        untrack(() => {
            if (!allowUserOptions) {
                if (userOptions.length) userOptions = [];
                return;
            }
            if (!contextKeyInitialized) {
                contextKeyInitialized = true;
                previousContextKey = currentContextKey;
            } else if (currentContextKey !== previousContextKey) {
                previousContextKey = currentContextKey;
                userOptions = [];
                return;
            }
            const trackedKeys = new Set(userOptions.map((o) => getValue(o)));
            const newlyAdded = currentSelected.filter((s) => !currentKnownOptionKeys.has(getValue(s)) && !trackedKeys.has(getValue(s)));
            if (newlyAdded.length) userOptions = [...userOptions, ...newlyAdded];
        });
    });

    // Pipeline: options+userOptions -> mergedOptions (deduped) -> orderedOptions (persisted sort order,
    // selected-first once closed) -> filteredOptions (search text + single-select-hides-selected applied)
    const mergedOptions = $derived.by(() => {
        const seen = new Set<string>();
        return [...(options ?? []), ...userOptions].filter((o) => {
            const key = String(getValue(o));
            if (!key) return false;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    });

    const showSelectAll = $derived(selectAllOption ?? maxSelect === null); // default to showing "Select all" only for genuinely unbounded multiselects
    const isMultiSelect = $derived(maxSelect === null || maxSelect > 1);
    const exactSearchMatch = $derived(searchText.length > 0 && mergedOptions.find((o) => getLabel(o).toLowerCase() === searchText.trim().toLowerCase()));
    // A single-select with exactly one (already selected) option has nothing left to choose, so clicking shouldn't reopen it
    const isLocked = $derived(!isMultiSelect && !allowUserOptions && !loading && mergedOptions.length === 1 && isSelected(mergedOptions[0]));
    const canSelectMore = $derived(maxSelect === null || selected.length < maxSelect);
    const canAddUserOption = $derived(allowUserOptions && !exactSearchMatch);
    const canRemoveItem = $derived(selected.length > minSelect);

    // Filter options based on search text and selection state
    const filteredOptions = $derived.by(() => {
        const query = searchText.trim().toLowerCase();
        let result = query ? orderedOptions.filter((o) => getLabel(o).toLowerCase().includes(query)) : [...orderedOptions];
        if (!isMultiSelect) {
            result = result.filter((o) => !isSelected(o));
        }
        return maxOptions !== null ? result.slice(0, maxOptions) : result;
    });

    const oneFilteredOption = $derived(!allowUserOptions && filteredOptions.length === 1 ? filteredOptions[0] : undefined);
    const isAllSelected = $derived(filteredOptions.length > 0 && filteredOptions.every((opt) => isSelected(opt)));

    const searchInputPlaceholder = $derived(
        allowUserOptions && mergedOptions.length === 0 ? 'Type to add new option' : allowUserOptions ? 'Search or type to add new option' : 'Search...'
    );

    // Keep existing order and append newly added options at the end, instead of sorting on every change
    $effect(() => {
        const allOptions = [...mergedOptions];
        untrack(() => {
            const currentKeys = new Set(orderedOptions.map((o) => String(getValue(o))));
            const preserved = orderedOptions.filter((o) => allOptions.some((m) => String(getValue(m)) === String(getValue(o))));
            const fresh = allOptions.filter((o) => !currentKeys.has(String(getValue(o)))).sort(byLabel);
            orderedOptions = [...preserved, ...fresh];
            sortSelected();
        });
    });

    $effect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (containerEl?.contains(target)) return;
            closeDropdown();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    });

    // Keep the highlighted option visible when it moves outside the scrolled area
    $effect(() => {
        if (activeIndex === null || !dropdownContentEl) return;
        dropdownContentEl.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
    });

    // Ensures that dropdown either flips or shrinks to fit in the viewport
    $effect(() => {
        if (!dropdownEl) return;
        const floatingEl = dropdownEl;

        function updatePosition() {
            computePosition(containerEl, floatingEl, {
                placement: 'bottom-start',
                strategy: 'fixed',
                middleware: [
                    flip({ padding: 8 }),
                    shift({ padding: 8 }),
                    size({
                        padding: 8,
                        apply({ availableHeight, rects }) {
                            if (dropdownContentEl) {
                                // Height taken up by the search input header and status message footer, which stay fixed in place instead of shrinking along with the scrollable option list
                                const headerAndFooterHeight = floatingEl.offsetHeight - dropdownContentEl.offsetHeight;
                                const availableForContent = availableHeight - headerAndFooterHeight;
                                dropdownContentEl.style.maxHeight = `${Math.max(0, Math.min(DEFAULT_MAX_CONTENT_HEIGHT, availableForContent))}px`;
                            }
                            floatingEl.style.width = `${rects.reference.width}px`;
                        },
                    }),
                ],
            }).then(({ x, y }) => {
                floatingEl.style.left = `${x}px`;
                floatingEl.style.top = `${y}px`;
            });
        }

        return autoUpdate(containerEl, floatingEl, updatePosition);
    });

    function hasChanged(): boolean {
        if (selected.length !== selectedSnapshot.length) return true;
        const currentKeys = selected.map(getValue).map(String).sort();
        const snapshotKeys = selectedSnapshot.map(getValue).map(String).sort();
        return currentKeys.some((key, i) => key !== snapshotKeys[i]);
    }

    function updateSelectedSnapshot() {
        selectedSnapshot = [...selected];
    }

    function openDropdown() {
        if (disabled || open || isLocked) return;
        updateSelectedSnapshot();
        open = true;
        activeIndex = null;
        onOpen?.();
        setTimeout(() => inputEl?.focus(), 0);
    }

    function closeDropdown() {
        open = false;
        searchText = '';
        activeIndex = null;
        sortSelected();
        if (hasChanged()) onClose?.();
    }

    // Sort selected options to the top of the list when the dropdown is closed
    function sortSelected() {
        if (open) return;
        orderedOptions = [...orderedOptions.filter((o) => isSelected(o)).sort(byLabel), ...orderedOptions.filter((o) => !isSelected(o)).sort(byLabel)];
    }

    function toggleOption(opt: MultiselectOption) {
        if (isSelected(opt)) {
            if (!canRemoveItem) return;
            selected = selected.filter((s) => getValue(s) !== getValue(opt));
        } else if (canSelectMore) {
            selected = [...selected, opt];
            if (maxSelect === 1) closeDropdown();
        } else if (maxSelect === 1) {
            selected = [opt];
            closeDropdown();
        }
        onChange?.();
    }

    function removeTag(opt: MultiselectOption) {
        if (!canRemoveItem) return;
        selected = selected.filter((s) => getValue(s) !== getValue(opt));
        if (!open) sortSelected();
        onChange?.();
        if (!open) onRemove?.();
    }

    function removeAll() {
        selected = selected.slice(0, minSelect);
        onChange?.();
        if (!open) onRemoveAll?.();
    }

    function toggleAll() {
        if (isAllSelected) {
            const displayedOptions = new Set(filteredOptions.map((o) => getValue(o)));
            selected = selected.filter((s) => !displayedOptions.has(getValue(s)));
        } else {
            const newOptions = filteredOptions.filter((s) => !isSelected(s));
            selected = [...selected, ...newOptions];
        }
        onChange?.();
    }

    function addUserOption() {
        const val = searchText.trim();
        if (!val || exactSearchMatch) return;
        if (maxSelect === 1) {
            selected = [val];
            closeDropdown();
        } else {
            selected = [...selected, val];
        }
        searchText = '';
        onChange?.();
    }

    // Handle keyboard navigation and selection in the dropdown
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (filteredOptions.length === 0) return;
            if (e.key === 'ArrowDown') {
                activeIndex = activeIndex === null ? 0 : Math.min(activeIndex + 1, filteredOptions.length - 1);
            } else {
                activeIndex = activeIndex === null ? filteredOptions.length - 1 : Math.max(activeIndex - 1, 0);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (maxSelect === 1) e.stopPropagation();

            if (activeIndex !== null && filteredOptions[activeIndex]) {
                toggleOption(filteredOptions[activeIndex]);
            } else if (oneFilteredOption) {
                toggleOption(oneFilteredOption);
            } else if (canAddUserOption) {
                addUserOption();
            } else if (exactSearchMatch) {
                const match = mergedOptions.find((o) => getLabel(o).toLowerCase() === searchText.trim().toLowerCase());
                if (match) toggleOption(match);
            }
            if (maxSelect === 1) closeDropdown();
        } else if (e.key === 'Escape') {
            e.stopPropagation();
            closeDropdown();
        }
    }
</script>

<div
    {id}
    class="multiselect"
    bind:this={containerEl}
    class:open
    class:disabled
    class:locked={isLocked && !disabled}
    onclick={openDropdown}
    role="combobox"
    aria-expanded={open}
    aria-haspopup="listbox"
    aria-controls={dropdownId}
    aria-owns={dropdownId}
    tabindex={disabled ? -1 : 0}
    onkeydown={(e) => !open && e.key === 'Enter' && openDropdown()}
    onfocusout={(e) => {
        if (!containerEl.contains(e.relatedTarget as Node)) closeDropdown();
    }}>
    <div class="multiselect-wrapper">
        {#if required}
            <input type="text" tabindex="-1" aria-hidden="true" class="required-validator" value={selected.length > 0 ? 'x' : ''} {required} />
        {/if}

        <div class="chevron">
            {#if !disabled && !isLocked}
                <button
                    type="button"
                    class="icon-btn"
                    onclick={(e) => {
                        open ? closeDropdown() : openDropdown();
                        e.stopPropagation();
                    }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            {/if}
        </div>

        <div class="selected-wrapper">
            <div class="selected-content">
                <div class="selected">
                    {#if isMultiSelect}
                        {#each selected as tag (getValue(tag))}
                            <span class="tag">
                                {getLabel(tag)}
                                {#if canRemoveItem}
                                    <button
                                        type="button"
                                        class="icon-btn"
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            removeTag(tag);
                                        }}>
                                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                {/if}
                            </span>
                        {/each}
                        {#if selected.length === 0}
                            <span class="trigger-placeholder">{placeholder}</span>
                        {/if}
                    {:else}
                        <span class="trigger-value" class:is-placeholder={!selected.length}>
                            {selected.length ? getLabel(selected[0]) : placeholder}
                        </span>
                    {/if}
                </div>
            </div>
        </div>

        <div class="remove-all">
            {#if selected.length > 1}
                <button
                    type="button"
                    class="icon-btn"
                    onclick={(e) => {
                        e.stopPropagation();
                        removeAll();
                    }}>
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            {/if}
        </div>
    </div>

    {#if open}
        <div id={dropdownId} class="dropdown" bind:this={dropdownEl}>
            <div class="dropdown-header">
                <input
                    bind:this={inputEl}
                    bind:value={searchText}
                    class="search-input"
                    placeholder={searchInputPlaceholder}
                    tabindex={0}
                    onkeydown={handleKeydown}
                    aria-autocomplete="list" />
                {#if showSelectAll && isMultiSelect && filteredOptions.length > 1}
                    <div
                        class="select-all"
                        role="option"
                        aria-selected={isAllSelected}
                        tabindex={0}
                        onclick={(e) => {
                            e.stopPropagation();
                            toggleAll();
                        }}
                        onkeydown={(e) => e.key === 'Enter' && toggleAll()}>
                        <span class="checkbox" class:checked={isAllSelected} aria-hidden="true"></span>
                        {isAllSelected ? 'Deselect All' : 'Select All'}
                    </div>
                {/if}
            </div>

            <div class="dropdown-content" bind:this={dropdownContentEl}>
                <ul class="options-list" role="listbox">
                    {#each filteredOptions as opt, i (getValue(opt))}
                        <!-- Keyboard interaction is handled centrally via the search input's arrow keys/Enter, not per-row focus -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <li
                            class="option"
                            class:selected={isSelected(opt)}
                            class:active={i === activeIndex}
                            data-index={i}
                            role="option"
                            aria-selected={isSelected(opt)}
                            onclick={(e) => {
                                e.stopPropagation();
                                toggleOption(opt);
                            }}>
                            {#if isMultiSelect}
                                <span class="checkbox" class:checked={isSelected(opt)} aria-hidden="true"></span>
                            {/if}
                            {getLabel(opt)}
                        </li>
                    {/each}
                </ul>
            </div>
            {@render statusMessage()}
        </div>
    {/if}
</div>

{#snippet statusMessage()}
    {#if loading}
        <div class="loading-msg">Loading...</div>
    {:else if filteredOptions.length === 0 && !allowUserOptions}
        <div class="no-options-msg">No options found</div>
    {:else if canAddUserOption && searchText.trim().length > 0}
        <div class="user-msg" role="option" aria-selected={false} tabindex={0} onclick={addUserOption} onkeydown={(e) => e.key === 'Enter' && addUserOption()}>
            Press enter to add: <em>{searchText.trim()}</em>
        </div>
    {/if}
{/snippet}

<style>
    .multiselect {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 0.25rem 0 0.375rem;
        border: 1px solid var(--multiselect-border-color, #34374d);
        border-radius: 999px;
        background-color: var(--multiselect-bg, #1c1e2b);
        cursor: pointer;
        font-size: 0.9375rem;
        color: var(--multiselect-text, #e4e6f1);
        margin-bottom: 1px;
        height: 1.8125rem;
    }

    .multiselect.disabled {
        cursor: not-allowed;
    }

    .multiselect.locked {
        cursor: default;
    }

    .multiselect-wrapper {
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .required-validator {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        width: 1px;
        height: 1px;
        border: none;
        padding: 0;
        margin: 0;
    }

    .chevron {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding-right: 0.3125rem;
        color: var(--multiselect-muted, #8a8da3);
    }

    .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        border: none;
        background: transparent;
        color: inherit;
        cursor: pointer;
        padding: 0;
        border-radius: 50%;
    }

    .icon-btn:hover {
        background-color: var(--multiselect-hover-bg, #292c40);
    }

    .selected-wrapper {
        overflow: hidden;
        display: flex;
    }

    .selected-content {
        min-width: 25rem;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .selected-content::-webkit-scrollbar {
        display: none;
    }

    .selected {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
    }

    .remove-all {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding-left: 0.1875rem;
    }

    .trigger-placeholder {
        color: var(--multiselect-muted, #8a8da3);
        white-space: nowrap;
    }

    .trigger-value {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .trigger-value.is-placeholder {
        color: var(--multiselect-muted, #8a8da3);
    }

    .tag {
        display: inline-flex;
        align-items: center;
        padding-right: 0.5rem;
        white-space: nowrap;
    }

    .dropdown {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: var(--multiselect-bg, #1c1e2b);
        border-radius: 0.5rem;
        border: 1px solid var(--multiselect-border-color, #34374d);
        z-index: 1;
    }

    .dropdown-content {
        overflow-y: auto;
        max-height: 20.625rem;
    }

    .dropdown-header {
        display: flex;
        flex-direction: column;
    }

    .search-input {
        border: none;
        border-bottom: 1px solid var(--multiselect-border-color, #34374d);
        background: transparent;
        color: var(--multiselect-text, #e4e6f1);
        outline: none;
        padding: 0.5rem 0.75rem;
        font: inherit;
    }

    .search-input::placeholder {
        color: var(--multiselect-muted, #8a8da3);
    }

    .select-all {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.3125rem 0.75rem;
        color: var(--multiselect-text, #e4e6f1);
        border-bottom: 1px solid var(--multiselect-border-color, #34374d);
        user-select: none;
        cursor: pointer;
    }

    .select-all:hover {
        color: var(--multiselect-accent, #8b7cf6);
    }

    .options-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.3125rem 0.75rem;
        color: var(--multiselect-text, #e4e6f1);
        user-select: none;
    }

    .option:hover,
    .option.active {
        background-color: var(--multiselect-hover-bg, #292c40);
        color: var(--multiselect-accent, #8b7cf6);
    }

    .checkbox {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.125rem;
        height: 1.125rem;
        border: 1px solid var(--multiselect-border-color, #34374d);
        border-radius: 0.25rem;
    }

    .checkbox.checked {
        background: var(--multiselect-accent, #8b7cf6);
        border-color: var(--multiselect-accent, #8b7cf6);
    }

    .checkbox.checked::after {
        content: '';
        width: 0.5rem;
        height: 0.3125rem;
        border-left: 2px solid #1c1e2b;
        border-bottom: 2px solid #1c1e2b;
        transform: rotate(-45deg) translate(1px, -2px);
    }

    .user-msg,
    .loading-msg,
    .no-options-msg {
        cursor: default;
        color: var(--multiselect-muted, #8a8da3);
        padding: 0.3125rem 0.75rem;
    }

    .user-msg:hover,
    .loading-msg:hover,
    .no-options-msg:hover {
        background-color: var(--multiselect-hover-bg, #292c40);
        color: var(--multiselect-accent, #8b7cf6);
    }

    .user-msg {
        border-top: 1px solid var(--multiselect-border-color, #34374d);
        cursor: pointer;
    }

    .user-msg em {
        color: var(--multiselect-accent, #8b7cf6);
        overflow-wrap: break-word;
    }
</style>