

function getTime(time){
    const hour = parseInt(time /3600)
    let remainingSecond = time%3600
    const minute = parseInt(remainingSecond /60)
    remainingSecond = remainingSecond %60;

    return `${hour}: ${minute}: ${remainingSecond}`
}

const getActiveBtnColor=()=>{
    const buttons = document.getElementsByClassName('category-btn')
    for(let btn of buttons){
       btn.classList.remove("active")
    }

}


function categoryID(id){
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res)=> res.json())
    .then((data)=> {
        getActiveBtnColor()
        const activeBtn = document.getElementById(`btn-${id}`)
        displayVideos(data.category)
        activeBtn.classList.add('active')
    })
    .catch((error)=> console.log(error))
}


const loadVideoId=async(videoId)=>{
    const uri = `
    https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json()
    displayVideoDetails(data.video)
}



const displayVideoDetails=(videos)=>{
    console.log(videos);
    const modalContainer = document.getElementById('modalContent')
    modalContainer.innerHTML = `
    <img src="${videos.thumbnail}"/>
    <p class="font-bold text-xl py-2">${videos.title}</p>
    <p  class="text-gray-500">${videos.description}</p>
    `


    document.getElementById('customModal').showModal()
}




const loadCategories = async () => {
    try {
        // Wait for the fetch call to complete
        const response = await fetch('https://openapi.programming-hero.com/api/phero-tube/categories');

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

       
        const data = await response.json();

       
        displayCategories(data.categories)
    } catch (error) {
        
        console.error('Error fetching categories:', error);
    }
}


const displayCategories =(categories)=>{
    const nav = document.getElementById('categories')
    categories.forEach((item) => {
        //create a btn
        const buttonContainer = document.createElement('div')
        buttonContainer.innerHTML= `
        <button id="btn-${item.category_id}"  onclick=categoryID(${item.category_id}) class="btn category-btn">${item.category}</button>
        `
       
        nav.appendChild(buttonContainer)
    })

    
}

loadCategories();



// Function to load videos from the API
const loadVideos = async (searcText ="") => {
    try {
        // Wait for the fetch call to complete
        const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searcText}`);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Display the videos by calling displayVideos function
        displayVideos(data.videos); // Assuming the video data is under 'data' in the API response
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

// Function to display videos on the page
const displayVideos = (videos) => {
    const main = document.getElementById('videos'); 
    main.innerHTML=""
    if(videos.length === 0){
        main.classList.remove('grid')
         main.innerHTML=`<div class="flex flex-col gap-5 justify-center items-center min-h-[300px]">
   
        <img src="./assests/icon.png"/>
        <h1 class="text-4xl font-bold">No Video Available</h1>
    
</div>
`
         return;
    } else{
        main.classList.add('grid')
    }
    videos.forEach((item) => {
        // Create a video element
        const div = document.createElement('div')
        div.classList = 'card card-compact  cursor-pointer'
        div.innerHTML =
        `
           <div onclick="loadVideoId('${item.video_id}')">     
        <div class ="w-full h-[250px] lg:h-[220px] relative">
            <img  class ="w-full h-full object-cover"
            src="${item.thumbnail}" />
            ${item.others.posted_date?.length === 0 ? "" : `<span class="absolute right-6 bottom-2 bg-black rounded p-1 text-white">${getTime(item.others.posted_date)}</span>`}
            
        </div>
        <div class ="flex px-0 py-2 gap-2 ">
        <div><img  class ="w-12 h-10 rounded-full object-cover"
            src="${item.authors[0].profile_picture}" /></div>
        <div class="">
            <h2 class="card-title">${item.title}</h2>
            <div class="flex gap-2 items-center">
            <p class="text-gray-500">${item.authors[0].profile_name}</p>
            ${item.authors[0].verified === true? '<img class="w-6 h-6" src="https://img.icons8.com/?size=96&id=102561&format=png"/>' : ''}
            </div>
            <p class="text-gray-500">${item.others.views} views</p>
            </div>
        </div>
        </div>
        
        `
        main.appendChild(div)
    });
}

// Call the function to load and display videos
loadVideos();

document.getElementById('search-input').addEventListener('keyup', (e)=>{
    loadVideos(e.target.value);
})

