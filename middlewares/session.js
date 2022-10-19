
module.exports = {
    adminSessionChecker: (req,res,next)=>{
        if (req.session.loggedIn){
            next()
        }else{
            res.redirect('/admin/')
        }
    },
    userSessionChecker: (req,res,next)=>{
        if (req.session.loggedIn){
            next()
        }else{
            res.redirect('/login')
        }
    }
}