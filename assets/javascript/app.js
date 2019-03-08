var gifArr = ["excited", "sad", "happy", "sleepy", "surprised", 'confused', "crying", "shocked"]
var apiKey = 'dc6zaTOxFJmzC&q'

var favArr = []

function makeBtns(){
  $('#btn-list').empty()
  gifArr.forEach(creature=>$('#btn-list').append(`<button class='btn btn-primary show-gifs' data-name=${creature}>${creature}</button>`))
  console.log('test')
  $('.show-gifs').on('click', onClickAddGifs)
}

//function to add gif cards/tiles to on click of buttons after they are created
function onClickAddGifs(){
  console.log(this.dataset.name)
  var queryURL = `https://api.giphy.com/v1/gifs/search?q=${this.dataset.name}&api_key=${apiKey}_KEY&limit=10`
  $.ajax({url: queryURL, method: 'GET'}).then((res)=>{
    $('#gif-display').empty();
    res.data.forEach((gif)=>{
      console.log(gif)
      addGifTile(gif.images.fixed_height_still.url, gif.images.fixed_height.url, gif.rating, gif.title)
    })
    $('#gif-display').append(`<div class='fill-space'></div>`)
    $('img').on('click', function(){
      var animateData = this.dataset.animate
      var stillData = this.dataset.still
      var animated = this.dataset.animated
      console.log(animated)
      if(animated === "true"){
        $(this).attr('src', stillData)
        $(this).attr('data-animated', "false")
      } else {
        $(this).attr('src', animateData)
        $(this).attr('data-animated', "true")
      }
    })
    $('.add-fav').on('click', function(){
      console.log($(this).parent().siblings('.card-img'))
      var imgSibling = $(this).parent().siblings('.card-img')
      var newFav = {
        still: imgSibling.data('still'),
        animate: imgSibling.data('animate'),
        rating: imgSibling.data('rating'),
        title: imgSibling.data('title')
      }
      console.log(newFav)
      favArr.push(newFav)
    })
  })
}

// function to append HTML for gif card/tile
function addGifTile(still, animate, rating, title, isFav=false){
  $('#gif-display').append(`
    <div class="card" style="width: 18rem;">
      <img class="card-img"
        src=${still}
        data-animated='false'
        data-animate=${animate}
        data-still=${still}
        data-rating=${rating}
        data-title=${title}
        alt="Card image cap">
      <div class="card-body text-center">
        <p class="card-text">Rating: ${rating}</p>
        <h5 class="card-title">${title}</h5>
        ${isFav ? '' : `<a href="#" class="btn btn-primary btn-center add-fav">Add Favorite</a>`}
      </div>
    </div>
  `)
}

$('#add-gif-btn').on('click', ()=>{
  event.preventDefault();
  gifArr.push($('#input-text').val())
  makeBtns()
  console.log($('#input-text').val())
})
$('#show-favorites').on('click', function(){
  $('#gif-display').empty()
  favArr.forEach((fav)=>{
    addGifTile(fav.still, fav.animate, fav.rating, fav.title, true)
  })
})

makeBtns()
