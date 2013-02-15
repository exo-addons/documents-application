var documentFilter, currentTag, docAppContext, docAppSpace, refresh;
var labelBrowserNotSupported, labelTooManyFiles, labelFileTooLarge, labelOnlyAllowed,
  labelDropzoneMsg1, labelDropZoneMsg2, labelHome, labelSortBy, labelName, labelDate, labelSize;
var by, order, ts;
var uploadFiles=0;

$(document).ready(function(){

  $(function(){

    var dropbox = $('#dropbox'),
      message = $('.message', dropbox);

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

  });





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


  function loadFiles() {
    if (jzGetParam("documentFilter")!==undefined) {
      documentFilter = jzGetParam("documentFilter");
    }
    jzStoreParam("documentFilter", documentFilter, 300);

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
        jzStoreParam(key, stringifiedFiles, 300);

        ts = data.timestamp;
        var keyts = getFilesStorageTSKey();
        jzStoreParam(keyts, ts, 300);

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
    jzStoreParam("documentFilter", documentFilter, 300);

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
            jzStoreParam(key, stringifiedFiles, 300);

            ts = data.timestamp;
            var keyts = getFilesStorageTSKey();
            jzStoreParam(keyts, ""+ts, 300);

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
    jzStoreParam("documentFilter", documentFilter, 300);
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
    $('#NewFolderModal').modal('show');
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
        jzStoreParam("documentFilter", documentFilter, 300);
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
    $('#UploadModal').modal('show');
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

    $('.delete-link').on("click", function() {
      var name = $(this).closest(".dropdown-menu").attr("data-name");
      var uuid = $(this).closest(".dropdown-menu").attr("data-uuid");
      var path = $(this).closest(".dropdown-menu").attr("data-path");
      $('#delete-label').html('Are you sure you want to delete the file "' + name + '"?');
      $('#delete-button').attr('data-uuid', uuid);
      $('#delete-button').attr('data-path', path);
      $('#DeleteModal').modal('show');
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


    $('.tags-link').on("click", function() {
      var name = $(this).closest(".dropdown-menu").attr("data-name");
      var uuid = $(this).closest(".dropdown-menu").attr("data-uuid");
      var tags = $(this).closest(".dropdown-menu").attr("data-tags");
      $('#tags-label').html('You are editing tags for "' + name + '"');
      $('#file-tags').val(tags);
      $('#tags-save-button').attr('data-uuid', uuid);
      $('#TagsModal').modal('show');
    });

    $('.label-tag').on("click", function() {
      currentTag = $(this).html();
      documentFilter = "Folksonomy/"+currentTag;
      jzStoreParam("documentFilter", documentFilter, 300);
      loadFiles();
    });

    $('.folder-link').on("click", function() {
      folderName = $(this).attr("data-name");
      documentFilter = documentFilter+"/"+folderName;
      jzStoreParam("documentFilter", documentFilter, 300);
      loadFiles();
    });

    $('.breadcrumb-link').on("click", function() {
      folderName = $(this).attr("data-name");
      documentFilter = folderName;
      jzStoreParam("documentFilter", documentFilter, 300);
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

});


jzGetParam = function(key) {
  var ts  = localStorage.getItem(key+"TS");
  var val = localStorage.getItem(key);
  if (!ts) ts=-1;

  var now = Math.round(new Date()/1000);

  if (val !== undefined && val !== null && (now<ts || ts===-1 )) {
    return val;
  }

  return undefined;
};

jzStoreParam = function(key, value, expire) {
  expire = typeof expire !== 'undefined' ? expire : 300;
  localStorage.setItem(key+"TS", Math.round(new Date()/1000) + expire);
  localStorage.setItem(key, value);
};

gravatar = function(email) {
  return "http://www.gravatar.com/avatar/" + calcMD5(email) + ".jpg?s=30&d=mm";
}


/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
      hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}



