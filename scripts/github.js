const { exec } = require('child_process')
const argv = require('minimist')(process.argv.slice(2))

exec(`echo "Start github" && git add . && git commit -m ${argv._[0] || 'automate save'} && git push`).stdout.pipe(process.stdout)
