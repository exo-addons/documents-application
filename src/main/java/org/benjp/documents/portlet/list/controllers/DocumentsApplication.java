package org.benjp.documents.portlet.list.controllers;

import juzu.*;
import juzu.bridge.portlet.JuzuPortlet;
import juzu.plugin.ajax.Ajax;
import juzu.request.ClientContext;
import juzu.request.RenderContext;
import juzu.request.ResourceContext;
import juzu.template.Template;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUpload;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.benjp.documents.portlet.list.bean.File;
import org.benjp.documents.portlet.list.bean.Folder;

import javax.inject.Inject;
import javax.inject.Provider;
import javax.portlet.PortletMode;
import javax.portlet.PortletPreferences;
import javax.portlet.ReadOnlyException;
import javax.portlet.ValidatorException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.logging.Logger;

/** @author <a href="mailto:benjamin.paillereau@exoplatform.com">Benjamin Paillereau</a> */
@SessionScoped
public class DocumentsApplication
{

  Logger log = Logger.getLogger("DocumentsApplication");

  @Inject
  Provider<PortletPreferences> providerPreferences;

  /** . */
  @Inject
  @Path("index.gtmpl")
  Template indexTemplate;

  @Inject
  @Path("edit.gtmpl")
  Template editTemplate;

  @Inject
  @Path("files.gtmpl")
  Template filesTemplate;

  @Inject
  @Path("properties.gtmpl")
  Template propertiesTemplate;

  @Inject
  DocumentsData documentsData;

  @Inject java.util.ResourceBundle bundle;


  @View
  public void index(RenderContext renderContext) throws IOException
  {
    PortletPreferences portletPreferences = providerPreferences.get();
    String refresh = portletPreferences.getValue("refresh", "10");
    if ("".equals(refresh)) refresh="10";

    PortletMode portletMode = renderContext.getProperty(JuzuPortlet.PORTLET_MODE);
    if (portletMode.equals(PortletMode.VIEW))
    {
      String space = documentsData.getSpaceName();
      String context;
      if (space!=null)
      {
        context = "Community";
      }
      else
      {
        context = "Personal";
        space = "";
      }

      indexTemplate.with().set("filter", DocumentsData.TYPE_DOCUMENT)
              .set("context", context).set("space", space)
              .set("refresh", refresh)
              .render();
    }
    else
    {
      documentsData.initNodetypes();
      editTemplate.with().set("refresh", refresh).render();

    }

  }

