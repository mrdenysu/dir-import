import { readdir, stat, readFile } from "fs/promises";
import { pathToFileURL } from "url";
import { join, extname, normalize, resolve } from "path";

export type Options = {
    deep?: boolean;
    js?: boolean;
    json?: boolean;
};

/**
 * Patch system path to add a filename function.
 * @example filename("something.js") => "something"
 */
function filename(path: string): string {
    var extension = extname(path);
    return path.substr(0, path.length - extension.length);
}

/**
 * Convert hyphens to camel case
 * @example camelCase("hello-world") => "helloWorld"
 */
function camelCase(input: string): string {
    return input.replace(/-(.)/g, function (_, firstLetter: string) {
        return firstLetter.toUpperCase();
    });
}

/**
 * Walk all files and folders in path to build tree
 */
async function walk(path: string, options: Options): Promise<object> {
    console.log(path);
    const tree = {};

    for (const file of await readdir(path)) {
        const newPathURL = pathToFileURL(join(path + "/" + file));
        const newPath = join(path + "/" + file);
        const status = await stat(newPathURL);
        if (status.isFile()) {
            const extension = extname(file);
            if (extension === ".js" && options.js) {
                tree[camelCase(filename(file))] = await import(newPathURL.href);
                tree[camelCase(filename(file))] = tree[
                    camelCase(filename(file))
                ].default
                    ? tree[camelCase(filename(file))].default
                    : tree[camelCase(filename(file))];
            } else if (extension === ".json" && options.json) {
                tree[camelCase(filename(file))] = JSON.parse(
                    <string>(
                        (<undefined>(
                            await readFile(new URL(newPathURL, import.meta.url))
                        ))
                    )
                );
            }
        } else if (status.isDirectory()) {
            tree[camelCase(file)] = await walk(newPath, options);
        }
    }

    return tree;
}

// Main function.
export default async function dirImport(
    baseDirectory: string,
    options: Options
): Promise<object> {
    options = options || {};
    if (options.deep === undefined) {
        options.deep = true;
    }
    if (options.js === undefined) {
        options.js = true;
    }
    if (options.json === undefined) {
        options.json = false;
    }

    var normalized = normalize(baseDirectory).replace(/[\/|\\]$/, "");
    if (resolve(baseDirectory) !== normalized) {
        baseDirectory = join(process.cwd() + "/" + baseDirectory);
    }

    return await walk(baseDirectory, options);
}
