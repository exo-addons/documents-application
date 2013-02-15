package org.benjp.documents.portlet.list.controllers;

import juzu.*;
import juzu.plugin.ajax.Ajax;
import juzu.template.Template;
import org.benjp.documents.portlet.list.bean.File;
import org.benjp.documents.portlet.list.bean.Folder;

import javax.inject.Inject;
import java.io.IOException;
import java.util.Enumeration;
import java.util.List;
import java.util.MissingResourceException;
import java.util.logging.Logger;

/** @author <a href="mailto:benjamin.paillereau@exoplatform.com">Benjamin Paillereau</a> */
@SessionScoped
public class DocumentsApplication
{

  Logger log = Logger.getLogger("DocumentsApplication");
  /** . */
  @Inject
  @Path("index.gtmpl")
  Template indexTemplate;

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
  public void index() throws IOException
  {
    documentsData.initNodetypes();
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

    indexTemplate.with().set("filter", DocumentsData.TYPE_DOCUMENT).set("context", context).set("space", space).render();
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
    log.info("checkTimestamp::"+filter+"::"+timestamp);
    sleep(2);
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
