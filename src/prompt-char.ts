// <prompt-char></prompt-char> — the green zsh/p10k prompt glyph (❯).
// Registered as a custom element so the markup stays declarative: authors write
// an empty tag and the glyph is injected here, instead of repeating a styled
// span with a literal glyph in five places. Colour/weight live in style.css
// (targeting the `prompt-char` tag); this only supplies the character.
//
// Note: HTML has no self-closing for custom elements — use
// `<prompt-char></prompt-char>`, not `<prompt-char />`.
class PromptChar extends HTMLElement {
	connectedCallback() {
		// Guard so upgrades / re-connects don't stack duplicate glyphs.
		if (!this.textContent) this.textContent = "❯";
	}
}

customElements.define("prompt-char", PromptChar);
