import { describe, expect, it } from "vitest";
import { exec } from "./commands";

describe("exec", () => {
	it("lists commands for help and man jlamb", () => {
		expect(exec("help").out).toContain("available commands:");
		expect(exec("man jlamb").out).toContain("neofetch");
	});

	it("answers whoami", () => {
		expect(exec("whoami").out).toContain("jlamb — software engineer");
	});

	it("handles ls with no args", () => {
		expect(exec("ls").out).toBe("projects/    cheatsheets/    links/    now.md    contact.md");
	});

	it("handles ls of known dirs, including ~/ and trailing-slash forms", () => {
		expect(exec("ls projects").out).toBe("pt.jlamb.sh    caelia.jlamb.sh");
		expect(exec("ls ~/cheatsheets").out).toBe("tmux.md    git.md    vim.md    dotfiles/");
		expect(exec("ls links/").out).toBe("tools.md    reading.md    me.md");
		expect(exec("ls ~/projects/").out).toBe("pt.jlamb.sh    caelia.jlamb.sh");
	});

	it("denies ls private", () => {
		expect(exec("ls private").out).toContain("Permission denied");
	});

	it("errors on ls of unknown dirs", () => {
		expect(exec("ls nope").out).toContain("No such file or directory");
	});

	it("cats now.md and contact.md", () => {
		expect(exec("cat now.md").out).toContain("building cool stuff for ttrpg's");
		expect(exec("cat ~/contact.md").out).toContain("mail@jlamb.sh");
	});

	it("errors on cat of unknown files and shows usage without an arg", () => {
		expect(exec("cat secrets.md").out).toContain("No such file or directory");
		expect(exec("cat").out).toBe("usage: cat <file>");
	});

	it("denies sudo", () => {
		expect(exec("sudo make me a sandwich").out).toContain("not in the sudoers file");
	});

	it("prints neofetch system info", () => {
		expect(exec("neofetch").out).toContain("visitor@jlamb.sh");
		expect(exec("neofetch").out).toContain("vim (btw)");
	});

	it("knows the easter eggs", () => {
		expect(exec("rm -rf /").out).toBe("nice try.");
		expect(exec("vim").out).toContain("good luck");
		expect(exec(":q").out).toBe("phew.");
		expect(exec("./jlamb.sh").out).toBe("already running.");
	});

	it("returns actions for clear and exit", () => {
		expect(exec("clear")).toEqual({ out: null, action: "clear" });
		expect(exec("exit")).toEqual({ out: null, action: "exit" });
	});

	it("reports unknown commands zsh-style", () => {
		expect(exec("frobnicate").out).toBe("zsh: command not found: frobnicate");
	});

	it("ignores empty input", () => {
		expect(exec("   ").out).toBeNull();
	});
});
