// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import log from 'loglevel';
const logger = log.getLogger('default');

export async function addStudentClub({ authenticatedEthosFetch, cardId, cardPrefix, contact }) {
    const resource = process.env.PIPELINE_POST_STUDENT_CLUBS;
      
    try {
        const start = new Date();

        const urlSearchParameters = new URLSearchParams({
            cardId,
            cardPrefix
        }).toString();

        const resourcePath = `${resource}?${urlSearchParameters}`;

        const response = await authenticatedEthosFetch(resourcePath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(contact)
        });

        const end = new Date();
        logger.debug(`post ${resource} time: ${end.getTime() - start.getTime()}`);

        let result;
        if (response) {
            switch (response.status) {
                case 200:
                    try {
                        const data = await response.json();

                        result = {
                            data,
                            status: 'success'
                        };
                    } catch (error) {
                        result = {
                            error: {
                                message: 'unable to parse response',
                                statusCode: 500
                            }
                        };
                    }
                    break;
                default:
                    result = {
                        error: {
                            message: 'server error',
                            statusCode: response.status
                        }
                    };
            }
        }

        return result;
    } catch (error) {
        logger.error('unable to search for persons: ', error);
        throw error;
    }
}



