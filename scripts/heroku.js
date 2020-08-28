const { exec } = require('child_process')
const argv = require('minimist')(process.argv.slice(2))

exec(`echo "Start" && git add . && git commit -m ${argv._[0] || 'heroku upload'} && git push heroku master`).stdout.pipe(process.stdout)
