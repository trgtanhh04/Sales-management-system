//1. Chức năng gửi yêu cầu
const listButtonAddFriend = document.querySelectorAll("[btn-add-friend]")

if(listButtonAddFriend.length > 0){
    listButtonAddFriend.forEach(button =>{
        button.addEventListener("click", ()=>{
            button.closest(".box-user").classList.add("add")
            const userId = button.getAttribute("btn-add-friend")
            // console.log(userId)

            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}
//Hết chức năng gửi yêu cầu

//Chức năng hủy gửi yêu cầu
const listButtonCancelFriend = document.querySelectorAll("[btn-cancel-friend]")

if(listButtonCancelFriend.length > 0){
    listButtonCancelFriend.forEach(button =>{
        button.addEventListener("click", ()=>{
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend")

            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}
//End Chức năng hủy gửi yêu cầu


//Chức nawmng từ chối kết bạn
const listButtonRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")

if(listButtonRefuseFriend.length > 0){
    listButtonRefuseFriend.forEach(button =>{
        button.addEventListener("click", ()=>{
            button.closest(".box-user").classList.add("refuse")

            const userId = button.getAttribute("btn-refuse-friend")
            //console.log("o day nha ma",userId)

            socket.emit("CLIENT_REFUSE_FRIEND", userId)
        })
    })
}
//End chức năng từ chối kết bạn