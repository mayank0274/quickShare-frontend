
const dropzone = document.querySelector(".upload_sec");
const addBtn = document.querySelector(".addbtn");
const fileSelect = document.querySelector("#fileInput");

const uploadText = document.querySelector(".uploadText");

const progressElem = document.querySelector(".progress")

const progressPercent = document.querySelector(".percent")

const progressBar = document.querySelector(".progressInner")


const linkBox = document.querySelector(".resLink");

const fileLink = document.querySelector(".fileLink");

const shareBtn = document.querySelector(".shareBtn");

const maxSize = 200 * 1024 * 1024;
//200 mb

addBtn.addEventListener("click",()=>{
  
  fileSelect.click();
});


// handling drop
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
 
  const files = e.dataTransfer.files;
  if (files.length === 1) {
    if (files[0].size < maxAllowedSize) {
      fileSelect.files = files;
      uploadFile();
    } else {
showError("File size can't exceed 200MB")
    }
  } else if (files.length > 1) {
showError("You can't upload multiple files")
}
  
});


// trigger upload file
fileSelect.addEventListener("change",(e)=>{
//  console.log("upload")
 // console.log(fileSelect.files.length);
  if(fileSelect.files[0].size>maxSize){
  showError("File size can't exceed 200MB")
    fileSelect.value = ""
    return;
  }
  uploadFile()
})





// upload file
const uploadFile = ()=>{
  const file = fileSelect.files[0];
  const data = new FormData()
  data.append("myFile",file);
  
  const xhr = new XMLHttpRequest();
  
  //handling progress
  xhr.upload.onprogress = updateProgress;

  // handle Error
  xhr.upload.onerror = function () {
   showError("An error occurred while uploading")

    fileInput.value = ""; 
   progressElem.style.display = "none"
    linkBox.style.opacity = "0"
  };


  xhr.onreadystatechange = ()=>{
    if (xhr.readyState == XMLHttpRequest.DONE) {
      onFileUploadSuccess(xhr.responseText);
    }
  };

    xhr.open("POST","http://localhost:3000/api/files")
    xhr.send(data)
  }
  
  //tracking progress
  const updateProgress = (event)=>{
    const uploadPercent = Math.round((event.loaded/event.total)*100);
    //console.log(event)
    addBtn.style.display = "none"
    uploadText.style.display = "none"
    progressElem.style.display = "block"
    progressPercent.innerText = uploadPercent + " %";
    progressBar.style.width = `${uploadPercent}%`
    //console.log(uploadPercent)
  }
  
  // file upload success
  const onFileUploadSuccess = (res)=>{
    fileSelect.value = "";
    addBtn.style.display = "block"
    uploadText.style.display = "block"
    progressElem.style.display = "none"
    linkBox.style.opacity = "1"
    const { fileLink: url } = JSON.parse(res);
    fileLink.value = url;
  }
  
// share link
shareBtn.addEventListener("click",()=>{
    if(navigator.share){
    navigator.share({
      title:"File url",
      text:"Share this link(Link expire in 25 hrs) 👇👇",
      url: fileLink.value
    }).then(()=>{
    // console.log("share success")
    })
    .catch((err)=>{
     // console.log("browser doesn't suppor")
    })
  }else{
    fileLink.select()
    document.execCommand("copy")
showError("Web share not supported in your browser (Link copied to clipboard)")
  }
})

// error message
const showError = (errorMsg)=>{

var notyf = new Notyf({
  duration: 1500,
dismissible:true
});

// Display an error notification
notyf.error(errorMsg);
	
}
