const { exec } = require('child_process')
const argv = require('minimist')(process.argv.slice(2))

exec(`git add . && git commit -m ${argv._[0] || 'automate save'} && git push && git push heroku master`).stdout.pipe(process.stdout)
