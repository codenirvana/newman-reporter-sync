const request = require('postman-request'),

    POSTMAN_API_URL = 'https://api.getpostman.com';

/**
 *
 * @param {*} newman -
 * @param {*} options -
 * @param {*} runOptions -
 */
function SyncReporter (newman, options, runOptions) {
    const { postmanApiKey } = runOptions;

    if (!postmanApiKey) {
        console.error('newman-reporter-sync:\n  error: missing required option `postmanApiKey`');

        return;
    }

    newman.on('beforeDone', () => {
        let { environment } = newman.summary,
            reqOptions;

        if (!(environment && environment.id)) {
            return;
        }

        reqOptions = {
            url: `${POSTMAN_API_URL}/environments/${environment.id}`,
            headers: {
                'X-Api-Key': postmanApiKey
            }
        };

        request
            .get(reqOptions)
            .on('response', (response) => {
                if (response.statusCode !== 200) {
                    return;
                }

                request.put({
                    ...reqOptions,
                    body: {
                        environment: environment.toJSON()
                    },
                    json: true
                });
            });
    });
}

module.exports = SyncReporter;
