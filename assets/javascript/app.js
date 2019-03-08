var gifArr = ["excited", "sad", "happy", "sleepy", "surprised", 'confused', "crying", "shocked"]
var apiKey = 'dc6zaTOxFJmzC&q'

var favArr = []

function makeBtns(){
  $('#btn-list').empty()
  gifArr.forEach(gif=>$('#btn-list').append(`<button class='btn btn-primary show-gifs' data-name=${gif}>${gif}</button>`))
  $('.show-gifs').on('click', onClickAddGifs)
}

//function to add gif cards/tiles to on click of buttons after they are created
function onClickAddGifs(){
  var queryURL = `https://api.giphy.com/v1/gifs/search?q=${this.dataset.name}&api_key=${apiKey}_KEY&limit=10`
  $.ajax({url: queryURL, method: 'GET'}).then((res)=>{
    $('#gif-display').empty();
    console.log(res.data)
    res.data.forEach((gif)=>{
      // console.log(gif)
      addGifTile(gif.images.fixed_height_still.url, gif.images.fixed_height.url, gif.rating, gif.title)
    })
    $('#gif-display').append(`<div class='fill-space'></div>`)
    $('img').on('click', onClickImg)
    $('.add-fav').on('click', function(){
      var imgSibling = $(this).parent().siblings('.card-img')
      var newFav = imgSibling.data('storage')
      if(favArr.indexOf(newFav) === -1){
        favArr.push(newFav)
      }
    })
  })
}

// function to append HTML for gif card/tile
function addGifTile(still, animate, rating, title, isFav=false){
  // console.log(title)
  $('#gif-display').append(`
    <div class="card" style="width: 18rem;">
      <img class="card-img"
        src=${still},
        data-animated=false,
        data-storage='{
          "animate": "${animate}",
          "still": "${still}",
          "rating": "${rating}",
          "title": "${title}"
        }'
        alt="Card image cap">
      <div class="card-body text-center">
        <p class="card-text">Rating: ${rating.toUpperCase()}</p>
        <h5 class="card-title">${title}</h5>
        ${isFav ? '' : `<a href="#" class="btn btn-primary btn-center add-fav">Add Favorite</a>`}
      </div>
    </div>
  `)
}
function onClickImg(){
  console.log(JSON.parse(this.dataset.storage))
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

$('#add-gif-btn').on('click', ()=>{
  event.preventDefault();
  gifArr.push($('#input-text').val())
  makeBtns()
  console.log($('#input-text').val())
})
$('#show-favorites').on('click', function(){
  $('#gif-display').empty()
  console.log(favArr)
  favArr.forEach((fav)=>{addGifTile(fav.still, fav.animate, fav.rating, fav.title, true)})
  // ('#gif-display').append(`<div class='fill-space'></div>`)
  $('img').on('click', onClickImg)
})

makeBtns()
