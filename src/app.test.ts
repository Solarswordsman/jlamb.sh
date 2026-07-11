// @vitest-environment jsdom
import { beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TYPE_SPEED = 85;

function el(selector: string): HTMLElement {
	const found = document.querySelector<HTMLElement>(selector);
	if (!found) throw new Error("missing element: " + selector);
	return found;
}

function key(target: EventTarget, key: string): void {
	target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

beforeAll(async () => {
	const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
	// Take the real markup but strip the module script — the app is imported below.
	document.body.innerHTML = /<body>([\s\S]*)<\/body>/.exec(html)![1];
	vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
	vi.useFakeTimers();
	await import("./main");
});

describe("boot sequence", () => {
	it("starts in the typing phase", () => {
		expect(el("#boot").hidden).toBe(false);
		expect(el("#page").hidden).toBe(true);
	});

	it("types ./jlamb.sh character by character", () => {
		vi.advanceTimersByTime(500 + TYPE_SPEED * 4);
		expect(el("#typed").textContent).toBe("./jl");
	});

	it("switches to the run phase after typing plus a 400ms hold", () => {
		vi.advanceTimersByTime(TYPE_SPEED * 6 + 400);
		expect(el("#typed").textContent).toBe("./jlamb.sh");
		expect(el("#boot").hidden).toBe(true);
		expect(el("#page").hidden).toBe(false);
	});

	it("replays from the typing phase", () => {
		el("#replay").click();
		expect(el("#boot").hidden).toBe(false);
		expect(el("#page").hidden).toBe(true);
		vi.advanceTimersByTime(500 + TYPE_SPEED * 10 + 400);
		expect(el("#page").hidden).toBe(false);
	});
});

describe("command line drawer", () => {
	it("opens on / and runs commands", () => {
		expect(el("#cli").hidden).toBe(true);
		key(window, "/");
		expect(el("#cli").hidden).toBe(false);

		const input = el("#cli-input") as HTMLInputElement;
		input.value = "help";
		key(input, "Enter");
		expect(el("#cli-log").textContent).toContain("available commands:");
		expect(input.value).toBe("");
	});

	it("recalls history with arrow keys", () => {
		const input = el("#cli-input") as HTMLInputElement;
		key(input, "ArrowUp");
		expect(input.value).toBe("help");
		key(input, "ArrowDown");
		expect(input.value).toBe("");
	});

	it("clears with clear and closes with Escape", () => {
		const input = el("#cli-input") as HTMLInputElement;
		input.value = "clear";
		key(input, "Enter");
		expect(el("#cli-log").textContent).toBe("");
		key(window, "Escape");
		expect(el("#cli").hidden).toBe(true);
	});

	it("prints the sudo denial when the nav sudo item is clicked", () => {
		el("#nav-sudo").click();
		expect(el("#cli").hidden).toBe(false);
		vi.advanceTimersByTime(120);
		expect(el("#cli-log").textContent).toContain("sudo ls ~/private");
		expect(el("#cli-log").textContent).toContain("not in the sudoers file");
	});
});
