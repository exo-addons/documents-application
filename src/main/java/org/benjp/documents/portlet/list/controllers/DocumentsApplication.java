package org.benjp.documents.portlet.list.controllers;

import juzu.*;
import juzu.plugin.ajax.Ajax;
import juzu.template.Template;
import org.benjp.documents.portlet.list.bean.File;

import javax.inject.Inject;
import java.io.IOException;
import java.util.Enumeration;
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
  public void getFiles(String filter, String order, String by)
  {
    log.info("getFiles::"+filter+" ; "+order+" ; "+by);
    filesTemplate.with().set("files", documentsData.getNodes(filter, order, by)).render();
  }

  @Resource
  @Ajax
  public void getProperties(String uuid, String path)
  {
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
    documentsData.restoreVersion(uuid, name);
    propertiesTemplate.with().set("file", documentsData.getNode(uuid)).render();
  }

  @Resource
  @Ajax
  public Response.Content deleteFile(String uuid, String path)
  {
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


}
