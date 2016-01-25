#!/usr/bin/env node

var convict = require('convict');

// Schema
var conf = convict({
    env     : {
        doc    : 'Environnment de l\'application',
        format : ['prod', 'dev'],
        default: 'dev',
        env    : 'NODE_ENV',
        arg    : 'env'
    },
    logDebug: {
        doc    : 'Activation du logger en debug',
        default: false,
        env    : 'NODE_LOG_DEBUG'
    },
    server  : {
        doc    : 'Le serveur à pour les appels WS',
        default: 'TO_BE_DEFINED',
        env    : 'NODE_SERVER'
    }
});

var env = conf.get('env');
conf.loadFile('build/config/env/' + env + '.json');

// perform validation
conf.validate();

module.exports = conf;