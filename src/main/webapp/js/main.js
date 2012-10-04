$(function(){
	
	var dropbox = $('#dropbox'),
		message = $('.message', dropbox);
	
	dropbox.filedrop({
		// The name of the $_FILES entry:
		paramname:'pic',
		
		maxfiles: 20,
		maxfilesize: 2,
		url: '/documents/uploadServlet',
		
		uploadFinished:function(i,file,response){
			$.data(file).addClass('done');
      $('#hideDropzone').css("display", "block");
			// response is the JSON object that post_file.php returns
		},
		
		error: function(err, file) {
			switch(err) {
				case 'BrowserNotSupported':
					showMessage('Your browser does not support HTML5 file uploads!');
					break;
				case 'TooManyFiles':
					alert('Too many files! Please select 20 at most!');
					break;
				case 'FileTooLarge':
					alert(file.name+' is too large! Please upload files up to 2mb.');
					break;
				default:
					break;
			}
		},
		
		// Called before each upload is started

		beforeEach: function(file){
			if(!file.type.match(/^image\//) && file.type !== "application/pdf"){
				alert('Only images and pdfs are allowed!');

				// Returning false will cause the
				// file to be rejected
				return false;
			}
		},
		
		uploadStarted:function(i, file, len){
			createImage(file);
		},
		
		progressUpdated: function(i, file, progress) {
			$.data(file).find('.progress').width(progress);
		}
 
	});
	
	var template = '<div class="preview">'+
						'<span class="imageHolder">'+
							'<img />'+
							'<span class="uploaded"></span>'+
						'</span>'+
						'<div class="progressHolder">'+
							'<div class="progress"></div>'+
						'</div>'+
					'</div>';
	
	
	function createImage(file){

		var preview = $(template),
			image = $('img', preview);
			
		var reader = new FileReader();
		
		image.width = 100;
		image.height = 100;
		
		reader.onload = function(e){

			// e.target.result holds the DataURL which
			// can be used as a source of the image:
			if (file.type == "application/pdf"){
				image.attr('src','/documents/img/pdf-icon.jpg');
			}
			else {
				image.attr('src',e.target.result);
			}
		};
		
		// Reading the file as a DataURL. When finished,
		// this will trigger the onload function above:
		reader.readAsDataURL(file);
		
		message.hide();
		preview.appendTo(dropbox);
		
		// Associating a preview container
		// with the file, using jQuery's $.data():
		
		$.data(file,preview);
	}

	function showMessage(msg){
		message.html(msg);
	}

});


$(document).ready(function(){

  $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter}, function () {
  });


  $('#images-type-button').on("click", function() {
    documentFilter = "Pictures";
    $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter}, function () {
    });
  });

  $('#documents-type-button').on("click", function() {
    documentFilter = "Documents";
    $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter}, function () {
    });
  });

  $('#tag-type-button').on("click", function() {
    documentFilter = "Documents";
    $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter}, function () {
      $("#documents-type-button").addClass("active");
      $(".filter-tag").css("display", "none");
      $(".filter-files").css("display", "inline");
    });
  });

  $('#hideDropzone').on("click", function() {
    console.log("hiding dropzone");
    $("#dropzone").css("display", "none");
    $("#dropbox").html('<span class="message">Drop files here to upload. <br /><i>(they will only be visible to you)</i></span>');

    $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter}, function () {
    });

  });


});


// Show the dropzone when dragging files (not folders or page
// elements). The dropzone is hidden after a timer to prevent
// flickering to occur as `dragleave` is fired constantly.
var dragTimer;
$(document).on('dragover', function(e) {
    var dt = e.originalEvent.dataTransfer;
    if(dt.types != null && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'))) {
        $("#dropzone").show();
        window.clearTimeout(dragTimer);
    }
});
$(document).on('dragleave', function(e) {
    dragTimer = window.setTimeout(function() {
        $("#dropzone").hide();
        }, 250);
});

