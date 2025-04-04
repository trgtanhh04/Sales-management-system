import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// FileUploadWithPreview
import { FileUploadWithPreview } from "https://unpkg.com/file-upload-with-preview/dist/index.js"
const upload = new FileUploadWithPreview('upload-image',{
    multiple: true,
    maxFileCount: 6
});
//End FileUploadWithPreview



// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if(formSendData){
    formSendData.addEventListener("submit", (e) =>{
        e.preventDefault()
        const content = e.target.elements.content.value
        const images = upload.cachedFileArray || []
        // console.log("hihi", images)

        if(content || images.length > 0){
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            })
            e.target.elements.content.value = ""
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden")
        }
    })
}
// END_CLIENT_SEND_MESSAGE

// SERVER_RETURN_MASSAGE
socket.on("SERVER_RETURN_MASSAGE", (data)=>{
    const body = document.querySelector(".chat .inner-body")
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const boxTyping = document.querySelector(".inner-list-typing")
    
    const div = document.createElement("div")

    let htmlFullName = ""
    let htmlContent = ""
    let htmlImages = ""

    if(myId == data.userId){
        div.classList.add("inner-outgoing")
    }else{
        div.classList.add("inner-incoming")
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    }

    if(data.content){
        htmlContent = `
            <div class="inner-content">${data.content}</div>
        `
    }

    if (data.images) {
        htmlImages += `<div class="inner-images">`;
    
        for (const image of data.images) {
            htmlImages += `<img src="${image}">`;
        }
    
        htmlImages += `</div>`;
    }
    
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;
    
    body.insertBefore(div, boxTyping)
    body.scrollTop = body.scrollHeight


    // Priview image
    const boxImages = div.querySelector(".inner-images")
    if(boxImages){
        const gallery = new Viewer(boxImages);
    }
})
// END_SERVER_RETURN_MASSAGE

// Scroll Chat to button
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight
}

//emoji-picker
//shown typing
var timeOut;
const showTyping = () =>{
    socket.emit("CLIENT_SEND_TYPING", "show")
    clearTimeout(timeOut)

    timeOut = setTimeout(()=>{
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000)
}

//Shown popper
const buttonIcon = document.querySelector(".button-icon")
if(buttonIcon){
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
//insert icon
const emojiClick = document.querySelector('emoji-picker')
if(emojiClick){
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")

    emojiClick.addEventListener("emoji-click", (event)=>{
        const icon = event.detail.unicode
        inputChat.value = inputChat.value + icon
        const end = inputChat.value.length
        inputChat.setSelectionRange(end, end)
        inputChat.focus()

        showTyping()
    })

    inputChat.addEventListener("keyup", ()=>{
        showTyping()
    })
}
//end-emoji-picker

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")
if(elementListTyping){

    socket.on("SERVER_RETURN_TYPING", (data)=>{
        if(data.type == "show"){
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if(!existTyping){
                const bodyChat = document.querySelector(".chat .inner-body")
                const boxTyping = document.createElement("div")
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.userId)

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `
                elementListTyping.appendChild(boxTyping)
                bodyChat.scrollTop = bodyChat.scrollHeight
            }
        }else{
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if(boxTypingRemove){
                elementListTyping.removeChild(boxTypingRemove)
            }
        }
    })
}

//END_SERVER_RETURN_TYPING

// Preview image
if(bodyChat){
    const gallery = new Viewer(bodyChat);
}
// End preview image