package documents.portlet.list.controllers;

import juzu.*;
import juzu.template.Template;
import org.exoplatform.portal.application.PortalRequestContext;

import javax.inject.Inject;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** @author <a href="mailto:benjamin.paillereau@exoplatform.com">Benjamin Paillereau</a> */
@SessionScoped
public class DocumentsApplication extends juzu.Controller
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
  public void getFiles(String filter)
  {
    filesTemplate.with().set("files", documentsData.getNodes(filter)).render();
  }

  @Resource
  public void getProperties(String uuid)
  {
    propertiesTemplate.with().set("file", documentsData.getNode(uuid)).render();
  }

  @Resource
  public void restore(String uuid, String name)
  {
    documentsData.restoreVersion(uuid, name);
    propertiesTemplate.with().set("file", documentsData.getNode(uuid)).render();
  }

  @Resource
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
