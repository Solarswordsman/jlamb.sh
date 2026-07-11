export interface CommandResult {
	out: string | null;
	action?: "clear" | "exit";
}

const HELP = [
	"available commands:",
	"  whoami            who is this guy",
	"  ls [dir]          look around (projects, cheatsheets, links)",
	"  cat <file>        read a file (now.md, contact.md)",
	"  neofetch          system info",
	"  sudo <cmd>        try it",
	"  clear             clear this terminal",
	"  exit              close the command line",
].join("\n");

const NEOFETCH =
	"        .--.       visitor@jlamb.sh\n" +
	"       |o_o |      ----------------\n" +
	"       |:_/ |      os:     linux (obviously)\n" +
	"      //   \\ \\     shell:  zsh + p10k\n" +
	"     (|     | )    editor: vim (btw)\n" +
	"    /'\\_   _/`\\    host:   jlamb.sh\n" +
	"    \\___)=(___/    uptime: since forever";

const SUDO_DENIED = "visitor is not in the sudoers file. this incident will be reported.";

export function exec(raw: string): CommandResult {
	const cmd = raw.trim();
	if (!cmd) return { out: null };
	const parts = cmd.split(/\s+/);
	const head = parts[0];
	const arg = parts.slice(1).join(" ");

	if (head === "help" || cmd === "man jlamb") return { out: HELP };
	if (head === "whoami") {
		return { out: "jlamb — software engineer. builds interactive tools for\ntabletop roleplaying: sheets, dice, foundry modules." };
	}
	if (head === "ls") {
		// Accept `~/`-prefixed and trailing-slash forms.
		const t = arg.replace(/^~\/?/, "").replace(/\/$/, "");
		if (!t) return { out: "projects/    cheatsheets/    links/    now.md    contact.md" };
		if (t === "projects") return { out: "pt.jlamb.sh    caelia.jlamb.sh" };
		if (t === "cheatsheets") return { out: "tmux.md    git.md    vim.md    dotfiles/" };
		if (t === "links") return { out: "tools.md    reading.md    me.md" };
		if (t === "private") return { out: "ls: cannot open directory 'private': Permission denied" };
		return { out: "ls: cannot access '" + arg + "': No such file or directory" };
	}
	if (head === "cat") {
		const f = arg.replace(/^~\//, "");
		if (f === "now.md") return { out: "# now\n- building cool stuff for ttrpg's\n- tinkering and hacking things\n- other stuff, for sure" };
		if (f === "contact.md") return { out: "github: solarswordsman\nmail:   mail@jlamb.sh" };
		if (!arg) return { out: "usage: cat <file>" };
		return { out: "cat: " + arg + ": No such file or directory" };
	}
	if (head === "sudo") return { out: SUDO_DENIED };
	if (head === "neofetch") return { out: NEOFETCH };
	if (cmd === "rm -rf /" || cmd === "rm -rf /*") return { out: "nice try." };
	if (head === "vim" || head === "vi" || head === "nvim") return { out: "you're in vim now. good luck. (:q to quit)" };
	if (cmd === ":q" || cmd === ":q!" || cmd === ":wq") return { out: "phew." };
	if (cmd === "./jlamb.sh" || cmd === "sh jlamb.sh") return { out: "already running." };
	if (head === "clear") return { out: null, action: "clear" };
	if (head === "exit") return { out: null, action: "exit" };
	return { out: "zsh: command not found: " + head };
}
