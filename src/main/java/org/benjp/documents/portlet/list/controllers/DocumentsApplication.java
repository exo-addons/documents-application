package org.benjp.documents.portlet.list.controllers;

import juzu.*;
import juzu.plugin.ajax.Ajax;
import juzu.template.Template;

import javax.inject.Inject;
import java.io.IOException;

/** @author <a href="mailto:benjamin.paillereau@exoplatform.com">Benjamin Paillereau</a> */
@SessionScoped
public class DocumentsApplication
{

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
  public void getFiles(String filter)
  {
    filesTemplate.with().set("files", documentsData.getNodes(filter)).render();
  }

  @Resource
  @Ajax
  public void getProperties(String uuid)
  {
    propertiesTemplate.with().set("file", documentsData.getNode(uuid)).render();
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
  public Response.Content deleteFile(String uuid)
  {
    try
    {
      documentsData.deleteFile(uuid);
    }
    catch (Exception e)
    {
      return Response.notFound("Your file cannot be deleted. Please, try later");
    }
    return Response.ok("Successfully deleted.");
  }

  @Resource
  @Ajax
  public Response.Content renameFile(String uuid, String name)
  {
    try
    {
      documentsData.renameFile(uuid, name);
    }
    catch (IllegalArgumentException e)
    {
      return Response.notFound(e.getMessage());
    }
    catch (Exception e)
    {
      return Response.notFound("Your file cannot be renamed. Please, try later");
    }
    return Response.ok("Successfully renamed.");
  }

  @Resource
  @Ajax
  public Response.Content newFolder(String documentFilter, String name)
  {
    if (!documentsData.createNodeIfNotExist(documentFilter, name))
    {
      return Response.notFound("Folder cannot be created or already exists. Please, try later");
    }
    return Response.ok("Successfully created.");
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
      return Response.notFound("Tags cannot be edited. Please, try later");
    }
    return Response.ok("Successfully tagged.");
  }




}
