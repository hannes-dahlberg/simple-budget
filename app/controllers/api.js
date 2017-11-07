const fs = require('fs')

module.exports = {
    backup(request, result) {
        fs.writeFile(__dirname + '/../../storage/' + request.body.name + '.json', request.body.data, 'utf8', (error) => {
            if(error) { console.log(error); result.sendStatus(500); return; }
            result.send()
        })
    },
    restore(request, result) {
        fs.readFile(__dirname + '/../../storage/' + request.query.name + '.json', 'utf8', (error, data) => {
            if(error) { console.log(error); result.sendStatus(500); return; }
            result.send(data)
        })
    }
}