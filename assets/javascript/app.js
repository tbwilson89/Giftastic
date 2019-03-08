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
    console.log(res.data)
    res.data.forEach((gif, i)=>{
      addGifTile(gif.images.fixed_height_still.url, gif.images.fixed_height.url, gif.rating, gif.title, i)
    })
    $('img').on('click', onClickImg)
    $('.add-fav').on('click', function(){
      var imgSibling = $(this).parent().siblings('.card-img')
      var newFav = imgSibling.data('storage')
      console.log(favArr.indexOf(newFav))
      if(favArr.indexOf(newFav) === -1){
        favArr.push(newFav)
      }
    })
  })
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
  console.log(favArr)
  favArr.forEach((fav, i)=>{addGifTile(fav.still, fav.animate, fav.rating, fav.title, i, true)})
  $('.remove-fav').on('click', function(){
    var eleImg = $(this).parent().siblings('.card-img')
    var storage = eleImg.data('storage')
    favArr.splice(storage.index, 1)
    // TESTING COOKIES HERE
    bake_cookie('giftastic_cookie', favArr)
    // ^ THIS IS A WIP ^
    $(this).parent().parent().remove()
    showFavorites()
  })
  $('img').on('click', onClickImg)
}
//initial setup of buttons when loading document
read_cookie('giftastic_cookie')
makeBtns()

// TESTING COOKIES
// Make 'em
function bake_cookie(name, value) {
  var json_arr = JSON.stringify(value)
  var testCookie = `${name}=${JSON.stringify(value)}; domain=.${window.location.host.toString()}; path=/;`
  var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
  document.cookie = cookie;
}
// Read 'em
function read_cookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 console.log(result)
 return result;
}
