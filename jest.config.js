module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    moduleDirectories: ['<rootDir>', 'src', 'node_modules'],
    testRegex: '/(src|tests)/.*\\.test.(ts|js)$',
};
