const handleError=(error,res)=>{

    console.log(error)
    res.status(error.stats || 500)
    res.json({
        message:error.message,
    })
}

module.exports=handleError;