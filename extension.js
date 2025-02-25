// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

module.exports = {
    name: 'Student Club Activities',
    publisher: 'Pansoft Card Contest -Kamar',
    cards: [{
        type: 'StudentClubsCard',
        source: './src/cards/StudentClubs.jsx',
        title: 'Student Clubs and Activities',
        displayCardType: 'Student Clubs and Activities',
        description: 'Student Clubs and Activities',
        configuration: {
            client: [{
                key: 'clubLimit',
                label: 'No Of Club Activity allowed',
                type: 'text',
                required: true
            },
            {
                key: 'clubCategory',
                label: 'Activity Category for Clubs',
                type: 'text',
                required: true
            },            
            {
                key: 'clubFees',
                label: 'Fee for joining Each Club',
                type: 'text',
                required: true
            }],
            server: [{
                key: 'ethosApiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: true,
                default:'6020297c-8506-4f23-b2db-6c95dc0f0bee'
            }]
        }
    }]
}
