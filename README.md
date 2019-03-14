# NASA Image and Video Library Search Application 

MindSumo Challenge: https://www.mindsumo.com/contests/nasa-image-archive

## Objectives
Required: 
* A search function that displays results in an intuitive, easy to navigate interface.
* Image metadata for the individual search results, displayed intuitively.
* Give users the ability to refine search results by a date range, location, and any other smart searching criteria you see fit.

Features Implemented to Help Refine Search: 
* **Sort Search Results**
    * Once the user performs a search, he or she has the option to sort the results by data: Newest or Oldest First and alphabetically: A-Z or Z-A. To sort the JSON data, first an array is created with each image's unique id, title, and date created. Then based on the sort option selected, a array.compare function is defined to create the array.sort function. For example, the alphabetical sort function is:
    
    ```
     sort_array.sort(function(a,b){
      if(a.title < b.title) { return -1; }
      if(a.title > b.title) { return 1; }
      return 0;
      });
      
    ```
* **Search by NASA Center**
    * Instead of search by location, decided to give the user the option to select from a list of all NASA Centers. All image s in the NASA Image Library orginiate from one of these NASA Centers so the user has the option to only return images that were posted by one of these centers. 


Bonus Features Implemented: 
* **The ability to see past search history**
    * Past search history is stored in an JSON array in local storage. The most recent searches are displayed under the search options. Clicking on any of the past search history recreates the search. 
* **Marking or saving images into a "favorites" collection**
    * A button to add any image to "favorites" add the given image JSON data to an array of favorite images. Favorite images are rendered on a seperate "favorites" page.
* **Sharing an image on various social media channels**
    * Underneath the metadata for each image, various social media icons are present. Clicking on any of these icons will share the url of the photo to the desired social media channel. 

## Built With

* [React.js](https://reactjs.org/docs/getting-started.html) - Javascript Library used
* [NASA Image and Video Library](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf) - NASA API
* [Ant Design](https://ant.design/docs/spec/introduce) - React UI Framework Used 
* [Heroku](https://devcenter.heroku.com/) - Used for Application Deployment


## Authors

* **Deepak Goel** - [Deepak Goel](https://github.com/DeepakG123)
