const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/* Resolver -> sezione della config che dice a Metro come interpretare i file in base all’estensione.
*  Permette di leggere i file .sql come file binari e non come codice JS.
* */
config.resolver = config.resolver || { assetExts: [], sourceExts: [] };

if (!config.resolver.assetExts.includes('sql')) {
    config.resolver.assetExts.push('sql');
}

config.resolver.sourceExts = (config.resolver.sourceExts || []).filter(
    (ext) => ext !== 'sql'
);

module.exports = config;
