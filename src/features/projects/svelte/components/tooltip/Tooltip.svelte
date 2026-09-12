<script lang="ts">
    import type { Snippet } from 'svelte';
    import { computePosition, autoUpdate, flip, size } from '@floating-ui/dom';
    import type { Placement, Strategy, Boundary } from '@floating-ui/dom';

    // A floating, boundary-aware tooltip. Pass `boundaryElement` to keep it
    // clamped inside a specific ancestor instead of the viewport.
    let {
        id,
        classNames = '',
        trigger,
        children,
        placement = 'bottom',
        strategy = 'fixed',
        boundaryElement,
    }: {
        id?: string;
        classNames?: string;
        trigger: Snippet<[{ toggle: () => void; open: boolean }]>;
        children?: Snippet;
        placement?: Placement;
        strategy?: Strategy;
        boundaryElement?: Boundary;
    } = $props();

    let open = $state(false);
    let anchorElement: HTMLElement | undefined = $state();
    let tooltipElement: HTMLElement | undefined = $state();

    function toggleTooltip() {
        open = !open;
    }

    $effect(() => {
        if (!open || !anchorElement || !tooltipElement) return;
        const floatingElement = tooltipElement;
        const referenceElement = anchorElement;

        function updatePosition() {
            computePosition(referenceElement, floatingElement, {
                placement,
                strategy,
                middleware: [
                    flip({ boundary: boundaryElement || undefined }),
                    size({
                        padding: 12,
                        boundary: boundaryElement || undefined,
                        apply({ availableWidth, availableHeight, elements }) {
                            Object.assign(elements.floating.style, {
                                maxWidth: `${Math.max(0, availableWidth)}px`,
                                maxHeight: `${Math.max(0, availableHeight)}px`,
                            });
                        },
                    }),
                ],
            }).then(({ x, y }) => {
                floatingElement.style.left = `${x}px`;
                floatingElement.style.top = `${y}px`;
            });
        }
        return autoUpdate(referenceElement, tooltipElement, updatePosition);
    });

    // Close the tooltip when clicking outside of it
    $effect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (anchorElement?.contains(target) || tooltipElement?.contains(target)) return;
            open = false;
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    });
</script>

<span class="tooltip-anchor" bind:this={anchorElement}>
    {@render trigger({ toggle: toggleTooltip, open })}
</span>

{#if open}
    <div id="tooltip-{id}" class="tooltip {classNames}" bind:this={tooltipElement}>
        <div class="tooltip-wrapper">
            {@render children?.()}
        </div>
    </div>
{/if}

<style>
    .tooltip-anchor {
        display: inline-block;
    }
    .tooltip {
        position: fixed;
        z-index: 1000;
    }
    .tooltip-wrapper {
        background-color: var(--tooltip-bg, #242828);
        color: var(--tooltip-color, #d2d2d2);
        border: solid 1px var(--tooltip-border-color, rgba(112, 112, 112, 0.67));
        border-radius: 3px;
        padding: 5px 10px;
        font-size: 0.875rem;
        line-height: 1.4;
        max-width: 260px;
    }
</style>