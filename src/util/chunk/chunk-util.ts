/**
 * Divides an array up into multiple chunks
 *
 * @param arr
 * @param chunkSize
 * @returns
 */
export function chunkify<T>(arr: T[], chunkSize: number): T[][] {
	const chunkList: T[][] = [];
	const chunkCount = Math.ceil(arr.length / chunkSize);
	for (let i = 0; i < chunkCount; i++) {
		chunkList.push(arr.splice(0, chunkSize));
	}
	return chunkList;
}
