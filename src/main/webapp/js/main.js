var documentFilter, currentTag, docAppContext, docAppSpace;
var labelBrowserNotSupported, labelTooManyFiles, labelFileTooLarge, labelOnlyAllowed,
  labelDropzoneMsg1, labelDropZoneMsg2, labelHome;
var by, order;

$(function(){

  var dropbox = $('#dropbox'),
    message = $('.message', dropbox);

  dropbox.filedrop({
    // The name of the $_FILES entry:
    paramname:'pic',

    maxfiles: 20,
    maxfilesize: 15,
    url: '/documents/uploadServlet',

    uploadFinished:function(i,file,response){
      $.data(file).addClass('done');
      $('#hideDropzone').css("display", "block");
      // response is the JSON object that post_file.php returns
    },

    error: function(err, file) {
      switch(err) {
        case 'BrowserNotSupported':
          showMessage(labelBrowserNotSupported);
          break;
        case 'TooManyFiles':
          alert(labelTooManyFiles);
          break;
        case 'FileTooLarge':
          alert(file.name+' '+labelFileTooLarge);
          break;
        default:
          break;
      }
    },

    // Called before each upload is started

    beforeEach: function(file){
      if(!file.type.match(/^image\//) && file.type !== "application/pdf"
        &&  file.type !== "application/vnd.ms-excel" &&  file.type !== "application/vnd.ms-powerpoint" &&  file.type !== "application/vnd.ms-word"
        &&  file.type !== "application/msexcel" &&  file.type !== "application/mspowerpoint" &&  file.type !== "application/msword"
        &&  file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        &&  file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        &&  file.type !== "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        &&  file.type !== "application/vnd.oasis.opendocument.spreadsheet"
        &&  file.type !== "application/vnd.oasis.opendocument.presentation"
        &&  file.type !== "application/vnd.oasis.opendocument.text"
        &&  file.name.indexOf(".xls")<1
        ){
        alert(labelOnlyAllowed);
        console.log(file.type);

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
      console.log("type="+file.type);
      if (file.type == "application/pdf"){
        image.attr('src','/documents/img/icon-pdf.png');
      } else if (file.type == "application/vnd.ms-excel" || file.type == "application/msexcel" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.name.indexOf(".xls")>0){
        image.attr('src','/documents/img/icon-xls.png');
      } else if (file.type == "application/vnd.ms-powerpoint" || file.type == "application/mspowerpoint" || file.type == "application/vnd.openxmlformats-officedocument.presentationml.presentation"){
        image.attr('src','/documents/img/icon-ppt.png');
      } else if (file.type == "application/vnd.ms-word" || file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        image.attr('src','/documents/img/icon-doc.png');
      } else if (file.type == "application/vnd.oasis.opendocument.text"){
        image.attr('src','/documents/img/icon-odt.png');
      } else if (file.type == "application/vnd.oasis.opendocument.spreadsheet"){
        image.attr('src','/documents/img/icon-ods.png');
      } else if (file.type == "application/vnd.oasis.opendocument.presentation"){
        image.attr('src','/documents/img/icon-odp.png');
      } else {
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
  /** somewhat, jz ajax methods are not loaded **/
  $.fn.extend({
    jz: function() {
      return this.closest(".jz");
    },
    jzURL: function(mid) {
      return this.jz().children().
        filter(function() { return $(this).data("method-id") == mid; }).
        map(function() { return $(this).data("url"); })[0];
    }
  });
  /** end bug fix **/

  var $documentsApplication = $("#container-documents");

  var jzDocumentsGetFiles = $documentsApplication.jzURL("DocumentsApplication.getFiles");
  var jzDocumentsGetProperties = $documentsApplication.jzURL("DocumentsApplication.getProperties");
  var jzDocumentsRestore = $documentsApplication.jzURL("DocumentsApplication.restore");
  var jzDocumentsDeleteFile = $documentsApplication.jzURL("DocumentsApplication.deleteFile");
  var jzDocumentsRenameFile = $documentsApplication.jzURL("DocumentsApplication.renameFile");
  var jzDocumentsNewFolder = $documentsApplication.jzURL("DocumentsApplication.newFolder");
  var jzDocumentsEditTags = $documentsApplication.jzURL("DocumentsApplication.editTags");
  documentFilter = $documentsApplication.attr("data-document-filter");
  currentTag = $documentsApplication.attr("data-current-tag");
  docAppContext = $documentsApplication.attr("data-app-context");
  docAppSpace = $documentsApplication.attr("data-app-space");

  by = $("#order-by-link").attr('data-by');
  order = $("#order-by-link").attr('data-order');

  labelBrowserNotSupported = $documentsApplication.attr("data-label-browser-not-supported");
  labelTooManyFiles = $documentsApplication.attr("data-label-too-many-files");
  labelFileTooLarge = $documentsApplication.attr("data-label-file-too-large");
  labelOnlyAllowed = $documentsApplication.attr("data-label-only-allowed");
  labelDropzoneMsg1 = $documentsApplication.attr("data-label-dropzone-msg1");
  labelDropZoneMsg2 = $documentsApplication.attr("data-label-dropzone-msg2");
  labelHome = $documentsApplication.attr("data-label-home");


  $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
    filesActions();
  });


  $('#hideDropzone').on("click", function() {
    console.log("hiding dropzone");
    $("#dropzone").css("display", "none");
    $("#dropbox").html('<span class="message">'+labelDropzoneMsg1+' <br /><i>('+labelDropZoneMsg2+')</i></span>');

    $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
      filesActions();
    });

  });

  function updateBreadcrumb() {
    var $breadcrumb = $("#documents-breadcrumb");
    var html = '<li class="breadcrumb-link" data-name="Documents"><a href="#">'+labelHome+'</a> <span class="divider">/</span></li>';
    var filter = documentFilter;
    var bc = "";
    do {
      ind = filter.indexOf("/");
      if (ind>-1) {
        var subs = filter.substr(0, ind);
        filter = filter.substr(ind+1, filter.length-ind);
        if (bc!=="") bc+="/"
        bc = bc + subs;
        if (bc=="Folksonomy")
          html += '<li class="breadcrumb-link" data-name="Documents"><a href="#">'+subs+'</a> <span class="divider">/</span></li>'
        else
          html += '<li class="breadcrumb-link" data-name="'+bc+'"><a href="#'+bc+'">'+subs+'</a> <span class="divider">/</span></li>'
      }
    } while (ind>-1);
    html += '<li class="active">'+filter+'</li>'
    $breadcrumb.html(html);

    if (documentFilter.indexOf("Folksonomy/")>-1) {
      $(".new-folder-link").css("display", "none");
    } else {
      $(".new-folder-link").css("display", "initial");
    }
  }


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



  /************
   ***** FILES ACTIONS
   ************/
  var filesLoaded = false;
  function filesActions() {

    if (!filesLoaded) {
      filesLoaded = true

      updateBreadcrumb();

      $('.preview-link').on("click", function() {
        $('#preview-image').attr("src", $(this).attr("data") );
        $('#PreviewModal').modal('show');
      });

      $('.properties-link').on("click", function() {
        var uuid = $(this).attr("data-uuid");
        var path = $(this).attr("data-path");
        $('#document-properties').load(jzDocumentsGetProperties, {"uuid": uuid, "path": path}, function () {
          propertiesActions();
          $('#propertiesTab a:first').tab('show');
          $('#PropertiesModal').modal('show');
        });
      });

      $('.file-version').on("click", function() {
        var uuid = $(this).attr("data-uuid");
        $('#document-properties').load(jzDocumentsGetProperties, {"uuid": uuid}, function () {
          propertiesActions();
          $('#propertiesTab a:last').tab('show');
          $('#PropertiesModal').modal('show');
        });
      });

      $('.thumbnail').on("click", function() {
        $('#preview-image').attr("src", $(this).attr("data") );
        $('#PreviewModal').modal('show');
      });

      $('.share-link').on("click", function() {
        $('#file-share-link').attr("value", $(this).attr("data") );
        $('#ShareModal').modal('show');
      });

      $('.upload-link').on("click", function() {
        $('#file-upload-input').attr("value", $(this).attr("data-uuid") );
        $('#file-upload-context').attr("value", docAppContext );
        $('#file-upload-space').attr("value", docAppSpace );
        $('#file-upload-filter').attr("value", documentFilter );
        $('#UploadModal').modal('show');
      });

      $('.upload-button').on("click", function() {
        $('#file-upload-context').attr("value", docAppContext );
        $('#file-upload-space').attr("value", docAppSpace );
        $('#file-upload-filter').attr("value", documentFilter );
        $('#UploadModal').modal('show');
      });

      $('.delete-link').on("click", function() {
        var name = $(this).closest(".dropdown-menu").attr("data-name");
        var uuid = $(this).closest(".dropdown-menu").attr("data-uuid");
        var path = $(this).closest(".dropdown-menu").attr("data-path");
        $('#delete-label').html('Are you sure you want to delete the file "' + name + '"?');
        $('#delete-button').attr('data-uuid', uuid);
        $('#delete-button').attr('data-path', path);
        $('#DeleteModal').modal('show');
      });

      $('#delete-button').on("click", function() {
        var uuid = $(this).attr('data-uuid');
        var path = $(this).attr('data-path');

        $.ajax({
          url: jzDocumentsDeleteFile,
          data: {"uuid": uuid, "path": path},

          success:function(response){
            $('#DeleteModal').modal('hide');
            $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
              filesActions();
            });
          },

          error:function (xhr, status, error){
            $("#delete-label").html(xhr.responseText);
            $("#delete-label").addClass("error");
          }

        });

      });


      $('.rename-link').on("click", function() {
        var name = $(this).closest(".dropdown-menu").attr("data-name");
        var uuid = $(this).closest(".dropdown-menu").attr("data-uuid");
        var path = $(this).closest(".dropdown-menu").attr("data-path");
        if (name.indexOf(".")>-1) name = name.substr(0, name.indexOf(".") );
        $('#file-name').attr("value", name);
        $('#rename-button').attr('data-uuid', uuid);
        $('#rename-button').attr('data-path', path);
        $('#rename-error').html("");
        $('#RenameModal').modal('show');
      });

      $('.new-folder-link').on("click", function() {
        $('#rename-error').html("");
        $('#NewFolderModal').modal('show');
      });

      $('ul.order-by-menu > li').on("click", function() {
        var by = $(this).attr('data-by');
        var order = "asc";
        oldBy = $("#order-by-link").attr('data-by');
        oldOrder = $("#order-by-link").attr('data-order');
        console.log("by="+by+" ; oldBy="+oldBy+" ; oldOrder="+oldOrder);
        if (by == oldBy) {
          if (oldOrder=="asc") order = "desc";
        } else {
          if (by=="date")
            order = "desc";
        }
        $("#order-by-link").attr('data-by', by);
        $("#order-by-link").attr('data-order', order);
        var labelBy="Name";
        if (by == "date")
          labelBy = 'Date';
        else if (by == "size")
          labelBy = 'Size';

        $("#order-by-link").text(labelBy);
        $("#order-by-name").html('<a href="#"><i class="minicon-empty"></i>Name</a>');
        $("#order-by-date").html('<a href="#"><i class="minicon-empty"></i>Date</a>');
        $("#order-by-size").html('<a href="#"><i class="minicon-empty"></i>Size</a>');

        $("#order-by-"+by).html('<a href="#"><i class="minicon-'+order+'"></i>'+labelBy+'</a>');

        $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
          filesActions();
        });

      })

      $('#rename-button').on("click", function() {
        var uuid = $(this).attr('data-uuid');
        var path = $(this).attr('data-path');
        var name = $('#file-name').attr("value");
        $.ajax({
          url: jzDocumentsRenameFile,
          data: {"uuid": uuid, "name": name, "path": path},

          success:function(response){
            $('#RenameModal').modal('hide');
            $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
              filesActions();
            });
          },

          error:function (xhr, status, error){
            $("#rename-error").html(xhr.responseText);
            $("#rename-error").closest(".control-group").addClass("error");
          }

        });

      });

      $('#folder-button').on("click", function() {
        var name = $('#folder-name').attr("value");
        $.ajax({
          url: jzDocumentsNewFolder,
          data: {"documentFilter": documentFilter, "name": name},

          success:function(response){
            $('#NewFolderModal').modal('hide');
            //documentFilter = documentFilter+"/"+name;
            $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
              filesActions();
            });
          },

          error:function (xhr, status, error){
            $("#folder-error").html(xhr.responseText);
            $("#folder-error").closest(".control-group").addClass("error");
          }

        });

      });

      $('.tags-link').on("click", function() {
        var name = $(this).closest(".dropdown-menu").attr("data-name");
        var uuid = $(this).closest(".dropdown-menu").attr("data-uuid");
        var tags = $(this).closest(".dropdown-menu").attr("data-tags");
        $('#tags-label').html('You are editing tags for "' + name + '"');
        $('#file-tags').val(tags);
        $('#tags-save-button').attr('data-uuid', uuid);
        $('#TagsModal').modal('show');
      });

      $('#tags-save-button').on("click", function() {
        var uuid = $(this).attr('data-uuid');
        var tags = $('#file-tags').val();
        $.ajax({
          url: jzDocumentsEditTags,
          data: {"uuid": uuid, "tags": tags},

          success:function(response){
            $('#TagsModal').modal('hide');
            $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
              filesActions();
            });
          },

          error:function (xhr, status, error){
            $("#tags-error").html(xhr.responseText);
            $("#tags-error").closest(".control-group").addClass("error");
          }

        });

      });

      $('.label-tag').on("click", function() {
        currentTag = $(this).html();
        documentFilter = "Folksonomy/"+currentTag;
        $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
          filesActions();
          $(".btn-inverse").removeClass("active");
        });
      });

      $('.folder-link').on("click", function() {
        folderName = $(this).attr("data-name");
        documentFilter = documentFilter+"/"+folderName;
        $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
          filesActions();
        });
      });

      $('.breadcrumb-link').on("click", function() {
        folderName = $(this).attr("data-name");
        documentFilter = folderName;
        $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
          filesActions();
        });
      });


      $('#ShareModal input[type=text]').click(function() {
        $(this).select();
      });

      $('#RenameModal input[type=text]').click(function() {
        $(this).select();
        $(this).closest(".control-group").removeClass("error");
        $('#rename-error').html("");
      });


      $('#hideDropzone').css("display", "none");

      var bar = $('.bar');
      var percent = $('.percent');
      var status = $('#status');

      $('form').ajaxForm({
        beforeSend: function() {
          status.empty();
          var percentVal = '0%';
          bar.width(percentVal)
          percent.html(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {
          var percentVal = percentComplete + '%';
          bar.width(percentVal)
          percent.html(percentVal);
        },
        complete: function(xhr) {
          status.html(xhr.responseText);
          $('#documents-files').load(jzDocumentsGetFiles, {"filter": documentFilter, "order": order, "by": by}, function () {
            filesActions();
          });
        }
      });
    }


  }


  var propertiesLoaded = false;
  function propertiesActions() {

    if (!propertiesLoaded) {
      propertiesLoaded = true;
      $('#propertiesTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
      })

      $('.restore-link').on("click", function() {
        var name = $(this).attr("data");
        var uuid = $(this).attr("data-uuid");
        $('#document-properties').load(jzDocumentsRestore, {"uuid": uuid, "name": name}, function () {
        });
      });
    }

  }




});


