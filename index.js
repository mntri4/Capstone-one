//capstone

function startSearch() {
    $('#start-button').on('click', function () {
      $('#search').removeClass('hidden');
      $('#start-button').addClass('hidden');
      $('.top, .middle, .bottom').addClass('topResult');
    });
  }
  
  //Get Youtube API data
  const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
  const YOUTUBE_API_KEY = "AIzaSyCd3vFdPMk1wvykYtP5lC8RbBJw-xckpjg";
  const YOUTUBE_WATCH_URL = "https://www.youtube.com/watch?v=";
  let PREV_TOKEN = '';
  let NEXT_TOKEN = '';
  
  function makeYoutubeQuery(searchTerm, task) {
    const query = {
      part: 'snippet',
      key: YOUTUBE_API_KEY,
      q: searchTerm,
      maxResults: 3,
    };
    if (task === 'next') {
      query.pageToken = NEXT_TOKEN;
    }
    if (task === 'prev') {
      query.pageToken = PREV_TOKEN;
    }
    return query;
    console.log(query);
  }
  
  function getDataFromYoutubeApi(query, callback) {
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  }
  
  function renderYTResult(result) {
    PREV_TOKEN = result.prevPageToken;
    NEXT_TOKEN = result.nextPageToken;
    $('#yt-results').html(" ");
    $('#yt-results').append(`
      <div class="channel youtube">YouTube</div>
    `);
    result.items.forEach((item) => {
      $('#yt-results').append(`
        <div class="yt-row">
          <div class="yt-1 yt-info">
            <a href="${YOUTUBE_WATCH_URL + item.id.videoId}" target="_blank"><img src="${item.snippet.thumbnails.default.url}" alt="Link to Youtube video titled ${item.snippet.title}" class="yt-thumb"></a>
          </div>
          <div class="yt-2">
            <h2 class="yt-title">${item.snippet.channelTitle}</h2>
            <p class="yt-info">${item.snippet.description}</p>
          </div>
        </div>
      `);
    });
  }
  
  function clearYTResult() {
    $('#yt-results').empty();
    $('#wiki-results').empty();
    $('#gb-results').empty();
  }
  
  function renderWikiResult(data) {
    $('#wiki-results').html(" ");
    $('#wiki-results').append(`
      <div class="channel wiki">Wikipedia</div>
    `);
    let pages = data.query.pages;
    console.log(pages);
  
      for (var id in pages) {
  
        if (pages[id] == undefined) {
          console.log("there is no id, its undefined");
          $('#wiki-results').append('<p>Try your search again.</p>');
        }
  
        if (pages[id].thumbnail == undefined) {  
          console.log("there is no thumbnail source, its undefined");
        }
  
        // showing the image
        if (pages[id].thumbnail !== undefined) {  
          $('#wiki-results').append(`<img class="wiki-pic" src="${pages[id].thumbnail.source}">`);
        }
  
        if (pages[id].extract == "") {
          $('#wiki-results').append(`<h2>Sorry, no results!</h2>`);
        } 
  
        // exptracting the title and contents
        if (pages[id].extract) {
          $('#wiki-results').append(`<h2 class="card">${pages[id].title}</h2>`);
          $('#wiki-results').append(`<p>${pages[id].extract}</p>`);
        }
  
        else {
          console.log("its undefined");
          $('#wiki-results').append(`<p>Try to be more specific!</p>`);
        }  
    }
  }
  
  const WIKI_SEARCH_URL = 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cpageimages&exsentences=3&list=&titles=';
  
  function getDataFromWikiApi(title, callback) {
    const url = WIKI_SEARCH_URL + title;
    console.log(url)
    const queryData = "";
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json()).then(callback)
  }
  
  //Get Google Books API data
  const GOOGLE_BOOK_SEARCH_URL = 'https://www.googleapis.com/books/v1/volumes?';
  
  function getDataFromGoogleBooksApi(searchTerm, callback) {
 
    const query = {
      key: 'AIzaSyAu1vr23zmW9OriNaqoRTZe1wuaqAhFEjY',
      q: searchTerm,
      
      maxResults: 3,
      orderBy: 'relevance',
    };
    $.getJSON(url, query, callback);
  }
  
  function renderGBResult(result) {
    $('#gb-results').html(" ");
    $('#gb-results').append(`
      <div class="channel goog">Google-Books</div>
    `);
    if(results){
      result.items.forEach((item) => {
        $('#gb-results').append(`
        <div class="gb-row">
          <div class="gb-1">
            <a href="${item.volumeInfo.canonicalVolumeLink}" target="_blank"><img class="gb-thumbs" src="${item.volumeInfo.imageLinks.thumbnail}"></a>
          </div>
          <div class="gb-2">
            <h2 class="gb-title">Title: ${item.volumeInfo.title}</h2>
            <h4>Author: ${item.volumeInfo.authors}</h4>
            <p class="gb-info">${item.volumeInfo.subtitle}</p>
          </div>
        </div>
      `);
      });
    } else {
      $('#gb-results').append(`<h2>Sorry, no results!</h2>`);
    }
  }
  
  function watchSubmit() {
    $('.js-search').submit((event) => {
      event.preventDefault();
      $('#results').removeClass('hidden');
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromYoutubeApi(makeYoutubeQuery(query, null), renderYTResult);
      getDataFromWikiApi(query, renderWikiResult);
      getDataFromGoogleBooksApi(query, renderGBResult);
  
      $('.yt-next').click(function () {
        $('.yt-previous').removeAttr('disabled');
        getDataFromYoutubeApi(makeYoutubeQuery(query, 'next'), renderYTResult);
      });
      $('.yt-previous').click(function () {
        getDataFromYoutubeApi(makeYoutubeQuery(query, 'prev'), renderYTResult);
      if (PREV_TOKEN == undefined) {
        $('.yt-previous').attr('disabled', true);
      }
      });
    });
  }
  
  $(function () {
    watchSubmit();
    startSearch();
  });
