// Runtime config via query params: ?boot=false&typeSpeed=40&sudoHint=false
const params = new URLSearchParams(window.location.search);

function flag(name: string, fallback: boolean): boolean {
	const v = params.get(name);
	if (v === null) return fallback;
	return !(v === "0" || v === "false");
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const config = {
	// Reduced motion skips the boot animation entirely (equivalent to ?boot=false).
	boot: flag("boot", true) && !reducedMotion,
	typeSpeed: Number(params.get("typeSpeed")) || 85,
	sudoHint: flag("sudoHint", true),
};
