// tslint:disable:strict-boolean-expressions

/**
 * Retrieves all possible combinations of the elements of the given array
 */
export function* getCombinations<T> (arr: T[], minSize: number = 1): IterableIterator<T[]> {

	/**
	 * The inner handler
	 * @param offset
	 * @param combo
	 * @returns {IterableIterator<any>}
	 */
	function* doGenerateCombinations (offset: number, combo: T[]): IterableIterator<T[]> {
		if (combo.length >= minSize) {
			yield combo;
		}
		for (let i = offset; i < arr.length; i++) {
			yield* doGenerateCombinations(i + 1, combo.concat(arr[i]));
		}
	}

	yield* doGenerateCombinations(0, []);
}

/**
 * Gets all permutations of the given array
 * @param {T[]} permutation
 * @returns {IterableIterator<T[]>}
 */
export function* getPermutations<T> (permutation: T[]): IterableIterator<T[]> {
	const length = permutation.length;
	const c = Array(length).fill(0);
	let i = 1;
	let k: number = 0;
	let p: T;

	yield permutation.slice();
	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			p = permutation[i];
			permutation[i] = permutation[k];
			permutation[k] = p;
			++c[i];
			i = 1;
			yield permutation.slice();
		} else {
			c[i] = 0;
			++i;
		}
	}
}