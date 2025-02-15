import fs from 'fs';
import { PurgeCSS } from 'purgecss';

const OUT_CSS = './public/css/postique.min.css';
const stream = fs.createWriteStream(OUT_CSS);

const purgeCSSResults = await new PurgeCSS().purge({
    content: ['./views/**/*.ejs'],
    css: ['./public/**/*.css'],
});

purgeCSSResults.forEach((result) => {
    stream.write(result.css + '\n');
});
