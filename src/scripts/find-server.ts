/**
 * Find the connect path from home to a target server (ignores purchased servers).
 * Usage: run find-server.js TARGET
 */
export async function main(ns: NS): Promise<void> {
	const target = String(ns.args[0] ?? "").trim();
	if (!target) {
		ns.tprint("Usage: run find-server.js TARGET");
		return;
	}

	const start = "home";
	if (target === start) {
		ns.tprint("You're already at home.");
		return;
	}

	const isPurchased = (host: string): boolean => {
		try {
			return ns.getServer(host).purchasedByPlayer === true;
		} catch (e) {
			return false;
		}
	};

	// BFS from home to target, skipping purchased servers (except home)
	const queue: string[] = [start];
	const visited = new Set<string>([start]);
	const parent = new Map<string, string>();

	while (queue.length > 0) {
		const current = queue.shift() as string;
		if (current === target) break;

		const neighbors = ns.scan(current);
		for (const neighbor of neighbors) {
			if (visited.has(neighbor)) continue;
			if (neighbor !== start && isPurchased(neighbor)) continue; // ignore purchased
			visited.add(neighbor);
			parent.set(neighbor, current);
			queue.push(neighbor);
		}
	}

	if (!visited.has(target)) {
		ns.tprint(`Target not found from ${start}: ${target}`);
		return;
	}

	// Reconstruct path
	const path: string[] = [];
	let node: string | undefined = target;
	while (node && node !== start) {
		path.push(node);
		node = parent.get(node);
	}
	path.push(start);
	path.reverse();

	const hops = Math.max(0, path.length - 1);
	const pathStr = path.join(" -> ");
	const connectCmd = path
		.map((h, i) => (i === 0 ? "home" : `connect ${h}`))
		.join("; ");

	ns.tprint(`Path (${hops} hop${hops === 1 ? "" : "s"}): ${pathStr}`);
	ns.tprint(`Commands: ${connectCmd}`);

	try {
		await ns.write("last-find-server-path.txt", path.join(","), "w");
	} catch (e) {
		// ignore
	}
}


