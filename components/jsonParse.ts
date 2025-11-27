// Some JSON data might have trailing commas that cause JSON.parse to fail. (e.g. from Supermarket Together exports)
export function jsonParse(data: Buffer, removeCommas?: boolean): any | null {
    try {
        const value = data.toString();
        const commaRegex = /,\s*}/g;
        if (removeCommas && commaRegex.test(value)) {
            return JSON.parse(Buffer.from(value.replace(commaRegex, '}')).toString());
        }

        const parsed = JSON.parse(value);
        return parsed;
    } catch (e) {
        const commaError = 'Expected double-quoted property name in JSON';
        if (!removeCommas && (e instanceof Error) && e.message.includes(commaError)) return jsonParse(data, true);
        return null;
    }
}