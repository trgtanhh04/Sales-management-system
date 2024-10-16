const Account = require("../../models/account.model.js")
const Roles = require("../../models/role.model")
const systemConfig = require("../../config/system.js")
const md5 = require('md5');
//1. [GET] admin/accounts
module.exports.index = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token")
    
    //Thêm role cho các record
    for (const record of records) {
        const role = await Roles.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }    

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}
//2.
//[GET] admin/accounts/create
module.exports.create = async (req, res)=>{
    const find = {
        deleted: false
    }
    const roles = await Roles.find(find)
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
        roles: roles
    })
}
//[POST] admin/accounts/create
module.exports.createPost = async (req, res)=>{
    const emailExit = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if(emailExit){
        req.flash("error", `Email ${req.body.email} đã tồn tại!`)
        res.redirect(`back`)
    }else{
        req.body.password = md5(req.body.password)
        const records = new Account(req.body)
        await records.save()
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}


//3
//[GET] admin/accounts/edit/:id
module.exports.edit = async (req, res)=>{
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const roles = await Roles.find({
        deleted: false
    })
    const account = await Account.findOne(find)
    console.log(account)
    res.render("admin/pages/accounts/edit.pug", {
        pageTitle: "Chỉnh sửa tài khoản",
        account: account,
        roles:roles
    })
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res)=>{
    const id = req.params.id
    const emailExit = await Account.findOne({
        _id: {$ne: id},//Tìm bản khi khác email mình đnag xét để tránh lặp
        email: req.body.email,
        deleted: false
    });
    if(emailExit){
        req.flash("error", `Email ${req.body.email} đã tồn tại!`)
        res.redirect(`back`)
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password)
        }else{
            delete req.body.password
        }
        try {
            await Account.updateOne({_id: req.params.id}, req.body )
            req.flash('success', 'Cập nhập thành công!');
            res.redirect(`${systemConfig.prefixAdmin}/accounts`)
        } catch (error) { 
            console.error('Error updating product:', error);
            req.flash('error', 'Cập nhật không thành công!');
            return res.redirect('back');
        }
    }
}