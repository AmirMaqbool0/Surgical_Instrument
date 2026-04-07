"use strict"
require('module-alias/register')
require('@root/database')

const args = process.argv.slice(2);

const validEnvironments = ['development', 'testing', 'staging'];

const environmentFlag = args.find(arg => validEnvironments.includes(arg));

const runSeedFunctions = async () => {
    if (!environmentFlag) {
        console.log('Invalid command. Please specify a valid environment flag (--development, --testing, --staging).');
    } else {
        switch (environmentFlag) {
            case 'development':
                break;
            case 'testing':
                break;
            case 'staging':
                break;
            default:
                console.log('Invalid environment.');
                break;
        }
        process.exit('1')
    }
};
runSeedFunctions();
