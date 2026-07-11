import "./style.css";
import { config } from "./config";
import { exec } from "./commands";
import { initCli, openCli, appendEntry } from "./cli";

const bootEl = document.querySelector<HTMLElement>("#boot")!;
const pageEl = document.querySelector<HTMLElement>("#page")!;
const typedEl = document.querySelector<HTMLElement>("#typed")!;

const CMD = "./jlamb.sh";
let typeTimer: ReturnType<typeof setInterval> | undefined;
let runDelay: ReturnType<typeof setTimeout> | undefined;

function showRun(): void {
	// Instant swap, like a terminal redraw. Re-showing the page from
	// display:none restarts the bootline animations, so replay works too.
	bootEl.hidden = true;
	pageEl.hidden = false;
}

function startBoot(): void {
	clearInterval(typeTimer);
	clearTimeout(runDelay);
	typedEl.textContent = "";
	pageEl.hidden = true;
	bootEl.hidden = false;
	let i = 0;
	runDelay = setTimeout(() => {
		typeTimer = setInterval(() => {
			i += 1;
			typedEl.textContent = CMD.slice(0, i);
			if (i >= CMD.length) {
				clearInterval(typeTimer);
				runDelay = setTimeout(showRun, 400);
			}
		}, config.typeSpeed);
	}, 500);
}

function navSudo(): void {
	openCli();
	setTimeout(() => {
		appendEntry("sudo ls ~/private", exec("sudo ls ~/private").out ?? "");
	}, 120);
}

initCli();
document.querySelector("#nav-sudo")!.addEventListener("click", navSudo);
document.querySelector("#footer-slash")!.addEventListener("click", openCli);
document.querySelector("#replay")!.addEventListener("click", startBoot);

if (!config.sudoHint) {
	document.querySelector("#sudo-hint")!.remove();
}

if (config.boot) {
	startBoot();
} else {
	showRun();
}
