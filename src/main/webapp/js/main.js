var documentFilter, currentTag, docAppContext, docAppSpace, refresh;
var labelBrowserNotSupported, labelTooManyFiles, labelFileTooLarge, labelOnlyAllowed,
  labelDropzoneMsg1, labelDropZoneMsg2, labelHome, labelSortBy, labelName, labelDate, labelSize;
var by, order, ts;
var uploadFiles=0;
var urlFilter;

var console = console || {
  log:function(){},
  warn:function(){},
  error:function(){}
};

(function($){

$(document).ready(function(){


  function initDropbox(jzDocumentsUpload) {

    var dropbox = $('#dropbox'), message = $('.message', dropbox);

    dropbox.filedrop({
      // The name of the $_FILES entry:
      paramname:'pic',

      maxfiles: 20,
      maxfilesize: 15,
      url: jzDocumentsUpload,

      uploadFinished:function(i,file,response){
        uploadFiles--;
        $.data(file).addClass('done');
        //$('#hideDropzone').css("display", "block");
        // response is the JSON object that post_file.php returns
        if (uploadFiles===0) {
          setTimeout(checkChanges, 2000);
        }
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
        $("#dropzone").css("display", "none");
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
        uploadFiles++;
        //console.log("uploading : "+uploadFiles);
        createImage(file);
      },

      progressUpdated: function(i, file, progress) {
        $.data(file).find('.bar').width(progress+"%");
        var percent = $.data(file).find('.percent');
        percent.html(progress+"%");
        percent.attr("data-percent", progress+"%");
      }

    });

    var template2 = '<tr>'+
      '<td width="32px" style="padding: 8px 8px 8px 0;">'+
      '<div class="thumbnail">'+
      '<img width="32px" height="32px"/>'+
      '</div>'+
      '</td>'+
      '<td style="padding: 8px 0;">'+
      '<span class="filename" style="float:left;"></span>'+
      '<div class="progress" style="float:right;margin:0;">'+
      '<div class="bar"></div>'+
      '<div class="percent percent-bulk" data-percent="0%">0%</div>'+
      '</div>'+
      '</td>'+
      '</tr>';

    function createImage(file){

      var preview = $(template2),
        image = $('img', preview);

      var reader = new FileReader();

      var table = $('#documents-files > table').first();

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
      preview.appendTo(table);

      // Associating a preview container
      // with the file, using jQuery's $.data():

      $.data(file,preview);

      $.data(file).find('.filename').text(file.name);
      $("#dropzone").css("display", "none");
      var progress = "0%";
      var bar = $.data(file).find('.bar');
      var percent = $.data(file).find('.percent')
      bar.width(progress)
      percent.html(progress);

//    preview.find('.filename').text(file.name);

    }

    function showMessage(msg){
      message.html(msg);
    }


  }


  var $documentsApplication = $("#container-documents");
  var files;

  var jzDocumentsGetFiles = $documentsApplication.jzURL("DocumentsApplication.getFiles");
  var jzDocumentsCheckTimestamp = $documentsApplication.jzURL("DocumentsApplication.checkTimestamp");
  var jzDocumentsGetProperties = $documentsApplication.jzURL("DocumentsApplication.getProperties");
  var jzDocumentsRestore = $documentsApplication.jzURL("DocumentsApplication.restore");
  var jzDocumentsDeleteFile = $documentsApplication.jzURL("DocumentsApplication.deleteFile");
  var jzDocumentsRenameFile = $documentsApplication.jzURL("DocumentsApplication.renameFile");
  var jzDocumentsNewFolder = $documentsApplication.jzURL("DocumentsApplication.newFolder");
  var jzDocumentsEditTags = $documentsApplication.jzURL("DocumentsApplication.editTags");
  var jzDocumentsUpload = $documentsApplication.jzURL("DocumentsApplication.upload");
  documentFilter = $documentsApplication.attr("data-document-filter");
  currentTag = $documentsApplication.attr("data-current-tag");
  docAppContext = $documentsApplication.attr("data-app-context");
  docAppSpace = $documentsApplication.attr("data-app-space");
  refresh = $documentsApplication.attr("data-refresh");
  urlFilter = "";//$.url().attr("fragment");
  console.log("urlFilter:"+urlFilter);

  by = $("#order-by-link").attr('data-by');
  order = $("#order-by-link").attr('data-order');

  labelBrowserNotSupported = $documentsApplication.attr("data-label-browser-not-supported");
  labelTooManyFiles = $documentsApplication.attr("data-label-too-many-files");
  labelFileTooLarge = $documentsApplication.attr("data-label-file-too-large");
  labelOnlyAllowed = $documentsApplication.attr("data-label-only-allowed");
  labelDropzoneMsg1 = $documentsApplication.attr("data-label-dropzone-msg1");
  labelDropZoneMsg2 = $documentsApplication.attr("data-label-dropzone-msg2");
  labelHome = $documentsApplication.attr("data-label-home");
  labelSortBy = $documentsApplication.attr("data-label-sort-by");
  labelName = $documentsApplication.attr("data-label-name");
  labelDate = $documentsApplication.attr("data-label-date");
  labelSize = $documentsApplication.attr("data-label-size");
  labelMinutes = $documentsApplication.attr("data-label-date-minutes");
  labelToday = $documentsApplication.attr("data-label-date-today");
  labelYesterday = $documentsApplication.attr("data-label-date-yesterday");

  initDropbox(jzDocumentsUpload);

  function loadFiles() {
    if (jzGetParam("documentFilter")!==undefined) {
      documentFilter = jzGetParam("documentFilter");
    }
    jzStoreParam("documentFilter", documentFilter, 300);

    if (urlFilter!="") {
      documentFilter = urlFilter;
      jzStoreParam("documentFilter", documentFilter, 300);
      urlFilter = "";
    } else {
      var url = window.location.href;
      if (url.indexOf("#")>-1) {
        url = url.substring(0, url.indexOf("#"))
      }
      url += "#"+documentFilter;
      if (!IsIE8Browser()) {
        window.history.pushState(documentFilter, "New Path", url);
      }

    }

    var key = getFilesStorageKey();
    var stringifiedFiles = jzGetParam(key);
    if (stringifiedFiles!==undefined && stringifiedFiles!=="" && stringifiedFiles!=="null") {
      files = TAFFY(stringifiedFiles);
      orderFilesAndShow();
    } else {
      // GET MUSTACHE TEMPLATES
      $.getJSON(jzDocumentsGetFiles, {"filter": documentFilter}, function(data){
        console.log("LOAD FILES : TS="+data.timestamp+" ; HASDATA="+data.hasData);
        files = TAFFY(data.files);
        stringifiedFiles = files().stringify();
        var key = getFilesStorageKey();
        jzStoreParam(key, stringifiedFiles, 3000);

        ts = data.timestamp;
        var keyts = getFilesStorageTSKey();
        jzStoreParam(keyts, ts, 3000);

        orderFilesAndShow();
      })
        .error(function (response){
          console.log(response);
        });

    }

  }
  loadFiles();

  function checkChanges() {
    if (uploadFiles>0) return;

    if (jzGetParam("documentFilter")!==undefined) {
      documentFilter = jzGetParam("documentFilter");
    }
    jzStoreParam("documentFilter", documentFilter, 3000);

    var keyts = getFilesStorageTSKey();
    ts = jzGetParam(keyts);
    if (ts!==undefined && ts!=="" && ts!=="null" && ts!==null) {
      console.log("CHECK TIMESTAMP : TS="+ts);
      $.getJSON(jzDocumentsCheckTimestamp, {"filter": documentFilter, "timestamp": ts}, function(data){
        var newts = data.timestamp;
        var keyts = getFilesStorageTSKey();
        ts = jzGetParam(keyts);
        if (newts!==ts) {
          console.log("NEEDS UPDATE : OLD="+ts+" ; NEW="+newts+" ; HASDATA="+data.hasData);

          if (data.hasData) {
            files = TAFFY(data.files);
            var stringifiedFiles = files().stringify();
            var key = getFilesStorageKey();
            jzStoreParam(key, stringifiedFiles, 3000);

            ts = data.timestamp;
            var keyts = getFilesStorageTSKey();
            jzStoreParam(keyts, ""+ts, 3000);

            orderFilesAndShow();

            $("#dropzone").css("display", "none");
            $("#dropbox").html('<span class="message">'+labelDropzoneMsg1+' <br /><i>('+labelDropZoneMsg2+')</i></span>');
          }

        } else {
          console.log("NO UPDATE NEEDED")
        }
      })
        .error(function (response){
          console.log(response);
        });

    }

  }
  if (refresh != "-1") {
    setInterval(checkChanges, Math.round(1000*refresh));
  }

  function getFilesStorageKey() {
    return calcMD5("FLS:"+documentFilter+":"+docAppContext+":"+docAppSpace);
  }

  function getFilesStorageTSKey() {
    return calcMD5("TST:"+documentFilter+":"+docAppContext+":"+docAppSpace);
  }

  function initFilesStorageKey(filter) {
    key = getFilesStorageKey();
    jzStoreParam(key, "", -1000);
    keyts = getFilesStorageTSKey();
    jzStoreParam(keyts, "", -1000);

  }

  function orderFilesAndShow() {
    order = $("#order-by-link").attr('data-order');
    by = $("#order-by-link").attr('data-by');

    if (jzGetParam("order")!==undefined) {
      order = jzGetParam("order");
    }
    if (jzGetParam("by")!==undefined) {
      by = jzGetParam("by");
    }
    updateOrderBy(order, by);


    var filesTpl = $('#filesTpl').html();
    var logicalOrder = 'logical';
    if (order==='desc')
      logicalOrder = 'logicaldesc';
    var html = Mustache.to_html(filesTpl, {"files": files().order(by+' '+logicalOrder).get()});
    $('#documents-files').html(html);
    if (files().count()==0) {
      $("#dropzone").css("display", "block");
    } else {
      $("#dropzone").css("display", "none");
    }
    $('.timestamp-label').each(function(index) {
      var ts = $(this).attr("data-timestamp");
      var now = new Date();
      var sec = Math.round((now-ts)/1000);
      var label="";
      if (sec<60*5) label = labelMinutes;
      else if (sec<60*60*24) label = labelToday;
      else if (sec<60*60*24*2) label = labelYesterday;

      if (label!=="") $(this).text(label);
    });
    filesActions();
  }
  //setInterval(orderFilesAndShow, 5000);

  $('#hideDropzone').on("click", function() {
    console.log("hiding dropzone");
    $("#dropzone").css("display", "none");
    $("#dropbox").html('<span class="message">'+labelDropzoneMsg1+' <br /><i>('+labelDropZoneMsg2+')</i></span>');
    initFilesStorageKey(documentFilter);

    loadFiles();
  });

  function updateBreadcrumb() {
    jzStoreParam("documentFilter", documentFilter, 3000);
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


  $('.new-folder-link').on("click", function() {
    $('#rename-error').html("");
    $('#folder-name').val("");
    $('#NewFolderModal').modal({"backdrop": false});
  });

  $('#folder-button').on("click", function() {
    var name = $('#folder-name').attr("value");
    $.ajax({
      url: jzDocumentsNewFolder,
      data: {"documentFilter": documentFilter, "name": name},

      success:function(response){
        $('#NewFolderModal').modal('hide');
        initFilesStorageKey(documentFilter);
        documentFilter = documentFilter+"/"+name;
        jzStoreParam("documentFilter", documentFilter, 3000);
        initFilesStorageKey(documentFilter);
        loadFiles();
      },

      error:function (xhr, status, error){
        $("#folder-error").html(xhr.responseText);
        $("#folder-error").closest(".control-group").addClass("error");
      }

    });

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

    jzStoreParam("order", order, 3000);
    jzStoreParam("by", by, 3000);

    orderFilesAndShow();
    //loadFiles();

  })

  function updateOrderBy(order, by) {
    $("#order-by-link").attr('data-by', by);
    $("#order-by-link").attr('data-order', order);

    var labelBy=labelName;
    if (by == "date")
      labelBy = labelDate;
    else if (by == "size")
      labelBy = labelSize;

    $("#order-by-link").text(labelBy);
    $("#order-by-name").html('<a href="#"><i class="minicon-empty"></i>'+labelName+'</a>');
    $("#order-by-date").html('<a href="#"><i class="minicon-empty"></i>'+labelDate+'</a>');
    $("#order-by-size").html('<a href="#"><i class="minicon-empty"></i>'+labelSize+'</a>');

    $("#order-by-"+by).html('<a href="#"><i class="minicon-'+order+'"></i>'+labelBy+'</a>');

  }

  $('.upload-button').on("click", function() {
    $('#file-upload-context').attr("value", docAppContext );
    $('#file-upload-space').attr("value", docAppSpace );
    $('#file-upload-filter').attr("value", documentFilter );
    $('.bar').css("width", "0%");
    $('.percent').text("0%");
    $("#status").empty();
    $("input:file").val("");
    $("#file-form").attr("action", jzDocumentsUpload);
    $('#UploadModal').modal({"backdrop": false});
  });

  $('#delete-button').on("click", function() {
    var uuid = $(this).attr('data-uuid');
    var path = $(this).attr('data-path');

    $.ajax({
      url: jzDocumentsDeleteFile,
      data: {"uuid": uuid, "path": path},

      success:function(response){
        $('#DeleteModal').modal('hide');
        initFilesStorageKey(documentFilter);
        if (documentFilter.indexOf("/")>-1) {
          parent = documentFilter.substring(0, documentFilter.lastIndexOf("/"))
          console.log("parent="+parent);
          initFilesStorageKey(parent);
        }
        loadFiles();
      },

      error:function (xhr, status, error){
        $("#delete-label").html(xhr.responseText);
        $("#delete-label").addClass("error");
      }

    });

  });

  $('#rename-button').on("click", function() {
    var uuid = $(this).attr('data-uuid');
    var path = $(this).attr('data-path');
    var name = $('#file-name').attr("value");
    $.ajax({
      url: jzDocumentsRenameFile,
      data: {"uuid": uuid, "name": name, "path": path},

      success:function(response){
        $('#RenameModal').modal('hide');
        initFilesStorageKey(documentFilter);
        loadFiles();
      },

      error:function (xhr, status, error){
        $("#rename-error").html(xhr.responseText);
        $("#rename-error").closest(".control-group").addClass("error");
      }

    });

  });

  $('#tags-save-button').on("click", function() {
    var uuid = $(this).attr('data-uuid');
    var tags = $('#file-tags').val();
    $.ajax({
      url: jzDocumentsEditTags,
      data: {"uuid": uuid, "tags": tags},

      success:function(response){
        $('#TagsModal').modal('hide');
        initFilesStorageKey(documentFilter);
        initFilesStorageKey("Documents");
        loadFiles();
      },

      error:function (xhr, status, error){
        $("#tags-error").html(xhr.responseText);
        $("#tags-error").closest(".control-group").addClass("error");
      }

    });

  });



  /************
   ***** FILES ACTIONS
   ************/
  function filesActions() {

    updateBreadcrumb();

    $('.preview-link').on("click", function() {
      $('#preview-image').attr("src", $(this).attr("data") );
      $('#PreviewModal').modal({"backdrop": false});
    });

    $('.properties-link').on("click", function() {
      var uuid = $(this).attr("data-uuid");
      var path = $(this).attr("data-path");
      $('#document-properties').load(jzDocumentsGetProperties, {"uuid": uuid, "path": path}, function () {
        propertiesActions();
        $('#propertiesTab a:first').tab('show');
        $('#PropertiesModal').modal({"backdrop": false});
      });
    });

    $('.file-version').on("click", function() {
      var uuid = $(this).attr("data-uuid");
      $('#document-properties').load(jzDocumentsGetProperties, {"uuid": uuid}, function () {
        propertiesActions();
        $('#propertiesTab a:last').tab('show');
        $('#PropertiesModal').modal({"backdrop": false});
      });
    });

    $('.thumbnail').on("click", function() {
      $('#preview-image').attr("src", $(this).attr("data") );
      $('#PreviewModal').modal({"backdrop": false});
    });

    $('.share-link').on("click", function() {
      $('#file-share-link').attr("value", $(this).attr("data") );
      $('#ShareModal').modal({"backdrop": false});
    });

    $('.upload-link').on("click", function() {
      $('#file-upload-input').attr("value", $(this).attr("data-uuid") );
      $('#file-upload-context').attr("value", docAppContext );
      $('#file-upload-space').attr("value", docAppSpace );
      $('#file-upload-filter').attr("value", documentFilter );
      $('#UploadModal').modal({"backdrop": false});
    });

    $('.delete-link').on("click", function() {
      var name = $(this).closest(".dropdown-menu").attr("data-name");
      var uuid = $(this).closest(".dropdown-menu").attr("data-uuid");
      var path = $(this).closest(".dropdown-menu").attr("data-path");
      $('#delete-label').html('Are you sure you want to delete the file "' + name + '"?');
      $('#delete-button').attr('data-uuid', uuid);
      $('#delete-button').attr('data-path', path);
      $('#DeleteModal').modal({"backdrop": false});
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
      $('#RenameModal').modal({"backdrop": false});
    });


    $('.tags-link').on("click", function() {
      var name = $(this).closest(".dropdown-menu").attr("data-name");
      var uuid = $(this).closest(".dropdown-menu").attr("data-uuid");
      var tags = $(this).closest(".dropdown-menu").attr("data-tags");
      $('#tags-label').html('You are editing tags for "' + name + '"');
      $('#file-tags').val(tags);
      $('#tags-save-button').attr('data-uuid', uuid);
      $('#TagsModal').modal({"backdrop": false});
    });

    $('.label-tag').on("click", function() {
      currentTag = $(this).html();
      documentFilter = "Folksonomy/"+currentTag;
      jzStoreParam("documentFilter", documentFilter, 3000);
      loadFiles();
    });

    $('.folder-link').on("click", function(event) {
      event.preventDefault();
      folderName = $(this).attr("data-name");
      documentFilter = documentFilter+"/"+folderName;
      jzStoreParam("documentFilter", documentFilter, 3000);
      loadFiles();
    });

    $('.breadcrumb-link').on("click", function() {
      folderName = $(this).attr("data-name");
      documentFilter = folderName;
      jzStoreParam("documentFilter", documentFilter, 3000);
      loadFiles();
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
        loadFiles();
      }
    });

  }


  function propertiesActions() {

    $('#propertiesTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })

    $('.restore-link').on("click", function() {
      var name = $(this).attr("data");
      var uuid = $(this).attr("data-uuid");
      $('#document-properties').load(jzDocumentsRestore, {"uuid": uuid, "name": name}, function () {
        initFilesStorageKey(documentFilter);
      });
    });

  }

})

})(jqdoc);



