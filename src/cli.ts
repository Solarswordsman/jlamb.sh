import { exec } from "./commands";

const cliEl = document.querySelector<HTMLElement>("#cli")!;
const logEl = document.querySelector<HTMLElement>("#cli-log")!;
const inputEl = document.querySelector<HTMLInputElement>("#cli-input")!;
const escEl = document.querySelector<HTMLButtonElement>("#cli-esc")!;

const cmdLog: string[] = [];
let histCursor = -1;

export function openCli(): void {
	cliEl.hidden = false;
	document.body.classList.add("cli-open");
	inputEl.focus();
}

export function closeCli(): void {
	cliEl.hidden = true;
	document.body.classList.remove("cli-open");
}

export function appendEntry(cmd: string, out: string): void {
	const entry = document.createElement("div");
	entry.className = "cli-entry";

	const cmdLine = document.createElement("div");
	const prompt = document.createElement("prompt-char");
	const cmdSpan = document.createElement("span");
	cmdSpan.className = "cmd-white";
	cmdSpan.textContent = cmd;
	// Space text node: the glyph carries no trailing space (see prompt-char.ts).
	cmdLine.append(prompt, " ", cmdSpan);
	entry.append(cmdLine);

	const outEl = document.createElement("div");
	outEl.className = "cli-out";
	outEl.textContent = out;
	entry.append(outEl);

	logEl.append(entry);
	logEl.scrollTop = logEl.scrollHeight;
}

function runCommand(): void {
	const cmd = inputEl.value.trim();
	if (!cmd) return;
	cmdLog.push(cmd);
	histCursor = -1;
	inputEl.value = "";
	const res = exec(cmd);
	if (res.action === "clear") {
		logEl.textContent = "";
		return;
	}
	if (res.action === "exit") {
		closeCli();
		return;
	}
	appendEntry(cmd, res.out ?? "");
}

function onInputKey(e: KeyboardEvent): void {
	if (e.key === "Enter") {
		runCommand();
	} else if (e.key === "ArrowUp") {
		e.preventDefault();
		if (!cmdLog.length) return;
		histCursor = histCursor < 0 ? cmdLog.length - 1 : Math.max(0, histCursor - 1);
		inputEl.value = cmdLog[histCursor];
	} else if (e.key === "ArrowDown") {
		e.preventDefault();
		if (histCursor < 0) return;
		histCursor += 1;
		if (histCursor >= cmdLog.length) {
			histCursor = -1;
			inputEl.value = "";
		} else {
			inputEl.value = cmdLog[histCursor];
		}
	}
}

export function initCli(): void {
	inputEl.addEventListener("keydown", onInputKey);
	escEl.addEventListener("click", closeCli);

	window.addEventListener("keydown", (e) => {
		const active = document.activeElement;
		const inField = active instanceof HTMLElement
			&& (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
		if (e.key === "/" && !inField) {
			// preventDefault beats Firefox quick-find.
			e.preventDefault();
			openCli();
		} else if (e.key === "Escape" && !cliEl.hidden) {
			closeCli();
		}
	});
}
