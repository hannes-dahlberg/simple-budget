module.exports = {
    key(request, result, next) {
        if(request.query.key != '6201472823b636be3334b720da4d9e95') {
            result.sendStatus(401)
            return
        }
        next()
    }
}