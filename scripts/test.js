const { exec } = require('child_process')
const argv = require('minimist')(process.argv.slice(2))

console.log(argv)
exec('git push heroku master').stdout.pipe(process.stdout)
