var gifArr = ["excited", "sad", "happy", "sleepy", "surprised", 'confused', "crying", "shocked"]
var apiKey = 'dc6zaTOxFJmzC&q'


function makeBtns(){
  $('#btn-list').empty()
  gifArr.forEach(creature=>$('#btn-list').append(`<button class='btn btn-primary' data-name=${creature}>${creature}</button>`))
  console.log('test')
  $('.btn').on('click', function(){
    console.log(this.dataset.name)
    var queryURL = `https://api.giphy.com/v1/gifs/search?q=${this.dataset.name}&api_key=${apiKey}_KEY&limit=10`
    $.ajax({url: queryURL, method: 'GET'}).then((res)=>{
      $('#gif-display').empty();
      res.data.forEach((gif)=>{
        console.log(gif)
        $('#gif-display').append(`
          <div class='gif-box'>
            <p>Rating: ${gif.rating}</p>
            <img src=${gif.images.fixed_height_still.url}
              data-animated='false'
              data-animate=${gif.images.fixed_height.url}
              data-still=${gif.images.fixed_height_still.url}>
          </div>
          `)
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
    })
  })
}

function addGif(){
  event.preventDefault()
  console.log(event)
}
$('#add-gif-btn').on('click', ()=>{
  event.preventDefault();
  gifArr.push($('#input-text').val())
  makeBtns()
  console.log($('#input-text').val())
})

makeBtns()
