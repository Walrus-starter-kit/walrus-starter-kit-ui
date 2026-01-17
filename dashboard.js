// Tailwind Configuration
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#A855F7", // Violet-500
                "background-light": "#f8fafc",
                "background-dark": "#000000",
                "surface-light": "#ffffff",
                "surface-dark": "#09090b",
                "border-light": "#e2e8f0",
                "border-dark": "#27272a",
                "card-dark": "#0a0a0a",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            borderRadius: {
                DEFAULT: "0.375rem",
                lg: "0.5rem",
            },
        },
    },
};

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
        });
    }

    // Interactive Selection Logic
    const selectableCards = document.querySelectorAll('.selectable-card');

    selectableCards.forEach(card => {
        card.addEventListener('click', () => {
            const group = card.dataset.group;

            if (group === 'addons') {
                // Multi-select behavior (Toggle)
                const isSelected = card.dataset.selected === 'true';
                updateCardVisuals(card, !isSelected);
            } else {
                // Single-select behavior (Radio)
                const groupCards = document.querySelectorAll(`.selectable-card[data-group="${group}"]`);
                groupCards.forEach(c => {
                    if (c === card) {
                        updateCardVisuals(c, true);
                    } else {
                        updateCardVisuals(c, false);
                    }
                });
            }
        });
    });

    function updateCardVisuals(card, isSelected) {
        card.dataset.selected = isSelected;

        // Elements to update
        const glowEffect = card.querySelector('.glow-effect');
        const cardContent = card.querySelector('.card-content'); // Main border container for standard cards
        const titleText = card.querySelector('.title-text');
        const checkIcon = card.querySelector('.check-icon');
        const toggleSwitch = card.querySelector('.toggle-switch');
        const toggleKnob = card.querySelector('.toggle-knob');

        // Base classes for unselected state (Dark mode / Light mode)
        const borderUnselected = ['border-border-light', 'dark:border-zinc-800', 'bg-surface-light', 'dark:bg-black', 'hover:border-zinc-600'];
        const borderSelected = ['border-primary', 'bg-surface-light', 'dark:bg-zinc-900/40', 'shadow-md', 'active-glow'];

        // Add-on specific styles (since they don't have .card-content wrapper in HTML structure I used, wait, I need to check HTML structure again)
        // Correction: In my HTML update, Add-ons match the structure of standard cards mostly but are "flex" containers themselves.
        // Let's handle the specific class shifts.

        if (isSelected) {
            // activate glow
            if (glowEffect) {
                glowEffect.classList.remove('opacity-0');
                glowEffect.classList.add('opacity-100');
            }

            // update border container
            const container = cardContent || card; // Addons are the container themselves
            container.classList.remove(...borderUnselected);
            container.classList.add(...borderSelected);

            if (titleText) {
                titleText.classList.remove('dark:text-white');
                titleText.classList.add('dark:text-primary');
            }

            if (checkIcon) {
                checkIcon.classList.remove('hidden');
            }

            if (toggleSwitch) {
                toggleSwitch.classList.remove('bg-slate-200', 'dark:bg-zinc-800');
                toggleSwitch.classList.add('bg-primary');
            }
            if (toggleKnob) {
                toggleKnob.classList.remove('left-1', 'dark:bg-zinc-400');
                toggleKnob.classList.add('right-1', 'bg-white');
                toggleKnob.classList.remove('left-1'); // ensure
            }

        } else {
            // deactivate glow
            if (glowEffect) {
                glowEffect.classList.remove('opacity-100');
                glowEffect.classList.add('opacity-0');
            }

            // update border container
            const container = cardContent || card;
            container.classList.remove(...borderSelected);
            container.classList.add(...borderUnselected);

            if (titleText) {
                titleText.classList.remove('dark:text-primary');
                titleText.classList.add('dark:text-white');
            }

            if (checkIcon) {
                checkIcon.classList.add('hidden');
            }

            if (toggleSwitch) {
                toggleSwitch.classList.remove('bg-primary');
                toggleSwitch.classList.add('bg-slate-200', 'dark:bg-zinc-800');
            }
            if (toggleKnob) {
                toggleKnob.classList.remove('right-1', 'bg-white');
                toggleKnob.classList.add('left-1', 'dark:bg-zinc-400');
            }
        }
    }
    // Dynamic Command Generation
    const projectNameInput = document.getElementById('project-name-input');
    const commandDisplay = document.getElementById('command-display');
    const copyBtn = document.getElementById('copy-btn');

    function generateCommand() {
        const projectName = projectNameInput.value.trim() || 'my-walrus-app';

        // Get selected values
        const sdk = document.querySelector('.selectable-card[data-group="sdk"][data-selected="true"]')?.dataset.value || 'mysten';
        const framework = document.querySelector('.selectable-card[data-group="framework"][data-selected="true"]')?.dataset.value || 'react';
        const useCase = document.querySelector('.selectable-card[data-group="use-case"][data-selected="true"]')?.dataset.value || 'simple-upload';

        // Get Add-ons
        const addons = Array.from(document.querySelectorAll('.selectable-card[data-group="addons"][data-selected="true"]'))
            .map(card => card.dataset.value);

        let command = `<span class="text-violet-400">npx</span> @blu1606/create-walrus-app ${projectName}`; // Base command

        // Append flags
        if (sdk !== 'mysten') command += ` --sdk=${sdk}`; // Default is mysten, omit if default? Or explicit? tem.md uses explicit flags.
        // Actually tem.md doesn't specify defaults behavior, but explicit is better for "Builder".
        // Let's force explicit for SDK if not default? Or just always explicit?
        // The previous static text had them all. Let's include them.
        // Wait, static text was: --sdk=mysten --framework=react --use-case=simple-upload

        command += ` --sdk=${sdk}`;

        if (framework !== 'none') {
            command += ` --framework=${framework}`;
        }

        if (useCase !== 'empty') {
            command += ` --use-case=${useCase}`;
        }

        // Add-ons
        if (addons.includes('pnpm')) {
            command += ` -p pnpm`;
        }

        // Update display
        if (commandDisplay) {
            commandDisplay.innerHTML = command;
        }
    }

    // Event Listeners for Command Updates
    if (projectNameInput) {
        projectNameInput.addEventListener('input', generateCommand);
    }

    // Hook into existing selection logic
    selectableCards.forEach(card => {
        card.addEventListener('click', () => {
            // The existing logic runs first (updating data-selected), so we can just call generate immediately after/simultaneously involved in the event loop?
            // Actually, the existing listener is defined above. If we add another listener, it runs after (if added after).
            // However, updates to DOM attributes might happen synchronously. 
            // Let's call generateCommand at the end of the existing handler or add a new handler.
            // Since I can't easily inject *into* the existing function without replacing it, I'll add a separate listener.
            // MutationObserver is overkill. setTimeout 0 is safe.
            setTimeout(generateCommand, 0);
        });
    });

    // Copy Functionality
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!commandDisplay) return;
            const textToCopy = commandDisplay.innerText || commandDisplay.textContent; // Get plain text
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                const icon = copyBtn.querySelector('.material-symbols-outlined');
                const originalIcon = icon.textContent;

                icon.textContent = 'check';
                icon.classList.add('text-green-500');

                setTimeout(() => {
                    icon.textContent = originalIcon;
                    icon.classList.remove('text-green-500');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }

    // Initial run
    generateCommand();
});
