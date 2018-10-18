# This is Neighborhood Maps App

This app was made for the Udacity Full Stack Developer course.  
It is not my best work but hopefully I can keep updating this as time goes on.  

In order to use this app, just clone the repository and open up the  
index.html file in whichever internet browswer you so choose.

### Note on design
This is not exactly where I would like it to be yet but it works and that is  
what I think counts for this portion of the project. Hopefully I'll have time  
to comeback and dig into it later on. 

### Ok so a little background?
This app seems to have been designed as an exercise in exploring javascript  
and how it can be combined with various APIs to produce a cool app.  

The idea seems to be that we ought pick some city and locate some points of  
interest in that city so that others can see what is going on.  

I took a little bit of a different approach but hopefully still satisfy the  
main requirements of the app.  

As an architectural designer, I am quite interested in urban environments and  
APIs that cater to those environments. A couple such APIs, built by a subsidiary of  
of company that I quite admire - Sidewalk Labs which is itself a spin off from  
Alphabet - are the Routing and Curbs APIs by Coord. Coord is a company that  
is looking to simplify the various transportation related information networks  
that are in use in our cities today. The Routing API is an API that is similar  
to Google Maps' Directions API except that it compiles a multi-modal route thus  
giving someone a clear sense of what transportation options are available. The  
Curbs API is meant to give someone a snapshot of the rules governing the curbs  
of various parts of the city. Perhaps most useful to the average person is  
locating where potential parking spots are.

I chose San Francisco as the "neighborhood" for this application because it  
supported both of the APIs that Coord provides. The APIs are not yet supported  
in every city unfortunately.

### How to use this application
You will see that this application is split into 4 elements: Places, Routes,  
Curbs, and About. About being fairly self explanatory.

Places is the initial section to look into. It locates places and allows you to  
store them in your browser's locale storage for later retrieval - supposing that
that you use this app again in the future.


Routing allows for users to call both the Google Directions API as well as the  
Coord Routing API in order to provide directions to various places. Please note  
that the Coord API's UI is not well figured out yet. That is something that I  
hope to fix later on but due to it not being as built out as Google, I'll need  
to do all of that by hand.  

Curbs is the final useful section. If "Show Curbs" is toggled on, curb geometry  
is overlaid onto the map. The colors are defined in a legend that also appears  
in the menu. Again, more features would be ideally be built out here but for now  
it is not yet particularly robust.
