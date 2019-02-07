import {constant} from "../src/constant/constant";
import {PolyfillName} from "../src/polyfill/polyfill-name";
import {PolyfillDictEntry} from "../src/polyfill/polyfill-dict";

const seenPolyfills: Set<PolyfillName> = new Set();

let formatted = "";

const entries = Object.entries(constant.polyfill) as [PolyfillName, PolyfillDictEntry][];

// Start with listing all aliases as well as the polyfills they alias
for (const [key, value] of entries) {
	if ("polyfills" in value) {
		seenPolyfills.add(key);
		formatted += `- **\`${key}\`**\n`;
		value.polyfills.forEach(polyfill => {
			seenPolyfills.add(polyfill);
			formatted += `  - \`${polyfill}\`\n`;
		});
	}
}

// Go another round, but this time only list those polyfills that hasn't been seen yet (and isn't aliases)
for (const [key, value] of entries) {
	if ("polyfills" in value || seenPolyfills.has(key)) continue;
	formatted += `- \`${key}\`\n`;
}

console.log(formatted);
