export declare type Options = {
    deep?: boolean;
    js?: boolean;
    json?: boolean;
};
export default function dirImport(baseDirectory: string, options: Options): Promise<object>;
