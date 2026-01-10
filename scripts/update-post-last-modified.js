import fs from 'node:fs/promises';

import matter from 'gray-matter';
import git from 'isomorphic-git';

/**
 * @typedef {Object} StagedFile
 * @property {string} path
 * @property {boolean} isNew
 */

/**
 * @param {string} dir
 * @returns {Promise<StagedFile>}
 */
async function getStaged(dir) {
	const status = await git.statusMatrix({ fs, dir });

	return (
		status
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([filepath, _head, _workdir, stage]) => {
				if (!(filepath.startsWith('content/posts') && filepath.endsWith('.md'))) return false;

				return stage === 2;
			})
			.map(([filepath, head]) => ({ path: filepath, isNew: head === 0 }))
	);
}

/**
 * @param {StagedFile} file
 * @returns {Promise<void>}
 */
async function updateLastModified(file) {
	const content = await fs.readFile(file.path, 'utf-8');
	const { data: frontmatter, content: body } = matter(content);

	frontmatter.lastModified = file.isNew ? null : new Date();

	const updated = matter.stringify(body, frontmatter);
	await fs.writeFile(file.path, updated, 'utf-8');
}

async function main() {
	const dir = process.cwd();
	const staged = await getStaged(dir);
	if (staged.length === 0) {
		console.log('No markdown files changed');
		return;
	}

	for (const file of staged) {
		await updateLastModified(file);
		await git.add({ fs, dir, filepath: file.path });
	}

	console.log(`Updated lastModified timestamp for ${staged.length} post(s).`);
}

main();