  @Action
  public void save(String refresh)
  {
    try {
      PortletPreferences portletPreferences = providerPreferences.get();
      portletPreferences.setValue("refresh", refresh);
      portletPreferences.store();
    } catch (ReadOnlyException e) {
      e.printStackTrace();
    } catch (ValidatorException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }


  @Resource
  @Ajax
  public Response.Content getFiles(String filter)
  {
    log.info("getFiles::" + filter);
    sleep(2);
    try
    {
      Folder folder = documentsData.getNodes(filter);
      return Response.ok(folder.filesToJSON()).withMimeType("text/event-stream; charset=UTF-8").withHeader("Cache-Control", "no-cache");

    }
    catch (Exception e)
    {
      return Response.notFound("error");
    }
  }

  @Resource
  @Ajax
  public Response.Content checkTimestamp(String filter, String timestamp)
  {
//    log.info("checkTimestamp::"+filter+"::"+timestamp);
//    sleep(2);
    try
    {


      Long timestampNew = documentsData.getTimestamp(filter);

      if (!(""+timestampNew).equals(timestamp))
      {
        Folder folder = documentsData.getNodes(filter);
        return Response.ok(folder.filesToJSON()).withMimeType("text/event-stream; charset=UTF-8").withHeader("Cache-Control", "no-cache");
      }
      else
      {
        return Response.ok("{\"timestamp\": \""+timestamp+"\", \"hasData\": false}").withMimeType("text/event-stream; charset=UTF-8").withHeader("Cache-Control", "no-cache");
      }

    }
    catch (Exception e)
    {
      return Response.notFound("error");
    }
  }

  @Resource
  @Ajax
  public Response.Content upload(String appContext, String appSpace, String appFilter, String dataUuid, FileItem pic, ResourceContext resourceContext) {

    String path = appFilter;
    boolean isPrivateContext = "Personal".equals(appContext);
    String name = (isPrivateContext)?resourceContext.getSecurityContext().getRemoteUser():appSpace; //request.getHeader("app-space");
    String uuid = dataUuid;

    if (pic != null)
    {
      if (uuid!=null)
      {
        documentsData.storeFile(path, pic, name, isPrivateContext, uuid);
        return Response.ok("<div style='background-color:#ffa; padding:20px'>File has been uploaded successfully!</div>")
                .withMimeType("text/html; charset=UTF-8").withHeader("Cache-Control", "no-cache");
      }
      else
      {
        documentsData.storeFile(path, pic, name, isPrivateContext);
        return Response.ok("{\"status\":\"File has been uploaded successfully!\"}")
                .withMimeType("application/json; charset=UTF-8").withHeader("Cache-Control", "no-cache");
      }
    }

    return Response.notFound("error");
  }

  @Resource
  @Ajax
  public void getProperties(String uuid, String path)
  {
    sleep(1);
    File file = null;
    if (uuid!=null && !"".equals(uuid))
      file = documentsData.getNode(uuid);
    else
      file = documentsData.getNode(path);

    propertiesTemplate.with().set("file", file).render();
  }

  @Resource
  @Ajax
  public void restore(String uuid, String name)
  {
    sleep(2);
    documentsData.restoreVersion(uuid, name);
    propertiesTemplate.with().set("file", documentsData.getNode(uuid)).render();
  }

  @Resource
  @Ajax
  public Response.Content deleteFile(String uuid, String path)
  {
    sleep(3);
    try
    {
      if (uuid!=null && !"".equals(uuid))
        documentsData.deleteFile(uuid);
      else
        documentsData.deleteFile(path);
    }
    catch (Exception e)
    {
      return Response.notFound(getMessage("benjp.documents.message.error.delete"));
    }
    return Response.ok(getMessage("benjp.documents.message.success.delete"));
  }

  @Resource
  @Ajax
  public Response.Content renameFile(String uuid, String name, String path)
  {
    sleep(3);
    try
    {
      if (uuid!=null && !"".equals(uuid))
        documentsData.renameFile(uuid, name);
      else
        documentsData.renameFile(path, name);

    }
    catch (IllegalArgumentException e)
    {
      return Response.notFound(e.getMessage());
    }
    catch (Exception e)
    {
      return Response.notFound(getMessage("benjp.documents.message.error.rename"));
    }
    return Response.ok(getMessage("benjp.documents.message.success.rename"));
  }

  @Resource
  @Ajax
  public Response.Content newFolder(String documentFilter, String name)
  {
    sleep(1);
    if (!documentsData.createNodeIfNotExist(documentFilter, name))
    {
      return Response.notFound(getMessage("benjp.documents.message.error.folder"));
    }
    return Response.ok(getMessage("benjp.documents.message.success.folder"));
  }

  @Resource
  @Ajax
  public Response.Content editTags(String uuid, String tags)
  {
    sleep(2);
    try
    {
      documentsData.editTags(uuid, tags);
    }
    catch (IllegalArgumentException e)
    {
      return Response.notFound(e.getMessage());
    }
    catch (Exception e)
    {
      return Response.notFound(getMessage("benjp.documents.message.error.tags"));
    }
    return Response.ok(getMessage("benjp.documents.message.success.tags"));
  }


  private String getMessage(String key) {
    try {
      return bundle.getString(key);
    } catch (MissingResourceException mre) {
    }
    return "";
  }

  private void sleep(int sec)
  {
    try {
      Thread.sleep(sec*1);
    } catch (InterruptedException e) {
    }
  }

}
