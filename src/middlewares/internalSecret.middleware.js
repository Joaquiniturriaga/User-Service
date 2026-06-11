const validateInternalSecret = (req, res, next) =>{
    const key = req.headers["x-internal-key"];
        console.log('>>> INTERNAL KEY recibida:', key);
    console.log('>>> INTERNAL SECRET env:', process.env.INTERNAL_SECRET);


    if (!key  || key !== process.env.INTERNAL_SECRET){
        //Respuesta generica
        return res.status(401).json({error: 'Unauthorized'});
    }
    next();
}

module.exports = {validateInternalSecret};
