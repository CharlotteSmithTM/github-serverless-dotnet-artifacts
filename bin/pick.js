#!/usr/bin/env node

import enq from 'enquirer'
import min from 'minimist'
import yaml from 'js-yaml'
import { readFileSync } from 'fs'
import p from '../lib/prompts.js'
import tags from '../lib/tags.js'
import deploy from '../lib/deploy.js'

const sls = yaml.safeLoad(readFileSync('serverless.yml'));

const {
    e: envs = ['stage', 'prod'],
    c: count = 7
} = min(process.argv.slice(2));

console.clear()

tags(envs, count, sls)
    .then(tags =>
        enq.prompt([
            p.version(tags),
            p.environments(envs),
            p.confirm(sls.service),
        ]))
    .then(({ version, envs, confirm }) => {
        if (confirm) deploy(envs, version);
    })
    .catch(console.error);