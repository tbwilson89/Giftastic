# Emotional Gif-Tastic Search
![Giphy Logo](/assets/images/giphy.gif)

## Overview
A website built using the Giphy API to search and display gifs.
Default search buttons are displayed based on an array of terms in the code. These terms can be added to through a small form on the top right of the page.
By clicking on a button with a term at the top of the page the webpage will dynamically build out 10 gif "cards" in a still state, rather then animated as well as the rating, title and a button to add to your favorites. If you click on the still gif it will swap to the animated version of the gif, clicking again will return it to a still state.
Pushing the favorite button will add it to a favorites array. These can be viewed by clicking the favorites button at the top of the page. You can also remove gifs from your favorites on the favorites page. Either adding or removing these will save the favorites to local storage, allowing the user to leave the page and return at a later date and still be able to view their favorites.

## API's
[Giphy API](https://giphy.com/)

## Special Thanks
[A Drip of JavaScript](http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html) - For the function used to check if an object of gif information matches a gif object already saved to the users favorites array.
