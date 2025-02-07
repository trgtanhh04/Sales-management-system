const md5 = require("md5")
const User = require("../../models/user.model.js")
const ForgotPassword = require("../../models/forgot-password.model.js")
const generateHelper = require("../../helpers/generate.js") 


// [GET] /user/register
module.exports.register = async(req, res)=>{
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    })
}

//[POST] /user/register
module.exports.registerPost = async(req, res)=>{
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if(existEmail){
        req.flash('error', 'Email đẫ tồn tại!');
        res.redirect("back")
        return;
    }

    req.body.password = md5(req.body.password)

    const user = new User(req.body)
    await user.save()

    // console.log(user)
    res.cookie("tokenUser", user.tokenUser)
    req.flash('success', 'Đăng ký tài khoản thành công!');

    res.redirect("/") 
}


//[GET] user/login
module.exports.login = async(req, res)=>{
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    })
}

//[POST] user/login
module.exports.loginPost = async(req, res)=>{
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash('error', 'Email không tồn tại!');
        res.redirect("back")
        return;
    }

    if(md5(password) != user.password){
        req.flash('error', 'Mật khẩu không chính xác!');
        res.redirect("back")
        return;
    }

    if(user.status == "inactive"){
        req.flash('error', 'Tài khoản của bạn đã bị khóa!');
        res.redirect("back")
        return;
    }

    // console.log(req.body)
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")
}


//[GET] user/logout
module.exports.logout = async(req, res)=>{
    res.clearCookie("tokenUser")
    res.redirect("/")
}


//[GET] user/password/forgot
module.exports.forgotPassword = async(req, res)=>{
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu",
    })
}

//[POST] user/password/forgot
module.exports.forgotPasswordPost = async(req, res)=>{
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash('error', 'Email không tồn tại!');
        res.redirect("back")
        return;
    }

    //Việc 1: Tạo mã OTP và lưu OPT, email vào collection forgot-password
    const otp = generateHelper.generateRandomNumber(4)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    //console.log(objectForgotPassword)
    //Việc 2: Gửi mã OTP qua email cho người dùng
    //code sau

    res.redirect(`/user/password/otp?email=${email}`)
}

//[GET] trang nhập mã otp /user/password/otp
module.exports.otpPassword = async(req, res)=>{
    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}
//[POST] /user/password/otp
module.exports.otpPasswordPost = async(req, res)=>{
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    // console.log(result)
    if(!result){
        req.flash('error', 'OTP không hợp lệ!');
        res.redirect("back")
        return;
    }

    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/user/password/reset")
}