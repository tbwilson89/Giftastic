var gifArr = ["excited", "sad", "happy", "sleepy", "surprised", 'confused', "crying", "shocked", 'wow']
var apiKey = 'dc6zaTOxFJmzC&q'
var favArr = []
var lastBtnClicked = ''
var btnClickOffset = 0

// creates buttons from each word in the gifArr array
function makeBtns(){
  $('#btn-list').empty()
  gifArr.forEach(gif=>$('#btn-list').append(`<button class='btn btn-primary show-gifs' data-name=${gif}>${gif.charAt(0).toUpperCase() + gif.slice(1)}</button>`))
  $('.show-gifs').on('click', onClickAddGifs)
}

//function to add gif cards/tiles to on click of buttons after they are created
function onClickAddGifs(event){
  // check if user presses the same gif button, appends more of the same kind if the same, clears and appends new selection otherwise
  if(lastBtnClicked === event.target.dataset.name){
    btnClickOffset++
  } else {
    btnClickOffset = 0
    lastBtnClicked = event.target.dataset.name
    $('#gif-display').empty();
  }
  var queryURL = `https://api.giphy.com/v1/gifs/search?q=${this.dataset.name}&api_key=${apiKey}_KEY&limit=10&offset=${btnClickOffset * 10}`
  $.ajax({url: queryURL, method: 'GET'}).then((res)=>{
    // For each gif returned, run function to create gif cards/tiles
    res.data.forEach((gif, i)=>{
      addGifTile(gif.images.fixed_height_still.url, gif.images.fixed_height.url, gif.rating, gif.title, i)
    })
    // Add onClick to .add-fav buttons.
    $('.add-fav').on('click', function(){
      var imgSibling = $(this).parent().siblings('.card-img')
      var newFav = Object.assign(imgSibling.data('storage'))
      // Check if new favorite object is already in the favArr.
      if(favArr.map(fav=>isObjEqual(fav,newFav)).indexOf(true) === -1){
        favArr.push(newFav)
        localStorage.setItem('favs', JSON.stringify(favArr))
      }
    })
  })
}
// function to check object equality (not instance, but values)
// Thanks for this function and explanation from:
// http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
function isObjEqual(a, b){
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}
// function to append HTML for gif card/tile
function addGifTile(still, animate, rating, title, index, isFav=false){
  $('#gif-display').append(`
    <div class="card" style="width: 18rem;">
      <img class="card-img"
        src=${still},
        data-animated=false,
        data-storage='{
          "animate": "${animate}",
          "still": "${still}",
          "rating": "${rating}",
          "title": "${title}",
          "index": "${index}"
        }'
        alt="Card image gif">
      <div class="card-body text-center">
        <p class="card-text">Rating: ${rating.toUpperCase()}</p>
        <h5 class="card-title">${title.charAt(0).toUpperCase() + title.slice(1)}</h5>
        ${isFav ? `<button class='btn btn-danger btn-center remove-fav'>Remove Favorite</button>` : `<button class="btn btn-primary btn-center add-fav">Add Favorite</button>`}
      </div>
    </div>
  `)
}
// onClick function that Changes the img between animated gif and still image
function onClickImg(){
  var animateData = JSON.parse(this.dataset.storage).animate
  var stillData = JSON.parse(this.dataset.storage).still
  var animated = this.dataset.animated
  console.log(animated)
  if(animated === "true"){
    $(this).attr('src', stillData)
    $(this).attr('data-animated', "false")
  } else {
    $(this).attr('src', animateData)
    $(this).attr('data-animated', "true")
  }
}
// onClick to add whatever text is in the text input field to a button to be used for searchs
$('#add-gif-btn').on('click', ()=>{
  event.preventDefault();
  gifArr.push($('#input-text').val())
  makeBtns()
})
// onClick for showing favorites and function to do so, seperated so that the function can call itself when deleting array elements by index (to reset index values)
$('#show-favorites').on('click', showFavorites)
function showFavorites(){
  $('#gif-display').empty()
  lastBtnClicked = ''
  console.log(favArr)
  favArr.forEach((fav, i)=>{addGifTile(fav.still, fav.animate, fav.rating, fav.title, i, true)})
  $('.remove-fav').on('click', function(){
    var eleImg = $(this).parent().siblings('.card-img')
    var storage = eleImg.data('storage')
    favArr.splice(storage.index, 1)
    localStorage.setItem('favs', JSON.stringify(favArr))
    $(this).parent().parent().remove()
    showFavorites()
  })
  $('img').on('click', onClickImg)
}
// Add onClick to image/gif to run function to change between the two states.
$(document).on('click', 'img', onClickImg)
// Used to load buttons based on gifArr and pull local storage to see if user has favorite gifs from a previous visit.
function onLoad(){
  makeBtns()
  localArr = JSON.parse(localStorage.getItem('favs'))
  if(Array.isArray(localArr)){
    console.log('testing')
    favArr = localArr
  }
  console.log(favArr)
}
//initial setup of buttons when loading document
onLoad()
