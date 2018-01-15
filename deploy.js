require('dotenv').config({
    path: './.env' + ((process.env.NODE_ENV != 'development' && process.env.NODE_ENV) ? '.' + process.env.NODE_ENV : '')
})

var exec = require('child_process').exec
//Building assets
console.log('Building assets')
exec('npm run '  + process.env.NODE_ENV, (error, stdout, stderr) => {
    console.log('Uploading files')
    exec('rsync -azP --delete --filter=\":- .gitignore\" . ' + process.env.SFTP_USERNAME + '@' + process.env.SFTP_HOST + ':' + process.env.SFTP_PATH, (error, stdout, stderr) => {
        console.log('Done!')
    });
});