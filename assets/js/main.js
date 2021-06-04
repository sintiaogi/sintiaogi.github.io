$(document).ready(function () {
  
    //AOS library
    AOS.init();

    var url = "https://cors-anywhere.herokuapp.com/http://newsapi.org/v2/top-headlines?country=id&category=technology&apiKey=a2c7dc63403f47e49535eea916ed17ca"
    var latResponse = ''
    var datResponse = ''
    var topRightResponse = ''
    var topLeftResponse = ''
    var topCenterResponse = ''


    //fetch data from online
  
    var getDataStatus = false
    //fetch url Api
    var getData = fetch(url).then(function(response){
      return response.json()
      //jika fetch url berhasil (user sedang online)
    }).then(function(data){
      console.log(data)
      getDataStatus = true
      createDatabase(data)  //membuat atau mengupdate database indexedDB
      renderData(data)      //menampilkan data ke HTML
      //jika fetch gagal (user sedang offline)
    }).catch(function(){
      console.log('Anda sedang offline')
      var data = createDatabase()
      console.log(data)
     //createDatabase()
      
     // 
    })

     //console.log(getDataStatus)

     function renderData(data){
      // console.log(data)
      if(data.status == 'ok'){
        for(let i=0;i<3;i++){
          latResponse +=  '<div class="content-side" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">'
                          +'<img src="'+data.articles[i].urlToImage+'"alt="">'
                          +'<a href="#"> <h4>'+data.articles[i].title+'</h4> </a>'
                          +'<p>'+data.articles[i].description+'</p>'
                          +'<button class="btn side-content-btn">Read More &nbsp; <i class="fa fa-arrow-right"></i></button>'
                          +'<hr></hr>'
                          +'</div>'
        }

        for(let i=0;i<5;i++){
          //console.log(data.articles[i])
          if(data.articles[i].author == null){
            var author = 'Admin'
          }else{
            var author = data.articles[i].author
          }
          
          datResponse +=  '<div id="post" class="post-content row" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"><div class="col-md-5">'
                      +'<img src="'+data.articles[i].urlToImage +'"alt="">'
                      +'</div>'
                      +'<div class="col-md-7">'
                      +'<a href="./post.html"> <h4>'+data.articles[i].title+'</h4> </a>'
                      +'<p>'+data.articles[i].description+'</p>'
                      +'<span class="author"><i class="fa fa-user text-gray"></i>&nbsp;&nbsp;'+author+'</span>'
                      +'<span class="date">'+data.articles[i].publishedAt+'</span>'
                      +'</div>'
                      +'</div>'
                      +'<hr></hr>' 
         }

         for(let j=0;j<2;j++){
       //   console.log(data.articles[j])
           topRightResponse += '<div class="content-side one-side" data-aos="zoom-in-right" data-aos-delay="300">'
                                +'<img src="'+data.articles[j].urlToImage+'"alt="">'
                                +'<a href="./post.html"> <h4>'+data.articles[j].title+'</h4> </a>'
                                +'<p>'+data.articles[j].description+'</p>'
                                +'<button class="btn side-content-btn">Read More &nbsp; <i class="fa fa-arrow-right"></i></button>'
                                +'<hr></hr>'
                                +'</div>' 
         }
         for(let j=0;j<2;j++){
          //   console.log(data.articles[j])
              topLeftResponse += '<div class="content-side" data-aos="zoom-in-right" data-aos-delay="300">'
                                   +'<img src="'+data.articles[j].urlToImage+'"alt="">'
                                   +'<a href="./post.html"> <h4>'+data.articles[j].title+'</h4> </a>'
                                   +'<p>'+data.articles[j].description+'</p>'
                                   +'<button class="btn side-content-btn">Read More &nbsp; <i class="fa fa-arrow-right"></i></button>'
                                   +'<hr></hr>'
                                   +'</div>' 
            }
            for(let k=0;k<1;k++){
              //   console.log(data.articles[j])
                  topCenterResponse += '<div class="content-center one-center" data-aos="zoom-in-up" data-aos-delay="300">'
                                      +'<img src="'+data.articles[k].urlToImage+'"alt="">'
                                      +'<a href="./post.html"> <h2>'+data.articles[k].title+'</h4> </a>'
                                      +'<p>'+data.articles[k].description+'</p>'
                                      +'<button class="btn center-content-btn">Read More &nbsp; <i class="fa fa-arrow-right"></i></button>'
                                      +'</div>' 
                }


        $('#latest-post').html(latResponse)
        $('#post-news').html(datResponse)
        $('#top-right').html(topRightResponse)
        $('#top-left').html(topLeftResponse)
        $('#top-center').html(topCenterResponse)
      }else{
        console.log('get data from newsapi not sucess')
      } 
     }
      
  //index DB
  //Buat database
    
    var DbName    = 'db-news1';
    var db;
    var StoreName = 'NewsData';

    // Fungsi untuk membuat database di indexedDB
    function createDatabase(data) {
      var request = indexedDB.open(DbName, 1);
      request.onupgradeneeded = function(e) {             
          var db = e.target.result                     
          var objectStore = db.createObjectStore(StoreName, { keyPath: 'id' })
      }
      //ketika koneksi ke db berhasil
      request.onsuccess = function(e) { 
        db = e.target.result;
        
        console.log('Database connection succesfully') 
        //memanggil fungsi GetData() 
        if(data){
          GetData(data) 
          console.log('ini jalan')   
        }else{
         // return showData()
         var dat = showData()
         console.log(dat)
        }
        
          
      }
      //ketika koneksi ke database error
      request.onerror=function(error){
        console.log('Database not open due to some errors!')
      }
    }

   function GetData(data){
    // console.log(data.status)
        if(data.status == 'ok'){
      
           var ItemData = {
            id : "1",
            data : data
          }
            addDB(ItemData) 
            console.log('tes')
        }
   }
    
    // membaca data dari indexedDB
    function showData(){
      console.log('result') 

      var transaction = db.transaction([StoreName],'readwrite')
      var objectStore = transaction.objectStore(StoreName)
      var request     = objectStore.getAll()
      //var result = request.result[0].data
      request.onsuccess=function(){
        var result = request.result[0].data
        console.log('Read data has been successfully')
        renderData(result)
        //
        console.log(request.result[0].data)
        //
       // window.location.reload();
      }
      request.onerror=function(error){
        console.log('some error occur during Read data! '+error)
      }
      
     

    }

        
    // fungsi untuk menambah data ke indexedDB
    function addDB(data){
      var transaction = db.transaction([StoreName],'readwrite')
      var objectStore = transaction.objectStore(StoreName)
      var request = objectStore.put(data);
      request.onsuccess=function(){
        console.log('Data has been successfully Added to '+StoreName); 
       // window.location.reload();
      }
      request.onerror=function(error){
        console.log('some error occur during insertion! '+error);
      }
    }  
    

  // Register service worker
  if ('serviceWorker' in navigator) {  //mengecek apakah browser sudah support atau belum
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
      //meregister service worker
      .then(registration => {
        console.log('Service Worker is registered', registration);
        //jika register berhasil
      })
      .catch(err => {
        console.error('Registration failed:', err);
        //jika register gagal
      });
    });
  }


 
  
});




