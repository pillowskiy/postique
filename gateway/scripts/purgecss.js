import fs from 'fs';
import minimist from 'minimist';
import { PurgeCSS } from 'purgecss';

const argv = minimist(process.argv.slice(2), {
    string: ['content', 'css', 'output'],
});

if (!argv.content) {
    throw new Error(
        'Content is required, please provide a content in the form of a glob',
    );
}

if (!argv.css) {
    throw new Error(
        'CSS is required, please provide a css in the form of a glob',
    );
}

if (!argv.output) {
    throw new Error('Output is required, please provide an output file path');
}

const stream = fs.createWriteStream(argv.output);

const purgeCSSResults = await new PurgeCSS().purge({
    content: argv.content.split(','),
    css: argv.css.split(','),
});

purgeCSSResults.forEach((result) => {
    stream.write(
        `/* Source: ${result.file || 'GENERATED'} */\n\n ${result.css}\n`,
    );
});
